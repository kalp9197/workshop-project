import express from "express";
import {
  getDatasetSummary,
  getSalesRecords,
  getRevenueByRegion,
  getSalesByItemType,
} from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getDatasetSummary);
router.get("/revenue-by-region", protect, getRevenueByRegion);
router.get("/sales-by-item-type", protect, getSalesByItemType);
router.get("/records", protect, getSalesRecords);

export default router;
