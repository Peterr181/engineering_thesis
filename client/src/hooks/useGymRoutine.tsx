import { useState } from "react";
import axios from "axios";

interface Routine {
  id: number;
  routine_name: string;
  start_date: string | null;
  is_active: number;
  duplicated: number;
}

interface RoutineDetails {
  [dayOfWeek: string]: {
    name: string;
    sets: {
      setNumber: number;
      repetitions: number;
      weight: number;
    }[];
  }[];
}

interface WorkoutDay {
  day: string;
  exercises: {
    name: string;
    sets: {
      setNumber: number;
      repetitions: number;
      weight: number;
    }[];
  }[];
}

export const useGymRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routineDetails, setRoutineDetails] = useState<RoutineDetails | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Fetch all routines for the authenticated user
  const fetchRoutines = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch routines.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/routines`);
      if (res.data) {
        setRoutines(res.data.routines);
      }
    } catch (err) {
      setError("Error fetching routines.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new routine
  const createRoutine = async (
    routineName: string,
    startDate: string | null
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot create routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/routines/create`, {
        routineName,
        startDate,
      });
      if (res.data) {
        fetchRoutines(); // Refresh routines list after creation
      }
    } catch (err) {
      setError("Error creating routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a day to a specific routine
  const addRoutineDay = async (routineId: number, dayOfWeek: string) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot add day to routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/routines/day`, {
        routineId,
        dayOfWeek,
      });
    } catch (err) {
      setError("Error adding day to routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add an exercise to a routine day
  const addExercise = async (
    routineDayId: number,
    exerciseName: string,
    numSets: number
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot add exercise.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/routines/exercise`, {
        routineDayId,
        exerciseName,
        numSets,
      });

      return res.data; // Return the response data
    } catch (err) {
      setError("Error adding exercise.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a set to an exercise
  const addExerciseSet = async (
    exerciseId: number,
    setNumber: number,
    repetitions: number,
    weight: number
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot add exercise set.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/routines/exercise/set`, {
        exerciseId,
        setNumber,
        repetitions,
        weight,
      });
    } catch (err) {
      setError("Error adding exercise set.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get details for a specific routine with days, exercises, and sets
  const fetchRoutineDetails = async (routineId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch routine details.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/routines/${routineId}`);
      if (res.data) {
        setRoutineDetails(res.data.routineDetails);
      }
    } catch (err) {
      setError("Error fetching routine details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific routine by its ID
  const fetchRoutineById = async (routineId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/routines/${routineId}`);
      if (res.data) {
        return res.data.routine;
      }
    } catch (err) {
      setError("Error fetching routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save the entire plan
  const savePlan = async (
    routineName: string,
    startDate: string | null,
    selectedDays: string[],
    workouts: WorkoutDay[]
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot save plan.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/routines/savePlan`, {
        routineName,
        startDate,
        selectedDays,
        workouts,
      });
    } catch (err) {
      setError("Error saving plan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // End the current routine
  const endRoutine = async (routineId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot end routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/routines/endRoutine`, {
        routineId,
      });
      if (res.data) {
        fetchRoutines(); // Refresh routines list after ending the current routine
      }
    } catch (err) {
      setError("Error ending routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Activate or deactivate a specific routine by its ID
  const activateRoutine = async (
    routineId: number,
    isActive: boolean = true
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot activate routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/routines/activate/${routineId}`, {
        isActive,
      });
      fetchRoutines(); // Refresh routines list after activation
    } catch (err) {
      setError("Error activating routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate a routine for the next week
  const duplicateRoutine = async (routineId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot duplicate routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/routines/duplicate/${routineId}`);
      fetchRoutines(); // Refresh routines list after duplication
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        setError(err.response.data.error);
      } else {
        setError("Error duplicating routine.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific routine
  const deleteRoutine = async (routineId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot delete routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.delete(`${apiUrl}/api/routines/${routineId}`);
      fetchRoutines(); // Refresh routines list after deletion
    } catch (err) {
      setError("Error deleting routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRoutine = async (
    routineId: number,
    selectedDays: string[],
    workouts: WorkoutDay[]
  ) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot update routine.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${apiUrl}/api/routines/update/${routineId}`, {
        selectedDays,
        workouts,
      });
    } catch (err) {
      setError("Error updating routine.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    routines,
    routineDetails,
    fetchRoutines,
    createRoutine,
    addRoutineDay,
    addExercise,
    addExerciseSet,
    fetchRoutineDetails,
    fetchRoutineById,
    savePlan,
    endRoutine,
    activateRoutine,
    duplicateRoutine,
    deleteRoutine,
    updateRoutine,
    error,
    loading,
  };
};

export default useGymRoutine;
