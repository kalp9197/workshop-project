import mongoose from "mongoose";

/**
 * Product schema
 *
 * Represents a single product that can be surfaced in the ScaleMetrics
 * UI. Additional key/value details live in the separate Specification model
 * so this core schema stays small and efficient to query.
 */
const productSchema = new mongoose.Schema(
  {
    // Human‑readable product name (used in tables and detail views).
    name: { type: String, required: true, trim: true, index: true },

    // SKU is the primary external identifier and must be unique.
    sku: { type: String, required: true, trim: true, unique: true, index: true },

    // Stored as a simple number for workshop purposes (no currency handling).
    price: { type: Number, required: true, min: 0 },

    // How many units are available; used in dashboard summaries.
    quantity: { type: Number, required: true, min: 0, default: 0 },

    // Optional free‑text description for detail views.
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
