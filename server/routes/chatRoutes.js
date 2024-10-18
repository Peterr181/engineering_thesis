import express from "express";
import {
  getRooms,
  getChatHistory,
  getRoomName,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All chat routes are protected by authMiddleware
router.use(authMiddleware);

router.get("/rooms/:roomId/name", getRoomName);

// Get all chat rooms
router.get("/rooms", getRooms);

// Get chat history for a specific room
router.get("/rooms/:roomId/history", getChatHistory);

export default router;
