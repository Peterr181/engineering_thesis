import { useEffect, useState } from "react";
import styles from "./GoalsStatistics.module.scss";

import GoalsComparisonChart from "../GoalsComprasionChart/GoalsComprasionChart";
import { useLanguage } from "../../../context/LanguageProvider";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import useDailySettings from "../../../hooks/useDailySettings";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

const GoalsStatistics = () => {
  const { t, language } = useLanguage();
  const { fetchPersonalInfo, personalInfoData } = usePersonalInfo();
  const { fetchAllDailySettings, dailySettings = [] } = useDailySettings();
  const [view, setView] = useState("today");
  const [weekMetric, setWeekMetric] = useState("calories");

  useEffect(() => {
    fetchPersonalInfo();
    fetchAllDailySettings();
  }, []);

  useEffect(() => {
    // Trigger updateGoalsData when component mounts
    setView("today");
  }, [personalInfoData, dailySettings]);

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  const handleMetricChange = (event: SelectChangeEvent<string>) => {
    setWeekMetric(event.target.value as string);
  };

  const getCurrentMonthName = () => {
    const date = new Date();
    return date.toLocaleString("default", { month: "long" });
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
  };

  return (
    <div className={styles.goalsStatistics}>
      <div className={styles.goalsStatistics__header}>
        <div>
          <h2>{t("goalsStatistics.title")}</h2>
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.buttons}>
            <button onClick={() => handleViewChange("today")}>
              {t("goalsStatistics.today")}
            </button>
            <button onClick={() => handleViewChange("week")}>
              {t("goalsStatistics.week")}
            </button>
            <button onClick={() => handleViewChange("month")}>
              {t("goalsStatistics.month")}
            </button>
          </div>
          <div>
            {(view === "week" || view === "month") && (
              <Select
                onChange={handleMetricChange}
                value={weekMetric}
                sx={{
                  "& .MuiSelect-select": {
                    paddingRight: 1,
                    paddingLeft: 1,
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                  },
                }}
              >
                <MenuItem value="calories">
                  {t("goalsStatistics.calories")}
                </MenuItem>
                <MenuItem value="steps">{t("goalsStatistics.steps")}</MenuItem>
                <MenuItem value="water">{t("goalsStatistics.water")}</MenuItem>
                <MenuItem value="sleep">{t("goalsStatistics.sleep")}</MenuItem>
              </Select>
            )}
          </div>
        </div>
      </div>
      {dailySettings && (
        <GoalsComparisonChart
          personalInfoData={personalInfoData.map((info) => ({
            label: info.label,
            value: Number(info.value),
          }))}
          dailySettings={Array.isArray(dailySettings) ? dailySettings : []}
          view={view}
          weekMetric={weekMetric}
          language={language} // Pass language prop
          currentMonth={getCurrentMonth()} // Pass current month prop
        />
      )}
      {view === "month" && (
        <div className={styles.currentMonth}>{getCurrentMonthName()}</div>
      )}
    </div>
  );
};

export default GoalsStatistics;
