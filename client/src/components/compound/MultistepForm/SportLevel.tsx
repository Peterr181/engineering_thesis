import React, { useState, useEffect } from "react";
import styles from "./MultistepForm.module.scss";
import beginner from "../../../assets/images/begginer.png";
import intermediate from "../../../assets/images/intermediate.png";
import advanced from "../../../assets/images/advanced.png";

interface SportLevelProps {
  updateFields: any;
}

const SportLevel = ({ updateFields }: SportLevelProps) => {
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);

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
          <h2>We can't wait to meet you.</h2>
          <p>
            Please fill in the details below so that we can get in contact with
            you.
          </p>
        </div>
        {/* Move the sport level items within the same containing div */}
        <div className={styles.sportLevel__items}>
          <div className={styles.sportLevel__container}>
            <div
              onClick={() => handleLevelClick(1)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 1 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={beginner} alt="Beginner" />
              <p>Beginner</p>
            </div>
            <div
              onClick={() => handleLevelClick(2)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 2 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={intermediate} alt="Intermediate" />
              <p>Intermediate</p>
            </div>
            <div
              onClick={() => handleLevelClick(3)}
              className={`${styles.sportLevel__item} ${
                activeLevel === 3 ? styles["sportLevel__item--active"] : ""
              }`}
            >
              <img src={advanced} alt="Advanced" />
              <p>Advanced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportLevel;
