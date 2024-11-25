import React, { useEffect } from "react";
import styles from "./PersonalGoals.module.scss";
import { TextField, MenuItem } from "@mui/material";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import questionMark from "../../../assets/images/questionMark.png";
import fitnessApp from "../../../assets/images/fitnessApp.png";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useLanguage } from "../../../context/LanguageProvider";

interface PersonalGoalsFormValues {
  favorite_training_type: string;
  current_fitness_goals: string;
  water_drunk_daily: string;
  steps_daily: string;
  caloric_intake_goal: string;
  body_measurements: string;
  workout_frequency: string;
  personal_bests: string;
  weight: string;
}

const PersonalGoals: React.FC = () => {
  const { t } = useLanguage();
  const { personalInfoData, updatePersonalInfo, loading } = usePersonalInfo();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalGoalsFormValues>({
    defaultValues: {
      favorite_training_type: "",
      current_fitness_goals: "",
      water_drunk_daily: "",
      steps_daily: "",
      caloric_intake_goal: "",
      body_measurements: "",
      workout_frequency: "",
      personal_bests: "",
      weight: "",
    },
  });

  useEffect(() => {
    if (!loading && personalInfoData.length > 0) {
      personalInfoData.forEach((info) => {
        setValue(info.label as keyof PersonalGoalsFormValues, info.value || "");
      });
    }
  }, [personalInfoData, loading, setValue]);

  const onSubmit = async (data: PersonalGoalsFormValues) => {
    const updates = Object.keys(data).map((key) => ({
      label: key as keyof PersonalGoalsFormValues,
      value: data[key as keyof PersonalGoalsFormValues],
    }));

    await updatePersonalInfo(updates);
    navigate("/");
  };

  const handleNumericInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Escape" ||
      event.key === "Enter" ||
      (event.key >= "0" && event.key <= "9")
    ) {
      return;
    }
    event.preventDefault();
  };

  return (
    <div className={`${styles.personalGoals} ${styles.responsive}`}>
      <WhiteCardWrapper>
        <h2>{t("personalGoals.title")}</h2>
        <p>{t("personalGoals.description")}</p>

        <form
          className={`${styles.form} ${styles.responsiveForm}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="favorite_training_type"
            control={control}
            rules={{ required: t("personalGoals.favoriteTraining") }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  select
                  label={t("personalGoals.favoriteTraining")}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.favorite_training_type}
                  helperText={errors.favorite_training_type?.message}
                >
                  <MenuItem value="Gym">{t("personalGoals.gym")}</MenuItem>
                  <MenuItem value="Cardio">
                    {t("personalGoals.cardio")}
                  </MenuItem>
                  <MenuItem value="Flexibility">
                    {t("personalGoals.flexibility")}
                  </MenuItem>
                  <MenuItem value="Combat">
                    {t("personalGoals.combat")}
                  </MenuItem>
                  <MenuItem value="Other">{t("personalGoals.other")}</MenuItem>
                </TextField>
              </div>
            )}
          />
          <Controller
            name="current_fitness_goals"
            control={control}
            rules={{ required: t("personalGoals.currentFitnessGoals") }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  select
                  label={t("personalGoals.currentFitnessGoals")}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.current_fitness_goals}
                  helperText={errors.current_fitness_goals?.message}
                >
                  <MenuItem value="Lose weight">
                    {t("personalGoals.loseWeight")}
                  </MenuItem>
                  <MenuItem value="Gain weight">
                    {t("personalGoals.gainWeight")}
                  </MenuItem>
                  <MenuItem value="Just stay healthy">
                    {t("personalGoals.stayHealthy")}
                  </MenuItem>
                </TextField>
              </div>
            )}
          />
          <Controller
            name="water_drunk_daily"
            control={control}
            rules={{
              required: t("personalGoals.waterDrunkDaily"),
              min: { value: 0, message: "Must be at least 0 liters." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("personalGoals.waterDrunkDaily")}
                  type="number"
                  inputProps={{ min: "0", step: "0.1" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.water_drunk_daily}
                  helperText={errors.water_drunk_daily?.message}
                />
              </div>
            )}
          />
          <Controller
            name="steps_daily"
            control={control}
            rules={{
              required: t("personalGoals.stepsDaily"),
              min: { value: 0, message: "Must be at least 0 steps." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("personalGoals.stepsDaily")}
                  type="number"
                  inputProps={{ min: "0" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.steps_daily}
                  helperText={errors.steps_daily?.message}
                />
              </div>
            )}
          />
          <Controller
            name="caloric_intake_goal"
            control={control}
            rules={{
              required: t("personalGoals.caloricIntakeGoal"),
              min: { value: 0, message: "Must be at least 0 calories." },
              max: { value: 15000, message: "Cannot exceed 15,000 calories." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("personalGoals.caloricIntakeGoal")}
                  type="number"
                  inputProps={{ min: "0", max: "15000" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.caloric_intake_goal}
                  helperText={errors.caloric_intake_goal?.message}
                />
              </div>
            )}
          />
          <Controller
            name="body_measurements"
            control={control}
            rules={{
              required: t("personalGoals.bodyMeasurements"),
              min: { value: 0, message: "Must be at least 0 cm." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("personalGoals.bodyMeasurements")}
                  type="number"
                  inputProps={{ min: "0" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.body_measurements}
                  helperText={errors.body_measurements?.message}
                />
              </div>
            )}
          />
          <Controller
            name="weight"
            control={control}
            rules={{
              required: t("personalGoals.weight"),
              min: { value: 0, message: "Must be at least 0 kg." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("personalGoals.weight")}
                  type="number"
                  inputProps={{ min: "0" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              </div>
            )}
          />
          <Controller
            name="workout_frequency"
            control={control}
            rules={{
              required: t("personalGoals.workoutFrequency"),
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  select
                  label={t("personalGoals.workoutFrequency")}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.workout_frequency}
                  helperText={errors.workout_frequency?.message}
                >
                  <MenuItem value="1-2 workouts per week">
                    {t("personalGoals.workoutFrequencyOptions.1-2")}
                  </MenuItem>
                  <MenuItem value="2-3 workouts per week">
                    {t("personalGoals.workoutFrequencyOptions.2-3")}
                  </MenuItem>
                  <MenuItem value="3-4 workouts per week">
                    {t("personalGoals.workoutFrequencyOptions.3-4")}
                  </MenuItem>
                  <MenuItem value="4-5 workouts per week">
                    {t("personalGoals.workoutFrequencyOptions.4-5")}
                  </MenuItem>
                </TextField>
              </div>
            )}
          />
          <div
            className={`${styles.personalGoals__buttons} ${styles.responsiveButtons}`}
          >
            <Link to="/">
              <button type="button" className={styles.backBtn}>
                {t("personalGoals.back")}
              </button>
            </Link>
            <button type="submit" className={styles.finishBtn}>
              {t("personalGoals.submit")}
            </button>
          </div>
        </form>
      </WhiteCardWrapper>
      <div className={styles.questionMarkOverlay}>
        <img src={questionMark} alt="question mark" />
      </div>
      <div className={styles.fitnessAppOverlay}>
        <img src={fitnessApp} alt="fitness app" />
      </div>
    </div>
  );
};

export default PersonalGoals;
