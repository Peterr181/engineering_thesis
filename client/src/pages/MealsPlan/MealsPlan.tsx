import React, { useState } from "react";
import styles from "./MealsPlan.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const MealsPlan = () => {
  // Dummy data for meals
  const [meals] = useState({
    breakfast: [
      { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fats: 3 },
      { name: "Boiled Eggs", calories: 140, protein: 12, carbs: 1, fats: 10 },
    ],
    lunch: [
      {
        name: "Grilled Chicken",
        calories: 300,
        protein: 30,
        carbs: 0,
        fats: 12,
      },
      { name: "Salad", calories: 100, protein: 3, carbs: 10, fats: 7 },
    ],
    dinner: [
      { name: "Steak", calories: 500, protein: 45, carbs: 0, fats: 35 },
      { name: "Sweet Potatoes", calories: 200, protein: 4, carbs: 45, fats: 0 },
    ],
    snacks: [
      { name: "Greek Yogurt", calories: 120, protein: 10, carbs: 12, fats: 5 },
      { name: "Almonds", calories: 250, protein: 8, carbs: 10, fats: 20 },
    ],
    supper: [
      { name: "Cottage Cheese", calories: 100, protein: 15, carbs: 5, fats: 4 },
    ],
  });

  const mealSections = ["breakfast", "lunch", "dinner", "snacks", "supper"];

  const [openSections, setOpenSections] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
    supper: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
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

            {mealSections.map((section) => (
              <div key={section} className={styles.mealSection}>
                <div
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section)}
                >
                  <div className={styles.mealHeader}>
                    <h3>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </h3>
                    <span className={styles.arrow}>
                      {openSections[section] ? "▼" : "►"}
                    </span>
                  </div>
                  {/* Nutrition Totals */}
                  <div className={styles.totals}>
                    <p>Calories: 22</p>
                    <p>Protein: 33g</p>
                    <p>Carbs: 44g</p>
                    <p>Fats: 55g</p>
                  </div>
                </div>

                <ul
                  className={`${styles.mealList} ${
                    openSections[section] ? styles.show : ""
                  }`}
                >
                  {meals[section].map((meal, index) => (
                    <li key={index} className={styles.mealItem}>
                      <div>
                        <h3>{meal.name}</h3>
                      </div>
                      <div className={styles.mealCalories}>
                        <span>{meal.calories} kcal</span>
                        <span>Protein: {meal.protein}g</span>
                        <span>Carbs: {meal.carbs}g</span>
                        <span>Fats: {meal.fats}g</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </WhiteCardWrapper>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default MealsPlan;
