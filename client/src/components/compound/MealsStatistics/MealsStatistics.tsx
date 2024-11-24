import React, { useEffect, useState } from "react";
import styles from "./MealsStatistics.module.scss";
import { useMeals } from "../../../hooks/useMeals";
import StackedBarChart from "../PieChart/StackedBarChart";
import { useLanguage } from "../../../context/LanguageProvider";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const dailyGoals = {
  totalCalories: 3000,
  totalProtein: 225,
  totalCarbs: 400,
  totalFats: 100,
};

interface NutrientSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

const MealsStatistics = () => {
  const { fetchAllArchivedMeals, uniqueDates, fetchDailyNutrientSummary } =
    useMeals();
  const { t } = useLanguage();
  const [dailyNutrientSummary, setDailyNutrientSummary] = useState<{
    [key: string]: NutrientSummary;
  }>({});
  const [hoveredCalories, setHoveredCalories] = useState<number>(0);
  const [range, setRange] = useState<number>(14);

  useEffect(() => {
    fetchAllArchivedMeals();
  }, []);

  useEffect(() => {
    const fetchSummaries = async () => {
      const summaries: { [key: string]: NutrientSummary } = {};
      for (const date of uniqueDates) {
        const summary = await fetchDailyNutrientSummary(date);
        if (summary) {
          summaries[date] = summary;
        }
      }
      setDailyNutrientSummary(summaries);
    };

    if (uniqueDates.length > 0) {
      fetchSummaries();
    }
  }, [uniqueDates]);

  const getLastDays = (numDays: number) => {
    const dates = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const lastDays = getLastDays(range);

  const data = lastDays.map((date) => {
    const summary = dailyNutrientSummary[date] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
    };
    return {
      name: date,
      protein: Math.round(
        (summary.totalProtein / dailyGoals.totalProtein) * 100
      ),
      carbs: Math.round((summary.totalCarbs / dailyGoals.totalCarbs) * 100),
      fats: Math.round((summary.totalFats / dailyGoals.totalFats) * 100),
      calories: summary.totalCalories,
    };
  });

  const handleMouseOver = (data: {
    activePayload?: { payload: { calories: number } }[];
  }) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setHoveredCalories(data.activePayload[0].payload.calories);
    } else {
      setHoveredCalories(0);
    }
  };

  return (
    <div className={styles.mealsStatistics}>
      <div className={styles.mealsStatistics__header}>
        <div>
          <h2>{t("mealsStatistics.title")}</h2>
        </div>
        <div className={styles.selectRange}>
          <label htmlFor="rangeSelect" className={styles.rangeLabel}>
            {t("mealsStatistics.selectRange")}
          </label>
          <FormControl variant="outlined" className={styles.rangeSelect}>
            <InputLabel id="rangeSelect-label">
              {t("mealsStatistics.selectDays")}
            </InputLabel>
            <Select
              labelId="rangeSelect-label"
              id="rangeSelect"
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              label={t("mealsStatistics.selectDays")}
            >
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={21}>21</MenuItem>
              <MenuItem value={31}>31</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {data.length > 0 && (
        <>
          <StackedBarChart data={data} onMouseOver={handleMouseOver} />
          <div className={styles.calories}>
            {t("mealsStatistics.calories")}: {hoveredCalories}
          </div>
        </>
      )}
    </div>
  );
};

export default MealsStatistics;
