import { useEffect } from "react";
import styles from "./MealsSummary.module.scss";
import { useMeals } from "../../../hooks/useMeals";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import { useLanguage } from "../../../context/LanguageProvider";

const MealsSummary = () => {
  const { fetchMeals, mealSummaryData } = useMeals();
  const { personalInfoData } = usePersonalInfo();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMeals();
  }, []);

  // Get the caloric intake goal
  const caloricIntakeGoal = parseInt(
    personalInfoData?.find((item) => item.label === "caloric_intake_goal")
      ?.value ?? "0",
    10
  );

  // Calculate the macronutrient goals based on caloric intake goal
  const proteinGoal = caloricIntakeGoal ? (caloricIntakeGoal * 0.3) / 4 : 0;
  const carbsGoal = caloricIntakeGoal ? (caloricIntakeGoal * 0.4) / 4 : 0;
  const fatsGoal = caloricIntakeGoal ? (caloricIntakeGoal * 0.3) / 9 : 0;

  return (
    <div className={`${styles.mealssummary} ${styles.responsive}`}>
      <WhiteCardWrapper>
        <div className={styles.mealsPlanInitial}>
          <div className={styles.mealsPlanInitial__text}>
            <h2>{t("caloriesSummary")}</h2>
            <p>{t("checkTotalDailyCalories")}</p>
          </div>
          <Link to="/mealsplan">
            <div className={styles.mealsBtn}>
              <Button variant="contained" color="info">
                {t("mealsPlanBtn")}
              </Button>
            </div>
          </Link>
        </div>

        {mealSummaryData ? (
          <div className={styles.mealCalories}>
            <div className={styles.mealCalories__total}>
              <div className={styles.mealCalories__column}>
                <div className={styles.mealCalories__item}>
                  <span className={styles.mealCalories__label}>
                    {t("kcal")}
                  </span>
                  <span className={styles.mealCalories__calories}>
                    {Math.round(mealSummaryData.totalCalories) || 0} /{" "}
                    {caloricIntakeGoal || 0}
                  </span>
                </div>

                <div className={styles.mealCalories__item}>
                  <span className={styles.mealCalories__label}>
                    {t("protein")}
                  </span>
                  <span className={styles.mealCalories__protein}>
                    {Math.round(mealSummaryData.totalProtein) || 0}g /{" "}
                    {Math.round(proteinGoal) || 0}g
                  </span>
                </div>
              </div>
              <div className={styles.mealCalories__column}>
                <div className={styles.mealCalories__item}>
                  <span className={styles.mealCalories__label}>
                    {t("carbs")}
                  </span>
                  <span className={styles.mealCalories__carbs}>
                    {Math.round(mealSummaryData.totalCarbs) || 0}g /{" "}
                    {Math.round(carbsGoal) || 0}g
                  </span>
                </div>

                <div className={styles.mealCalories__item}>
                  <span className={styles.mealCalories__label}>
                    {t("fats")}
                  </span>
                  <span className={styles.mealCalories__fats}>
                    {Math.round(mealSummaryData.totalFats) || 0}g /{" "}
                    {Math.round(fatsGoal) || 0}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>{t("pleaseSignInToSeeCaloriesSummary")}</p>
        )}
      </WhiteCardWrapper>
    </div>
  );
};

export default MealsSummary;
