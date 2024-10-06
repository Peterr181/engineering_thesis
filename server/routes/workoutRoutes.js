import express from "express";
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createWorkout);

router.get("/", getWorkouts);

router.put("/:workoutId", authMiddleware, updateWorkout);

router.delete("/:workoutId", authMiddleware, deleteWorkout);

export default router;
