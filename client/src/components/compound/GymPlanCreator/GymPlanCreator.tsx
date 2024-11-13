import React, { useState, useEffect } from "react";
import styles from "./GymPlanCreator.module.scss";
import PlatformWrapper from "../PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { iconFile } from "../../../assets/iconFile";
import { useGymRoutine } from "../../../hooks/useGymRoutine";

type Exercise = {
  name: string;
  sets: {
    repetitions: number;
    weight: number;
  }[];
};

type WorkoutDay = {
  day: string;
  exercises: Exercise[];
};

const GymPlanCreator: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [numSets, setNumSets] = useState<number>(0);
  const [sets, setSets] = useState<{ repetitions: number; weight: number }[]>(
    []
  );
  const [currentDay, setCurrentDay] = useState<string>("");
  const [dialogStep, setDialogStep] = useState<number>(0);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [routineCreated, setRoutineCreated] = useState<boolean>(false);

  const {
    routines,
    routineDetails,
    fetchRoutines,
    savePlan,
    fetchRoutineDetails,
    deleteRoutine,
  } = useGymRoutine();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleCreateRoutine = () => {
    setRoutineCreated(true);
  };

  const handleSavePlan = async () => {
    if (selectedDays.length === 0) {
      setAlertOpen(true);
      return;
    }

    const routineName = "My Routine2"; // Replace with actual routine name input
    const startDate = null; // Replace with actual start date input
    await savePlan(routineName, startDate, selectedDays, workouts);

    setAlertOpen(true);
    setRoutineCreated(false); // Close the routine creator
    await fetchRoutines(); // Refresh routines to show the new routine

    if (routines.length > 0) {
      await handleFetchRoutineDetails(routines[0].id); // Fetch details for the first routine
    }
  };

  const handleFetchRoutineDetails = async (routineId: number) => {
    await fetchRoutineDetails(routineId);
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  useEffect(() => {
    if (routines.length > 0) {
      handleFetchRoutineDetails(routines[0].id); // Fetch details for the first routine
    }
  }, [routines]);

  useEffect(() => {
    if (routineDetails) {
      const daysWithExercises = Object.keys(routineDetails);
      setSelectedDays(daysWithExercises);
      const updatedWorkouts = daysWithExercises.map((day) => ({
        day,
        exercises: routineDetails[day],
      }));
      setWorkouts(updatedWorkouts);
    }
  }, [routineDetails]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleDayExpansion = (day: string) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addExerciseToDay = (day: string, exercise: Exercise) => {
    setWorkouts((prevWorkouts) => {
      const updatedWorkouts = [...prevWorkouts];
      const dayIndex = updatedWorkouts.findIndex((w) => w.day === day);
      if (dayIndex >= 0) {
        const existingExercises = updatedWorkouts[dayIndex].exercises;
        const exerciseExists = existingExercises.some(
          (ex) => ex.name === exercise.name
        );
        if (!exerciseExists) {
          updatedWorkouts[dayIndex].exercises.push(exercise);
        }
      } else {
        updatedWorkouts.push({ day, exercises: [exercise] });
      }
      return updatedWorkouts;
    });
    setAlertOpen(true);
  };

  const handleAddExercise = (day: string) => {
    setCurrentDay(day);
    setDialogOpen(true);
  };

  const handleNextStep = () => {
    if (exerciseName && numSets > 0) {
      setSets(
        Array.from({ length: numSets }, () => ({ repetitions: 0, weight: 0 }))
      );
      setDialogStep(1);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setExerciseName("");
    setNumSets(0);
    setSets([]);
    setDialogStep(0);
  };

  const handleDialogSubmit = () => {
    if (exerciseName && sets.length > 0) {
      const newExercise: Exercise = { name: exerciseName, sets };
      addExerciseToDay(currentDay, newExercise);
      handleDialogClose();
    }
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    const updatedSets = [...sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setSets(updatedSets);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Confirm and delete the routine
  const handleDeleteRoutine = async () => {
    if (routines.length > 0) {
      await deleteRoutine(routines[0].id); // Deletes the first routine for demo
      setDeleteDialogOpen(false);
      fetchRoutines(); // Refresh routines after deletion
      setSelectedDays([]); // Clear selected days
      setWorkouts([]); // Clear workouts
    }
  };

  return (
    <PlatformWrapper>
      <section className={styles.gymPlanCreator}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.gymPlanCreator__header}>
              <h2>Select Workout Days</h2>
              {routines.length === 0 ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateRoutine}
                  disabled={routineCreated}
                >
                  Create Routine
                </Button>
              ) : (
                <Button
                  onClick={handleOpenDeleteDialog}
                  color="error"
                  variant="contained"
                >
                  Delete Routine
                </Button>
              )}
            </div>
            {routineCreated || routines.length > 0 ? (
              <>
                {routineCreated && (
                  <div className={styles.daySelection}>
                    {daysOfWeek.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={selectedDays.includes(day)}
                            onChange={() => toggleDaySelection(day)}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </div>
                )}
                <div className={styles.workoutDays}>
                  {selectedDays.length > 0 ? (
                    <>
                      {selectedDays.map((day) => {
                        const dayExercises =
                          workouts.find((workout) => workout.day === day)
                            ?.exercises || [];
                        return (
                          <div key={day} className={styles.workoutDay}>
                            <div
                              className={styles.workoutDayHeader}
                              onClick={() => toggleDayExpansion(day)}
                            >
                              <div className={styles.dayName}>
                                <h3>{day}</h3>
                                {dayExercises.length > 0 &&
                                  (expandedDays.includes(day) ? (
                                    <span>{iconFile.arrowDown}</span>
                                  ) : (
                                    <span>{iconFile.arrowRight}</span>
                                  ))}
                              </div>
                              {routineCreated && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddExercise(day);
                                  }}
                                  color="primary"
                                  variant="contained"
                                >
                                  Add Exercise
                                </Button>
                              )}
                            </div>
                            <div
                              className={`${styles.exerciseList} ${
                                expandedDays.includes(day)
                                  ? styles.expanded
                                  : ""
                              }`}
                            >
                              {dayExercises.map((exercise, i) => (
                                <div key={i} className={styles.exercise}>
                                  <h4>{exercise.name}</h4>
                                  <table className={styles.setsTable}>
                                    <thead>
                                      <tr>
                                        <th>Set</th>
                                        <th>Repetitions</th>
                                        <th>Weight (kg)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {exercise.sets.map((set, j) => (
                                        <tr key={j}>
                                          <td>{j + 1}</td>
                                          <td>{set.repetitions}</td>
                                          <td>{set.weight}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                </div>
                {routineCreated && (
                  <div className={styles.saveButton}>
                    <Button
                      onClick={handleSavePlan}
                      color="success"
                      variant="contained"
                    >
                      Save Plan
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>
                Create your own weekly gym routine here in gym routine creator!
              </p>
            )}
            <Snackbar
              open={alertOpen}
              autoHideDuration={2000}
              onClose={() => setAlertOpen(false)}
            >
              <Alert onClose={() => setAlertOpen(false)} severity="success">
                Plan saved successfully!
              </Alert>
            </Snackbar>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Add Exercise</DialogTitle>
              <DialogContent>
                {dialogStep === 0 ? (
                  <>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Exercise Name"
                      fullWidth
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Number of Sets"
                      type="number"
                      fullWidth
                      value={numSets}
                      onChange={(e) => setNumSets(Number(e.target.value))}
                    />
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "16px" }}>
                    {sets.map((set, index) => (
                      <div key={index} style={{ flex: 1 }}>
                        <TextField
                          margin="dense"
                          label={`Set ${index + 1} Repetitions`}
                          type="number"
                          fullWidth
                          value={set.repetitions}
                          onChange={(e) =>
                            handleSetChange(
                              index,
                              "repetitions",
                              Number(e.target.value)
                            )
                          }
                        />
                        <TextField
                          margin="dense"
                          label={`Set ${index + 1} Weight (kg)`}
                          type="number"
                          fullWidth
                          value={set.weight}
                          onChange={(e) =>
                            handleSetChange(
                              index,
                              "weight",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                {dialogStep === 0 ? (
                  <Button onClick={handleNextStep} color="primary">
                    Next
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleDialogSubmit} color="primary">
                      Add
                    </Button>
                  </>
                )}
              </DialogActions>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this routine?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteRoutine}
                  color="error"
                  variant="contained"
                >
                  Confirm Delete
                </Button>
              </DialogActions>
            </Dialog>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default GymPlanCreator;
