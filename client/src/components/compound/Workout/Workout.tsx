import React from "react";
import styles from "./Workout.module.scss";
import Button from "../../atomic/Button/Button";
import { iconFile } from "../../../assets/iconFile";
import { useLanguage } from "../../../context/LanguageProvider";

export enum Status {
  IN_PROGRESS = "INPROGRESS",
  FINISHED = "FINISHED",
  NOT_STARTED = "NOTSTARTED",
}

export enum Category {
  GYM = "Gym",
  CARDIO = "Cardio",
}

interface WorkoutProps {
  exercise_name?: string;
  exercise_type?: string;
  day: number;
  month: string;
  name: string;
  status: Status;
  category: Category;
}

const Workout = ({ day, month, name, status, category }: WorkoutProps) => {
  const { t } = useLanguage();

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.IN_PROGRESS:
        return styles.blue;
      case Status.FINISHED:
        return styles.green;
      case Status.NOT_STARTED:
        return styles.red;
      default:
        return "";
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case Category.GYM:
        return styles.gym;
      case Category.CARDIO:
        return styles.bicycling;
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.GYM:
        return iconFile.gymIcon;
      case Category.CARDIO:
        return iconFile.iconBicycle;
      default:
        return null;
    }
  };

  return (
    <div className={styles.workout}>
      <div className={styles.workout__date}>
        <div className={styles.workout__date__day}>
          <p className={styles.workout__date__day__number}>{day}</p>
          <p className={styles.workout__date__day__month}>{month}</p>
        </div>
        <div className={styles.workout__name}>
          <h3>{name}</h3>
          <div className={`${styles.status} ${getStatusColor(status)}`}>
            <p>{t(`status.${status}`)}</p>
          </div>
        </div>
      </div>
      <div
        className={`${styles.workout__category} ${getCategoryColor(category)}`}
      >
        {/* {getCategoryIcon(category)}
        <p>{t(`category.${category}`)}</p> */}
        <p>{category}</p>
      </div>
      <div className={styles.workout__buttons}>
        <Button variant="almostGreen" rightIcon={iconFile.iconFinish}>
          <span>{t("upcomingWorkouts.button")}</span>
        </Button>
      </div>
    </div>
  );
};

export default Workout;
