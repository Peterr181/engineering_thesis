import React from "react";
import styles from "./Home.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (
    <div className={styles.home}>
      <Sidebar />
      <div className={styles.home__container}>
        <Navbar />
        <div className={styles.home__widgets}>Widgets</div>
      </div>
    </div>
  );
};

export default Home;
