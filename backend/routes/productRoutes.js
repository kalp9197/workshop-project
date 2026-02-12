import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

// Router responsible for CRUD operations on products.
const router = express.Router();

// All product routes are protected and require a valid JWT.
router.use(protect);

// GET /api/products      -> list products
// POST /api/products     -> create a new product
router.route("/").get(getProducts).post(createProduct);

// GET /api/products/:id  -> fetch a single product
// PUT /api/products/:id  -> update an existing product
// DELETE /api/products/:id -> remove a product
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
