import { useState } from "react";
import axios from "axios";

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
}

export const useWorkouts = (userId?: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchWorkouts = async (sorted: boolean = true) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch workouts.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Construct the URL based on userId
      const url = userId
        ? `${apiUrl}/api/workouts/user/${userId}?sorted=${sorted}` // Update this line
        : `${apiUrl}/api/workouts?sorted=${sorted}`;

      const res = await axios.get(url);

      if (res.data) {
        setWorkouts(res.data.workouts);
      }
    } catch (err) {
      setError("Error fetching workouts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (newWorkout: Workout) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot add workout.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/workouts`, newWorkout);
      if (res.data) {
        setWorkouts((prevWorkouts) => [...prevWorkouts, res.data]);
      }
    } catch (err) {
      setError("Error adding new workout.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const finishWorkout = async (workoutId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot finish workout.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/workouts/${workoutId}/finish`);

      fetchWorkouts(false);
    } catch (error) {
      setError("Error finishing the workout.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyWorkouts = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch weekly workouts.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Construct the URL based on userId
      const url = userId
        ? `${apiUrl}/api/workouts/weekly/${userId}`
        : `${apiUrl}/api/workouts/weekly`;

      const res = await axios.get(url); // Adjust this URL based on your backend endpoint
      if (res.data) {
        setWeeklyWorkouts(res.data.workouts); // Store weekly workouts
      }
    } catch (err) {
      setError("Error fetching weekly workouts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    workouts,
    weeklyWorkouts,
    fetchWorkouts,
    fetchWeeklyWorkouts,
    addWorkout,
    finishWorkout,
    error,
    loading,
  };
};
