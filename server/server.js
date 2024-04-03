import express from "express";
// const db = require("./db");
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";

const salt = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["POST", "GET"],
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",

  password: "",
  database: "gymero",
});

app.post("/register", (req, res) => {
  const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const values = [req.body.username, hash, req.body.email];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error registering user" });
      } else {
        console.log(result);
        return res
          .status(200)
          .json({ status: "Success", message: "User registered successfully" });
      }
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (response) {
            return res.json({
              status: "Success",
              message: "User logged in successfully",
            });
          }
        }
      );
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});

// app.get("/api/v1/workouts", async (req, res) => {
//   const results = await db.query("SELECT * FROM exercises");
//   console.log(results);
// });

// app.get("/api/v1/workouts/:workoutid", (req, res) => {
//   res
//     .status(200)
//     .json({ status: "success", data: { workout: "Bench lifting" } });
// });

// app.post("/api/v1/workouts/:workoutid", (req, res) => {
//   console.log(req);
//   res
//     .status(200)
//     .json({ status: "success", data: { workout: "Bench lifting" } });
// });

// app.put("/api/v1/workouts/:workoutid", (req, res) => {
//   console.log(req.params.id);
//   console.log(req.body);
//   res
//     .status(200)
//     .json({ status: "success", data: { workout: "Bench lifting" } });
// });

// const port = process.env.PORT;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
