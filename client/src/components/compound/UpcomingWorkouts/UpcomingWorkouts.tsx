import { useEffect } from "react";
import styles from "./UpcomingWorkouts.module.scss";
import Workout from "../Workout/Workout";
import { useLanguage } from "../../../context/LanguageProvider";
import { Status, Category } from "../../compound/Workout/Workout";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { useWorkouts } from "../../../hooks/useWorkout";
import { Link } from "react-router-dom";
import Button2 from "@mui/material/Button";

const UpcomingWorkouts = () => {
  const { t } = useLanguage();
  const { workouts, fetchWorkouts, loading, finishWorkout } = useWorkouts();

  useEffect(() => {
    fetchWorkouts(true);
  }, []);

  const upcomingWorkouts =
    workouts?.filter((workout) => !workout.finished) || [];

  return (
    <div className={`${styles.upcomingWorkouts} ${styles.responsive}`}>
      <WhiteCardWrapper additionalClass={styles.upcomingWorkouts__container}>
        <div className={styles.upcomingWorkouts__container__header}>
          <div className={styles.header}>
            <h2 className={styles.upcomingWorkouts__container__header__title}>
              {t("upcomingWorkouts.upcomingWorkouts")}
            </h2>
            <p className={styles.upcomingWorkouts__container__header__text}>
              {t("upcomingWorkouts.keepTrack")}
            </p>
          </div>
          <Link to="/workoutplan">
            <div className={styles.workoutPlanBtn}>
              <Button2 variant="contained" color="success">
                {t("upcomingWorkouts.showWorkoutPlan")}
              </Button2>
            </div>
          </Link>
        </div>
        <div className={styles.upcomingWorkouts__workouts}>
          {loading && <p>{t("loading")}</p>}

          {upcomingWorkouts.length > 0 ? (
            upcomingWorkouts.map((workout, index) => (
              <Workout
                key={index}
                id={workout.id}
                workout_id={workout.workout_id}
                day={workout.day}
                month={workout.month}
                minutes={workout.minutes}
                name={workout.exercise_name || t("unnamedWorkout")}
                status={workout.finished ? Status.FINISHED : Status.NOT_STARTED}
                category={
                  Category[workout.exercise_type as keyof typeof Category] ||
                  Category.GYM
                }
                onFinish={() => finishWorkout(workout.id)}
              />
            ))
          ) : (
            <p>{t("upcomingWorkouts.noUpcomingWorkouts")}</p>
          )}
        </div>
      </WhiteCardWrapper>
    </div>
  );
};

export default UpcomingWorkouts;
