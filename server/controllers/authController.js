import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql";

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
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (result.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
      if (err) return res.status(500).json({ error: "Error hashing password" });

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
        if (err)
          return res.status(500).json({ error: "Error registering user" });

        const user_id = result.insertId;
        const token = jwt.sign(
          { id: user_id, username: nickname },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
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
  const { username, password } = req.body;
  console.log(process.env.JWT_SECRET);

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = data[0];
    bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      if (!isMatch)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
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
