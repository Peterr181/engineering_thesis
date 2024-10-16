import React, { useEffect } from "react";
import styles from "./MealsSummary.module.scss";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import { useMeals } from "../../../hooks/useMeals";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const MealsSummary = () => {
  const { fetchMeals, mealSummaryData } = useMeals();

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className={styles.mealssummary}>
      <WhiteCardWrapper>
        <MaxWidthWrapper>
          <div className={styles.mealsPlanInitial}>
            <div>
              <h2>Calories summary</h2>
              <p>Check your total daily calories</p>
            </div>
            <Link to="/mealsplan">
              <div>
                <Button variant="contained" color="info">
                  MEALS PLAN
                </Button>
              </div>
            </Link>
          </div>
          {mealSummaryData ? ( // Use mealSummaryData directly
            <div className={styles.mealCalories}>
              <div className={styles.mealCalories__total}>
                <span className={styles.mealCalories__calories}>
                  {Math.round(mealSummaryData.totalCalories)} kcal
                </span>
                <span className={styles.mealCalories__protein}>
                  {Math.round(mealSummaryData.totalProtein)}g Protein
                </span>
                <span className={styles.mealCalories__carbs}>
                  {Math.round(mealSummaryData.totalCarbs)}g Carbs
                </span>
                <span className={styles.mealCalories__fats}>
                  {Math.round(mealSummaryData.totalFats)}g Fats
                </span>
              </div>
            </div>
          ) : (
            <p>Loading...</p> // Display a loading message if data is not yet available
          )}
        </MaxWidthWrapper>
      </WhiteCardWrapper>
    </div>
  );
};

export default MealsSummary;
