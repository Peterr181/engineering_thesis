import db from "../db/db.js";

// Get all chat rooms
export const getRooms = (req, res) => {
  const sql = `SELECT * FROM chat_rooms`;

  db.query(sql, (err, rooms) => {
    if (err) {
      console.error("Error retrieving rooms:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ rooms });
  });
};

// Save message to database
export const saveMessage = (roomId, userId, message, callback) => {
  const sql = `INSERT INTO chat_messages (room_id, user_id, message) VALUES (?, ?, ?)`;

  db.query(sql, [roomId, userId, message], (err, result) => {
    if (err) {
      console.error("Error saving message:", err);
      // Call the callback function with an error
      return callback({ error: "Database error", details: err });
    }

    // Call the callback function with success status
    callback(null, { status: "Success", message: "Message sent" });
  });
};
// Retrieve chat history
export const getChatHistory = (req, res) => {
  const { roomId } = req.params;

  const sql = `SELECT cm.message, u.username, cm.timestamp
               FROM chat_messages cm
               JOIN users u ON cm.user_id = u.id
               WHERE cm.room_id = ? 
               ORDER BY cm.timestamp ASC`;

  db.query(sql, [roomId], (err, messages) => {
    if (err) {
      console.error("Error retrieving chat history:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ messages });
  });
};

export const getRoomName = (req, res) => {
  const { roomId } = req.params;

  const sql = `SELECT name FROM chat_rooms WHERE id = ?`;

  db.query(sql, [roomId], (err, result) => {
    if (err) {
      console.error("Error retrieving room name:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log(result);
    if (result.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ roomName: result[0].name });
  });
};
