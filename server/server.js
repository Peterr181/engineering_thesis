import express from "express";
import http from "http"; // Import http module
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io"; // Import Socket.IO
import path from "path"; // Import path module for resolving paths

import mealsRoutes from "./routes/mealsRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import personalInfoRoutes from "./routes/personalInfoRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Import your chat routes
import { saveMessage } from "./controllers/chatController.js";

config();

const app = express();
const PORT = process.env.PORT || 8081;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "PATCH"], // Allowed methods
    credentials: true, // Allow credentials
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../client/dist")));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Catch-all route for Single Page Application (SPA) behavior
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/personal-info", personalInfoRoutes);
app.use("/api/chat", chatRoutes); // Use your chat routes

// Socket.IO event listeners
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, userId, message, userNickname }) => {
    console.log(
      `Received message from ${userId} in room ${roomId}: ${message}`
    );

    // Save message to the database
    saveMessage(roomId, userId, message, (err, result) => {
      if (err) {
        console.error("Error saving message:", err.details);
        socket.emit("errorMessage", err.error);
      } else {
        // Emit message to the room with userNickname
        io.to(roomId).emit("receiveMessage", {
          userId,
          message,
          username: userNickname,
        }); // Include username
        console.log(`Message sent to room ${roomId}: ${message}`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
