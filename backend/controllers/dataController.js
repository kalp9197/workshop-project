import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";

const DEFAULT_SOURCE_COLLECTION = "workshop_raw_data";
const DEFAULT_TARGET_COLLECTION = "workshop_transformed_data";

const sanitizeCollectionName = (value, fallback) => {
  const cleaned = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return cleaned || fallback;
};

const convertCsvRowToDocument = (row) => ({
  recordId: String(row.recordId || "").trim(),
  fullName: String(row.fullName || "").trim(),
  email: String(row.email || "").trim(),
  city: String(row.city || "").trim(),
  state: String(row.state || "").trim(),
  country: String(row.country || "").trim(),
  age: Number(row.age) || null,
  signupDate: row.signupDate ? new Date(row.signupDate) : null,
  purchaseAmount: Number(row.purchaseAmount) || 0,
  status: String(row.status || "").trim(),
  importedAt: new Date(),
});

export const importCsvToCollection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required (field name: csvFile)" });
    }

    const collectionName = sanitizeCollectionName(req.body?.collectionName, DEFAULT_SOURCE_COLLECTION);
    const truncateCollection = String(req.body?.truncateCollection || "false") === "true";

    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    if (truncateCollection) {
      await collection.deleteMany({});
    }

    let totalParsed = 0;
    let totalInserted = 0;
    const batchSize = 500;
    let batch = [];

    const insertBatch = async () => {
      if (!batch.length) return;
      await collection.insertMany(batch, { ordered: false });
      totalInserted += batch.length;
      batch = [];
    };

    const csvStream = fs.createReadStream(req.file.path).pipe(csv());

    for await (const row of csvStream) {
      batch.push(convertCsvRowToDocument(row));
      totalParsed += 1;

      if (batch.length >= batchSize) {
        await insertBatch();
      }
    }

    await insertBatch();

    const collectionCount = await collection.countDocuments({});

    return res.status(201).json({
      message: "CSV imported successfully",
      fileName: req.file.originalname,
      collectionName,
      totalParsed,
      totalInserted,
      collectionCount,
      truncateCollection,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to import CSV", error: error.message });
  }
};

export const migrateCityWithAggregation = async (req, res) => {
  try {
    const sourceCollection = sanitizeCollectionName(
      req.body?.sourceCollection,
      DEFAULT_SOURCE_COLLECTION
    );
    const targetCollection = sanitizeCollectionName(
      req.body?.targetCollection,
      DEFAULT_TARGET_COLLECTION
    );
    const fromCity = String(req.body?.fromCity || "Ahmedabad").trim();
    const toCity = String(req.body?.toCity || "Vadodara").trim();

    if (!fromCity || !toCity) {
      return res.status(400).json({ message: "fromCity and toCity are required" });
    }

    const db = mongoose.connection.db;
    const source = db.collection(sourceCollection);

    const sourceCount = await source.countDocuments({});
    if (!sourceCount) {
      return res.status(404).json({
        message: `Source collection '${sourceCollection}' is empty or not found`,
      });
    }

    const fromCityRegex = new RegExp(`^${fromCity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    const affectedBefore = await source.countDocuments({ city: fromCityRegex });

    const pipeline = [
      {
        $addFields: {
          city: {
            $cond: [
              {
                $eq: [{ $toLower: { $ifNull: ["$city", ""] } }, fromCity.toLowerCase()],
              },
              toCity,
              "$city",
            ],
          },
          migrationMeta: {
            migratedAt: new Date(),
            operation: `${fromCity} -> ${toCity}`,
          },
        },
      },
      {
        $merge: {
          into: targetCollection,
          on: "_id",
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ];

    await source.aggregate(pipeline).toArray();

    const target = db.collection(targetCollection);
    const targetCount = await target.countDocuments({});
    const affectedAfter = await target.countDocuments({ city: toCity });

    return res.status(200).json({
      message: "Migration completed using aggregation pipeline",
      sourceCollection,
      targetCollection,
      fromCity,
      toCity,
      sourceCount,
      targetCount,
      affectedBefore,
      affectedAfter,
      pipeline,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to migrate data using aggregation pipeline",
      error: error.message,
    });
  }
};

export const getDataCollectionsOverview = async (_req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const nonSystemCollections = collections
      .map((collection) => collection.name)
      .filter((name) => !name.startsWith("system."));

    const details = await Promise.all(
      nonSystemCollections.map(async (name) => {
        const collection = db.collection(name);
        const [count, sample] = await Promise.all([
          collection.countDocuments({}),
          collection.find({}, { projection: { _id: 1, city: 1, fullName: 1, recordId: 1 } }).limit(1).toArray(),
        ]);

        return {
          name,
          count,
          sample: sample[0] || null,
        };
      })
    );

    return res.status(200).json(details.sort((a, b) => b.count - a.count));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch collections", error: error.message });
  }
};
