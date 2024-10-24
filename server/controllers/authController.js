import bcrypt from "bcryptjs"; // Use bcryptjs
import jwt from "jsonwebtoken";
import db from "../db/db.js";

const saltRounds = 10;

const handleError = (res, status, message) => {
  return res.status(status).json({ error: message });
};

export const register = (req, res) => {
  const { nickname, password, email, gender, birthYear, avatar, sportLevel } =
    req.body;

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [email], (err, result) => {
    if (err) return handleError(res, 500, "Internal Server Error");

    if (result.length > 0)
      return handleError(res, 400, "Email already registered");

    bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
      if (err) return handleError(res, 500, "Error hashing password");

      const sql = `INSERT INTO users (username, password, email, gender, birthYear, avatar, sportLevel) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        nickname,
        hash,
        email,
        gender,
        birthYear,
        avatar,
        sportLevel,
      ];

      db.query(sql, values, (err, result) => {
        if (err) return handleError(res, 500, "Error registering user");

        const user_id = result.insertId;
        const token = jwt.sign(
          { id: user_id, username: nickname },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          status: "Success",
          message: "User registered successfully",
          token,
        });
      });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log query errors
      return handleError(res, 500, "Internal Server Error");
    }

    if (data.length === 0) {
      console.warn(`User not found for email: ${email}`); // Log user not found
      return handleError(res, 404, "User not found");
    }

    const user = data[0];

    bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing password:", err); // Log password comparison errors
        return handleError(res, 500, "Internal Server Error");
      }

      if (!isMatch) {
        console.warn(`Invalid credentials for email: ${email}`); // Log invalid credentials
        return handleError(res, 401, "Invalid credentials");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        status: "Success",
        message: "User logged in successfully",
        token,
      });
    });
  });
};

export const logout = (req, res) => {
  return res.json({ status: "Success", message: "User logged out" });
};

export const verifyUser = (req, res) => {
  return res.json({ status: "Success", message: "User verified" });
};
