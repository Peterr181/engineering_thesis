import { useEffect } from "react";
import axios from "axios";
import { create } from "zustand";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  gender: string;
  birthYear: string;
  avatar: string;
  sportLevel: number;
}

interface AuthState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
}));

const useAuth = (): UserProfile | null => {
  const { userProfile, setUserProfile } = useAuthStore();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    axios
      .get(`${apiUrl}/api/users/profile`)
      .then((res) => {
        setUserProfile(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        setUserProfile(null);
      });
  }, [setUserProfile]);

  return userProfile;
};

export default useAuth;
