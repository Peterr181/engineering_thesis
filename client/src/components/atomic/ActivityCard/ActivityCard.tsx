import React from "react";
import styles from "./ActivityCard.module.scss";
import { iconFile } from "../../.././assets/iconFile";
interface ActivityCardProps {
  icon: string | JSX.Element;
  title: string;
  number: string;
}

const ActivityCard = ({ icon, title, number }: ActivityCardProps) => {
  return (
    <div className={styles.activitiesCard}>
      <div className={styles.activitiesCard__icon}>{icon}</div>
      <div className={styles.activitiesCard__info}>
        <span className={styles.activitiesCard__info__number}>{number}</span>
        <span>{title}</span>
      </div>
      <div className={styles.activitiesCard__iconRight}>
        {iconFile.arrowRight}
      </div>
    </div>
  );
};

export default ActivityCard;
