import { useState, useEffect } from "react";
import styles from "./CreatingWorkout.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageProvider";
import { useWorkouts } from "../../hooks/useWorkout";
import { allExercises as getAllExercises } from "../../constants/exercises";

interface Exercise {
  workout_id: string;
  name: string;
  type: string;
}

const CreatingWorkout = () => {
  const { addWorkout, error, loading } = useWorkouts();
  const { t } = useLanguage();

  const filterCategories = [
    t("filterCategories.All"),
    t("filterCategories.Cardio"),
    t("filterCategories.Strength"),
    t("filterCategories.Combat"),
    t("filterCategories.Flexibility"),
  ];

  // Fetch dynamically translated constants
  const allExercises = getAllExercises(t);
  const months = [
    { label: t("monthsList.January"), id: "January" },
    { label: t("monthsList.February"), id: "February" },
    { label: t("monthsList.March"), id: "March" },
    { label: t("monthsList.April"), id: "April" },
    { label: t("monthsList.May"), id: "May" },
    { label: t("monthsList.June"), id: "June" },
    { label: t("monthsList.July"), id: "July" },
    { label: t("monthsList.August"), id: "August" },
    { label: t("monthsList.September"), id: "September" },
    { label: t("monthsList.October"), id: "October" },
    { label: t("monthsList.November"), id: "November" },
    { label: t("monthsList.December"), id: "December" },
  ];

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    setFilter(t("filterCategories.All"));
  }, [t]);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minutes, setMinutes] = useState<number | "">("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [gymDialogOpen, setGymDialogOpen] = useState<boolean>(false);

  const handleOpenModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDay("");
    setMonth("");
    setDescription("");
    setMinutes("");
  };

  const handleAddWorkout = async () => {
    if (selectedExercise && day && month && minutes !== "") {
      const newWorkout = {
        day: parseInt(day, 10),
        month, // Store the month as a unique identifier
        description,
        workout_id: selectedExercise.workout_id,
        exercise_type: selectedExercise.type,
        minutes: minutes,
        id: 0,
        finished: false,
        created_at: new Date().toISOString(), // Add this line
      };

      try {
        await addWorkout(newWorkout);
        handleClose();
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to add workout:", err.message);
          alert(t("errors.addWorkoutFailed", { error: err.message }));
        } else {
          console.error("Unknown error", err);
          alert(t("errors.unknownError"));
        }
      }
    } else {
      alert(t("errors.fillAllFields"));
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && parseInt(value, 10) <= 31) {
      setDay(value);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && parseInt(value, 10) <= 500) {
      const minutesValue = value === "" ? "" : parseInt(value, 10);
      setMinutes(minutesValue);
    }
  };

  const handleCloseGymDialog = () => {
    setGymDialogOpen(false);
  };

  const handleDeleteGymWorkouts = () => {
    // Logic to delete Gym workouts
    setGymDialogOpen(false);
  };

  const filteredExercises = allExercises.filter(
    (exercise: Exercise) =>
      filter === t("filterCategories.All") || exercise.type === filter
  );

  return (
    <PlatformWrapper>
      <section className={styles.creatingworkout}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.creatingworkout__header}>
              <h2>{t("creatingWorkout.addNewWorkout")}</h2>
            </div>
            <p>{t("creatingWorkout.selectType")}</p>
            <div className={styles.creatingworkout__filter}>
              {filterCategories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "contained" : "outlined"}
                  color="success"
                  onClick={() => setFilter(category)}
                >
                  {category}
                </Button>
              ))}
              <Link to="/gymplancreator">
                <Button variant="contained" color="secondary">
                  Gym
                </Button>
              </Link>
            </div>
            <div className={styles.creatingworkout__buttons}>
              {filteredExercises.map((exercise: Exercise) => (
                <Button
                  key={exercise.name}
                  variant="contained"
                  color="success"
                  className={styles.creatingworkout__button}
                  onClick={() => handleOpenModal(exercise)}
                >
                  {exercise.name}
                </Button>
              ))}
            </div>

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {t("creatingWorkout.add")} {selectedExercise?.name}{" "}
                {t("creatingWorkout.toYourPlan")}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("creatingWorkout.enterDetails")}
                </DialogContentText>

                <TextField
                  autoFocus
                  margin="dense"
                  label={t("creatingWorkout.day")}
                  type="text"
                  fullWidth
                  value={day}
                  onChange={handleDayChange}
                  inputProps={{ maxLength: 2 }}
                  helperText={t("creatingWorkout.enterDay")}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>{t("creatingWorkout.month")}</InputLabel>
                  <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    label={t("creatingWorkout.month")}
                  >
                    {months.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  margin="dense"
                  label={t("creatingWorkout.minutes")}
                  type="text"
                  fullWidth
                  value={minutes.toString()}
                  onChange={handleMinutesChange}
                  inputProps={{ maxLength: 3 }}
                  helperText={t("creatingWorkout.enterMinutes")}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  {t("creatingWorkout.cancel")}
                </Button>
                <Button
                  onClick={handleAddWorkout}
                  color="primary"
                  disabled={loading}
                >
                  {loading
                    ? t("creatingWorkout.adding")
                    : t("creatingWorkout.add")}
                </Button>
              </DialogActions>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Dialog>
            <Snackbar
              open={alertOpen}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              autoHideDuration={3000}
              onClose={() => setAlertOpen(false)}
            >
              <Alert onClose={() => setAlertOpen(false)} severity="success">
                {t("creatingWorkout.workoutAdded")}
              </Alert>
            </Snackbar>
            <Dialog open={gymDialogOpen} onClose={handleCloseGymDialog}>
              <DialogTitle>
                {t("creatingWorkout.deleteGymWorkouts")}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("creatingWorkout.confirmDeleteGymWorkouts")}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseGymDialog} color="secondary">
                  {t("creatingWorkout.cancel")}
                </Button>
                <Button onClick={handleDeleteGymWorkouts} color="error">
                  {t("creatingWorkout.delete")}
                </Button>
              </DialogActions>
            </Dialog>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default CreatingWorkout;
