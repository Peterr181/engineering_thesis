import { useState, useEffect } from "react";
import axios from "axios";

export interface PersonalInfoType {
  label: string;
  value: string;
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

export const usePersonalInfo = () => {
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoType[]>(
    defaultPersonalInfoData
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPersonalData, setHasPersonalData] = useState<boolean>(false);

  axios.defaults.withCredentials = true;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const fetchPersonalInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized - No token found");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${apiUrl}/api/personal-info`);

      // Log the response to check its structure
      console.log("API Response:", response.data);

      const fetchedData = response.data.personalInfo || {}; // Default to empty object if undefined

      // Ensure fetchedData exists and has the required properties
      const updatedPersonalInfoData = defaultPersonalInfoData.map((info) => ({
        ...info,
        value: fetchedData[info.label] || "", // Ensure fetchedData exists
      }));

      setPersonalInfoData(updatedPersonalInfoData);

      const hasData = updatedPersonalInfoData.some((info) => info.value !== "");
      setHasPersonalData(hasData);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Unauthorized access - please log in.");
        } else {
          setError("Failed to fetch personal information");
        }
        console.error(err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = async (
    updatedInfo: PersonalInfoType | PersonalInfoType[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized - No token found");
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let updatedFields: Record<string, string> = {};

      if (Array.isArray(updatedInfo)) {
        updatedFields = updatedInfo.reduce((acc, field) => {
          acc[field.label] = field.value || ""; // Ensure value is defined
          return acc;
        }, {} as Record<string, string>);
      } else {
        updatedFields = {
          ...personalInfoData.reduce((acc, info) => {
            acc[info.label] = info.value || ""; // Ensure value is defined
            return acc;
          }, {} as Record<string, string>),
          [updatedInfo.label]: updatedInfo.value || "", // Ensure value is defined
        };
      }

      await axios.post(`${apiUrl}/api/personal-info`, updatedFields);

      setPersonalInfoData((prev) =>
        prev.map((info) =>
          Array.isArray(updatedInfo)
            ? updatedInfo.find((update) => update.label === info.label) || info
            : info.label === updatedInfo.label
            ? { ...info, value: updatedInfo.value }
            : info
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Unauthorized access - please log in.");
        } else {
          setError("Failed to update personal information");
        }
        console.error(err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return {
    personalInfoData,
    updatePersonalInfo,
    loading,
    error,
    hasPersonalData,
  };
};
