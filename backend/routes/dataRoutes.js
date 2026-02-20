import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getDataCollectionsOverview,
  importCsvToCollection,
  migrateCityWithAggregation,
} from "../controllers/dataController.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv")) {
    cb(null, true);
    return;
  }

  cb(new Error("Only CSV files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();
router.use(protect);

router.get("/collections", getDataCollectionsOverview);
router.post("/import-csv", upload.single("csvFile"), importCsvToCollection);
router.post("/migrate-city", migrateCityWithAggregation);

export default router;
