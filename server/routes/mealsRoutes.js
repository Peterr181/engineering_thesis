import express from "express";
import {
  getMeals,
  createMeal,
  deleteMeal,
  updateMeal,
} from "../controllers/mealsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getMeals);

router.post("/", authMiddleware, createMeal);

router.delete("/:mealId", authMiddleware, deleteMeal);

router.put("/:mealId", authMiddleware, updateMeal);

export default router;
