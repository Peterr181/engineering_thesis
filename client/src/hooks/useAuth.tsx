import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  gender: string;
  birthYear: string;
  avatar: string;
  sportLevel: number;
}

const useAuth = (): UserProfile | null => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    axios
      .get(`${apiUrl}/user/profile`)
      .then((res) => {
        setUserProfile(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        setUserProfile(null);
      });
  }, []);

  return userProfile;
};

export default useAuth;
