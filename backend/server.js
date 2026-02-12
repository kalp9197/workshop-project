import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "ScaleMetrics backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/products", productRoutes);

app.use((error, _req, res, _next) => {
  // Centralized fallback to avoid exposing stack traces in production-like demos.
  res.status(500).json({ message: error.message || "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
