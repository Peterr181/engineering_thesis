import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

interface ArchivedMeal {
  date_added: string;
}

export const useMeals = (userId?: string) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealSummaryData, setMealSummaryData] = useState<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  axios.defaults.withCredentials = true;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchMeals = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);
    await fetchMealSummary();

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const url = userId
        ? `${apiUrl}/api/meals/user/${userId}`
        : `${apiUrl}/api/meals`;

      const res = await axios.get(url);

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
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const summaryUrl = userId
        ? `${apiUrl}/api/meals/summary/${userId}`
        : `${apiUrl}/api/meals/summary`;
      const res = await axios.get(summaryUrl);

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

  const fetchDailyNutrientSummary = async (date: string) => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals/summary/daily/${date}`);

      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    } catch (err) {
      setError("Error fetching daily nutrient summary.");
      console.error("Error fetching daily nutrient summary:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (newMeal: Meal) => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return;
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
        await fetchMealSummary();
      }
    } catch (err) {
      setError("Error adding new meal.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedMeals = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals/archived`);
      if (res.data) {
        return res.data.meals; // Return the archived meals
      }
    } catch (err) {
      setError("Error fetching archived meals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
    return [];
  };

  const fetchAllArchivedMeals = async () => {
    try {
      const meals = await fetchArchivedMeals();

      const dates: string[] = Array.from(
        new Set(
          meals.map((meal: ArchivedMeal) =>
            dayjs(meal.date_added).format("YYYY-MM-DD")
          )
        )
      );

      const filteredDates = dates.filter((date: string) =>
        dayjs(date).isBefore(dayjs(), "day")
      );

      setUniqueDates(filteredDates as string[]);
    } catch (error) {
      console.error("Error fetching archived meals:", error);
    }
  };

  const deleteMeal = async (mealId: string) => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`${apiUrl}/api/meals/${mealId}`);
      fetchMeals();
      await fetchMealSummary();
    } catch (err) {
      setError("Error deleting meal.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMealDates = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals/available-dates`);

      if (res.data) {
        setAvailableDates(res.data.dates);
      }
    } catch (err) {
      setError("Error fetching available meal dates.");
      console.error("Error fetching available meal dates:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    meals,
    fetchMeals,
    fetchArchivedMeals,
    mealSummaryData,
    addMeal,
    deleteMeal,
    fetchDailyNutrientSummary,

    fetchAvailableMealDates,
    availableDates,
    fetchAllArchivedMeals,
    uniqueDates,
    error,
    loading,
  };
};
