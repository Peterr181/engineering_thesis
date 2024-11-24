import React, { useState, useEffect } from "react";
import LineChartObject from "../LineChart/LineChartObject";
import styles from "./WorkoutStatistics.module.scss";
import { useWorkouts } from "../../../hooks/useWorkout";
import { useLanguage } from "../../../context/LanguageProvider";

interface WorkoutStatisticsProps {
  userId?: string;
}

const WorkoutStatistics: React.FC<WorkoutStatisticsProps> = ({ userId }) => {
  const [currentMode, setCurrentMode] = useState<
    "day" | "week" | "month" | "year"
  >("week");
  const { t } = useLanguage();
  const {
    workouts,
    weeklyWorkouts,
    fetchDailyWorkouts,
    fetchWeeklyWorkouts,
    fetchMonthlyWorkouts,
    fetchYearlyWorkouts,
  } = useWorkouts(userId);

  useEffect(() => {
    switch (currentMode) {
      case "day":
        fetchDailyWorkouts();
        break;
      case "week":
        fetchWeeklyWorkouts();
        break;
      case "month":
        fetchMonthlyWorkouts();
        break;
      case "year":
        fetchYearlyWorkouts();
        break;
      default:
        fetchWeeklyWorkouts();
    }
  }, [currentMode, userId]);

  const handleModeChange = (newMode: "day" | "week" | "month" | "year") => {
    setCurrentMode(newMode);
  };

  const formatChartData = () => {
    let dataToFormat = workouts;

    if (currentMode === "week") {
      dataToFormat = weeklyWorkouts.length ? weeklyWorkouts : [];
    }

    switch (currentMode) {
      case "day": {
        const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        return hours.map((hour) => {
          const workoutForHour = dataToFormat.find((workout) => {
            const workoutDate = new Date(workout.created_at);
            return workoutDate.getHours() === parseInt(hour.split(":")[0]);
          });
          return {
            day: hour,
            minutes: workoutForHour ? workoutForHour.minutes : 0,
          };
        });
      }
      case "week": {
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const chartData = daysOfWeek.map((day) => ({ day, minutes: 0 }));

        dataToFormat.forEach((workout) => {
          if (workout.dayName) {
            const formattedDayName = workout.dayName.substring(0, 3);
            const dayIndex = daysOfWeek.indexOf(formattedDayName);
            if (dayIndex !== -1) {
              chartData[dayIndex].minutes += workout.minutes;
            }
          }
        });

        return chartData;
      }
      case "month": {
        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
        return days.map((day) => {
          const totalMinutes = dataToFormat
            .filter(
              (workout) =>
                new Date(workout.created_at).getDate() === parseInt(day)
            )
            .reduce((sum, workout) => sum + workout.minutes, 0);
          return {
            day,
            minutes: totalMinutes,
          };
        });
      }
      case "year": {
        const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
        return months.map((month, index) => {
          const totalMinutes = dataToFormat
            .filter(
              (workout) => new Date(workout.created_at).getMonth() === index
            )
            .reduce((sum, workout) => sum + workout.minutes, 0);
          return {
            day: month,
            minutes: totalMinutes,
          };
        });
      }
      default:
        return workouts.map((workout) => ({
          day: workout.dayName || "",
          minutes: workout.minutes,
        }));
    }
  };
  return (
    <div className={styles.workoutStatistics}>
      <div className={styles.header}>
        <h2>{t("workoutStatistics.title")}</h2>
        <div className={styles.buttons}>
          <button onClick={() => handleModeChange("day")}>
            {t("workoutStatistics.daily")}
          </button>
          <button onClick={() => handleModeChange("week")}>
            {t("workoutStatistics.weekly")}
          </button>
          <button onClick={() => handleModeChange("month")}>
            {t("workoutStatistics.monthly")}
          </button>
          <button onClick={() => handleModeChange("year")}>
            {t("workoutStatistics.yearly")}
          </button>
        </div>
      </div>
      <LineChartObject data={formatChartData()} />
    </div>
  );
};

export default WorkoutStatistics;
