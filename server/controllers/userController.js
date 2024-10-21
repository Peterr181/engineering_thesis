import db from "../db/db";

export const getProfile = (req, res) => {
  const userId = req.user.userId;

  const sql =
    "SELECT id, username, email, gender, birthYear, avatar, sportLevel FROM users WHERE id = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length > 0) {
      return res.json({ user: data[0] });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
};
