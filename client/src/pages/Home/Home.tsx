import React from "react";
import styles from "./Home.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import LineChartObject from "../../components/compound/LineChart/LineChartObject";
import { chartData } from "../../data/chartData";
import { iconFile } from "../../assets/iconFile";
import ActivityCard from "../../components/atomic/ActivityCard/ActivityCard";
const Home = () => {
  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <div className={styles.home}>
          <div className={styles.home__activitiesWrapper}>
            <div className={styles.home__weekactivityContainer}>
              <h2>Week Activity</h2>
              <p>Your average activity time is 18 minutes.</p>
              <LineChartObject data={chartData} />
            </div>
            <div className={styles.home__activitesCardsContainer}>
              <ActivityCard
                icon={iconFile.iconSteps}
                title="Total steps"
                number="5,565"
              />
              <ActivityCard
                icon={iconFile.iconWater}
                title="Water drinked"
                number="2l"
              />
              <ActivityCard
                icon={iconFile.iconMeal}
                title="Calories eaten"
                number="1800"
              />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Home;
