import axios from "axios";
import { create } from "zustand";

interface Workout {
  dayName?: string;
  id: number;
  day: number;
  month: string;
  description: string;
  finished: boolean;
  exercise_type?: string;
  exercise_name?: string;
  minutes: number;
  workout_id: string;
  created_at?: string;
}

interface WorkoutState {
  workouts: Workout[];
  weeklyWorkouts: Workout[];
  error: string | null;
  loading: boolean;
  fetchWorkouts: (sorted?: boolean, userId?: string) => Promise<void>;
  fetchWeeklyWorkouts: (userId?: string) => Promise<void>;
  fetchDailyWorkouts: () => Promise<void>;
  fetchMonthlyWorkouts: (userId?: string) => Promise<void>;
  fetchYearlyWorkouts: (userId?: string) => Promise<void>;
  addWorkout: (newWorkout: Workout) => Promise<void>;
  finishWorkout: (workoutId: number) => Promise<void>;
}

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useWorkouts = create<WorkoutState>((set, get) => ({
  workouts: [],
  weeklyWorkouts: [],
  error: null,
  loading: false,

  fetchWorkouts: async (sorted = true, userId?: string) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch workouts.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const url = userId
        ? `${apiUrl}/api/workouts/user/${userId}?sorted=${sorted}`
        : `${apiUrl}/api/workouts?sorted=${sorted}`;

      const res = await axios.get(url);

      if (res.data) {
        set({ workouts: res.data.workouts });
      }
    } catch (err) {
      set({ error: "Error fetching workouts." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addWorkout: async (newWorkout: Workout) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot add workout.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/workouts`, newWorkout);
      if (res.data) {
        set((state) => ({ workouts: [...state.workouts, res.data] }));
      }
    } catch (err) {
      set({ error: "Error adding new workout." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  finishWorkout: async (workoutId: number) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot finish workout.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/workouts/${workoutId}/finish`);

      await get().fetchWorkouts(false);
    } catch (error) {
      set({ error: "Error finishing the workout." });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchWeeklyWorkouts: async (userId?: string) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch weekly workouts.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const url = userId
        ? `${apiUrl}/api/workouts/weekly/${userId}`
        : `${apiUrl}/api/workouts/weekly`;

      const res = await axios.get(url);

      let weeklyData = [];
      if (res.data) {
        weeklyData = res.data.workouts;
      } else {
        const currentDate = new Date();
        const startOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        );
        const endOfWeek = new Date(
          startOfWeek.setDate(startOfWeek.getDate() + 6)
        );

        const workouts = get().workouts;
        weeklyData = workouts.filter((workout) => {
          if (!workout.created_at) return false;
          const workoutDate = new Date(workout.created_at);
          return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
        });
      }

      set({ weeklyWorkouts: weeklyData });
    } catch (err) {
      set({ error: "Error fetching weekly workouts." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchDailyWorkouts: async () => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch daily workouts.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const url = `${apiUrl}/api/workouts/daily`;

      const res = await axios.get(url);
      if (res.data) {
        set({ workouts: res.data.workouts });
      }
    } catch (err) {
      set({ error: "Error fetching daily workouts." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchMonthlyWorkouts: async (userId?: string) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch monthly workouts.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const url = userId
        ? `${apiUrl}/api/workouts/monthly/${userId}`
        : `${apiUrl}/api/workouts/monthly`;

      const res = await axios.get(url);
      if (res.data) {
        set({ workouts: res.data.workouts });
      }
    } catch (err) {
      set({ error: "Error fetching monthly workouts." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchYearlyWorkouts: async (userId?: string) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch yearly workouts.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const url = userId
        ? `${apiUrl}/api/workouts/yearly/${userId}`
        : `${apiUrl}/api/workouts/yearly`;

      const res = await axios.get(url);
      if (res.data) {
        set({ workouts: res.data.workouts });
      }
    } catch (err) {
      set({ error: "Error fetching yearly workouts." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
