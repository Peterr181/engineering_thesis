import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",

  password: "",
  database: "gymero",
});

export const createWorkout = (req, res) => {
  const { day, month, description, exercise_name, exercise_type } = req.body;

  const user_id = req.cookies.userId;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const sql =
    "INSERT INTO workouts (user_id, day, month, description, exercise_name, exercise_type) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    day,
    month,
    description,
    exercise_name,
    exercise_type,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating workout:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(201).json({
      status: "Success",
      message: "Workout created",
      workoutId: result.insertId,
    });
  });
};

export const getWorkouts = (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const sql = `SELECT * FROM workouts WHERE user_id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    return res.status(200).json({ workouts: results });
  });
};

export const updateWorkout = (req, res) => {
  const { workoutId } = req.params;
  const { day, month, description } = req.body;
  const userId = req.userId;

  const sql = `UPDATE workouts SET day = ?, month = ?, description = ? WHERE workout_id = ? AND user_id = ?`;

  db.query(sql, [day, month, description, workoutId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Workout not found or unauthorized to edit." });
    }
    return res.status(200).json({ message: "Workout updated successfully." });
  });
};

export const deleteWorkout = (req, res) => {
  const { workoutId } = req.params;
  const userId = req.userId;

  const sql = `DELETE FROM workouts WHERE workout_id = ? AND user_id = ?`;

  db.query(sql, [workoutId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Workout not found or unauthorized to delete." });
    }
    return res.status(200).json({ message: "Workout deleted successfully." });
  });
};
