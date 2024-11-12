import express from "express";
import {
  sendMessage,
  getMessages,
  getAllMessages,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to send a message
router.post("/send", authMiddleware, sendMessage);

// Route to get all messages
router.get("/", authMiddleware, getAllMessages);

// Route to get messages between two users
router.get("/:otherUserId", authMiddleware, getMessages);

export default router;
