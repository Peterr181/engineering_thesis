import { useState } from "react";
import axios from "axios";

interface Habit {
  name: string;
  completed: boolean;
}

interface DailySettings {
  calories_eaten: number | null;
  steps_taken: number | null;
  water_consumed: number | null;
  sleep_duration: number | null;
  mood_energy: number | null; // Changed from mood_energy_level to mood_energy
  habits: Habit[];
  created_at: string | null;
}

export const useDailySettings = () => {
  const [dailySettings, setDailySettings] = useState<DailySettings | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wasUpdated, setWasUpdated] = useState<boolean | null>(null);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchDailySettings = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch daily settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${apiUrl}/api/daily-settings`);
      setDailySettings(
        response.data.settings || {
          calories_eaten: null,
          steps_taken: null,
          water_consumed: null,
          sleep_duration: null,
          mood_energy: null,
          habits: [],
          created_at: null,
        }
      );
    } catch (err) {
      setError("Error fetching daily settings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDailySettings = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch daily settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${apiUrl}/api/daily-settings/all`);
      setDailySettings(response.data.settings || []);
    } catch (err) {
      setError("Error fetching all daily settings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDailySettings = async (settings: DailySettings) => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot save daily settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(
        `${apiUrl}/api/daily-settings`,
        settings
      );
      setDailySettings(settings); // Update the state after successful save
      setWasUpdated(response.data.wasUpdated);
    } catch (err) {
      setError("Error saving daily settings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    dailySettings,
    fetchDailySettings,
    saveDailySettings,
    fetchAllDailySettings,
    error,
    loading,
    wasUpdated,
  };
};

export default useDailySettings;
