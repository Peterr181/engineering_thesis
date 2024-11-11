import express from "express";
import {
  getProfile,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to get the authenticated user's profile
router.get("/profile", authMiddleware, getProfile);

// Route to get all users
router.get("/", authMiddleware, getAllUsers);

// Route to get a specific user by ID
router.get("/:userId", authMiddleware, getUserById); // Endpoint to get user by ID

export default router;
