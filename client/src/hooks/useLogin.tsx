import { useNavigate } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";

interface LoginValues {
  email: string;
  password: string;
}

interface LoginState {
  error: string | null;
  loading: boolean;
  login: (
    loginValues: LoginValues
  ) => Promise<{ status: string; token?: string; error?: string }>;
  handlePasswordChange: (
    currentPassword: string,
    newPassword: string,
    repeatPassword: string
  ) => Promise<{ status?: string; error?: string }>;
}

const createLoginStore = (navigate: ReturnType<typeof useNavigate>) => {
  return create<LoginState>((set) => ({
    error: null,
    loading: false,
    login: async (loginValues: LoginValues) => {
      set({ loading: true, error: null });
      axios.defaults.withCredentials = true;
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      try {
        const res = await axios.post(`${apiUrl}/auth/login`, loginValues);

        if (res.data.status === "Success") {
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;
          navigate("/");
          set({ loading: false });
          return res.data;
        } else {
          set({
            error: res.data.error || "Login failed. Please try again.",
            loading: false,
          });
          return { error: res.data.error || "Login failed. Please try again." };
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Login error:", err.response?.data || err);
          set({
            error:
              err.response?.data?.error || "An error occurred during login.",
            loading: false,
          });
          return {
            error:
              err.response?.data?.error || "An error occurred during login.",
          };
        } else {
          console.error("Unexpected error:", err);
          set({ error: "An unexpected error occurred.", loading: false });
          return { error: "An unexpected error occurred." };
        }
      }
    },
    handlePasswordChange: async (
      currentPassword: string,
      newPassword: string,
      repeatPassword: string
    ) => {
      set({ loading: true, error: null });
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      if (newPassword !== repeatPassword) {
        set({ error: "New passwords do not match.", loading: false });
        return { error: "New passwords do not match." };
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ error: "User not authenticated.", loading: false });
          return { error: "User not authenticated." };
        }

        const res = await axios.post(
          `${apiUrl}/auth/change-password`,
          { currentPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "Success") {
          set({ loading: false });
          return { status: "Success" };
        } else {
          const errorMessage =
            res.data.error === "Incorrect current password"
              ? "The current password is incorrect."
              : res.data.error || "Failed to change password.";
          set({ error: errorMessage, loading: false });
          return { error: errorMessage };
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Password change error:", err.response?.data || err);
          const errorMessage =
            err.response?.data?.error ||
            "An error occurred while changing password.";
          set({ error: errorMessage, loading: false });
          return { error: errorMessage };
        } else {
          console.error("Unexpected error:", err);
          const errorMessage = "An unexpected error occurred.";
          set({ error: errorMessage, loading: false });
          return { error: errorMessage };
        }
      }
    },
  }));
};

export const useLogin = () => {
  const navigate = useNavigate();
  return createLoginStore(navigate)();
};
