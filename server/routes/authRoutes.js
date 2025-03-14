import express from "express";
import {
  register,
  login,
  logout,
  verifyUser,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.get("/verify", authMiddleware, verifyUser);
router.post("/change-password", authMiddleware, changePassword);

export default router;
