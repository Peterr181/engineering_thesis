import { useState, useEffect } from "react";
import axios from "axios";

export interface PersonalInfoType {
  label: string;
  value: string;
}

const defaultPersonalInfoData: PersonalInfoType[] = [
  { label: "nickname", value: "" },
  { label: "favorite_training_type", value: "" },
  { label: "current_fitness_goals", value: "" },
  { label: "water_drunk_daily", value: "" },
  { label: "steps_daily", value: "" },
  { label: "skill_level", value: "" },
  { label: "caloric_intake_goal", value: "" },
  { label: "body_measurements", value: "" },
  { label: "workout_frequency", value: "" },
  { label: "personal_bests", value: "" },
];
export const usePersonalInfo = () => {
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoType[]>(
    defaultPersonalInfoData
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/personal-info"
      );
      const fetchedData = response.data.personalInfo;

      const updatedPersonalInfoData = defaultPersonalInfoData.map((info) => ({
        ...info,
        value: fetchedData[info.label] || "",
      }));

      setPersonalInfoData(updatedPersonalInfoData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch personal information");
      setLoading(false);
    }
  };

  const updatePersonalInfo = async (updatedInfo: PersonalInfoType) => {
    try {
      const personalInfoToUpdate = {
        nickname: "",
        favorite_training_type: "",
        current_fitness_goals: "",
        water_drunk_daily: "",
        steps_daily: "",
        skill_level: "",
        caloric_intake_goal: "",
        body_measurements: "",
        workout_frequency: "",
        personal_bests: "",
        ...personalInfoData.reduce((acc, info) => {
          acc[info.label] =
            info.label === updatedInfo.label ? updatedInfo.value : info.value;
          return acc;
        }, {} as Record<string, string>),
      };

      await axios.post(
        "http://localhost:8081/api/personal-info",
        personalInfoToUpdate
      );

      setPersonalInfoData((prev) =>
        prev.map((info) =>
          info.label === updatedInfo.label
            ? { ...info, value: updatedInfo.value }
            : info
        )
      );
    } catch (err) {
      console.error("Error updating personal info:", err);
      setError("Failed to update personal information");
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return { personalInfoData, updatePersonalInfo, loading, error };
};
