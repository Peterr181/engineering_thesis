import { useState } from "react";
import styles from "./MealsPlan.module.scss";
import { iconFile } from "../../assets/iconFile";
import { useLanguage } from "../../context/LanguageProvider";

interface Meal {
  id?: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  grams: number;
}

interface UserMealsPlanProps {
  meals: Meal[];
}

const UserMealsPlan = ({ meals }: UserMealsPlanProps) => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
    supper: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
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

  return (
    <div className={styles.mealsPlanWrapper}>
      <div className={styles.mealsPlan}>
        <div className={styles.mealSections}>
          {["breakfast", "lunch", "dinner", "snacks", "supper"].map(
            (section) => {
              const totals = calculateTotals(section);

              return (
                <div key={section} className={styles.mealSection}>
                  <div className={styles.sectionHeader}>
                    <h3
                      className={styles.mealHeader}
                      onClick={() => toggleSection(section)}
                    >
                      {t(`mealsPlan.${section}`)}
                    </h3>
                    <span className={styles.sectionToggle}>
                      {openSections[section]
                        ? iconFile.arrowRight
                        : iconFile.arrowDown}
                    </span>
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

                  {meals.filter((meal) => meal.type === section).length > 0 ? (
                    <ul
                      className={`${styles.mealList} ${
                        openSections[section] ? styles.show : ""
                      }`}
                    >
                      {meals
                        .filter((meal) => meal.type === section)
                        .map((meal, index) => (
                          <li key={index} className={styles.mealItem2}>
                            <div className={styles.mealItem2__header}>
                              <div>
                                <h3>{meal.name}</h3>
                                <p>{meal.grams}g</p>
                              </div>
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
                                {t("mealsPlan.carbs")}: {Math.round(meal.carbs)}
                                g
                              </span>
                              <span>
                                {t("mealsPlan.fats")}: {Math.round(meal.fats)}g
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMealsPlan;
