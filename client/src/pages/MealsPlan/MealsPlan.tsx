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
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLanguage } from "../../context/LanguageProvider";

interface Food {
  foodId: string;
  label: string;
  nutrients: {
    ENERC_KCAL: number;
    PROCNT: number;
    CHOCDF: number;
    FAT: number;
  };
  image: string;
}

interface Hint {
  food: Food;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  grams: number;
  type: string;
  image?: string;
}

interface ArchivedMeal extends Meal {
  date_added: string;
}
const MealsPlan = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
    supper: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [isMealAdded, setIsMealAdded] = useState(false);
  const [grams, setGrams] = useState(100);
  const [showAlert, setShowAlert] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [archivedMeals, setArchivedMeals] = useState<ArchivedMeal[]>([]);
  const [selectedDateMeals, setSelectedDateMeals] = useState<ArchivedMeal[]>(
    []
  );
  const [isViewingArchived, setIsViewingArchived] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const {
    meals,
    fetchMeals,
    mealSummaryData,
    addMeal,
    deleteMeal,
    fetchArchivedMeals,
  } = useMeals();

  useEffect(() => {
    fetchMeals();
  }, [isMealAdded]);

  useEffect(() => {
    fetchAllArchivedMeals();
  }, []);

  const fetchAllArchivedMeals = async () => {
    try {
      const meals = await fetchArchivedMeals();
      setArchivedMeals(meals); // Ensure this sets the correct state

      // Extract unique dates from `date_added` and format them to "YYYY-MM-DD"
      const dates: string[] = Array.from(
        new Set(
          meals.map((meal: ArchivedMeal) =>
            dayjs(meal.date_added).format("YYYY-MM-DD")
          )
        )
      );

      // Filter dates to only include those before the current date
      const filteredDates = dates.filter((date: string) =>
        dayjs(date).isBefore(dayjs(), "day")
      );

      setUniqueDates(filteredDates as string[]);
    } catch (error) {
      console.error("Error fetching archived meals:", error);
    }
  };

  const handleShowArchivedDialog = () => {
    setIsArchiveDialogOpen(true);
  };

  const handleCloseArchivedDialog = () => {
    setIsArchiveDialogOpen(false);
    // Clear selected meals when dialog closes
  };

  const handleShowMealsForDate = (date: string) => {
    const mealsForDate = archivedMeals.filter(
      (meal: ArchivedMeal) =>
        dayjs(meal.date_added).format("YYYY-MM-DD") === date
    );
    setSelectedDateMeals(mealsForDate);
    setSelectedDate(date);
    setIsViewingArchived(true);
    handleCloseArchivedDialog();
  };

  const handleShowTodayMeals = () => {
    setSelectedDateMeals([]);
    setSelectedDate(null);
    setIsViewingArchived(false);
  };

  const toggleSection = (section: keyof typeof openSections) => {
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
    setGrams(100);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenSummaryDialog = () => {
    setIsSummaryDialogOpen(true);
  };

  const handleCloseSummaryDialog = () => {
    setIsSummaryDialogOpen(false);
  };

  const handleGramsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrams(parseFloat(event.target.value));
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
      const fetchedMeals: Meal[] = response.data.hints.map((hint: Hint) => ({
        id: hint.food.foodId,
        name: hint.food.label,
        calories: hint.food.nutrients.ENERC_KCAL || 0,
        protein: hint.food.nutrients.PROCNT || 0,
        carbs: hint.food.nutrients.CHOCDF || 0,
        fats: hint.food.nutrients.FAT || 0,
        image: hint.food.image,
      }));
      setSearchResults(fetchedMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const handleAddMeal = (meal: Meal) => {
    if (selectedMealType) {
      const adjustedMeal: Meal = {
        ...meal,
        calories: (meal.calories * grams) / 100,
        protein: (meal.protein * grams) / 100,
        carbs: (meal.carbs * grams) / 100,
        fats: (meal.fats * grams) / 100,
        grams: grams,
        type: selectedMealType,
      };

      addMeal(adjustedMeal);
      setIsMealAdded(true);
      setShowAlert(true);
      handleCloseDialog();
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const calculateTotals = (mealType: string, mealsToCalculate: Meal[]) => {
    const mealTypeMeals = mealsToCalculate.filter(
      (meal) => meal.type === mealType
    );

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

  const handleOpenDeleteDialog = (mealId: string) => {
    setMealToDelete(mealId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteMeal = async () => {
    if (mealToDelete) {
      try {
        await deleteMeal(mealToDelete);
        setIsMealAdded(true);
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMealToDelete(null);
  };

  return (
    <PlatformWrapper>
      <div className={styles.mealsPlanWrapper}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.mealsPlan}>
              <div className={styles.mealsPlanInitial}>
                <div>
                  <h2>
                    {t("mealsPlan.yourPersonalMealsPlan")}
                    {selectedDate && (
                      <span className={styles.selectedDate}>
                        {" "}
                        - {selectedDate}
                      </span>
                    )}
                  </h2>

                  <Dialog
                    open={isArchiveDialogOpen}
                    onClose={handleCloseArchivedDialog}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle align="center">
                      {t("mealsPlan.archivedMeals")}
                    </DialogTitle>
                    <DialogContent>
                      <div className={styles.mealsPlanButtons}>
                        {uniqueDates.length > 0 ? (
                          uniqueDates.map((date) => (
                            <Button
                              key={date}
                              variant="outlined"
                              onClick={() => handleShowMealsForDate(date)}
                            >
                              {date}
                            </Button>
                          ))
                        ) : (
                          <div className={styles.emptyMessage}>
                            <p>{t("mealsPlan.noArchivedDays")}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleCloseArchivedDialog}
                        color="primary"
                      >
                        {t("mealsPlan.cancel")}
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <p>{t("mealsPlan.personalMealsPlanDescription")}</p>
                </div>
                <div className={styles.mealsPlanButtons}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleOpenSummaryDialog}
                  >
                    {t("mealsPlan.daySummary")}
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleShowArchivedDialog}
                  >
                    {t("mealsPlan.archivedMeals")}
                  </Button>
                  {isViewingArchived && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleShowTodayMeals}
                    >
                      {t("mealsPlan.today")}
                    </Button>
                  )}
                </div>
              </div>
              <div className={styles.summaryDialog}>
                <Dialog
                  open={isSummaryDialogOpen}
                  onClose={handleCloseSummaryDialog}
                  fullWidth={true}
                  maxWidth="sm"
                >
                  <DialogTitle align="center" fontWeight={500}>
                    {t("mealsPlan.daySummaryTitle")}
                  </DialogTitle>
                  <DialogContent>
                    {mealSummaryData ? (
                      <div className={styles.mealCalories}>
                        <div className={styles.mealCalories__total}>
                          <span className={styles.mealCalories__calories}>
                            {Math.round(mealSummaryData.totalCalories)}{" "}
                            {t("mealsPlan.kcal")}
                          </span>
                          <span className={styles.mealCalories__protein}>
                            {Math.round(mealSummaryData.totalProtein)}g{" "}
                            {t("mealsPlan.protein")}
                          </span>
                          <span className={styles.mealCalories__carbs}>
                            {Math.round(mealSummaryData.totalCarbs)}g{" "}
                            {t("mealsPlan.carbs")}
                          </span>
                          <span className={styles.mealCalories__fats}>
                            {Math.round(mealSummaryData.totalFats)}g{" "}
                            {t("mealsPlan.fats")}
                          </span>
                        </div>
                      </div>
                    ) : meals.length > 0 ? (
                      <p>Loading...</p>
                    ) : (
                      <p className={styles.emptyMessage}>
                        {t("mealsPlan.addSomeMeals")}
                      </p>
                    )}
                  </DialogContent>
                  <div className={styles.dialogClose}>
                    <DialogActions>
                      <Button onClick={handleCloseSummaryDialog}>
                        {iconFile.iconClose}
                      </Button>
                    </DialogActions>
                  </div>
                </Dialog>
              </div>
              {["breakfast", "lunch", "dinner", "snacks", "supper"].map(
                (section: string) => {
                  const sectionMeals = isViewingArchived
                    ? selectedDateMeals.filter((meal) => meal.type === section)
                    : meals.filter((meal) => meal.type === section);
                  const totals = calculateTotals(
                    section,
                    sectionMeals as Meal[]
                  );

                  return (
                    <div key={section} className={styles.mealSection}>
                      <div className={styles.sectionHeader}>
                        <div
                          className={styles.mealHeader}
                          onClick={() => toggleSection(section)}
                        >
                          <h3>{t(`mealsPlan.${section}`)}</h3>
                          {sectionMeals.length > 0 && (
                            <span className={styles.arrowIcon}>
                              {openSections[section]
                                ? iconFile.arrowRight
                                : iconFile.arrowDown}
                            </span>
                          )}
                          <div className={styles.addMealMobile}>
                            {!isViewingArchived &&
                              sectionMeals.length === 0 && (
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    handleOpenDialog(section);
                                    setIsMealAdded(false);
                                  }}
                                >
                                  {t("mealsPlan.addMeal")}
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.mealCalories}>
                        <span className={styles.mealCalories__calories}>
                          {totals.totalCalories} {t("mealsPlan.kcal")}
                        </span>
                        <span className={styles.mealCalories__protein}>
                          {totals.totalProtein}g {t("mealsPlan.protein")}
                        </span>
                        <span className={styles.mealCalories__carbs}>
                          {totals.totalCarbs}g {t("mealsPlan.carbs")}
                        </span>
                        <span className={styles.mealCalories__fats}>
                          {totals.totalFats}g {t("mealsPlan.fats")}
                        </span>
                      </div>
                      {!isViewingArchived && sectionMeals.length === 0 && (
                        <div className={styles.addMealMobile1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              handleOpenDialog(section);
                              setIsMealAdded(false);
                            }}
                          >
                            {t("mealsPlan.addMeal")}
                          </Button>
                        </div>
                      )}
                      {sectionMeals.length > 0 ? (
                        <ul
                          className={`${styles.mealList} ${
                            openSections[section] ? styles.show : ""
                          }`}
                        >
                          {sectionMeals.map((meal, index) => (
                            <li key={index} className={styles.mealItem}>
                              <div className={styles.mealItem__header}>
                                <div>
                                  <h3>{meal.name}</h3>
                                  <p>{meal.grams}g</p>
                                </div>
                                {!isViewingArchived && (
                                  <span
                                    onClick={() =>
                                      handleOpenDeleteDialog(meal.id ?? "")
                                    }
                                  >
                                    {iconFile.circleMinus}
                                  </span>
                                )}
                              </div>
                              <div className={styles.totalsSummary}>
                                <span>
                                  {Math.round(meal.calories)}{" "}
                                  {t("mealsPlan.kcal")}
                                </span>
                                <span>
                                  {t("mealsPlan.protein")}:{" "}
                                  {Math.round(meal.protein)}g
                                </span>
                                <span>
                                  {t("mealsPlan.carbs")}:{" "}
                                  {Math.round(meal.carbs)}g
                                </span>
                                <span>
                                  {t("mealsPlan.fats")}: {Math.round(meal.fats)}
                                  g
                                </span>
                              </div>
                            </li>
                          ))}
                          {!isViewingArchived && (
                            <div className={styles.addButton}>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  handleOpenDialog(section);
                                  setIsMealAdded(false);
                                }}
                              >
                                {t("mealsPlan.addMeal")}
                              </Button>
                            </div>
                          )}
                        </ul>
                      ) : null}
                    </div>
                  );
                }
              )}
            </div>
            <div className={styles.dialogContainer}>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth={true}
                maxWidth="sm"
              >
                <DialogTitle align="center" fontWeight={500}>
                  {t("mealsPlan.searchForMeal")}
                </DialogTitle>
                <DialogContent>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder={t("mealsPlan.searchForMealPlaceholder")}
                    className={styles.searchInput}
                  />
                  <div className={styles.gramsInput}>
                    <input
                      type="number"
                      value={grams}
                      onChange={handleGramsChange}
                      placeholder={t("mealsPlan.enterGrams")}
                      className={styles.searchInput}
                    />
                  </div>
                  <div className={styles.buttonSearch}>
                    <ButtonMy variant="filter" onClick={handleSearch}>
                      {t("mealsPlan.search")}
                    </ButtonMy>
                  </div>
                  <ul className={styles.searchResults}>
                    {searchResults.map((meal, index) => (
                      <li key={index} className={styles.mealItem}>
                        <div>
                          <h3>{meal.name}</h3>
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className={styles.mealImage}
                          />
                          <div className={styles.mealCalories2}>
                            <span className={styles.mealCalories__calories}>
                              {Math.round((meal.calories * grams) / 100)}{" "}
                              {t("mealsPlan.kcal")}
                            </span>
                            <span className={styles.mealCalories__protein}>
                              {t("mealsPlan.protein")}:{" "}
                              {Math.round((meal.protein * grams) / 100)}g
                            </span>
                            <span className={styles.mealCalories__carbs}>
                              {t("mealsPlan.carbs")}:{" "}
                              {Math.round((meal.carbs * grams) / 100)}g
                            </span>
                            <span className={styles.mealCalories__fats}>
                              {t("mealsPlan.fats")}:{" "}
                              {Math.round((meal.fats * grams) / 100)}g
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="contained"
                          onClick={() => handleAddMeal(meal)}
                        >
                          {t("mealsPlan.addMeal")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
                <div className={styles.dialogClose}>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>
                      {iconFile.iconClose}
                    </Button>
                  </DialogActions>
                </div>
              </Dialog>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onClose={handleCancelDelete}
              fullWidth={true}
            >
              <DialogTitle align="center" fontWeight={500}>
                {t("mealsPlan.areYouSureDeleteMeal")}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleConfirmDeleteMeal} color="error">
                  {t("mealsPlan.yesDelete")}
                </Button>
                <Button onClick={handleCancelDelete}>
                  {t("mealsPlan.cancel")}
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              open={showAlert}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              onClose={() => setShowAlert(false)}
            >
              <Alert onClose={() => setShowAlert(false)} severity="success">
                {t("mealsPlan.mealAddedSuccessfully")}
              </Alert>
            </Snackbar>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </div>
    </PlatformWrapper>
  );
};

export default MealsPlan;
