import styles from "./Workout.module.scss";
import Button from "../../atomic/Button/Button";
import { iconFile } from "../../../assets/iconFile";

export enum Status {
  IN_PROGRESS = "INPROGRESS",
  FINISHED = "FINISHED",
  NOT_STARTED = "NOTSTARTED",
}

export enum Category {
  GYM = "Gym",
  CARDIO = "Cardio",
  FLEXIBILITY = "Flexibility",
  STRENGTH = "Strength",
  COMBAT = "Combat",
}

interface WorkoutProps {
  id: number;
  exercise_name?: string;
  exercise_type?: string;
  day: number;
  month: string;
  name: string;
  status: Status;
  category: Category;
  onFinish: () => void;
  minutes: number;
}

const Workout = ({
  day,
  month,
  name,
  status,
  category,
  minutes,
  onFinish,
}: WorkoutProps) => {
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
      case Category.FLEXIBILITY:
        return styles.flexibility;
      case Category.STRENGTH:
        return styles.strength;
      case Category.COMBAT:
        return styles.combat;
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
      case Category.FLEXIBILITY:
        return iconFile.flexibilityIcon;
      case Category.STRENGTH:
        return iconFile.strengthIcon;
      case Category.COMBAT:
        return iconFile.combatIcon;
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
            <p>{minutes} minutes</p>
          </div>
        </div>
      </div>
      <div
        className={`${styles.workout__category} ${getCategoryColor(category)}`}
      >
        {getCategoryIcon(category)}
        <p>{category}</p>
      </div>
      <div className={styles.workout__buttons}>
        {status !== Status.FINISHED && (
          <Button
            variant="almostGreen"
            rightIcon={iconFile.iconFinish}
            onClick={onFinish}
          >
            <span>Finish</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Workout;
