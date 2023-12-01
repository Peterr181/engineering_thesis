require("dotenv").config();
const express = require("express");
const db = require("./db");
const morgan = require("morgan");
const app = express();

// app.use((req, res, next) => {
//   console.log("our middleware");
//   next();
// });

app.get("/api/v1/workouts", async (req, res) => {
  const results = await db.query("SELECT * FROM exercises");
  console.log(results);
});

app.get("/api/v1/workouts/:workoutid", (req, res) => {
  res
    .status(200)
    .json({ status: "success", data: { workout: "Bench lifting" } });
});

app.post("/api/v1/workouts/:workoutid", (req, res) => {
  console.log(req);
  res
    .status(200)
    .json({ status: "success", data: { workout: "Bench lifting" } });
});

app.put("/api/v1/workouts/:workoutid", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res
    .status(200)
    .json({ status: "success", data: { workout: "Bench lifting" } });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
