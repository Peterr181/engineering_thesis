import React from "react";
import styles from "./Home.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import { ResponsiveLine } from "@nivo/line";

const Home = () => {
  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <div className={styles.home}>
          <div className={styles.home__container}>
            <h2>Week Activity</h2>
            <p>Your average activity time is 18 minutes.</p>
          </div>
        </div>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default Home;
