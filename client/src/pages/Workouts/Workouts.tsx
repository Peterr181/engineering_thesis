import React, { useState, useEffect } from "react";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import styles from "./Workouts.module.scss";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import axios from "axios";

// Define a type for the exercise object
interface Exercise {
  name: string;
  // Add other properties if available in the API response
}

const Workouts = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]); // Specify the type of the state
  const apiKey = import.meta.env.VITE_REACT_APP_CLIENT_ID;

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://exercisedb.p.rapidapi.com/exercises",

        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  console.log(exercises);

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <section className={styles.workouts}>
          <h2>Exercises</h2>
          <ul>
            {exercises.map((exercise: Exercise, index: number) => (
              <li key={index}>{exercise.name}</li>
            ))}
          </ul>
        </section>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Workouts;
