import React, { useEffect } from "react";
import styles from "./PersonalGoals.module.scss";
import { TextField, MenuItem } from "@mui/material";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import questionMark from "../../../assets/images/questionMark.png";
import fitnessApp from "../../../assets/images/fitnessApp.png";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

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

const labelMappings: { [key: string]: string } = {
  favorite_training_type: "Favorite Training",
  current_fitness_goals: "Current Fitness Goals",
  water_drunk_daily: "Water Drunk Daily (liters)",
  steps_daily: "Steps Daily",
  caloric_intake_goal: "Daily Caloric Intake Goal",
  body_measurements: "Height (cm)",
  workout_frequency: "Workout Frequency (days per week)",
  personal_bests: "Personal Bests",
  weight: "Weight (kg)",
};

const PersonalGoals: React.FC = () => {
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

  return (
    <div className={styles.personalGoals}>
      <WhiteCardWrapper>
        <h2>Set Your Personal Fitness Goals</h2>
        <p>Please complete your profile with data.</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="favorite_training_type"
            control={control}
            rules={{ required: "Favorite Training is required." }}
            render={({ field }) => (
              <TextField
                select
                label={labelMappings.favorite_training_type}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.favorite_training_type}
                helperText={errors.favorite_training_type?.message}
              >
                <MenuItem value="Gym">Gym</MenuItem>
                <MenuItem value="Cardio">Cardio</MenuItem>
                <MenuItem value="Flexibility">Flexibility</MenuItem>
                <MenuItem value="Combat">Combat</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="current_fitness_goals"
            control={control}
            rules={{ required: "Current Fitness Goals is required." }}
            render={({ field }) => (
              <TextField
                select
                label={labelMappings.current_fitness_goals}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.current_fitness_goals}
                helperText={errors.current_fitness_goals?.message}
              >
                <MenuItem value="Lose weight">Lose weight</MenuItem>
                <MenuItem value="Gain weight">Gain weight</MenuItem>
                <MenuItem value="Just stay healthy">Just stay healthy</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="water_drunk_daily"
            control={control}
            rules={{
              required: "Water Drunk Daily is required.",
              min: { value: 0, message: "Must be at least 0 liters." },
            }}
            render={({ field }) => (
              <TextField
                label={labelMappings.water_drunk_daily}
                type="number"
                inputProps={{ min: "0", step: "0.1" }}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.water_drunk_daily}
                helperText={errors.water_drunk_daily?.message}
              />
            )}
          />

          <Controller
            name="steps_daily"
            control={control}
            rules={{
              required: "Steps Daily is required.",
              min: { value: 0, message: "Must be at least 0 steps." },
            }}
            render={({ field }) => (
              <TextField
                label={labelMappings.steps_daily}
                type="number"
                inputProps={{ min: "0" }}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.steps_daily}
                helperText={errors.steps_daily?.message}
              />
            )}
          />

          <Controller
            name="caloric_intake_goal"
            control={control}
            rules={{
              required: "Caloric Intake Goal is required.",
              min: { value: 0, message: "Must be at least 0 calories." },
              max: { value: 15000, message: "Cannot exceed 15,000 calories." },
            }}
            render={({ field }) => (
              <TextField
                label={labelMappings.caloric_intake_goal}
                type="number"
                inputProps={{ min: "0", max: "15000" }}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.caloric_intake_goal}
                helperText={errors.caloric_intake_goal?.message}
              />
            )}
          />

          <Controller
            name="body_measurements"
            control={control}
            rules={{
              required: "Height is required.",
              min: { value: 0, message: "Must be at least 0 cm." },
            }}
            render={({ field }) => (
              <TextField
                label={labelMappings.body_measurements}
                type="number"
                inputProps={{ min: "0" }}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.body_measurements}
                helperText={errors.body_measurements?.message}
              />
            )}
          />

          <Controller
            name="weight"
            control={control}
            rules={{
              required: "Weight is required.",
              min: { value: 0, message: "Must be at least 0 kg." },
            }}
            render={({ field }) => (
              <TextField
                label={labelMappings.weight}
                type="number"
                inputProps={{ min: "0" }}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.weight}
                helperText={errors.weight?.message}
              />
            )}
          />

          <Controller
            name="workout_frequency"
            control={control}
            rules={{
              required: "Workout Frequency is required.",
            }}
            render={({ field }) => (
              <TextField
                select
                label={labelMappings.workout_frequency}
                {...field}
                fullWidth
                margin="normal"
                error={!!errors.workout_frequency}
                helperText={errors.workout_frequency?.message}
              >
                <MenuItem value="1-2 workouts per week">
                  1-2 workouts per week
                </MenuItem>
                <MenuItem value="2-3 workouts per week">
                  2-3 workouts per week
                </MenuItem>
                <MenuItem value="3-4 workouts per week">
                  3-4 workouts per week
                </MenuItem>
                <MenuItem value="4-5 workouts per week">
                  4-5 workouts per week
                </MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="personal_bests"
            control={control}
            render={({ field }) => (
              <TextField
                label={labelMappings.personal_bests}
                {...field}
                fullWidth
                margin="normal"
              />
            )}
          />

          <div className={styles.personalGoals__buttons}>
            <Link to="/">
              <button className={styles.finishBtn}>Back</button>
            </Link>
            <button type="submit" className={styles.backBtn}>
              Submit
            </button>
          </div>
        </form>
      </WhiteCardWrapper>
      <div className={styles.questionMarkOverlay}>
        <img src={questionMark} alt="question mark" />
      </div>
      <div className={styles.fitnessAppOverlay}>
        <img src={fitnessApp} alt="question mark" />
      </div>
    </div>
  );
};

export default PersonalGoals;
