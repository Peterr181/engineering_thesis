import express from "express";
import {
  register,
  login,
  logout,
  verifyUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify", authMiddleware, verifyUser); // Verify if user is authenticated

export default router;
