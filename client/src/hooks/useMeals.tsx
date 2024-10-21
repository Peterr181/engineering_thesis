import { useState } from "react";
import axios from "axios";

interface Meal {
  id?: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  grams: number;
}

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealSummaryData, setMealSummaryData] = useState<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    fetchMealSummary();

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(
        "https://gymero-882311e33226.herokuapp.com/api/meals"
      );

      if (res.data) {
        setMeals(res.data.meals);
      }
    } catch (err) {
      setError("Error fetching meals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(
        "https://gymero-882311e33226.herokuapp.com/api/meals/summary"
      );

      if (res.data) {
        setMealSummaryData(res.data);
      }
    } catch (err) {
      setError("Error fetching meal summary.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (newMeal: Meal) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post("http://localhost:8081/api/meals", newMeal);
      if (res.data) {
        setMeals((prevMeals) => [...prevMeals, res.data]);
        await fetchMealSummary(); // Refresh the summary after adding a meal
      }
    } catch (err) {
      setError("Error adding new meal.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`http://localhost:8081/api/meals/${mealId}`);
      fetchMeals();
      fetchMealSummary(); // Refresh the summary after deleting a meal
    } catch (err) {
      setError("Error deleting meal.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    meals,
    fetchMeals,
    mealSummaryData,
    addMeal,
    deleteMeal,
    error,
    loading,
  };
};
