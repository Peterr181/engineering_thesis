import styles from "./Home.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import LineChartObject from "../../components/compound/LineChart/LineChartObject";

import { iconFile } from "../../assets/iconFile";
import ActivityCard from "../../components/atomic/ActivityCard/ActivityCard";
import UpcomingWorkouts from "../../components/compound/UpcomingWorkouts/UpcomingWorkouts";
import { LanguageProvider, useLanguage } from "../../context/LanguageProvider";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MealsSummary from "../../components/compound/MealsSummary/MealsSummary";
import { usePersonalInfo } from "../../hooks/usePersonalInfo";
import { useEffect } from "react";
import { useWorkouts } from "../../hooks/useWorkout";
import Streak from "../../components/compound/Streak/Streak";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useLanguage();
  const { personalInfoData } = usePersonalInfo();
  const { fetchWeeklyWorkouts, weeklyWorkouts } = useWorkouts();

  useEffect(() => {
    fetchWeeklyWorkouts();
  }, []);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = daysOfWeek.map((day) => ({ day, minutes: 0 }));

  weeklyWorkouts.forEach((workout) => {
    const workoutDayName = workout.dayName
      ? workout.dayName.substring(0, 3)
      : "";
    const dayIndex = daysOfWeek.indexOf(workoutDayName);
    if (dayIndex !== -1) {
      chartData[dayIndex].minutes += workout.minutes;
    }
  });

  const totalMinutes = weeklyWorkouts.reduce(
    (acc, workout) => acc + workout.minutes,
    0
  );
  const averageActivityTime =
    weeklyWorkouts.length > 0 ? totalMinutes / weeklyWorkouts.length : 0;

  const averageMinutes = Math.round(averageActivityTime % 60);
  const averageTimeString = t("home.averageTimeString", { averageMinutes });

  const getValueByLabel = (label: string) =>
    personalInfoData.find((info) => info.label === label)?.value || "0";

  return (
    <LanguageProvider>
      <PlatformWrapper>
        <MaxWidthWrapper>
          <div className={styles.home}>
            <div className={styles.home__responsiveWrapper}>
              <div className={styles.home__activitiesWrapper}>
                <WhiteCardWrapper additionalClass={styles.lineChartContainer}>
                  <div className={styles.activitiesHeader}>
                    <div>
                      <h2>{t(`home.weekActivity`)}</h2>
                      <p>{averageTimeString}</p>
                    </div>
                    <Link to="/statistics">
                      <div>
                        <Button variant="contained" color="info">
                          {t(`sidebar.statistics`)}
                        </Button>
                      </div>
                    </Link>
                  </div>
                  <LineChartObject data={chartData} />
                </WhiteCardWrapper>
                <div className={styles.home__activitesCardsContainer}>
                  <ActivityCard
                    icon={iconFile.iconSteps}
                    title="totalSteps"
                    number={getValueByLabel("steps_daily")}
                  />
                  <ActivityCard
                    icon={iconFile.iconWater}
                    title="waterDrinked"
                    number={`${getValueByLabel("water_drunk_daily")}l`}
                  />
                  <ActivityCard
                    icon={iconFile.iconMeal}
                    title="caloriesEaten"
                    number={getValueByLabel("caloric_intake_goal")}
                  />
                  <ActivityCard
                    icon={iconFile.progressIcon}
                    title="progress"
                    number="20%"
                  />
                </div>
              </div>
              <Streak />
              <MealsSummary />
              <UpcomingWorkouts />
            </div>
          </div>
        </MaxWidthWrapper>
      </PlatformWrapper>
    </LanguageProvider>
  );
};

export default Home;
