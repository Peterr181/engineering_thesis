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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get("http://localhost:8081/api/meals");

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
    addMeal,
    deleteMeal,
    error,
    loading,
  };
};
