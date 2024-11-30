import axios from "axios";
import { create } from "zustand";

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

interface GymRoutineState {
  routines: Routine[];
  routineDetails: RoutineDetails | null;
  error: string | null;
  loading: boolean;
  apiUrl: string;
  fetchRoutines: () => Promise<void>;
  createRoutine: (
    routineName: string,
    startDate: string | null
  ) => Promise<void>;
  addRoutineDay: (routineId: number, dayOfWeek: string) => Promise<void>;
  addExercise: (
    routineDayId: number,
    exerciseName: string,
    numSets: number
  ) => Promise<{ success: boolean; message: string }>;
  addExerciseSet: (
    exerciseId: number,
    setNumber: number,
    repetitions: number,
    weight: number
  ) => Promise<void>;
  fetchRoutineDetails: (routineId: number) => Promise<void>;
  fetchRoutineById: (routineId: number) => Promise<Routine | null>;
  savePlan: (
    routineName: string,
    startDate: string | null,
    selectedDays: string[],
    workouts: WorkoutDay[]
  ) => Promise<void>;
  endRoutine: (routineId: number) => Promise<void>;
  activateRoutine: (routineId: number, isActive: boolean) => Promise<void>;
  duplicateRoutine: (routineId: number) => Promise<void>;
  deleteRoutine: (routineId: number) => Promise<void>;
  updateRoutine: (
    routineId: number,
    selectedDays: string[],
    workouts: WorkoutDay[]
  ) => Promise<void>;
}

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useGymRoutine = create<GymRoutineState>((set, get) => ({
  routines: [],
  routineDetails: null,
  error: null,
  loading: false,
  apiUrl: import.meta.env.VITE_REACT_APP_API_URL,
  fetchRoutines: async () => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch routines.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${get().apiUrl}/api/routines`);
      if (res.data) {
        set({ routines: res.data.routines });
      }
    } catch (err) {
      set({ error: "Error fetching routines." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  createRoutine: async (routineName, startDate) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot create routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${get().apiUrl}/api/routines/create`, {
        routineName,
        startDate,
      });
      if (res.data) {
        get().fetchRoutines(); // Refresh routines list after creation
      }
    } catch (err) {
      set({ error: "Error creating routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  addRoutineDay: async (routineId, dayOfWeek) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot add day to routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${get().apiUrl}/api/routines/day`, {
        routineId,
        dayOfWeek,
      });
    } catch (err) {
      set({ error: "Error adding day to routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  addExercise: async (routineDayId, exerciseName, numSets) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot add exercise.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${get().apiUrl}/api/routines/exercise`, {
        routineDayId,
        exerciseName,
        numSets,
      });

      return res.data; // Return the response data
    } catch (err) {
      set({ error: "Error adding exercise." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  addExerciseSet: async (exerciseId, setNumber, repetitions, weight) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot add exercise set.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${get().apiUrl}/api/routines/exercise/set`, {
        exerciseId,
        setNumber,
        repetitions,
        weight,
      });
    } catch (err) {
      set({ error: "Error adding exercise set." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchRoutineDetails: async (routineId) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch routine details.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${get().apiUrl}/api/routines/${routineId}`);
      if (res.data) {
        set({ routineDetails: res.data.routineDetails });
      }
    } catch (err) {
      set({ error: "Error fetching routine details." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchRoutineById: async (routineId) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${get().apiUrl}/api/routines/${routineId}`);
      if (res.data) {
        return res.data.routine;
      }
    } catch (err) {
      set({ error: "Error fetching routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  savePlan: async (routineName, startDate, selectedDays, workouts) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot save plan.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${get().apiUrl}/api/routines/savePlan`, {
        routineName,
        startDate,
        selectedDays,
        workouts,
      });
    } catch (err) {
      set({ error: "Error saving plan." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  endRoutine: async (routineId) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot end routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${get().apiUrl}/api/routines/endRoutine`, {
        routineId,
      });
      if (res.data) {
        get().fetchRoutines(); // Refresh routines list after ending the current routine
      }
    } catch (err) {
      set({ error: "Error ending routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  activateRoutine: async (routineId, isActive = true) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot activate routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${get().apiUrl}/api/routines/activate/${routineId}`, {
        isActive,
      });
      get().fetchRoutines(); // Refresh routines list after activation
    } catch (err) {
      set({ error: "Error activating routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  duplicateRoutine: async (routineId) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot duplicate routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${get().apiUrl}/api/routines/duplicate/${routineId}`);
      get().fetchRoutines(); // Refresh routines list after duplication
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        set({ error: err.response.data.error });
      } else {
        set({ error: "Error duplicating routine." });
      }
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  deleteRoutine: async (routineId) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot delete routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.delete(`${get().apiUrl}/api/routines/${routineId}`);
      get().fetchRoutines(); // Refresh routines list after deletion
    } catch (err) {
      set({ error: "Error deleting routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  updateRoutine: async (routineId, selectedDays, workouts) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot update routine.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${get().apiUrl}/api/routines/update/${routineId}`, {
        selectedDays,
        workouts,
      });
    } catch (err) {
      set({ error: "Error updating routine." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useGymRoutine;
