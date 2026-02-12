import fs from "fs";
import csv from "csv-parser";
import Sale from "../models/Sale.js";

const DEFAULT_BATCH_SIZE = 20_000;
const DEFAULT_INSERT_CONCURRENCY = 3;

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const BATCH_SIZE = toPositiveInt(process.env.CSV_BATCH_SIZE, DEFAULT_BATCH_SIZE);
const INSERT_CONCURRENCY = toPositiveInt(process.env.CSV_INSERT_CONCURRENCY, DEFAULT_INSERT_CONCURRENCY);

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pickFirstValue = (row, keys) => {
  for (const key of keys) {
    if (!(key in row)) continue;
    const value = row[key];
    if (value === undefined || value === null || value === "") continue;
    return value;
  }
  return undefined;
};

const mapRowToSale = (row) => ({
  Index: parseOptionalNumber(pickFirstValue(row, ["Index"])),
  CustomerId: pickFirstValue(row, ["Customer Id", "CustomerId"]),
  FirstName: pickFirstValue(row, ["First Name", "FirstName"]),
  LastName: pickFirstValue(row, ["Last Name", "LastName"]),
  Company: pickFirstValue(row, ["Company"]),
  City: pickFirstValue(row, ["City"]),
  Country: pickFirstValue(row, ["Country"]),
  Phone1: pickFirstValue(row, ["Phone 1", "Phone1"]),
  Phone2: pickFirstValue(row, ["Phone 2", "Phone2"]),
  Email: pickFirstValue(row, ["Email"]),
  SubscriptionDate: parseDate(pickFirstValue(row, ["Subscription Date", "SubscriptionDate"])),
  Website: pickFirstValue(row, ["Website"]),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const getInsertedCount = (result, fallback = 0) => {
  if (typeof result?.insertedCount === "number") return result.insertedCount;
  if (typeof result?.nInserted === "number") return result.nInserted;
  if (typeof result?.result?.nInserted === "number") return result.result.nInserted;
  if (result?.insertedIds && typeof result.insertedIds === "object") {
    return Object.keys(result.insertedIds).length;
  }
  return fallback;
};

export const uploadCsvData = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a CSV file" });
  }

  const filePath = req.file.path;
  let batch = [];
  let insertedCount = 0;
  const inFlightInserts = new Set();

  const enqueueInsert = async (docs) => {
    const insertPromise = Sale.collection
      .insertMany(docs, { ordered: false, rawResult: true })
      .then((result) => {
        insertedCount += getInsertedCount(result, docs.length);
      });

    const trackedPromise = insertPromise.catch((error) => {
      const partialInsertedCount = getInsertedCount(error?.result, 0);
      if (partialInsertedCount > 0) {
        insertedCount += partialInsertedCount;
      }
      throw error;
    });

    inFlightInserts.add(trackedPromise);
    trackedPromise.finally(() => inFlightInserts.delete(trackedPromise));

    if (inFlightInserts.size >= INSERT_CONCURRENCY) {
      await Promise.race(inFlightInserts);
    }
  };

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
      batch.push(mapRowToSale(row));

      if (batch.length >= BATCH_SIZE) {
        const docs = batch;
        batch = [];
        await enqueueInsert(docs);
      }
    }

    if (batch.length > 0) {
      await enqueueInsert(batch);
      batch = [];
    }

    await Promise.all(inFlightInserts);

    return res.status(200).json({
      message: "CSV processed successfully",
      insertedCount,
      batchSize: BATCH_SIZE,
      insertConcurrency: INSERT_CONCURRENCY,
    });
  } catch (error) {
    if (inFlightInserts.size > 0) {
      await Promise.allSettled(inFlightInserts);
    }
    return res.status(500).json({ message: "CSV processing failed", error: error.message });
  } finally {
    fs.promises.unlink(filePath).catch(() => {});
  }
};
