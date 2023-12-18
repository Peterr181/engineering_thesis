import React from "react";
import styles from "./Navbar.module.scss";
import { iconFile } from "../../assets/iconFile";
import humanFace from "../../assets/images/personDefault.jpg";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__left}></div>
      <div className={styles.navbar__right}>
        <div className={styles.navbar__right__input}>
          {iconFile.searchIcon}
          <input type="text" placeholder="Search something..." />
        </div>
        <div className={styles.navbar__right__icons}>
          <span>{iconFile.moonIcon}</span>
          <span>{iconFile.notifyIcon}</span>
          <span>{iconFile.chatIcon}</span>
          <span>{iconFile.giftIcon}</span>
        </div>
        <div className={styles.navbar__right__profile}>
          <div>
            <img src={humanFace} alt="Human face" />
          </div>
          <div>
            <p>Peter Morgan</p>
            <span>Member</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
