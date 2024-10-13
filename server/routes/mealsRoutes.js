import express from "express";
import {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
} from "../controllers/mealsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createMeal);
router.get("/", getMeals);
router.put("/:mealId", updateMeal);
router.delete("/:mealId", deleteMeal);

export default router;
