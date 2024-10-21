import { useEffect } from "react";
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
import { monthMap } from "../../constants/other";

const WorkoutPlan = () => {
  const { workouts, fetchWorkouts, loading, error, finishWorkout } =
    useWorkouts();

  useEffect(() => {
    fetchWorkouts(false);
  }, []);

  const workoutDays = workouts.map((workout) => {
    const monthNumber = monthMap[workout.month];
    return new Date(2024, monthNumber, workout.day);
  });

  const highlightWorkouts = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      return workoutDays.some(
        (workoutDate) => workoutDate.toDateString() === date.toDateString()
      )
        ? styles.highlightedDay
        : null;
    }
    return null;
  };

  console.log(workouts);
  return (
    <PlatformWrapper>
      <div className={styles.workoutPlanWrapper}>
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
                  <div className={styles.workoutPlan__trainings__buttons}>
                    <Link to="/creatingworkout">
                      <div>
                        <Button variant="contained" color="success">
                          Add new
                        </Button>
                      </div>
                    </Link>
                    <div>
                      <Button variant="contained" color="error">
                        Check finished
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={styles.workoutPlan__trainings__trainingsList}>
                  {loading && <p>Loading workouts...</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {workouts.map((workout, index) => {
                    const workoutCategory =
                      Category[
                        (workout.exercise_type?.toUpperCase() as keyof typeof Category) ||
                          Category.GYM
                      ] || Category.GYM;
                    return (
                      <Workout
                        key={index}
                        id={workout.id}
                        day={workout.day}
                        month={workout.month}
                        name={workout.exercise_name || "Unnamed Workout"}
                        status={
                          workout.finished
                            ? Status.FINISHED
                            : Status.NOT_STARTED
                        }
                        category={workoutCategory}
                        onFinish={() => finishWorkout(workout.id)}
                      />
                    );
                  })}
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
      </div>
    </PlatformWrapper>
  );
};

export default WorkoutPlan;
