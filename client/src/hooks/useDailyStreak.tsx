import { useEffect } from "react";
import axios from "axios";
import { create } from "zustand";

interface StreakData {
  streakCount: number;
  pointsGained: number;
  totalPoints: number;
}

interface StreakState {
  streakData: StreakData | null;
  error: string | null;
  loading: boolean;
  fetchStreak: () => void;
}

const useStreakStore = create<StreakState>((set) => ({
  streakData: null,
  error: null,
  loading: false,
  fetchStreak: async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    axios.defaults.withCredentials = true;

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot fetch streak." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(`${apiUrl}/api/streak/update-streak`);
      set({ streakData: response.data });
    } catch (err) {
      set({ error: "Error fetching streak." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));

export const useDailyStreak = () => {
  const { streakData, fetchStreak, error, loading } = useStreakStore();

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return {
    streakData,
    fetchStreak,
    error,
    loading,
  };
};

export default useDailyStreak;
