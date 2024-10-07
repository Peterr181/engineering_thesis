import React, { useEffect } from "react";
import styles from "./UpcomingWorkouts.module.scss";
import Button from "../../atomic/Button/Button";
import Workout from "../Workout/Workout";
import { useLanguage } from "../../../context/LanguageProvider";
import { Status, Category } from "../../compound/Workout/Workout";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { useWorkouts } from "../../../hooks/useWorkout";
import { Link } from "react-router-dom";

const UpcomingWorkouts = () => {
  const { t } = useLanguage();
  const { workouts, fetchWorkouts, loading, error, finishWorkout } =
    useWorkouts();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const upcomingWorkouts = workouts.filter((workout) => workout.finished === 0);

  return (
    <div className={styles.upcomingWorkouts}>
      <WhiteCardWrapper additionalClass={styles.upcomingWorkouts__container}>
        <div className={styles.upcomingWorkouts__container__header}>
          <div>
            <h2 className={styles.upcomingWorkouts__container__header__title}>
              {t("upcomingWorkouts.upcomingWorkouts")}
            </h2>
            <p className={styles.upcomingWorkouts__container__header__text}>
              {t("upcomingWorkouts.keepTrack")}
            </p>
          </div>
          <Link to="/workoutplan">
            <div>
              <Button variant="primaryFilled">
                <span>{t("upcomingWorkouts.showWorkoutPlan")}</span>
              </Button>
            </div>
          </Link>
        </div>
        <div className={styles.upcomingWorkouts__workouts}>
          {loading && <p>Loading workouts...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {upcomingWorkouts.length > 0 ? (
            upcomingWorkouts.map((workout, index) => (
              <Workout
                key={index}
                id={workout.id}
                day={workout.day}
                month={workout.month}
                name={workout.exercise_name}
                status={workout.finished ? Status.FINISHED : Status.NOT_STARTED}
                category={workout.exercise_type || Category.GYM}
                onFinish={() => finishWorkout(workout.id)}
              />
            ))
          ) : (
            <p>No upcoming workouts available.</p>
          )}
        </div>
      </WhiteCardWrapper>
    </div>
  );
};

export default UpcomingWorkouts;
