import React, { useState, useEffect } from "react";
import styles from "./Meals.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import axios from "axios";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import Button from "../../components/atomic/Button/Button";
import { iconFile } from "../../assets/iconFile";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

interface ResultsData {
  text: string;
  parsed: any[];
  hints: any[];
  _links: {
    next: {
      href: string;
    };
  };
}

const Meals = () => {
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const apiId: string | undefined = import.meta.env.VITE_REACT_APP_MEALS_API_ID;
  const apiKey: string | undefined = import.meta.env
    .VITE_REACT_APP_MEALS_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ResultsData>(
          `https://api.edamam.com/api/food-database/v2/parser`,
          {
            params: {
              app_id: apiId,
              app_key: apiKey,
              ingr: filterQuery,
            },
          }
        );
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterQuery]);

  const fetchNextPage = async () => {
    if (!results) return;
    setLoading(true);
    try {
      const response = await axios.get<ResultsData>(results._links.next.href);
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterSubmit = () => {
    setFilterQuery(searchQuery);
  };

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <section className={styles.meals}>
          <WhiteCardWrapper>
            <div className={styles.meals__header}>
              <div>
                <h2>Meals</h2>
                <p>
                  Browse between a numerous numbers of food be careful nutrients
                  are for 100g
                </p>
              </div>
              <div>
                <Button
                  variant="filter"
                  leftIcon={iconFile.filterIcon}
                  onClick={onOpenModal}
                >
                  Filter
                </Button>
              </div>
            </div>
            <div className={styles.meals__content}>
              {loading && <p>Loading...</p>}
              {results?.hints
                .filter((hint) => hint.food.image)
                .map((hint, index) => (
                  <div key={index} className={styles.meals__item}>
                    <div className={styles.meals__item__image}>
                      <img src={hint.food.image} alt={hint.food.label} />
                      <div className={styles.meals__item__name}>
                        <h3>
                          {hint.food.label.split(" ").slice(0, 6).join(" ")}{" "}
                        </h3>
                        <p>{hint.food.category}</p>
                      </div>
                    </div>
                    <div className={styles.meals__item__nutrients}>
                      <div className={styles.meals__item__nutrients__details}>
                        <span
                          className={styles.meals__item__nutrients__calories}
                        >
                          Calories: {hint.food.nutrients.ENERC_KCAL.toFixed(0)}{" "}
                        </span>
                        <span
                          className={styles.meals__item__nutrients__protein}
                        >
                          Protein: {hint.food.nutrients.PROCNT.toFixed(1)}g{" "}
                        </span>
                        <span className={styles.meals__item__nutrients__fat}>
                          Fat: {hint.food.nutrients.FAT.toFixed(1)}g{" "}
                        </span>
                        <span className={styles.meals__item__nutrients__carbs}>
                          Carbohydrates: {hint.food.nutrients.CHOCDF.toFixed(1)}
                          g
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="almostGreen"
                        rightIcon={iconFile.addIcon}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              <Button variant="primary" onClick={fetchNextPage}>
                Show more meals
              </Button>
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
            <h2 className={styles.modalHeader}>Find your favourite meal</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search by meal name"
              className={styles.modalInput}
            />
            <div className={styles.filterButton}>
              <Button variant="filter" onClick={handleFilterSubmit}>
                Search
              </Button>{" "}
            </div>
          </Modal>
        </section>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Meals;
