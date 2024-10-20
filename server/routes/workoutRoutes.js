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

router.use(authMiddleware);

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.put("/:workoutId", updateWorkout);
router.delete("/:workoutId", deleteWorkout);
router.post("/:workoutId/finish", finishWorkout);

export default router;
