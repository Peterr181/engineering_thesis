import React from "react";
import styles from "./Streak.module.scss";

interface StreakItemProps {
  points: number;
  day: string;
  image: string;
  additionalClass?: string;
}

const StreakItem: React.FC<StreakItemProps> = ({
  points,
  day,
  image,
  additionalClass,
}) => {
  return (
    <div className={`${styles.streak__item} ${styles.responsive__item}`}>
      <div
        className={`${styles.streak__item__header} ${
          styles.responsive__header
        } ${additionalClass || ""}`}
      >
        <p>{points}pt</p>
        <img src={image} alt="dolar" />
      </div>
      <p>{day}</p>
    </div>
  );
};

export default StreakItem;
