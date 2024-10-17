import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gymero",
});

export const setPersonalInfo = (req, res) => {
  const userId = req.user.userId;
  const {
    nickname,
    favorite_training_type,
    current_fitness_goals,
    water_drunk_daily,
    steps_daily,
    skill_level,
    caloric_intake_goal,
    body_measurements,
    workout_frequency,
    personal_bests,
    weight,
  } = req.body;

  const sql = `
    INSERT INTO personal_info (user_id, nickname, favorite_training_type, current_fitness_goals, water_drunk_daily, steps_daily, skill_level, caloric_intake_goal, body_measurements, workout_frequency, personal_bests, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    nickname = VALUES(nickname),
    favorite_training_type = VALUES(favorite_training_type),
    current_fitness_goals = VALUES(current_fitness_goals),
    water_drunk_daily = VALUES(water_drunk_daily),
    steps_daily = VALUES(steps_daily),
    skill_level = VALUES(skill_level),
    caloric_intake_goal = VALUES(caloric_intake_goal),
    body_measurements = VALUES(body_measurements),
    workout_frequency = VALUES(workout_frequency),
    personal_bests = VALUES(personal_bests),
    weight = VALUES(weight)
  `;
  const values = [
    userId,
    nickname,
    favorite_training_type,
    current_fitness_goals,
    water_drunk_daily,
    steps_daily,
    skill_level,
    caloric_intake_goal,
    body_measurements,
    workout_frequency,
    personal_bests,
    weight,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error setting personal info:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(200).json({
      status: "Success",
      message: "Personal info saved successfully",
    });
  });
};

export const getPersonalInfo = (req, res) => {
  const userId = req.user.userId;

  const sql = `SELECT * FROM personal_info WHERE user_id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }

    if (result.length > 0) {
      return res.status(200).json({ personalInfo: result[0] });
    } else {
      return res.status(200).json({
        personalInfo: {
          nickname: "",
          favoriteTrainingType: "",
          currentFitnessGoals: "",
          waterDrunkDaily: "",
          stepsDaily: "",
          skillLevel: "",
          caloricIntakeGoal: "",
          bodyMeasurements: "",
          workoutFrequency: "",
          personalBests: "",
          weight: "",
        },
      });
    }
  });
};

export const deletePersonalInfo = (req, res) => {
  const userId = req.user.userId;

  const sql = `DELETE FROM personal_info WHERE user_id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Personal info not found" });
    }
    return res
      .status(200)
      .json({ message: "Personal info deleted successfully." });
  });
};
