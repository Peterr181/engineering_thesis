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
  BICYCLE = "Bicycle",
}

interface WorkoutProps {
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
      case Category.BICYCLE:
        return styles.bicycling;
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.GYM:
        return iconFile.gymIcon;
      case Category.BICYCLE:
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
          <p>{month}</p>
        </div>
        <div className={styles.workout__name}>
          <h3>{name}</h3>
          <p className={`${styles.status} ${getStatusColor(status)}`}>
            <p>{t(`status.${status}`)}</p>
          </p>
        </div>
      </div>
      <div
        className={`${styles.workout__category} ${getCategoryColor(category)}`}
      >
        {getCategoryIcon(category)}
        <p>{t(`category.${category}`)}</p>
      </div>
      <Button variant="almostGreen" rightIcon={iconFile.iconFinish}>
        <span>{t("upcomingWorkouts.button")}</span>
      </Button>
    </div>
  );
};

export default Workout;
