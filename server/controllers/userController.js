import mysql from "mysql";
const db = mysql.createConnection({
  host: "localhost",
  user: "root",

  password: "",
  database: "gymero",
});

export const getProfile = (req, res) => {
  const sql =
    "SELECT id, username, email, gender, birthYear, avatar, sportLevel FROM users WHERE username = ?";
  db.query(sql, [req.username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length > 0) {
      return res.json({ user: data[0] });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
};