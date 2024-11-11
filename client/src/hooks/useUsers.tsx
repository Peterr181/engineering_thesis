import { useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  gender?: string;
  birthYear?: number;
  avatar?: string;
  sportLevel?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch users.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/users`);
      if (res.data) {
        setUsers(res.data.users);
      }
    } catch (err) {
      setError("Error fetching users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId: number) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch user data.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/users/${userId}`);
      if (res.data) {
        setSelectedUser(res.data.user);
      }
    } catch (err) {
      setError("Error fetching user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    selectedUser,
    fetchUsers,
    fetchUserById,
    error,
    loading,
  };
};

export default useUsers;
