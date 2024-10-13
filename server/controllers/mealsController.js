import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gymero",
});

export const createMeal = (req, res) => {
  const { name, type, calories, protein, carbs, fats, grams } = req.body;
  const userId = req.user.userId;

  const sql = `INSERT INTO meals (user_id, name, type, calories, protein, carbs, fats, grams) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [userId, name, type, calories, protein, carbs, fats, grams];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding meal:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(201).json({
      status: "Success",
      message: "Meal added to the plan",
      mealId: result.insertId,
    });
  });
};

export const getMeals = (req, res) => {
  const userId = req.user.userId;

  const sql = `SELECT * FROM meals WHERE user_id = ? ORDER BY date_added DESC`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error occurred." });
    }
    return res.status(200).json({ meals: results });
  });
};

export const updateMeal = (req, res) => {
  const { mealId } = req.params;
  const { name, type, calories, protein, carbs, fats } = req.body;
  const userId = req.user.userId;

  const sql = `UPDATE meals 
               SET name = ?, type = ?, calories = ?, protein = ?, carbs = ?, fats = ? 
               WHERE id = ? AND user_id = ?`;

  db.query(
    sql,
    [name, type, calories, protein, carbs, fats, mealId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error occurred." });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Meal not found or unauthorized to update." });
      }
      return res.status(200).json({ message: "Meal updated successfully." });
    }
  );
};

export const deleteMeal = (req, res) => {
  const { mealId } = req.params;
  const userId = req.user.userId;

  const sql = `DELETE FROM meals WHERE id = ? AND user_id = ?`;

  db.query(sql, [mealId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error occurred." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Meal not found or unauthorized to delete." });
    }
    return res.status(200).json({ message: "Meal deleted successfully." });
  });
};
