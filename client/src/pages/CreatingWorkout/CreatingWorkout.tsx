import { useState } from "react";
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
import { useWorkouts } from "../../hooks/useWorkout";
import { allExercises, months } from "../../constants/exercises";

interface Exercise {
  name: string;
  type: string;
}

const filterCategories = ["All", "Cardio", "Strength", "Combat", "Flexibility"];

const CreatingWorkout = () => {
  const { addWorkout, error, loading } = useWorkouts();

  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleOpenModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDay("");
    setMonth("");
    setDescription("");
  };

  const handleAddWorkout = async () => {
    if (selectedExercise && day && month && description) {
      const newWorkout = {
        day: parseInt(day, 10),
        month,
        description,
        exercise_name: selectedExercise.name,
        exercise_type: selectedExercise.type,
        id: 0,
        finished: false,
      };
      try {
        await addWorkout(newWorkout);
        handleClose();
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to add workout:", err.message);
          alert("Failed to add workout: " + err.message);
        } else {
          console.error("Unknown error", err);
          alert("An unknown error occurred.");
        }
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && parseInt(value, 10) <= 31) {
      setDay(value);
    }
  };

  const filteredExercises = allExercises.filter(
    (exercise: Exercise) => filter === "All" || exercise.type === filter
  );

  return (
    <PlatformWrapper>
      <section className={styles.creatingworkout}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.creatingworkout__header}>
              <h2>Add new workout to your workout plan</h2>
            </div>
            <p>
              Select a type of workout you want to add to your exercise routine
              and start building a custom workout plan. You can view them in
              your workout plan section.
            </p>
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
                Add {selectedExercise?.name} to your plan
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter the details for your workout.
                </DialogContentText>

                <TextField
                  autoFocus
                  margin="dense"
                  label="Day"
                  type="text"
                  fullWidth
                  value={day}
                  onChange={handleDayChange}
                  inputProps={{ maxLength: 2 }}
                  helperText="Enter a day (1-31)"
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    label="Month"
                  >
                    {months.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddWorkout}
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add"}
                </Button>
              </DialogActions>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Dialog>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default CreatingWorkout;
