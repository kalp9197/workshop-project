import mongoose from "mongoose";

/**
 * Specification schema
 *
 * Stores additional key/value details for a product (for example
 * "Color: Blue", "Size: Large"). Each document belongs to exactly one
 * product, and the frontend renders them as a simple list.
 */
const specificationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Specification", specificationSchema);

