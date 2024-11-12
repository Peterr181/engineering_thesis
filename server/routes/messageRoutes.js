import express from "express";
import {
  sendMessage,
  getMessages,
  getAllMessages,
  markMessagesAsRead,
  getUnreadMessages,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to send a message
router.post("/send", authMiddleware, sendMessage);

// Route to get all messages for the current user
router.get("/", authMiddleware, getAllMessages);

// Route to get messages between two users
router.get("/:otherUserId", authMiddleware, getMessages);

// Route to get unread messages for the current user
router.get("/unread", authMiddleware, getUnreadMessages);

// Route to mark all unread messages as read
router.put("/mark-as-read", authMiddleware, markMessagesAsRead);

// Route to mark all unread messages as read
router.put("/mark-all-as-read", authMiddleware, markMessagesAsRead);

export default router;
