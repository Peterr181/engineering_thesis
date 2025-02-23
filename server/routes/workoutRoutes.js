import express from "express";
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  finishWorkout,
  getWeeklyWorkouts,
  getWorkoutsByUserId,
  getDailyWorkouts,
  getMonthlyWorkouts,
  getYearlyWorkouts,
} from "../controllers/workoutController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/weekly", getWeeklyWorkouts);
router.get("/user/:userId", getWorkoutsByUserId); // Update this line
router.get("/daily", getDailyWorkouts);
router.get("/monthly", getMonthlyWorkouts);
router.get("/yearly", getYearlyWorkouts);
router.put("/:workoutId", updateWorkout);
router.delete("/:workoutId", deleteWorkout);
router.post("/:workoutId/finish", finishWorkout);

export default router;
