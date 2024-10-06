import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import crypto from "crypto";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gymero",
});

const saltRounds = 10;

export const register = (req, res) => {
  const { nickname, password, email, gender, birthYear, avatar, sportLevel } =
    req.body;

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      const sql =
        "INSERT INTO users (username, password, email, gender, birthYear, avatar, sportLevel) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        nickname,
        hash,
        email,
        gender,
        birthYear,
        avatar,
        sportLevel,
      ];

      db.query(sql, values, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error registering user" });
        }

        const uniqueSecret = crypto.randomBytes(16).toString("hex");
        const jwtSecret = `${nickname}-${uniqueSecret}`;

        const token = jwt.sign(
          { username: nickname, secret: uniqueSecret },
          jwtSecret,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({
          status: "Success",
          message: "User registered and logged in successfully",
        });
      });
    });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    if (data.length > 0) {
      bcrypt.compare(password.toString(), data[0].password, (err, response) => {
        if (err)
          return res.status(500).json({ error: "Internal Server Error" });

        if (response) {
          const uniqueSecret = crypto.randomBytes(16).toString("hex");
          const jwtSecret = `${username}-${uniqueSecret}`;

          const token = jwt.sign(
            { username, secret: uniqueSecret },
            jwtSecret,
            {
              expiresIn: "1d",
            }
          );

          const userId = data[0].id;
          res.cookie("token", token, { httpOnly: true });
          res.cookie("userId", userId, { httpOnly: true });

          return res.json({
            status: "Success",
            message: "User logged in successfully",
          });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userId");
  return res.json({ status: "Success", message: "User logged out" });
};

export const verifyUser = (req, res) => {
  return res.json({ status: "Success", message: "User verified" });
};
