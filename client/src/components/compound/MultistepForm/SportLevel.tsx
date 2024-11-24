import { useState, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageProvider";
import styles from "./MultistepForm.module.scss";
import beginner from "../../../assets/images/begginer.png";
import intermediate from "../../../assets/images/intermediate.png";
import advanced from "../../../assets/images/advanced.png";

interface UpdateFields {
  sportLevel: number;
}

interface SportLevelProps {
  updateFields: (fields: UpdateFields) => void;
}

const SportLevel = ({ updateFields }: SportLevelProps) => {
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLevelClick = (level: number) => {
    setActiveLevel(level);
    updateFields({ sportLevel: level });
  };

  return (
    <div
      className={`${styles.sportLevel__container} ${
        animate ? styles["slide_in"] : ""
      }`}
    >
      <div>
        <div className={styles.userBasicInfo__intro}>
          <h2>{t("sportLevel.weCantWait")}</h2>
          <p>{t("sportLevel.fillDetails")}</p>
        </div>
        <div className={styles.sportLevel__items}>
          <div className={styles.sportLevel__container}>
            <div
              onClick={() => handleLevelClick(1)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 1 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={beginner} alt={t("beginner")} />
              <p>{t("beginner")}</p>
            </div>
            <div
              onClick={() => handleLevelClick(2)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 2 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={intermediate} alt={t("intermediate")} />
              <p>{t("intermediate")}</p>
            </div>
            <div
              onClick={() => handleLevelClick(3)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 3 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={advanced} alt={t("advanced")} />
              <p>{t("advanced")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportLevel;
