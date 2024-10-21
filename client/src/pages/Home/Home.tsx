import styles from "./Home.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import LineChartObject from "../../components/compound/LineChart/LineChartObject";
import { chartData } from "../../data/chartData";
import { iconFile } from "../../assets/iconFile";
import ActivityCard from "../../components/atomic/ActivityCard/ActivityCard";
import UpcomingWorkouts from "../../components/compound/UpcomingWorkouts/UpcomingWorkouts";
import { useLanguage } from "../../context/LanguageProvider";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MealsSummary from "../../components/compound/MealsSummary/MealsSummary";

const Home = () => {
  const { t } = useLanguage();
  return (
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
                number="5,565"
              />
              <ActivityCard
                icon={iconFile.iconWater}
                title="waterDrinked"
                number="2l"
              />
              <ActivityCard
                icon={iconFile.iconMeal}
                title="caloriesEaten"
                number="1800"
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
  );
};

export default Home;
