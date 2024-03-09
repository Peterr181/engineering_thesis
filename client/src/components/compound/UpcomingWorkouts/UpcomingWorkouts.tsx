import React from "react";
import styles from "./UpcomingWorkouts.module.scss";
import Button from "../../atomic/Button/Button";
import Workout from "../Workout/Workout";
import { useLanguage } from "../../../context/LanguageProvider";
import { Status, Category } from "../../compound/Workout/Workout";
const UpcomingWorkouts = () => {
  const { t } = useLanguage();
  return (
    <div className={styles.upcomingWorkouts}>
      <div className={styles.upcomingWorkouts__container}>
        <div className={styles.upcomingWorkouts__container__header}>
          <div>
            <h3 className={styles.upcomingWorkouts__container__header__title}>
              {t("upcomingWorkouts.upcomingWorkouts")}
            </h3>
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
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.FINISHED} // Use enum value
            category={Category.GYM} // Use enum value
          />
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.IN_PROGRESS} // Use enum value
            category={Category.BICYCLE} // Use enum value
          />
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.NOT_STARTED} // Use enum value
            category={Category.GYM} // Use enum value
          />
        </div>
      </div>
    </div>
  );
};

export default UpcomingWorkouts;
