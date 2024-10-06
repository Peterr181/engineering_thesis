import React, { useEffect } from "react";
import styles from "./UpcomingWorkouts.module.scss";
import Button from "../../atomic/Button/Button";
import Workout from "../Workout/Workout";
import { useLanguage } from "../../../context/LanguageProvider";
import { Status, Category } from "../../compound/Workout/Workout";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { useWorkouts } from "../../../hooks/useWorkout";

const UpcomingWorkouts = () => {
  const { t } = useLanguage();
  const { workouts, fetchWorkouts, loading, error } = useWorkouts();

  useEffect(() => {
    fetchWorkouts();
  }, []);

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
          <div>
            <Button variant="primaryFilled">
              <span>{t("upcomingWorkouts.showWorkoutPlan")}</span>
            </Button>
          </div>
        </div>
        <div className={styles.upcomingWorkouts__workouts}>
          {loading && <p>Loading workouts...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {workouts.map((workout, index) => (
            <Workout
              key={index}
              day={workout.day}
              month={workout.month}
              name={workout.exercise_name || workout.name}
              status={workout.status || Status.NOT_STARTED}
              category={workout.exercise_type || Category.GYM}
            />
          ))}
        </div>
      </WhiteCardWrapper>
    </div>
  );
};

export default UpcomingWorkouts;
