import express from "express";
import { checkAndUpdateStreak } from "../controllers/streakController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to check and update the user's streak
router.post("/update-streak", authMiddleware, checkAndUpdateStreak);

export default router;
