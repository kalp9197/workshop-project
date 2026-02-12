import Product from "../models/Product.js";

const normalizeSpecifications = (specifications = []) => {
  if (!Array.isArray(specifications)) return [];

  return specifications
    .map((spec) => ({
      key: String(spec?.key ?? "").trim(),
      value: String(spec?.value ?? "").trim(),
    }))
    .filter((spec) => spec.key && spec.value);
};

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
      specifications: normalizeSpecifications(specifications),
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

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
    if (specifications !== undefined) {
      product.specifications = normalizeSpecifications(specifications);
    }

    const updated = await product.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};
