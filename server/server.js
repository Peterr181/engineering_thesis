import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv"; // For using environment variables

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize dotenv to use environment variables
config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
