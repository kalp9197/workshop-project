import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    sku: { type: String, required: true, trim: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, trim: true, default: "" },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
