import React, { useState } from "react";
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

const allExercises = [
  { name: "Cardio", type: "Cardio" },
  { name: "Yoga", type: "Flexibility" },
  { name: "Pilates", type: "Flexibility" },
  { name: "CrossFit", type: "Strength" },
  { name: "HIIT", type: "Cardio" },
  { name: "Running", type: "Cardio" },
  { name: "Cycling", type: "Cardio" },
  { name: "Swimming", type: "Cardio" },
  { name: "Boxing", type: "Combat" },
  { name: "Weightlifting", type: "Strength" },
  { name: "Stretching", type: "Flexibility" },
  { name: "Bodybuilding", type: "Strength" },
  { name: "Core Training", type: "Strength" },
  { name: "Dance", type: "Cardio" },
  { name: "Kickboxing", type: "Combat" },
  { name: "TRX", type: "Strength" },
  { name: "Powerlifting", type: "Strength" },
  { name: "Zumba", type: "Cardio" },
  { name: "Calisthenics", type: "Strength" },
  { name: "Gymnastics", type: "Flexibility" },
  { name: "Rowing", type: "Cardio" },
  { name: "Martial Arts", type: "Combat" },
  { name: "Aerobics", type: "Cardio" },
  { name: "Resistance Training", type: "Strength" },
  { name: "Spin Class", type: "Cardio" },
  { name: "Plyometrics", type: "Strength" },
  { name: "Barre", type: "Flexibility" },
  { name: "Mobility Workouts", type: "Flexibility" },
];

const months = [
  { label: "Jan", value: "January" },
  { label: "Feb", value: "February" },
  { label: "Mar", value: "March" },
  { label: "Apr", value: "April" },
  { label: "May", value: "May" },
  { label: "Jun", value: "June" },
  { label: "Jul", value: "July" },
  { label: "Aug", value: "August" },
  { label: "Sep", value: "September" },
  { label: "Oct", value: "October" },
  { label: "Nov", value: "November" },
  { label: "Dec", value: "December" },
];

const filterCategories = ["All", "Cardio", "Strength", "Combat", "Flexibility"];

const CreatingWorkout = () => {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenModal = (exercise) => {
    setSelectedExercise(exercise);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDay("");
    setMonth("");
    setDescription("");
  };

  const handleAddWorkout = () => {
    handleClose();
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value) && value <= 31) {
      setDay(value);
    }
  };

  const filteredExercises = allExercises.filter(
    (exercise) => filter === "All" || exercise.type === filter
  );

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <WhiteCardWrapper>
          <div className={styles.creatingworkout__header}>
            <h2>Add new workout to your workout plan</h2>
          </div>
          <p>
            Select a type of workout you want to add to your exercise routine
            and start building a custom workout plan. You can view them in your
            workout plan section.
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
            {filteredExercises.map((exercise) => (
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
            <DialogTitle>Add {selectedExercise?.name} to your plan</DialogTitle>
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
              <Button onClick={handleAddWorkout} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </WhiteCardWrapper>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default CreatingWorkout;
