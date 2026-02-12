import Product from "../models/Product.js";
import Specification from "../models/Specification.js";

/**
 * Normalize raw specification input into a clean array of { key, value } pairs.
 *
 * - Accepts either an array of objects or any falsy value
 * - Coerces keys/values to trimmed strings
 * - Drops empty entries so the DB only stores meaningful data
 *
 * @param {Array<{ key: string, value: string }>} [specifications]
 * @returns {Array<{ key: string, value: string }>}
 */
const normalizeSpecifications = (specifications = []) => {
  if (!Array.isArray(specifications)) return [];

  return specifications
    .map((spec) => ({
      key: String(spec?.key ?? "").trim(),
      value: String(spec?.value ?? "").trim(),
    }))
    .filter((spec) => spec.key && spec.value);
};

/**
 * Create a new product along with its specifications.
 *
 * Validates required product fields and enforces SKU uniqueness. Specifications
 * are stored in a separate collection and linked back to the product id.
 */
export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, quantity, description, specifications } = req.body;

    if (!name || !sku || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "name, sku, price and quantity are required" });
    }

    const existing = await Product.findOne({ sku: String(sku).trim() });
    if (existing) {
      return res.status(400).json({ message: "Product with this SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      price,
      quantity,
      description,
    });

    const normalizedSpecs = normalizeSpecifications(specifications);
    if (normalizedSpecs.length) {
      await Specification.insertMany(
        normalizedSpecs.map((spec) => ({
          ...spec,
          product: product._id,
        }))
      );
    }

    const specsForResponse = await Specification.find({ product: product._id }).lean();

    const productWithSpecs = {
      ...product.toObject(),
      specifications: specsForResponse.map((spec) => ({
        key: spec.key,
        value: spec.value,
      })),
    };

    return res.status(201).json(productWithSpecs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

/**
 * Fetch all products with their associated specifications.
 *
 * Products are sorted with the newest first. Specifications are fetched in
 * a single query and grouped in memory for a simple shape the frontend can
 * render directly.
 */
export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const productIds = products.map((p) => p._id);

    const specs = await Specification.find({ product: { $in: productIds } }).lean();

    const specsByProduct = specs.reduce((acc, spec) => {
      const key = String(spec.product);
      if (!acc[key]) acc[key] = [];
      acc[key].push({ key: spec.key, value: spec.value });
      return acc;
    }, {});

    const productsWithSpecs = products.map((product) => ({
      ...product,
      specifications: specsByProduct[String(product._id)] || [],
    }));

    return res.status(200).json(productsWithSpecs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

/**
 * Fetch a single product by id, including its specifications.
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const specs = await Specification.find({ product: product._id }).lean();

    const productWithSpecs = {
      ...product,
      specifications: specs.map((spec) => ({
        key: spec.key,
        value: spec.value,
      })),
    };

    return res.status(200).json(productWithSpecs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

/**
 * Update an existing product and optionally replace its specifications.
 *
 * Only fields present in the body are patched so partial updates are easy
 * to perform from the frontend.
 */
export const updateProduct = async (req, res) => {
  try {
    const { name, sku, price, quantity, description, specifications } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (sku && sku !== product.sku) {
      const duplicate = await Product.findOne({ sku: String(sku).trim() });
      if (duplicate) {
        return res.status(400).json({ message: "Another product already uses this SKU" });
      }
    }

    // Patch only provided fields so form partial updates are easy in demos.
    if (name !== undefined) product.name = name;
    if (sku !== undefined) product.sku = sku;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (description !== undefined) product.description = description;

    const updated = await product.save();

    if (specifications !== undefined) {
      // Replace existing specs for this product with the new normalized set
      await Specification.deleteMany({ product: product._id });

      const normalizedSpecs = normalizeSpecifications(specifications);
      if (normalizedSpecs.length) {
        await Specification.insertMany(
          normalizedSpecs.map((spec) => ({
            ...spec,
            product: product._id,
          }))
        );
      }
    }

    const specs = await Specification.find({ product: product._id }).lean();

    const updatedWithSpecs = {
      ...updated.toObject(),
      specifications: specs.map((spec) => ({
        key: spec.key,
        value: spec.value,
      })),
    };

    return res.status(200).json(updatedWithSpecs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

/**
 * Delete a product and all of its specifications.
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Specification.deleteMany({ product: product._id });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};
