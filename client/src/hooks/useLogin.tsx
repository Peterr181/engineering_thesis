import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginValues {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const apiUrl =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8081";

  const login = async (loginValues: LoginValues) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${apiUrl}/auth/login`, loginValues);

      if (res.data.status === "Success") {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        navigate("/");
        return res.data;
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Login error:", err.response?.data || err);
        setError(
          err.response?.data?.error || "An error occurred during login."
        );
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
};
