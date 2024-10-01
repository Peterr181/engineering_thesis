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

  const login = async (loginValues: LoginValues) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8081/login", loginValues);

      if (res.data.status === "Success") {
        navigate("/");
        return res.data;
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
};
