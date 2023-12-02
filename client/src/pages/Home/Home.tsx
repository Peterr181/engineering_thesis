import React from "react";
import styles from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";

const Home = () => {
  return (
    <div className={styles.home}>
      <Sidebar />
      <div className={styles.home__container}>
        <div className={styles.home__feed}>Feed</div>
        <div className={styles.home__widgets}>Widgets</div>
      </div>
    </div>
  );
};

export default Home;
