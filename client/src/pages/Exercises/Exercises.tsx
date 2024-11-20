import React, { useState, useEffect } from "react";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import styles from "./Exercises.module.scss";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import axios from "axios";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import { iconFile } from "../../assets/iconFile";
import Exercise from "../../components/compound/Exercise/Exercise";
import Button from "../../components/atomic/Button/Button";
import Modal from "react-responsive-modal";
import { useLanguage } from "../../context/LanguageProvider";

interface ExerciseData {
  name: string;
  target: string;
  bodyPart: string;
  gifUrl: string;
}

const Exercises: React.FC = () => {
  const { t } = useLanguage();
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(9);
  const [selectedTarget, setSelectedTarget] = useState("all");
  const apiKey: string | undefined = import.meta.env.VITE_REACT_APP_CLIENT_ID;

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem("exercises");

      if (cachedData) {
        setExercises(JSON.parse(cachedData));
        return;
      }

      const options = {
        method: "GET",
        url: "https://exercisedb.p.rapidapi.com/exercises",
        params: { limit: "200" },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request<ExerciseData[]>(options);
        localStorage.setItem("exercises", JSON.stringify(response.data));
        setExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [apiKey]);

  const filteredExercises = exercises.filter(
    (exercise) => selectedTarget === "all" || exercise.target === selectedTarget
  );
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const totalExercises = filteredExercises.length;
  const currentExercises = filteredExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const paginate = (pageNumber: number) => {
    const totalPages = Math.ceil(totalExercises / exercisesPerPage);
    const newPage = Math.min(Math.max(1, pageNumber), totalPages);

    setCurrentPage(newPage);
  };

  const filteredTargets = Array.from(
    new Set(exercises.map((exercise) => exercise.target))
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTarget(event.target.value);
  };

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <section className={styles.exercises}>
          <WhiteCardWrapper>
            <div className={styles.exercises__header}>
              <div>
                <h2>{t("exercises.title")}</h2>
                <p>{t("exercises.subtitle")}</p>
              </div>
              <div>
                <Button
                  variant="filter"
                  leftIcon={iconFile.filterIcon}
                  onClick={onOpenModal}
                >
                  {t("exercises.filter")}
                </Button>
              </div>
            </div>
            <div className={styles.exercises__container}>
              {currentExercises.map((exercise: ExerciseData) => (
                <Exercise
                  key={`${exercise.name}-${exercise.target}`}
                  name={exercise.name}
                  target={exercise.target}
                  bodyPart={exercise.bodyPart}
                  image={exercise.gifUrl}
                />
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              >
                {iconFile.arrowLeft}
              </button>
              {currentPage > 2 && (
                <button onClick={() => paginate(1)}>1</button>
              )}
              {currentPage > 2 && <p>...</p>}
              {currentPage > 1 && (
                <button onClick={() => paginate(currentPage - 1)}>
                  {currentPage - 1}
                </button>
              )}
              <button
                className={styles.active}
                onClick={() => paginate(currentPage)}
              >
                {currentPage}
              </button>
              {currentPage < Math.ceil(totalExercises / exercisesPerPage) && (
                <button onClick={() => paginate(currentPage + 1)}>
                  {currentPage + 1}
                </button>
              )}
              {currentPage <
                Math.ceil(totalExercises / exercisesPerPage) - 1 && <p>...</p>}
              {currentPage <
                Math.ceil(totalExercises / exercisesPerPage) - 1 && (
                <button
                  onClick={() =>
                    paginate(Math.ceil(totalExercises / exercisesPerPage))
                  }
                >
                  {Math.ceil(totalExercises / exercisesPerPage)}
                </button>
              )}
              <button
                onClick={() =>
                  currentPage <
                    Math.ceil(exercises.length / exercisesPerPage) &&
                  paginate(currentPage + 1)
                }
              >
                {iconFile.arrowRight}
              </button>
            </div>
          </WhiteCardWrapper>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{
              overlay: styles.modalOverlay,
              modal: styles.modalContent,
            }}
          >
            <h2 className={styles.modalHeader}>{t("exercises.modalHeader")}</h2>
            <div className={styles.modalSelect}>
              <select name="target" id="target" onChange={handleChange}>
                <option value="all" className={styles.selectDropdown}>
                  {t("exercises.all")}
                </option>
                {filteredTargets.map((target, index) => (
                  <option
                    key={index}
                    value={target}
                    className={styles.selectDropdown}
                  >
                    {target}
                  </option>
                ))}
              </select>
            </div>
          </Modal>
        </section>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Exercises;
