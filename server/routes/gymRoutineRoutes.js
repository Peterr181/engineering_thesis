import express from "express";
import {
  createRoutine,
  getRoutines,
  addRoutineDay,
  addExercise,
  addExerciseSet,
  getRoutineDetails,
  savePlan,
  deleteRoutine,
  endRoutine,
  activateRoutine,
  duplicateRoutineForNextWeek,
  updateRoutine, // Add this import
} from "../controllers/gymRoutineController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new routine
router.post("/create", authMiddleware, createRoutine);

// Route to get all routines for a user
router.get("/", authMiddleware, getRoutines);

// Route to add a day to a specific routine
router.post("/day", authMiddleware, addRoutineDay);

// Route to add an exercise to a specific day in a routine
router.post("/exercise", authMiddleware, addExercise);

// Route to add a set to an exercise
router.post("/exercise/set", authMiddleware, addExerciseSet);

// Route to get details of a specific routine with days, exercises, and sets
router.get("/:routineId", authMiddleware, getRoutineDetails);

// Route to save the entire plan
router.post("/savePlan", authMiddleware, savePlan);

// Route to delete a specific routine
router.delete("/:routineId", authMiddleware, deleteRoutine);

// Route to end the current routine
router.post("/endRoutine", authMiddleware, endRoutine);

// Route to activate a specific routine
router.post("/activate/:routineId", authMiddleware, activateRoutine);

// Route to duplicate a routine for the next week
router.post(
  "/duplicate/:routineId",
  authMiddleware,
  duplicateRoutineForNextWeek
);

// Route to update an existing routine
router.put("/update/:routineId", authMiddleware, updateRoutine);

export default router;
