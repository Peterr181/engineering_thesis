import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gymero",
});

export const createWorkout = (req, res) => {
  const { day, month, description, exercise_name, exercise_type } = req.body;
  const userId = req.user.userId;

  const sql =
    "INSERT INTO workouts (user_id, day, month, description, exercise_name, exercise_type) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    userId,
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
  const userId = req.user.userId;
  const { sorted } = req.query;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const sql = `SELECT * FROM workouts WHERE user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    let filteredWorkouts = results;

    if (sorted === "true") {
      filteredWorkouts = results
        .filter(
          (workout) =>
            monthMap[workout.month] > currentMonth ||
            (monthMap[workout.month] === currentMonth &&
              workout.day >= currentDay)
        )
        .sort((a, b) => {
          const monthA = monthMap[a.month];
          const monthB = monthMap[b.month];

          if (monthA === monthB) {
            return a.day - b.day;
          }
          return monthA - monthB;
        });
    }

    return res.status(200).json({ workouts: filteredWorkouts });
  });
};

export const updateWorkout = (req, res) => {
  const { workoutId } = req.params;
  const { day, month, description } = req.body;
  const userId = req.user.userId;

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
  const userId = req.user.userId;

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

export const finishWorkout = (req, res) => {
  const { workoutId } = req.params;
  const userId = req.user.userId;

  const sql = `UPDATE workouts SET finished = 1 WHERE id = ? AND user_id = ?`;
  db.query(sql, [workoutId, userId], (err, result) => {
    if (err) {
      console.error("Database update error:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Workout not found or unauthorized." });
    }
    return res.status(200).json({ message: "Workout marked as finished." });
  });
};
