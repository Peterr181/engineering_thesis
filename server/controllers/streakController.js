import db from "../db/db.js";
import moment from "moment";

export const checkAndUpdateStreak = async (req, res) => {
  const userId = req.user.userId;
  const today = moment().format("YYYY-MM-DD");

  // Get the user’s streak data
  const sqlSelect = "SELECT * FROM user_streaks WHERE user_id = ?";
  const [streakData] = await db.promise().query(sqlSelect, [userId]);

  let newStreakCount = 1;
  let newPoints = 10; // Points for the first day
  let totalPoints = 10;

  if (streakData.length > 0) {
    const lastLogin = moment(streakData[0].last_login_date);

    // Check if the streak was already updated today
    if (lastLogin.isSame(today, "day")) {
      return res.status(200).json({
        message: "Streak already updated today",
        streakCount: streakData[0].streak_count,
        pointsGained: 0,
        totalPoints: streakData[0].total_points,
      });
    }

    // Check if the last login was yesterday (continues the streak)
    if (lastLogin.isSame(moment().subtract(1, "days"), "day")) {
      newStreakCount = streakData[0].streak_count + 1;
      newPoints = newStreakCount * 10; // Incremental points per day
      totalPoints = Array.from(
        { length: newStreakCount },
        (_, i) => (i + 1) * 10
      ).reduce((a, b) => a + b, 0);
    } else if (lastLogin.isBefore(moment().subtract(1, "days"), "day")) {
      newStreakCount = 1; // Reset if it's been more than a day
      newPoints = 10;
      totalPoints = 10;
    }

    const sqlUpdate = `
            UPDATE user_streaks 
            SET last_login_date = ?, streak_count = ?, total_points = ? 
            WHERE user_id = ?
        `;
    await db
      .promise()
      .query(sqlUpdate, [today, newStreakCount, totalPoints, userId]);
  } else {
    // If no streak record exists, create a new one
    const sqlInsert = `
            INSERT INTO user_streaks (user_id, last_login_date, streak_count, total_points)
            VALUES (?, ?, ?, ?)
        `;
    await db
      .promise()
      .query(sqlInsert, [userId, today, newStreakCount, totalPoints]);
  }

  // Update total_points in users table
  const sqlUpdateUser = `
          UPDATE users
          SET total_points = ?
          WHERE id = ?
      `;
  await db.promise().query(sqlUpdateUser, [totalPoints, userId]);

  res.status(200).json({
    message: "Streak updated",
    streakCount: newStreakCount,
    pointsGained: newPoints,
    totalPoints: totalPoints,
  });
};
