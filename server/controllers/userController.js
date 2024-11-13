import db from "../db/db.js";

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

export const getUserById = (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT id, username, email, gender, birthYear, avatar, sportLevel, total_points, stars FROM users WHERE id = ?";

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

export const getAllUsers = (req, res) => {
  const sql =
    "SELECT id, username, email, gender, birthYear, avatar, sportLevel, total_points, stars FROM users";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ users: data });
  });
};

export const addStarToUser = (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.userId;

  // Check if the current user has already added a star to this user
  const checkSql =
    "SELECT * FROM user_stars WHERE user_id = ? AND star_by_user_id = ?";
  db.query(checkSql, [userId, currentUserId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already added a star to this user" });
    }

    // Add a star to the user
    const addStarSql = "UPDATE users SET stars = stars + 1 WHERE id = ?";
    db.query(addStarSql, [userId], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Record the star addition
      const recordStarSql =
        "INSERT INTO user_stars (user_id, star_by_user_id) VALUES (?, ?)";
      db.query(recordStarSql, [userId, currentUserId], (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json({ message: "Star added successfully" });
      });
    });
  });
};
