import { useEffect } from "react";
import axios from "axios";
import { create } from "zustand";

export interface PersonalInfoType {
  label: string;
  value: string;
}

interface PersonalInfoState {
  personalInfoData: PersonalInfoType[];
  loading: boolean;
  error: string | null;
  hasPersonalData: boolean;
  fetchPersonalInfo: (userId?: string) => Promise<void>;
  updatePersonalInfo: (
    updatedInfo: PersonalInfoType | PersonalInfoType[]
  ) => Promise<void>;
}

const defaultPersonalInfoData: PersonalInfoType[] = [
  { label: "favorite_training_type", value: "" },
  { label: "current_fitness_goals", value: "" },
  { label: "water_drunk_daily", value: "" },
  { label: "steps_daily", value: "" },
  { label: "caloric_intake_goal", value: "" },
  { label: "body_measurements", value: "" },
  { label: "workout_frequency", value: "" },
  { label: "personal_bests", value: "" },
  { label: "weight", value: "" },
];

const usePersonalInfoStore = create<PersonalInfoState>((set) => ({
  personalInfoData: defaultPersonalInfoData,
  loading: true,
  error: null,
  hasPersonalData: false,
  fetchPersonalInfo: async (userId?: string) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized - No token found");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      const url = userId
        ? `${apiUrl}/api/personal-info/${userId}`
        : `${apiUrl}/api/personal-info`;
      const response = await axios.get(url);

      const fetchedData = response.data.personalInfo || {};

      const updatedPersonalInfoData = defaultPersonalInfoData.map((info) => ({
        ...info,
        value: fetchedData[info.label] || "",
      }));

      const hasData = updatedPersonalInfoData.some((info) => info.value !== "");

      set({
        personalInfoData: updatedPersonalInfoData,
        hasPersonalData: hasData,
        loading: false,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          set({ error: "Unauthorized access - please log in." });
        } else {
          set({ error: "Failed to fetch personal information" });
        }
        console.error(err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
        set({ error: "An unexpected error occurred." });
      }
      set({ loading: false });
    }
  },
  updatePersonalInfo: async (
    updatedInfo: PersonalInfoType | PersonalInfoType[]
  ) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized - No token found");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

      let updatedFields: Record<string, string> = {};

      if (Array.isArray(updatedInfo)) {
        updatedFields = updatedInfo.reduce((acc, field) => {
          acc[field.label] = field.value || "";
          return acc;
        }, {} as Record<string, string>);
      } else {
        updatedFields = {
          ...usePersonalInfoStore
            .getState()
            .personalInfoData.reduce((acc, info) => {
              acc[info.label] = info.value || "";
              return acc;
            }, {} as Record<string, string>),
          [updatedInfo.label]: updatedInfo.value || "",
        };
      }

      await axios.post(`${apiUrl}/api/personal-info`, updatedFields);

      set((state) => ({
        personalInfoData: state.personalInfoData.map((info) =>
          Array.isArray(updatedInfo)
            ? updatedInfo.find((update) => update.label === info.label) || info
            : info.label === updatedInfo.label
            ? { ...info, value: updatedInfo.value }
            : info
        ),
        loading: false,
      }));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          set({ error: "Unauthorized access - please log in." });
        } else {
          set({ error: "Failed to update personal information" });
        }
        console.error(err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
        set({ error: "An unexpected error occurred." });
      }
      set({ loading: false });
    }
  },
}));

export const usePersonalInfo = (userId?: string) => {
  const {
    personalInfoData,
    fetchPersonalInfo,
    updatePersonalInfo,
    loading,
    error,
    hasPersonalData,
  } = usePersonalInfoStore();

  useEffect(() => {
    fetchPersonalInfo(userId);
  }, [userId, fetchPersonalInfo]);

  return {
    personalInfoData,
    fetchPersonalInfo,
    updatePersonalInfo,
    loading,
    error,
    hasPersonalData,
  };
};
