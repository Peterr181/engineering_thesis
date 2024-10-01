import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";

const salt = 10;

const app = express();
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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",

  password: "",
  database: "gymero",
});

app.post("/register", (req, res) => {
  console.log(req.body);

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [req.body.email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const sql =
      "INSERT INTO users (username, password, email, gender, birthYear, avatar, sportLevel) VALUES (?, ?, ?, ?, ?, ?, ?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const values = [
        req.body.nickname,
        hash,
        req.body.email,
        req.body.gender,
        req.body.birthYear,
        req.body.avatar,
        req.body.sportLevel,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error registering user" });
        } else {
          const name = req.body.nickname;
          const token = jwt.sign({ name }, "jwt-secret-key", {
            expiresIn: "1d",
          });

          res.cookie("token", token, { httpOnly: true });

          return res.status(200).json({
            status: "Success",
            message: "User registered and logged in successfully",
          });
        }
      });
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
            const name = req.body.username;
            const token = jwt.sign({ name }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);

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

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/profile", verifyUser, (req, res) => {
  const sql =
    "SELECT id, username, email, gender, birthYear, avatar, sportLevel FROM users WHERE username = ?";
  db.query(sql, [req.name], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length > 0) {
      return res.json({ user: data[0] });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/auth", verifyUser, (req, res) => {
  return res.json({ status: "Success", message: "User verified" });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "Success", message: "User logged out" });
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
