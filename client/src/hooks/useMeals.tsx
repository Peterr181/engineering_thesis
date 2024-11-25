import { create } from "zustand";
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
  date_added: string; // Add this line
}

interface MealSummaryData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface MealsState {
  meals: Meal[];
  mealSummaryData: MealSummaryData | null;
  error: string | null;
  loading: boolean;
  availableDates: string[];
  uniqueDates: string[];
  setMeals: (meals: Meal[]) => void;
  setMealSummaryData: (data: MealSummaryData) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAvailableDates: (dates: string[]) => void;
  setUniqueDates: (dates: string[]) => void;
  fetchMeals: (userId?: string) => Promise<void>;
  fetchMealSummary: (userId?: string) => Promise<void>;
  fetchDailyNutrientSummary: (date: string) => Promise<MealSummaryData | null>;
  addMeal: (newMeal: Meal) => Promise<void>;
  fetchArchivedMeals: () => Promise<Meal[]>;
  fetchAllArchivedMeals: () => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  fetchAvailableMealDates: () => Promise<void>;
}

axios.defaults.withCredentials = true;
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useMealsStore = create<MealsState>((set) => ({
  meals: [],
  mealSummaryData: null,
  error: null,
  loading: false,
  availableDates: [],
  uniqueDates: [],
  setMeals: (meals) => set({ meals }),
  setMealSummaryData: (data) => set({ mealSummaryData: data }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setAvailableDates: (dates) => set({ availableDates: dates }),
  setUniqueDates: (dates) => set({ uniqueDates: dates }),
  fetchMeals: async (userId) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ loading: true, error: null });
    await useMealsStore.getState().fetchMealSummary(userId);

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
        set({ meals: res.data.meals });
      }
    } catch (err) {
      set({ error: "Error fetching meals." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchMealSummary: async (userId) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ loading: true, error: null });

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
        set({ mealSummaryData: res.data });
      }
    } catch (err) {
      set({ error: "Error fetching meal summary." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchDailyNutrientSummary: async (date) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return null;
    }

    set({ loading: true, error: null });

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
      set({ error: "Error fetching daily nutrient summary." });
      console.error("Error fetching daily nutrient summary:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addMeal: async (newMeal) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post(`${apiUrl}/api/meals`, newMeal);
      if (res.data) {
        set((state) => ({ meals: [...state.meals, res.data] }));
        await useMealsStore.getState().fetchMealSummary();
      }
    } catch (err) {
      set({ error: "Error adding new meal." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchArchivedMeals: async () => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return [];
    }

    set({ loading: true, error: null });

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
      set({ error: "Error fetching archived meals." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
    return [];
  },
  fetchAllArchivedMeals: async () => {
    try {
      const meals = await useMealsStore.getState().fetchArchivedMeals();

      const dates = Array.from(
        new Set(
          meals.map((meal) => dayjs(meal.date_added).format("YYYY-MM-DD"))
        )
      );

      const filteredDates = dates.filter((date) =>
        dayjs(date).isBefore(dayjs(), "day")
      );

      set({ uniqueDates: filteredDates });
    } catch (error) {
      console.error("Error fetching archived meals:", error);
    }
  },
  deleteMeal: async (mealId) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.delete(`${apiUrl}/api/meals/${mealId}`);
      useMealsStore.getState().fetchMeals();
      await useMealsStore.getState().fetchMealSummary();
    } catch (err) {
      set({ error: "Error deleting meal." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchAvailableMealDates: async () => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(`${apiUrl}/api/meals/available-dates`);

      if (res.data) {
        set({ availableDates: res.data.dates });
      }
    } catch (err) {
      set({ error: "Error fetching available meal dates." });
      console.error("Error fetching available meal dates:", err);
    } finally {
      set({ loading: false });
    }
  },
}));

export const useMeals = () => useMealsStore((state) => state);
