import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";

import mealsRoutes from "./routes/mealsRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import personalInfoRoutes from "./routes/personalInfoRoutes.js";

config();

const app = express();
const PORT = process.env.PORT || 8081;

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

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/personal-info", personalInfoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
