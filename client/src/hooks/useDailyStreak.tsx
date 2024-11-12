import { useState, useEffect } from "react";
import axios from "axios";

interface StreakData {
  streakCount: number;
  pointsGained: number;
  totalPoints: number;
}

export const useDailyStreak = () => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchStreak = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch streak.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(`${apiUrl}/api/streak/update-streak`);
      setStreakData(response.data);
    } catch (err) {
      setError("Error fetching streak.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  return {
    streakData,
    fetchStreak,
    error,
    loading,
  };
};

export default useDailyStreak;
