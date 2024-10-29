import styles from "./Home.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import LineChartObject from "../../components/compound/LineChart/LineChartObject";
import { chartData } from "../../data/chartData";
import { iconFile } from "../../assets/iconFile";
import ActivityCard from "../../components/atomic/ActivityCard/ActivityCard";
import UpcomingWorkouts from "../../components/compound/UpcomingWorkouts/UpcomingWorkouts";
import { LanguageProvider, useLanguage } from "../../context/LanguageProvider";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MealsSummary from "../../components/compound/MealsSummary/MealsSummary";
import { usePersonalInfo } from "../../hooks/usePersonalInfo";

const Home = () => {
  const { t } = useLanguage();
  const { personalInfoData } = usePersonalInfo();

  const getValueByLabel = (label: string) =>
    personalInfoData.find((info) => info.label === label)?.value || "0";

  return (
    <LanguageProvider>
      <PlatformWrapper>
        <MaxWidthWrapper>
          <div className={styles.home}>
            <div className={styles.home__activitiesWrapper}>
              <WhiteCardWrapper additionalClass={styles.lineChartContainer}>
                <h2>{t(`home.weekActivity`)}</h2>
                <p>{t(`home.averageActivity`)}</p>
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
            <MealsSummary />
            <UpcomingWorkouts />
          </div>
        </MaxWidthWrapper>
      </PlatformWrapper>
    </LanguageProvider>
  );
};

export default Home;
