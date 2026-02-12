import Sale from "../models/Sale.js";

export const getRevenueByRegion = async (req, res) => {
  try {
    const data = await Sale.aggregate([
      {
        $group: {
          _id: "$Region",
          totalRevenue: { $sum: "$TotalRevenue" },
          totalUnitsSold: { $sum: "$UnitsSold" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      {
        $project: {
          _id: 0,
          region: "$_id",
          totalRevenue: 1,
          totalUnitsSold: 1,
        },
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to aggregate region revenue", error: error.message });
  }
};

export const getSalesByItemType = async (req, res) => {
  try {
    const data = await Sale.aggregate([
      {
        $group: {
          _id: "$ItemType",
          totalRevenue: { $sum: "$TotalRevenue" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      {
        $project: {
          _id: 0,
          itemType: "$_id",
          totalRevenue: 1,
          orders: 1,
        },
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to aggregate item type stats", error: error.message });
  }
};

export const getDatasetSummary = async (_req, res) => {
  try {
    const [summary] = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalRevenue: { $sum: "$TotalRevenue" },
          totalProfit: { $sum: "$TotalProfit" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          totalRevenue: 1,
          totalProfit: 1,
        },
      },
    ]);

    return res.status(200).json(
      summary || {
        totalRecords: 0,
        totalRevenue: 0,
        totalProfit: 0,
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to build dataset summary", error: error.message });
  }
};

export const getSalesRecords = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const safeLimit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 200;
    const limit = Math.min(safeLimit, 200);

    const records = await Sale.collection
      .find(
        {},
        {
          projection: {
            _id: 1,
            Index: 1,
            CustomerId: 1,
            FirstName: 1,
            LastName: 1,
            Company: 1,
            City: 1,
            Country: 1,
            Phone1: 1,
            Phone2: 1,
            Email: 1,
            SubscriptionDate: 1,
            Website: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .toArray();

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch sales records", error: error.message });
  }
};
