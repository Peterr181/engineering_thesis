import React from "react";
import styles from "./Exercise.module.scss";

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
  return (
    <div className={styles.exercise}>
      <img src={image} alt="exercise" />
      <div>
        <span>{target}</span>
        <span>{bodyPart}</span>
      </div>
      <h3>{name}</h3>
    </div>
  );
};

export default Exercise;
