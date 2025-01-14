import styles from "./ActivityCard.module.scss";
import { iconFile } from "../../.././assets/iconFile";
import { useLanguage } from "../../../context/LanguageProvider";
import { useMediaQuery } from "react-responsive";

interface ActivityCardProps {
  icon: string | JSX.Element;
  title: string;
  number: string | number;
}

const ActivityCard = ({ icon, title, number }: ActivityCardProps) => {
  const { t } = useLanguage();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div
      className={`${styles.activitiesCard} ${isMobile ? styles.mobile : ""}`}
    >
      <div className={styles.activitiesCard__icon}>{icon}</div>
      <div className={styles.activitiesCard__info}>
        <span className={styles.activitiesCard__info__header}>
          <p>{t(`activityCard.${title}`)}</p>
        </span>
        <span className={styles.activitiesCard__info__number}>{number}</span>
      </div>
      <div className={styles.activitiesCard__iconRight}>
        {iconFile.arrowRight}
      </div>
    </div>
  );
};

export default ActivityCard;
