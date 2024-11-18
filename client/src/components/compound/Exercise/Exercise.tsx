import React from "react";
import styles from "./Exercise.module.scss";
import { useLanguage } from "../../../context/LanguageProvider";

interface ExerciseProps {
  name: string;
  target: string;
  bodyPart: string;
  image: string;
}

const Exercise: React.FC<ExerciseProps> = ({
  name,
  target,
  bodyPart,
  image,
}) => {
  const { t } = useLanguage();
  return (
    <div className={styles.exercise}>
      <img src={image} alt={t("exercise.imageAlt")} />
      <div>
        <span>{t(`exercise.target.${target}`)}</span>
        <span>{t(`exercise.bodyPart.${bodyPart}`)}</span>
      </div>
      <h3>{name}</h3>
    </div>
  );
};

export default Exercise;
