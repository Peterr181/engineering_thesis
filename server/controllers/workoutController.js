import db from "../db/db.js";

export const createWorkout = (req, res) => {
  const { day, month, description, exercise_name, exercise_type, minutes } =
    req.body;
  const userId = req.user.userId;

  const sql =
    "INSERT INTO workouts (user_id, day, month, description, exercise_name, exercise_type, minutes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    userId,
    day,
    month,
    description,
    exercise_name,
    exercise_type,
    minutes,
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

export const getWeeklyWorkouts = (req, res) => {
  const userId = req.user.userId;

  // Mapping month names to their corresponding numerical values
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

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get today's date and set the start and end of the current week
  const today = new Date();

  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Set start of the week to Monday
  startOfWeek.setDate(
    today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
  ); // Monday
  startOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight

  // Set end of the week to Sunday
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

  const currentYear = today.getFullYear(); // Get the current year

  // Generate a CASE statement to convert month names to numeric values
  const monthCaseStatement = `(CASE 
    ${Object.entries(monthMap)
      .map(
        ([name, num]) =>
          `WHEN month = '${name}' THEN ${String(num).padStart(2, "0")}`
      )
      .join(" ")}
    END)`;

  const sql = `
      SELECT * FROM workouts 
      WHERE user_id = ? 
        AND STR_TO_DATE(CONCAT(?, '-', ${monthCaseStatement}, '-', LPAD(day, 2, '0')), '%Y-%m-%d')
        BETWEEN ? AND ?
  `;

  const queryParams = [
    userId,
    currentYear,
    startOfWeek.toISOString().slice(0, 10), // Format to YYYY-MM-DD
    endOfWeek.toISOString().slice(0, 10), // Format to YYYY-MM-DD
  ];

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error.", details: err });
    }

    const workoutsWithDayName = results.map((workout) => {
      const monthNumber = monthMap[workout.month] - 1;
      const workoutDate = new Date(currentYear, monthNumber, workout.day);
      return {
        ...workout,
        dayName: daysOfWeek[workoutDate.getDay()],
      };
    });

    return res.status(200).json({ workouts: workoutsWithDayName });
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

export const getWorkoutsByUserId = (req, res) => {
  const { userId } = req.params; // Update this line

  const sql = `SELECT * FROM workouts WHERE user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No workouts found for this user." });
    }
    return res.status(200).json({ workouts: results });
  });
};
