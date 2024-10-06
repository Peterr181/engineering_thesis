import React, { useEffect } from "react";
import Calendar from "react-calendar";
import styles from "./WorkoutPlan.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import Workout from "../../components/compound/Workout/Workout";
import { Status, Category } from "../../components/compound/Workout/Workout";
import "react-calendar/dist/Calendar.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useWorkouts } from "../../hooks/useWorkout";

const WorkoutPlan = () => {
  const { workouts, fetchWorkouts, loading, error } = useWorkouts();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const workoutDays = workouts.map((workout) => new Date(2024, 0, workout.day));

  const highlightWorkouts = ({ date, view }) => {
    if (view === "month") {
      return workoutDays.some(
        (workoutDate) => workoutDate.toDateString() === date.toDateString()
      )
        ? styles.highlightedDay
        : null;
    }
    return null;
  };

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <div className={styles.workoutPlan}>
          <div className={styles.workoutPlan__trainings}>
            <WhiteCardWrapper>
              <div className={styles.workoutPlan__trainings__header}>
                <div>
                  <h2>Plan treningowy</h2>
                  <p>
                    Sprawdź kiedy masz swoje najbliższe zaplanowane treningi!
                  </p>
                </div>
                <Link to="/creatingworkout">
                  <div>
                    <Button variant="contained" color="success">
                      Add new training
                    </Button>
                  </div>
                </Link>
              </div>
              <div className={styles.workoutPlan__trainings__trainingsList}>
                {loading && <p>Loading workouts...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {workouts.map((workout, index) => (
                  <Workout
                    key={index}
                    day={workout.day}
                    month={workout.month}
                    name={workout.exercise_name}
                    status={Status.NOT_STARTED}
                    category={workout.exercise_type || Category.GYM}
                  />
                ))}
              </div>
            </WhiteCardWrapper>
          </div>

          <div className={styles.workoutPlan__calendar}>
            <WhiteCardWrapper>
              <h2>Kalendarz</h2>
              <p>Sprawdź kiedy masz treningi</p>
              <div className={styles.workoutPlan__calendar__content}>
                <Calendar
                  tileClassName={highlightWorkouts}
                  className={styles.customCalendar}
                />
              </div>
            </WhiteCardWrapper>
          </div>
        </div>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default WorkoutPlan;
