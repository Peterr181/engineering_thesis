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
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists
  };

  const fetchMeals = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return; // Prevent fetching if user is not authenticated
    }

    setLoading(true);
    setError(null);
    await fetchMealSummary();

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals`);

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
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return; // Prevent fetching if user is not authenticated
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals/summary`);

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
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return; // Prevent adding meal if user is not authenticated
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post(`${apiUrl}/api/meals`, newMeal);
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
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return; // Prevent deleting meal if user is not authenticated
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`${apiUrl}/api/meals/${mealId}`);
      fetchMeals(); // Refresh meals after deletion
      await fetchMealSummary(); // Refresh the summary after deleting a meal
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
