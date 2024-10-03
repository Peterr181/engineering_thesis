import React from "react";
import styles from "./UpcomingWorkouts.module.scss";
import Button from "../../atomic/Button/Button";
import Workout from "../Workout/Workout";
import { useLanguage } from "../../../context/LanguageProvider";
import { Status, Category } from "../../compound/Workout/Workout";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
const UpcomingWorkouts = () => {
  const { t } = useLanguage();
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
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.FINISHED}
            category={Category.GYM}
          />
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.IN_PROGRESS}
            category={Category.CARDIO}
          />
          <Workout
            day={12}
            month="Jan"
            name="Chest workout"
            status={Status.NOT_STARTED}
            category={Category.GYM}
          />
        </div>
      </WhiteCardWrapper>
    </div>
  );
};

export default UpcomingWorkouts;
