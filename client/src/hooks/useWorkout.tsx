import { useState } from "react";
import axios from "axios";

interface Workout {
  id: number;
  day: number;
  month: string;
  description: string;
  finished: boolean;
}

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const fetchWorkouts = async (sorted: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.get(
        `http://localhost:8081/api/workouts?sorted=${sorted}`
      );

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
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

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

  const finishWorkout = async (workoutId: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.post(
        `http://localhost:8081/api/workouts/${workoutId}/finish`
      );

      fetchWorkouts(false);
    } catch (error) {
      console.error("Error finishing the workout", error);
      setError("Error finishing the workout.");
    } finally {
      setLoading(false);
    }
  };

  return {
    workouts,
    fetchWorkouts,
    addWorkout,
    finishWorkout,
    error,
    loading,
  };
};
