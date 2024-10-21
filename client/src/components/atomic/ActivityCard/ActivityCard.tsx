import styles from "./ActivityCard.module.scss";
import { iconFile } from "../../.././assets/iconFile";
import { useLanguage } from "../../../context/LanguageProvider";
interface ActivityCardProps {
  icon: string | JSX.Element;
  title: string;
  number: string;
}

const ActivityCard = ({ icon, title, number }: ActivityCardProps) => {
  const { t } = useLanguage();
  return (
    <div className={styles.activitiesCard}>
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
