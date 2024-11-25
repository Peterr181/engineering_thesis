import express from "express";
import {
  saveDailySettings,
  getDailySettings,
  getAllDailySettings,
} from "../controllers/dailySettingsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Route to save or update daily settings
router.post("/", saveDailySettings);

// Route to get daily settings for the current logged-in user
router.get("/", getDailySettings);

// Route to get all daily settings for the current logged-in user
router.get("/all", getAllDailySettings);

export default router;
