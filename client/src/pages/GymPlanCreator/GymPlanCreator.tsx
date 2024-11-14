import React, { useState, useEffect } from "react";
import styles from "./GymPlanCreator.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { iconFile } from "../../assets/iconFile";
import { useGymRoutine } from "../../hooks/useGymRoutine";

type Exercise = {
  name: string;
  sets: {
    setNumber: number;
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
  const [routineName, setRoutineName] = useState<string>("");
  const [viewRoutine, setViewRoutine] = useState<boolean>(false);
  const [emptyDayAlertOpen, setEmptyDayAlertOpen] = useState<boolean>(false);

  const {
    routines,
    routineDetails,
    fetchRoutines,
    savePlan,
    fetchRoutineDetails,
    deleteRoutine,
    fetchRoutineById,
    endRoutine,
    activateRoutine,
  } = useGymRoutine();

  useEffect(() => {
    fetchRoutines();
  }, []);

  useEffect(() => {
    return () => {
      const activeRoutine = routines.find((routine) => routine.is_active === 1);
      if (activeRoutine) {
        activateRoutine(activeRoutine.id, false); // Set the active routine to inactive
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const activeRoutine = routines.find((routine) => routine.is_active === 1);
      if (activeRoutine) {
        activateRoutine(activeRoutine.id, false); // Set the active routine to inactive
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [routines]);

  const handleCreateRoutine = () => {
    setRoutineCreated(true);
    setSelectedDays([]); // Clear selected days
    setWorkouts([]); // Clear workouts
  };

  const handleCancelCreateRoutine = () => {
    setRoutineCreated(false);
    setRoutineName("");
    setSelectedDays([]);
    setWorkouts([]);
  };

  const handleSavePlan = async () => {
    if (selectedDays.length === 0 || !routineName) {
      setAlertOpen(true);
      return;
    }

    const emptyDays = selectedDays.filter(
      (day) =>
        !workouts.find((workout) => workout.day === day)?.exercises.length
    );

    if (emptyDays.length > 0) {
      setEmptyDayAlertOpen(true);
      return;
    }

    const startDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    await savePlan(routineName, startDate, selectedDays, workouts);

    setAlertOpen(true); // Trigger the alert here
    setRoutineCreated(false); // Close the routine creator
    setViewRoutine(false); // Ensure the routine creator is closed
    await fetchRoutines(); // Refresh routines to show the new routine

    const activeRoutines = routines.filter(
      (routine) => routine.is_active === 1
    );
    if (activeRoutines.length > 0) {
      await handleFetchRoutineDetails(activeRoutines[0].id); // Fetch details for the first active routine
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
      const activeRoutines = routines.filter(
        (routine) => routine.is_active === 1
      );
      if (activeRoutines.length > 0) {
        handleFetchRoutineDetails(activeRoutines[0].id); // Fetch details for the first active routine
      }
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
    // Remove the alert trigger here
    // setAlertOpen(true);
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
      const newExercise: Exercise = {
        name: exerciseName,
        sets: sets.map((set, index) => ({
          setNumber: index + 1,
          repetitions: set.repetitions,
          weight: set.weight,
        })),
      };
      addExerciseToDay(currentDay, newExercise);
      handleDialogClose();
    }
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    const updatedSets = [...sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setSets(updatedSets);
  };

  const handleRoutineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setRoutineName(value);
    }
  };

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setExerciseName(value);
    }
  };

  const handleNumSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (num <= 10 && !value.startsWith("0")) {
      setNumSets(num);
    }
  };

  const handleSetRepetitionsChange = (index: number, value: string) => {
    const num = Number(value);
    if (num <= 100 && !value.startsWith("0")) {
      handleSetChange(index, "repetitions", num);
    }
  };

  const handleSetWeightChange = (index: number, value: string) => {
    const num = Number(value);
    if (num <= 300 && !value.startsWith("0")) {
      handleSetChange(index, "weight", num);
    }
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
    const activeRoutine = routines.find((routine) => routine.is_active === 1);

    if (activeRoutine) {
      await deleteRoutine(activeRoutine.id); // Deletes the active routine
      setDeleteDialogOpen(false);
      fetchRoutines(); // Refresh routines after deletion
      setSelectedDays([]); // Clear selected days
      setWorkouts([]); // Clear workouts
      setViewRoutine(false); // Ensure the routine list is shown
    }
  };

  const handleEndRoutine = async () => {
    const activeRoutine = routines.find((routine) => routine.is_active === 1);
    setViewRoutine(false);
    if (activeRoutine) {
      await endRoutine(activeRoutine.id); // Ends the active routine
      setRoutineCreated(false); // Close the routine creator
      fetchRoutines(); // Refresh routines to show the new routine

      const activeRoutines = routines.filter(
        (routine) => routine.is_active === 1
      );
      if (activeRoutines.length > 0) {
        await handleFetchRoutineDetails(activeRoutines[0].id); // Fetch details for the first active routine
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const handleViewRoutine = async (routineId: number) => {
    await activateRoutine(routineId, true); // Activate the routine
    await handleFetchRoutineDetails(routineId);
    setRoutineCreated(false); // Close the routine creator
    setViewRoutine(true);
    setSelectedDays([]); // Clear selected days
    setWorkouts([]); // Clear workouts
    const routine = await fetchRoutineById(routineId);
    if (routine) {
      setSelectedDays(Object.keys(routineDetails || {}));
      const updatedWorkouts = Object.keys(routineDetails || {}).map((day) => ({
        day,
        exercises: routineDetails![day],
      }));
      setWorkouts(updatedWorkouts);
    }
  };

  return (
    <PlatformWrapper>
      <section className={styles.gymPlanCreator}>
        <MaxWidthWrapper>
          <WhiteCardWrapper additionalClass={styles.wrapperClass}>
            <div className={styles.gymPlanCreator__header}>
              <h2>Your gym workout routine creator</h2>
              {routines.filter((routine) => routine.is_active === 1).length ===
              0 ? (
                <>
                  <div className={styles.deleteRoutine}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleCreateRoutine}
                      disabled={routineCreated}
                    >
                      Create Routine
                    </Button>
                    {routineCreated && (
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleCancelCreateRoutine}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.deleteRoutine}>
                    <Button
                      onClick={handleOpenDeleteDialog}
                      color="error"
                      variant="contained"
                    >
                      Delete Routine
                    </Button>
                    <Button
                      onClick={handleEndRoutine}
                      color="secondary"
                      variant="contained"
                    >
                      Close Routine
                    </Button>
                  </div>
                </>
              )}
            </div>
            {routineCreated ||
            routines.filter((routine) => routine.is_active === 1).length > 0 ? (
              <>
                {routineCreated && (
                  <div className={styles.daySelection}>
                    <div className={styles.daySelection__routineName}>
                      <TextField
                        label="Routine Name"
                        fullWidth
                        value={routineName}
                        onChange={handleRoutineNameChange}
                      />
                    </div>
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
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={() => setAlertOpen(false)} severity="success">
                Plan saved successfully!
              </Alert>
            </Snackbar>
            <Snackbar
              open={emptyDayAlertOpen}
              autoHideDuration={5000}
              onClose={() => setEmptyDayAlertOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setEmptyDayAlertOpen(false)}
                severity="error"
              >
                Each selected day must have at least one exercise!
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
                      onChange={handleExerciseNameChange}
                    />
                    <TextField
                      margin="dense"
                      label="Number of Sets"
                      type="number"
                      fullWidth
                      value={numSets}
                      onChange={handleNumSetsChange}
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
                            handleSetRepetitionsChange(index, e.target.value)
                          }
                        />
                        <TextField
                          margin="dense"
                          label={`Set ${index + 1} Weight (kg)`}
                          type="number"
                          fullWidth
                          value={set.weight}
                          onChange={(e) =>
                            handleSetWeightChange(index, e.target.value)
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
            {!routineCreated && !viewRoutine ? (
              <div className={styles.routinesList}>
                {routines.map((routine) => (
                  <div key={routine.id} className={styles.routineItem}>
                    <span className="routineName">{routine.routine_name}</span>
                    <span className="routineDate">
                      {routine.start_date
                        ? formatDate(routine.start_date)
                        : "N/A"}
                    </span>
                    <Button
                      onClick={() => handleViewRoutine(routine.id)}
                      color="success"
                      variant="contained"
                    >
                      View Routine
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default GymPlanCreator;
