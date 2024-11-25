import React, { useEffect, useState } from "react";
import styles from "./DailyData.module.scss";
import { TextField, MenuItem, Alert, Snackbar } from "@mui/material";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import questionMark from "../../assets/images/questionMark.png";
import fitnessApp from "../../assets/images/fitnessApp.png";
import { useForm, Controller } from "react-hook-form";
import { useLanguage } from "../../context/LanguageProvider";
import useDailySettings from "../../hooks/useDailySettings";
import { Link, useNavigate } from "react-router-dom";

interface DailyDataFormValues {
  calories_eaten: string;
  steps_taken: string;
  water_consumed: string;
  sleep_duration: string;
  mood_energy: string; // Changed from mood_energy_level to mood_energy
  habits: string[];
}

const DailyData: React.FC = () => {
  const { t } = useLanguage();
  const { dailySettings, saveDailySettings } = useDailySettings();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DailyDataFormValues>({
    defaultValues: {
      calories_eaten: "",
      steps_taken: "",
      water_consumed: "",
      sleep_duration: "",
      mood_energy: "",
      habits: [],
    },
  });

  useEffect(() => {
    if (dailySettings) {
      Object.keys(dailySettings).forEach((key) => {
        if (key === "habits") {
          setValue(
            key as keyof DailyDataFormValues,
            dailySettings.habits.map((habit) => habit.name)
          );
        } else if (
          key === "calories_eaten" ||
          key === "steps_taken" ||
          key === "water_consumed" ||
          key === "sleep_duration" ||
          key === "mood_energy"
        ) {
          setValue(
            key as keyof DailyDataFormValues,
            dailySettings[key]?.toString() || ""
          );
        }
      });
    }
  }, [dailySettings, setValue]);

  const onSubmit = async (data: DailyDataFormValues) => {
    const formattedData = {
      ...data,
      calories_eaten: parseInt(data.calories_eaten),
      steps_taken: parseInt(data.steps_taken),
      water_consumed: parseFloat(data.water_consumed),
      sleep_duration: parseFloat(data.sleep_duration),
      mood_energy: parseInt(data.mood_energy), // Changed from mood_energy_level to mood_energy
      habits: data.habits.map((habit) => ({ name: habit, completed: true })),
      created_at: new Date().toISOString(), // Added created_at
    };

    await saveDailySettings(formattedData);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    if (openSnackbar) {
      const timer = setTimeout(() => {
        navigate("/"); // Redirect after showing the Snackbar
      }, 1000); // Delay of 1 second to show the Snackbar
      return () => clearTimeout(timer);
    }
  }, [openSnackbar, navigate]);

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.personalGoals}>
      <WhiteCardWrapper>
        <h2>{t("dailyData.title")}</h2>
        <p>{t("dailyData.description")}</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="calories_eaten"
            control={control}
            rules={{
              required: t("dailyData.caloriesEaten"),
              min: { value: 0, message: "Must be at least 0 calories." },
              max: { value: 20000, message: "Cannot exceed 20000 calories." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("dailyData.caloriesEaten")}
                  type="number"
                  inputProps={{ min: "0", max: "20000" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.calories_eaten}
                  helperText={errors.calories_eaten?.message}
                />
              </div>
            )}
          />
          <Controller
            name="steps_taken"
            control={control}
            rules={{
              required: t("dailyData.stepsTaken"),
              min: { value: 0, message: "Must be at least 0 steps." },
              max: { value: 100000, message: "Cannot exceed 100000 steps." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("dailyData.stepsTaken")}
                  type="number"
                  inputProps={{ min: "0", max: "100000" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.steps_taken}
                  helperText={errors.steps_taken?.message}
                />
              </div>
            )}
          />
          <Controller
            name="water_consumed"
            control={control}
            rules={{
              required: t("dailyData.waterConsumed"),
              min: { value: 0, message: "Must be at least 0 liters." },
              max: { value: 30, message: "Cannot exceed 30 liters." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("dailyData.waterConsumed")}
                  type="number"
                  inputProps={{ min: "0", max: "30", step: "0.1" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.water_consumed}
                  helperText={errors.water_consumed?.message}
                />
              </div>
            )}
          />
          <Controller
            name="sleep_duration"
            control={control}
            rules={{
              required: t("dailyData.sleepDuration"),
              min: { value: 0, message: "Must be at least 0 hours." },
              max: { value: 50, message: "Cannot exceed 50 hours." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("dailyData.sleepDuration")}
                  type="number"
                  inputProps={{ min: "0", max: "50", step: "0.1" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.sleep_duration}
                  helperText={errors.sleep_duration?.message}
                />
              </div>
            )}
          />
          <Controller
            name="mood_energy"
            control={control}
            rules={{
              required: t("dailyData.moodEnergyLevel"),
              min: { value: 1, message: "Must be at least 1." },
              max: { value: 5, message: "Cannot exceed 5." },
            }}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  label={t("dailyData.moodEnergyLevel")}
                  type="number"
                  inputProps={{ min: "1", max: "5" }}
                  onKeyPress={handleNumericInput}
                  {...field}
                  fullWidth
                  margin="normal"
                  error={!!errors.mood_energy}
                  helperText={errors.mood_energy?.message}
                />
              </div>
            )}
          />
          <Controller
            name="habits"
            control={control}
            render={({ field }) => (
              <div className={styles.inputField}>
                <TextField
                  select
                  label={t("dailyData.habits")}
                  {...field}
                  fullWidth
                  margin="normal"
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="No sugar">{t("dailyData.noSugar")}</MenuItem>
                  <MenuItem value="No stimulants">
                    {t("dailyData.noStimulants")}
                  </MenuItem>
                  <MenuItem value="Stretching">
                    {t("dailyData.stretching")}
                  </MenuItem>
                </TextField>
              </div>
            )}
          />
          <div className={styles.personalGoals__buttons}>
            <Link to="/">
              <button type="button" className={styles.backBtn}>
                {t("dailyData.back")}
              </button>
            </Link>
            <button type="submit" className={styles.finishBtn}>
              {t("dailyData.submit")}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("dailyData.successMessage")}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DailyData;
