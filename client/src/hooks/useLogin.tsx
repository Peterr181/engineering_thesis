import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginValues {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
    repeatPassword: string
  ) => {
    setLoading(true);
    setError(null);

    // Step 1: Validate that new password and repeat password match
    if (newPassword !== repeatPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return { error: "New passwords do not match." };
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return { error: "User not authenticated." };
      }

      // Step 2: Make API call to change password
      const res = await axios.post(
        `${apiUrl}/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 3: Handle API response
      if (res.data.status === "Success") {
        setLoading(false);
        return { status: "Success" };
      } else {
        // If the current password is incorrect, set a specific error message
        const errorMessage =
          res.data.error === "Incorrect current password"
            ? "The current password is incorrect."
            : res.data.error || "Failed to change password.";
        setError(errorMessage);
        setLoading(false);
        return { error: errorMessage };
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Password change error:", err.response?.data || err);
        const errorMessage =
          err.response?.data?.error ||
          "An error occurred while changing password.";
        setError(errorMessage);
        setLoading(false);
        return { error: errorMessage };
      } else {
        console.error("Unexpected error:", err);
        const errorMessage = "An unexpected error occurred.";
        setError(errorMessage);
        setLoading(false);
        return { error: errorMessage };
      }
    }
  };

  return { login, handlePasswordChange, error, loading };
};
