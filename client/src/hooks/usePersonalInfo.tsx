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

  const fetchPersonalInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("Unauthorized - No token found");
      }

      const response = await axios.get(
        "https://gymero-882311e33226.herokuapp.com/api/personal-info"
      );

      const fetchedData = response.data.personalInfo;

      const updatedPersonalInfoData = defaultPersonalInfoData.map((info) => ({
        ...info,
        value: fetchedData[info.label] || "",
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
        // Handle non-Axios error
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

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("Unauthorized - No token found");
      }

      let updatedFields: Record<string, string> = {};

      if (Array.isArray(updatedInfo)) {
        // Handle multiple field updates
        updatedFields = updatedInfo.reduce((acc, field) => {
          acc[field.label] = field.value;
          return acc;
        }, {} as Record<string, string>);
      } else {
        // Handle single field update
        updatedFields = {
          ...personalInfoData.reduce((acc, info) => {
            acc[info.label] = info.value;
            return acc;
          }, {} as Record<string, string>),
          [updatedInfo.label]: updatedInfo.value,
        };
      }

      await axios.post(
        "https://gymero-882311e33226.herokuapp.com/api/personal-info",
        updatedFields
      );

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
