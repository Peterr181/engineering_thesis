import db from "../db/db.js";

// Save or Update Daily Settings
export const saveDailySettings = (req, res) => {
  const userId = req.user.userId;
  const {
    calories_eaten,
    steps_taken,
    water_consumed,
    sleep_duration,
    mood_energy,
    habits,
  } = req.body;

  const today = new Date().toISOString().split("T")[0];
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL datetime format

  // Check if the user already has a record for today
  const checkSql =
    "SELECT id FROM daily_settings WHERE user_id = ? AND date = ?";
  db.query(checkSql, [userId, today], (err, data) => {
    if (err) {
      console.error("Database error (checkSql):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let wasUpdated = false;

    if (data.length > 0) {
      // Update the existing record
      const dailySettingId = data[0].id;
      const updateSql = `
        UPDATE daily_settings 
        SET calories_eaten = ?, steps_taken = ?, water_consumed = ?, sleep_duration = ?, mood_energy = ?
        WHERE id = ?
      `;
      db.query(
        updateSql,
        [
          calories_eaten,
          steps_taken,
          water_consumed,
          sleep_duration,
          mood_energy,
          dailySettingId,
        ],
        (updateErr) => {
          if (updateErr) {
            console.error("Database error (updateSql):", updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          wasUpdated = true;
          // Update habits
          updateDailyHabits(dailySettingId, habits, res, wasUpdated);
        }
      );
    } else {
      // Insert a new record
      const insertSql = `
        INSERT INTO daily_settings (user_id, date, calories_eaten, steps_taken, water_consumed, sleep_duration, mood_energy, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [
          userId,
          today,
          calories_eaten,
          steps_taken,
          water_consumed,
          sleep_duration,
          mood_energy,
          createdAt, // Include created_at in the insert query
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Database error (insertSql):", insertErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Insert habits
          const dailySettingId = result.insertId;
          updateDailyHabits(dailySettingId, habits, res, wasUpdated);
        }
      );
    }
  });
};

// Helper function to update daily habits
const updateDailyHabits = (dailySettingId, habits, res, wasUpdated) => {
  const deleteSql = "DELETE FROM daily_habits WHERE daily_setting_id = ?";
  db.query(deleteSql, [dailySettingId], (deleteErr) => {
    if (deleteErr) {
      console.error("Database error (deleteSql):", deleteErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (habits && habits.length > 0) {
      const insertSql = `
        INSERT INTO daily_habits (daily_setting_id, habit_name, completed)
        VALUES ?
      `;
      const habitValues = habits.map((habit) => [
        dailySettingId,
        habit.name,
        habit.completed,
      ]);

      db.query(insertSql, [habitValues], (insertErr) => {
        if (insertErr) {
          console.error("Database error (insertSql for habits):", insertErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res
          .status(200)
          .json({ message: "Daily settings saved successfully", wasUpdated });
      });
    } else {
      return res
        .status(200)
        .json({ message: "Daily settings saved successfully", wasUpdated });
    }
  });
};

// Get Daily Settings for a Specific Date
export const getDailySettings = (req, res) => {
  const userId = req.user.userId;
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT ds.*, dh.habit_name, dh.completed
    FROM daily_settings ds
    LEFT JOIN daily_habits dh ON ds.id = dh.daily_setting_id
    WHERE ds.user_id = ? AND ds.date = ?
  `;

  db.query(sql, [userId, today], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length > 0) {
      const settings = {
        id: data[0].id,
        calories_eaten: data[0].calories_eaten,
        steps_taken: data[0].steps_taken,
        water_consumed: data[0].water_consumed,
        sleep_duration: data[0].sleep_duration,
        mood_energy: data[0].mood_energy,
        created_at: data[0].created_at,
        habits: data.map((row) => ({
          name: row.habit_name,
          completed: row.completed,
        })),
      };

      return res.json({ settings });
    } else {
      return res.json({ settings: {} });
    }
  });
};

// Get All Daily Settings for the Current Logged-in User
export const getAllDailySettings = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT ds.*, dh.habit_name, dh.completed
    FROM daily_settings ds
    LEFT JOIN daily_habits dh ON ds.id = dh.daily_setting_id
    WHERE ds.user_id = ?
    ORDER BY ds.date DESC
  `;

  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const settings = data.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
        acc[date] = {
          id: row.id,
          calories_eaten: row.calories_eaten,
          steps_taken: row.steps_taken,
          water_consumed: row.water_consumed,
          sleep_duration: row.sleep_duration,
          mood_energy: row.mood_energy,
          created_at: row.created_at,
          habits: [],
        };
      }
      acc[date].habits.push({
        name: row.habit_name,
        completed: row.completed,
      });
      return acc;
    }, {});

    return res.json({ settings: Object.values(settings) });
  });
};
