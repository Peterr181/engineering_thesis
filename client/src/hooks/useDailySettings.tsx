import { create } from "zustand";
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
  mood_energy: number | null;
  habits: Habit[];
  created_at: string | null;
}

interface DailySettingsState {
  dailySettings: DailySettings | null;
  error: string | null;
  loading: boolean;
  wasUpdated: boolean | null;
  fetchDailySettings: () => Promise<void>;
  fetchAllDailySettings: () => Promise<void>;
  saveDailySettings: (settings: DailySettings) => Promise<void>;
}

const useDailySettings = create<DailySettingsState>((set) => ({
  dailySettings: null,
  error: null,
  loading: false,
  wasUpdated: null,
  fetchDailySettings: async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    axios.defaults.withCredentials = true;

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot fetch daily settings." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${apiUrl}/api/daily-settings`);
      set({ dailySettings: response.data.settings || null });
    } catch (err) {
      set({ error: "Error fetching daily settings." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchAllDailySettings: async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    axios.defaults.withCredentials = true;

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot fetch daily settings." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${apiUrl}/api/daily-settings/all`);
      set({ dailySettings: response.data.settings });
    } catch (err) {
      set({ error: "Error fetching all daily settings." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  saveDailySettings: async (settings: DailySettings) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    axios.defaults.withCredentials = true;

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      return !!token;
    };

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot save daily settings." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(
        `${apiUrl}/api/daily-settings`,
        settings
      );
      set({ dailySettings: settings, wasUpdated: response.data.wasUpdated });
    } catch (err) {
      set({ error: "Error saving daily settings." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDailySettings;
