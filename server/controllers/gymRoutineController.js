import db from "../db/db.js";

// Create a new routine
export const createRoutine = async (req, res) => {
  const { routineName, startDate } = req.body;
  const userId = req.user.userId;

  const sql =
    "INSERT INTO routines (user_id, routine_name, start_date) VALUES (?, ?, ?)";
  try {
    const [result] = await db
      .promise()
      .query(sql, [userId, routineName, startDate]);
    return res.status(201).json({
      routineId: result.insertId,
      message: "Routine created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all routines for a user
export const getRoutines = async (req, res) => {
  const userId = req.user.userId;

  const sql =
    "SELECT id, routine_name, start_date, is_active FROM routines WHERE user_id = ?";
  try {
    const [data] = await db.promise().query(sql, [userId]);
    return res.json({ routines: data });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a day to a routine
export const addRoutineDay = async (req, res) => {
  const { routineId, dayOfWeek } = req.body;

  const sql =
    "INSERT INTO routine_days (routine_id, day_of_week) VALUES (?, ?)";
  try {
    const [result] = await db.promise().query(sql, [routineId, dayOfWeek]);
    return res
      .status(201)
      .json({ routineDayId: result.insertId, message: "Day added to routine" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add an exercise to a routine day
export const addExercise = async (req, res) => {
  const { routineDayId, exerciseName, numSets } = req.body;

  const sql =
    "INSERT INTO gym_exercises (routine_day_id, exercise_name, num_sets) VALUES (?, ?, ?)";
  try {
    const [result] = await db
      .promise()
      .query(sql, [routineDayId, exerciseName, numSets]);
    return res.status(201).json({
      exerciseId: result.insertId,
      message: "Exercise added successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a set to an exercise
export const addExerciseSet = async (req, res) => {
  const { exerciseId, setNumber, repetitions, weight } = req.body;

  const sql =
    "INSERT INTO gym_exercise_sets (exercise_id, set_number, repetitions, weight) VALUES (?, ?, ?, ?)";
  try {
    const [result] = await db
      .promise()
      .query(sql, [exerciseId, setNumber, repetitions, weight]);
    return res
      .status(201)
      .json({ setId: result.insertId, message: "Set added successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get complete routine with days, exercises, and sets
export const getRoutineDetails = async (req, res) => {
  const { routineId } = req.params;

  const sql = `
    SELECT rd.day_of_week, e.exercise_name, s.set_number, s.repetitions, s.weight
    FROM routine_days rd
    JOIN gym_exercises e ON rd.id = e.routine_day_id
    JOIN gym_exercise_sets s ON e.id = s.exercise_id
    WHERE rd.routine_id = ?
    ORDER BY rd.day_of_week, e.exercise_name, s.set_number
  `;

  try {
    const [data] = await db.promise().query(sql, [routineId]);
    // Transform data into a nested structure for better readability
    const routineDetails = {};
    data.forEach((row) => {
      if (!routineDetails[row.day_of_week]) {
        routineDetails[row.day_of_week] = [];
      }
      let exercise = routineDetails[row.day_of_week].find(
        (e) => e.name === row.exercise_name
      );
      if (!exercise) {
        exercise = { name: row.exercise_name, sets: [] };
        routineDetails[row.day_of_week].push(exercise);
      }
      exercise.sets.push({
        setNumber: row.set_number,
        repetitions: row.repetitions,
        weight: row.weight,
      });
    });

    return res.json({ routineDetails });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Save the entire plan
export const savePlan = async (req, res) => {
  const { routineName, startDate, selectedDays, workouts } = req.body;
  const userId = req.user.userId;

  try {
    // Create a new routine
    const routineSql =
      "INSERT INTO routines (user_id, routine_name, start_date) VALUES (?, ?, ?)";
    const [routineResult] = await db
      .promise()
      .query(routineSql, [userId, routineName, startDate]);
    const routineId = routineResult.insertId;

    for (const day of selectedDays) {
      // Add a day to the routine
      const daySql =
        "INSERT INTO routine_days (routine_id, day_of_week) VALUES (?, ?)";
      const [dayResult] = await db.promise().query(daySql, [routineId, day]);
      const routineDayId = dayResult.insertId;

      const workout = workouts.find((w) => w.day === day);
      if (workout) {
        for (const exercise of workout.exercises) {
          // Add an exercise to the routine day
          const exerciseSql =
            "INSERT INTO gym_exercises (routine_day_id, exercise_name, num_sets) VALUES (?, ?, ?)";
          const [exerciseResult] = await db
            .promise()
            .query(exerciseSql, [
              routineDayId,
              exercise.name,
              exercise.sets.length,
            ]);
          const exerciseId = exerciseResult.insertId;

          for (let i = 0; i < exercise.sets.length; i++) {
            const set = exercise.sets[i];
            // Add a set to the exercise
            const setSql =
              "INSERT INTO gym_exercise_sets (exercise_id, set_number, repetitions, weight) VALUES (?, ?, ?, ?)";
            await db
              .promise()
              .query(setSql, [exerciseId, i + 1, set.repetitions, set.weight]);
          }
        }
      }
    }

    return res.status(201).json({ message: "Plan saved successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a specific routine
export const deleteRoutine = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.userId;

  const sql = "DELETE FROM routines WHERE id = ? AND user_id = ?";
  try {
    await db.promise().query(sql, [routineId, userId]);
    return res.status(200).json({ message: "Routine deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// End the current routine
export const endRoutine = async (req, res) => {
  const { routineId } = req.body;
  const userId = req.user.userId;

  const sql = "UPDATE routines SET is_active = 0 WHERE id = ? AND user_id = ?";
  try {
    const [result] = await db.promise().query(sql, [routineId, userId]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Routine not found or not owned by user" });
    }
    return res.status(200).json({ message: "Routine ended successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Activate or deactivate a specific routine by its ID
export const activateRoutine = async (req, res) => {
  const { routineId } = req.params;
  const { isActive } = req.body; // Get the active status from the request body
  const userId = req.user.userId;

  const deactivateSql = "UPDATE routines SET is_active = 0 WHERE user_id = ?";
  const activateSql =
    "UPDATE routines SET is_active = ? WHERE id = ? AND user_id = ?";

  try {
    await db.promise().query(deactivateSql, [userId]);
    const [result] = await db
      .promise()
      .query(activateSql, [isActive ? 1 : 0, routineId, userId]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Routine not found or not owned by user" });
    }
    return res.status(200).json({
      message: `Routine ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific routine by its ID
export const getRoutineById = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.userId;

  const sql =
    "SELECT id, routine_name, start_date, is_active FROM routines WHERE id = ? AND user_id = ?";
  try {
    const [data] = await db.promise().query(sql, [routineId, userId]);
    if (data.length === 0) {
      return res.status(404).json({ error: "Routine not found" });
    }
    return res.json({ routine: data[0] });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Duplicate a routine for the next week
export const duplicateRoutineForNextWeek = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.userId;

  try {
    // Fetch the original routine
    const [routineData] = await db
      .promise()
      .query(
        "SELECT routine_name, start_date FROM routines WHERE id = ? AND user_id = ?",
        [routineId, userId]
      );

    if (routineData.length === 0) {
      return res.status(404).json({ error: "Routine not found" });
    }

    const originalRoutine = routineData[0];
    const newStartDate = new Date(originalRoutine.start_date);
    newStartDate.setDate(newStartDate.getDate() + 7); // Add 7 days to the start date

    // Create a new routine with the new start date
    const [newRoutineResult] = await db
      .promise()
      .query(
        "INSERT INTO routines (user_id, routine_name, start_date) VALUES (?, ?, ?)",
        [
          userId,
          originalRoutine.routine_name,
          newStartDate.toISOString().split("T")[0],
        ]
      );
    const newRoutineId = newRoutineResult.insertId;

    // Duplicate routine days
    const [routineDays] = await db
      .promise()
      .query("SELECT id, day_of_week FROM routine_days WHERE routine_id = ?", [
        routineId,
      ]);

    for (const day of routineDays) {
      const [newDayResult] = await db
        .promise()
        .query(
          "INSERT INTO routine_days (routine_id, day_of_week) VALUES (?, ?)",
          [newRoutineId, day.day_of_week]
        );
      const newRoutineDayId = newDayResult.insertId;

      // Duplicate exercises
      const [exercises] = await db
        .promise()
        .query(
          "SELECT id, exercise_name, num_sets FROM gym_exercises WHERE routine_day_id = ?",
          [day.id]
        );

      for (const exercise of exercises) {
        const [newExerciseResult] = await db
          .promise()
          .query(
            "INSERT INTO gym_exercises (routine_day_id, exercise_name, num_sets) VALUES (?, ?, ?)",
            [newRoutineDayId, exercise.exercise_name, exercise.num_sets]
          );
        const newExerciseId = newExerciseResult.insertId;

        // Duplicate sets
        const [sets] = await db
          .promise()
          .query(
            "SELECT set_number, repetitions, weight FROM gym_exercise_sets WHERE exercise_id = ?",
            [exercise.id]
          );

        for (const set of sets) {
          await db
            .promise()
            .query(
              "INSERT INTO gym_exercise_sets (exercise_id, set_number, repetitions, weight) VALUES (?, ?, ?, ?)",
              [newExerciseId, set.set_number, set.repetitions, set.weight]
            );
        }
      }
    }

    return res.status(201).json({ message: "Routine duplicated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
