import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    Region: { type: String, index: true },
    Country: { type: String },
    ItemType: { type: String, index: true },
    SalesChannel: { type: String },
    OrderPriority: { type: String },
    OrderDate: { type: Date, index: true },
    OrderID: { type: String, index: true },
    ShipDate: { type: Date },
    UnitsSold: { type: Number, default: 0 },
    UnitPrice: { type: Number, default: 0 },
    UnitCost: { type: Number, default: 0 },
    TotalRevenue: { type: Number, default: 0, index: true },
    TotalCost: { type: Number, default: 0 },
    TotalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
