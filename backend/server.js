import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

/**
 *
 * - Loads environment variables
 * - Connects to MongoDB
 * - Wires up core middleware and routes
 * - Exposes a simple health check endpoint
 */
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Establish a single shared MongoDB connection for the whole app.
connectDB();

// Global middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Lightweight liveness probe used by the frontend and for manual checks.
app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "ScaleMetrics backend is running" });
});

// Auth and product APIs are grouped under the /api prefix.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Basic error handler so uncaught errors return JSON instead of HTML.
app.use((error, _req, res, _next) => {
  // Centralized fallback to avoid exposing stack traces in production-like demos.
  res.status(500).json({ message: error.message || "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
