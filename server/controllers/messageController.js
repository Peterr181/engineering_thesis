import db from "../db/db.js";

export const sendMessage = (req, res) => {
  const { message, recipient_id, sender_username } = req.body;
  const sender_id = req.user.userId;

  const sql =
    "INSERT INTO messages (message, sender_id, recipient_id, sender_username) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [message, sender_id, recipient_id, sender_username],
    (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to send message" });
      }
      return res.status(201).json({
        message: "Message sent successfully",
        messageId: data.insertId,
      });
    }
  );
};

export const getMessages = (req, res) => {
  const userId = req.user.userId;
  const { otherUserId } = req.params;

  const sql = `
    SELECT * FROM messages 
    WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) 
    ORDER BY date_sent ASC
  `;

  db.query(sql, [userId, otherUserId, otherUserId, userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to retrieve messages" });
    }
    return res.status(200).json({ messages: data });
  });
};

export const getAllMessages = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT * FROM messages 
    WHERE sender_id = ? OR recipient_id = ? 
    ORDER BY date_sent ASC
  `;

  db.query(sql, [userId, userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to retrieve messages" });
    }
    return res.status(200).json({ messages: data });
  });
};
