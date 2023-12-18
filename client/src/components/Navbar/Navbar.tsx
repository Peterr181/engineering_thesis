import React from "react";
import styles from "./Navbar.module.scss";
import { iconFile } from "../../assets/iconFile";
import humanFace from "../../assets/images/personDefault.jpg";
import Button from "../Button/Button";

const Navbar = () => {
  return (
    <nav className={styles.navbar__wrapper}>
      <section className={styles.navbar}>
        <div className={styles.navbar__left}>
          <p>Set your gym workout plan</p>
          <Button variant="primaryOutline">Set workout plan</Button>
        </div>
        <div className={styles.navbar__right}>
          {/* <div className={styles.navbar__right__input}>
          {iconFile.searchIcon}
          <input type="text" placeholder="Search something..." />
        </div> */}
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
      </section>
    </nav>
  );
};

export default Navbar;
