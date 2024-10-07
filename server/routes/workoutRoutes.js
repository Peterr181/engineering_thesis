import express from "express";
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  finishWorkout,
} from "../controllers/workoutController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createWorkout);

router.get("/", getWorkouts);

router.put("/:workoutId/finish", finishWorkout);

router.put("/:workoutId", authMiddleware, updateWorkout);

router.delete("/:workoutId", authMiddleware, deleteWorkout);

export default router;
