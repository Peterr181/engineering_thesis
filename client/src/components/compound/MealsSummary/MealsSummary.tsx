import { useEffect } from "react";
import styles from "./MealsSummary.module.scss";
import { useMeals } from "../../../hooks/useMeals";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";

const MealsSummary = () => {
  const { fetchMeals, mealSummaryData } = useMeals();
  const { personalInfoData } = usePersonalInfo();

  useEffect(() => {
    fetchMeals();
  }, []);

  const caloricIntakeGoal = parseInt(
    personalInfoData?.find((item) => item.label === "caloric_intake_goal")
      ?.value ?? "0",
    10
  );

  const proteinGoal = (caloricIntakeGoal * 0.3) / 4;
  const carbsGoal = (caloricIntakeGoal * 0.4) / 4;
  const fatsGoal = (caloricIntakeGoal * 0.3) / 9;

  return (
    <div className={styles.mealssummary}>
      <WhiteCardWrapper>
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

        {mealSummaryData ? (
          <div className={styles.mealCalories}>
            <div className={styles.mealCalories__total}>
              <div className={styles.mealCalories__item}>
                <span className={styles.mealCalories__label}>kcal</span>
                <span className={styles.mealCalories__calories}>
                  {Math.round(mealSummaryData.totalCalories)} /{" "}
                  {caloricIntakeGoal}
                </span>
              </div>

              <div className={styles.mealCalories__item}>
                <span className={styles.mealCalories__label}>Protein</span>
                <span className={styles.mealCalories__protein}>
                  {Math.round(mealSummaryData.totalProtein)}g /{" "}
                  {Math.round(proteinGoal)}g
                </span>
              </div>

              <div className={styles.mealCalories__item}>
                <span className={styles.mealCalories__label}>Carbs</span>
                <span className={styles.mealCalories__carbs}>
                  {Math.round(mealSummaryData.totalCarbs)}g /{" "}
                  {Math.round(carbsGoal)}g
                </span>
              </div>

              <div className={styles.mealCalories__item}>
                <span className={styles.mealCalories__label}>Fats</span>
                <span className={styles.mealCalories__fats}>
                  {Math.round(mealSummaryData.totalFats)}g /{" "}
                  {Math.round(fatsGoal)}g
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p>Please sign in to see calories summary</p>
        )}
      </WhiteCardWrapper>
    </div>
  );
};

export default MealsSummary;
