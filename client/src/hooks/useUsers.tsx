import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  gender?: string;
  birthYear?: number;
  avatar?: string;
  sportLevel?: string;
  total_points: number;
  stars: number;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  error: string | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  fetchUserById: (userId: number) => Promise<void>;
  addStarToUser: (userId: number) => Promise<void>;
}

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useUsers = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  error: null,
  loading: false,
  fetchUsers: async () => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch users.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/users`);
      if (res.data) {
        set({ users: res.data.users });
      }
    } catch (err) {
      set({ error: "Error fetching users." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  fetchUserById: async (userId: number) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot fetch user data.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/users/${userId}`);
      if (res.data) {
        set({ selectedUser: res.data.user });
      }
    } catch (err) {
      set({ error: "Error fetching user data." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  addStarToUser: async (userId: number) => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({
        error: "User not authenticated. Cannot add star.",
        loading: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${apiUrl}/api/users/${userId}/star`);
      if (res.data) {
        set({ selectedUser: res.data.user });
        useUsers.getState().fetchUsers();
      }
    } catch (err) {
      set({ error: "Error adding star." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUsers;
