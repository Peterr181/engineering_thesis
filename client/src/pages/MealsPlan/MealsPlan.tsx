import React, { useEffect, useState } from "react";
import styles from "./MealsPlan.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonMy from "../../components/atomic/Button/Button";
import { iconFile } from "../../assets/iconFile";
import { useMeals } from "../../hooks/useMeals";
import axios from "axios";
import IconButton from "@mui/material/IconButton";

const MealsPlan = () => {
  const [openSections, setOpenSections] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
    supper: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMealAdded, setIsMealAdded] = useState(false);

  const { meals, fetchMeals, addMeal, deleteMeal, error, loading } = useMeals();
  console.log(isMealAdded, "posilek dodany");
  useEffect(() => {
    fetchMeals();
  }, [isMealAdded]);

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleOpenDialog = (mealType: string) => {
    setSelectedMealType(mealType);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    try {
      const response = await axios.get(
        `https://api.edamam.com/api/food-database/v2/parser`,
        {
          params: {
            app_id: import.meta.env.VITE_REACT_APP_MEALS_API_ID,
            app_key: import.meta.env.VITE_REACT_APP_MEALS_API_KEY,
            ingr: searchQuery,
          },
        }
      );
      const fetchedMeals = response.data.hints.map((hint: any) => ({
        name: hint.food.label,
        calories: hint.food.nutrients.ENERC_KCAL || 0,
        protein: hint.food.nutrients.PROCNT || 0,
        carbs: hint.food.nutrients.CHOCDF || 0,
        fats: hint.food.nutrients.FAT || 0,
      }));
      setSearchResults(fetchedMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const handleAddMeal = (meal: Meal) => {
    if (selectedMealType) {
      addMeal({
        ...meal,
        type: selectedMealType,
      });
      setIsMealAdded(true);
      handleCloseDialog();
    }
  };

  const calculateTotals = (mealType: string) => {
    const mealTypeMeals = meals.filter((meal) => meal.type === mealType);

    const totalCalories = Math.round(
      mealTypeMeals.reduce((total, meal) => total + meal.calories, 0)
    );
    const totalProtein = Math.round(
      mealTypeMeals.reduce((total, meal) => total + meal.protein, 0)
    );
    const totalCarbs = Math.round(
      mealTypeMeals.reduce((total, meal) => total + meal.carbs, 0)
    );
    const totalFats = Math.round(
      mealTypeMeals.reduce((total, meal) => total + meal.fats, 0)
    );

    return { totalCalories, totalProtein, totalCarbs, totalFats };
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId);
      setIsMealAdded(true);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <WhiteCardWrapper>
          <div className={styles.mealsPlan}>
            <h2>Your personal meals plan</h2>
            <p>
              Here you can find your personal meals plan. It is generated based
              on your preferences and goals.
            </p>

            {["breakfast", "lunch", "dinner", "snacks", "supper"].map(
              (section) => {
                const totals = calculateTotals(section);
                return (
                  <div key={section} className={styles.mealSection}>
                    <div className={styles.sectionHeader}>
                      <div
                        className={styles.mealHeader}
                        onClick={() => toggleSection(section)}
                      >
                        <h3>
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </h3>

                        {meals.filter((meal) => meal.type === section).length >
                        0 ? (
                          iconFile.arrowDown
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              handleOpenDialog(section);
                              setIsMealAdded(false);
                            }}
                          >
                            Add Meal
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className={styles.totalsSummary}>
                      {totals.totalCalories} kcal, {totals.totalProtein}g
                      Protein, {totals.totalCarbs}g Carbs, {totals.totalFats}g
                      Fats
                    </div>

                    {meals.filter((meal) => meal.type === section).length >
                    0 ? (
                      <ul
                        className={`${styles.mealList} ${
                          openSections[section] ? styles.show : ""
                        }`}
                      >
                        {meals
                          .filter((meal) => meal.type === section)
                          .map((meal, index) => (
                            <li key={index} className={styles.mealItem}>
                              <div className={styles.mealItem__header}>
                                <h3>{meal.name}</h3>
                                <span onClick={() => handleDeleteMeal(meal.id)}>
                                  {iconFile.circleMinus}
                                </span>
                              </div>
                              <div className={styles.mealCalories}>
                                <span className={styles.mealCalories__calories}>
                                  {Math.round(meal.calories)} kcal
                                </span>
                                <span className={styles.mealCalories__protein}>
                                  Protein: {Math.round(meal.protein)}g
                                </span>
                                <span className={styles.mealCalories__carbs}>
                                  Carbs: {Math.round(meal.carbs)}g
                                </span>
                                <span className={styles.mealCalories__fats}>
                                  Fats: {Math.round(meal.fats)}g
                                </span>
                              </div>
                            </li>
                          ))}
                        <div className={styles.addButton}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              handleOpenDialog(section);
                              setIsMealAdded(false);
                            }}
                          >
                            Add Meal
                          </Button>
                        </div>
                      </ul>
                    ) : null}
                  </div>
                );
              }
            )}
          </div>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth={true}
          >
            <DialogTitle align="center" fontWeight={500}>
              Search for a meal that you want to add
            </DialogTitle>
            <DialogContent>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder="Search for a meal..."
                className={styles.searchInput}
              />
              <div className={styles.buttonSearch}>
                <ButtonMy variant="filter" onClick={handleSearch}>
                  Search
                </ButtonMy>
              </div>
              <ul className={styles.searchResults}>
                {searchResults.map((meal, index) => (
                  <li key={index} className={styles.mealItem}>
                    <div>
                      <h3>{meal.name}</h3>
                      <div className={styles.mealCalories}>
                        <span className={styles.mealCalories__calories}>
                          {Math.round(meal.calories)} kcal
                        </span>
                        <span className={styles.mealCalories__protein}>
                          Protein: {Math.round(meal.protein)}g
                        </span>
                        <span className={styles.mealCalories__carbs}>
                          Carbs: {Math.round(meal.carbs)}g
                        </span>
                        <span className={styles.mealCalories__fats}>
                          Fats: {Math.round(meal.fats)}g
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      onClick={() => handleAddMeal(meal)}
                    >
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </DialogContent>
            <div>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </div>
          </Dialog>
        </WhiteCardWrapper>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default MealsPlan;
