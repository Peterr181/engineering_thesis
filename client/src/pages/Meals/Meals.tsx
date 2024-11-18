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
import { useLanguage } from "../../context/LanguageProvider";

interface Nutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  CHOCDF: number;
  FAT: number;
}

interface Food {
  foodId: string;
  label: string;
  nutrients: Nutrients;
  image: string;
  category: string;
}

interface Hint {
  food: Food;
}

interface ParsedItem {
  food: Food;
  quantity: number;
  measure: string;
}

interface ResultsData {
  text: string;
  parsed: ParsedItem[];
  hints: Hint[];
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
  const { t } = useLanguage();

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
            <div
              className={`${styles.meals__header} ${styles.responsiveHeader}`}
            >
              <div>
                <h2>{t("meals")}</h2>
                <p>{t("browseFood")}</p>
              </div>
              <div>
                <Button
                  variant="filter"
                  leftIcon={iconFile.filterIcon}
                  onClick={onOpenModal}
                >
                  {t("filter")}
                </Button>
              </div>
            </div>
            <div
              className={`${styles.meals__content} ${styles.responsiveContent}`}
            >
              {loading && <p>{t("loading")}</p>}
              {results?.hints
                .filter((hint) => hint.food.image)
                .map((hint, index) => (
                  <div
                    key={index}
                    className={`${styles.meals__item} ${styles.responsiveItem}`}
                  >
                    <div
                      className={`${styles.meals__item__image} ${styles.responsiveImage}`}
                    >
                      <img src={hint.food.image} alt={hint.food.label} />
                      <div className={styles.meals__item__name}>
                        <h3>
                          {hint.food.label.split(" ").slice(0, 6).join(" ")}{" "}
                        </h3>
                        <p>{hint.food.category}</p>
                      </div>
                    </div>
                    <div
                      className={`${styles.meals__item__nutrients} ${styles.responsiveNutrients}`}
                    >
                      <div
                        className={`${styles.meals__item__nutrients__details} `}
                      >
                        <span
                          className={styles.meals__item__nutrients__calories}
                        >
                          {t("calories")}:{" "}
                          {hint.food.nutrients.ENERC_KCAL.toFixed(0)}{" "}
                        </span>
                        <span
                          className={styles.meals__item__nutrients__protein}
                        >
                          {t("protein")}:{" "}
                          {hint.food.nutrients.PROCNT.toFixed(1)}g{" "}
                        </span>
                        <span className={styles.meals__item__nutrients__fat}>
                          {t("fat")}: {hint.food.nutrients.FAT.toFixed(1)}g{" "}
                        </span>
                        <span className={styles.meals__item__nutrients__carbs}>
                          {t("carbs")}: {hint.food.nutrients.CHOCDF.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                    {/* <div>
                      <Button
                        variant="almostGreen"
                        rightIcon={iconFile.addIcon}
                      >
                        {t('add')}
                      </Button>
                    </div> */}
                  </div>
                ))}
              <Button variant="primary" onClick={fetchNextPage}>
                {t("showMoreMeals")}
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
            <h2 className={styles.modalHeader}>{t("findMeal")}</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder={t("searchMeal")}
              className={styles.modalInput}
            />
            <div className={styles.filterButton}>
              <Button variant="filter" onClick={handleFilterSubmit}>
                {t("search")}
              </Button>{" "}
            </div>
          </Modal>
        </section>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Meals;
