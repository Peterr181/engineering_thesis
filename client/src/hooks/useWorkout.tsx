import { useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

interface Workout {
  day: number;
  month: string;
  description: string;
}

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("http://localhost:8081/api/workouts");

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
    try {
      const res = await axios.post(
        "http://localhost:8081/api/workouts",
        newWorkout
      );
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

  return {
    workouts,
    fetchWorkouts,
    addWorkout,
    error,
    loading,
  };
};
