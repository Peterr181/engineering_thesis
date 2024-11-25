import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import mealsRoutes from "./routes/mealsRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import personalInfoRoutes from "./routes/personalInfoRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import dailySettingsRoutes from "./routes/dailySettingsRoutes.js";
import gymRoutineRoutes from "./routes/gymRoutineRoutes.js";
import { saveMessage } from "./controllers/chatController.js";
import expressSslify from "express-sslify";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

const isProduction = process.env.NODE_ENV === "production";
const clientOrigin = isProduction
  ? "https://gymero.live" // Production URL
  : "http://localhost:5173"; // Local development URL

if (isProduction) {
  app.use(expressSslify.HTTPS({ trustProtoHeader: true }));
}

// Create a rate limiter
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 50, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });

// // Apply the rate limiter to all API routes
// app.use("/api/", apiLimiter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [clientOrigin],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [clientOrigin],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/personal-info", personalInfoRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/routines", gymRoutineRoutes);
app.use("/api/daily-settings", dailySettingsRoutes);

// Serve static files only in production
if (isProduction) {
  const clientPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  // Define the root route to serve the index.html file
  app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Socket.IO event listeners
io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on(
    "sendMessage",
    async ({ roomId, userId, message, userNickname }) => {
      try {
        // Save message to the database
        await saveMessage(roomId, userId, message);
        // Emit message to the room with userNickname
        io.to(roomId).emit("receiveMessage", {
          userId,
          message,
          username: userNickname,
        });
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
    console.log("User disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
