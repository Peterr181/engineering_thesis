import db from "../db/db.js";

// Controller to send a message
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

// Controller to get all messages for a user (sent and received)
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

// Controller to get messages between two users
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

// Controller to fetch unread messages for a user
export const getUnreadMessages = (req, res) => {
  console.log("Fetching all unread messages");

  const sql = `
    SELECT * FROM messages 
    WHERE is_read = 0
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to fetch unread messages" });
    }
    console.log("Unread messages data:", data); // Add this log
    return res.status(200).json({ messages: data });
  });
};

// Controller to mark all unread messages as read for the current user
export const markMessagesAsRead = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    UPDATE messages 
    SET is_read = 1 
    WHERE recipient_id = ? AND is_read = 0
  `;

  db.query(sql, [userId], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to update message status" });
    }
    return res.status(200).json({ message: "Messages marked as read" });
  });
};
