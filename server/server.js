import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import path from "path";

// Import routes
import mealsRoutes from "./routes/mealsRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import personalInfoRoutes from "./routes/personalInfoRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { saveMessage } from "./controllers/chatController.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 8081;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.resolve("./client/dist")));

// Define routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

// API routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/personal-info", personalInfoRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO event listeners
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on(
    "sendMessage",
    async ({ roomId, userId, message, userNickname }) => {
      console.log(
        `Received message from ${userId} in room ${roomId}: ${message}`
      );

      try {
        // Save message to the database
        await saveMessage(roomId, userId, message);
        // Emit message to the room with userNickname
        io.to(roomId).emit("receiveMessage", {
          userId,
          message,
          username: userNickname,
        });
        console.log(`Message sent to room ${roomId}: ${message}`);
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit(
          "errorMessage",
          err.message || "An error occurred while saving the message"
        );
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
