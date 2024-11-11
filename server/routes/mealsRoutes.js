import express from "express";
import {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
  getMealSummary,
  getMealsByUserId, // import the new function
} from "../controllers/mealsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createMeal);
router.get("/", getMeals);
router.get("/summary", getMealSummary);
router.get("/user/:userId", getMealsByUserId);
router.put("/:mealId", updateMeal);
router.delete("/:mealId", deleteMeal);

export default router;
