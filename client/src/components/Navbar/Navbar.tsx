// Navbar.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.scss";
import { iconFile } from "../../assets/iconFile";
import humanFace from "../../assets/images/personDefault.jpg";
import Button from "../Button/Button";
import { useLanguage } from "../../context/LanguageProvider";

const Navbar = () => {
  const { t, changeLanguage, language } = useLanguage();

  // const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  // const toggleLanguage = () => {
  //   const newLanguage = currentLanguage === "en" ? "pl" : "en";
  //   i18n.changeLanguage(newLanguage);
  //   setCurrentLanguage(newLanguage);
  // };
  return (
    <nav className={styles.navbar__wrapper}>
      <section className={styles.navbar}>
        <div className={styles.navbar__left}>
          <p>{t("navbar.setWorkoutPlan")}</p>
          <Button variant="primaryOutline">
            {t("navbar.setWorkoutButton")}
          </Button>
        </div>
        <div className={styles.navbar__right}>
          <div className={styles.navbar__right__icons}>
            <span>{iconFile.moonIcon}</span>
            <span>{iconFile.notifyIcon}</span>
            <span>{iconFile.chatIcon}</span>
            <span>{iconFile.giftIcon}</span>
            <span
              onClick={() => changeLanguage(language === "en" ? "pl" : "en")}
            >
              {iconFile.languageIcon}
            </span>
          </div>
          <div className={styles.navbar__right__profile}>
            <div>
              <img src={humanFace} alt={t("navbar.humanFaceAlt")} />
            </div>
            <div>
              <p>{t("navbar.userName")}</p>
              <span>{t("navbar.userRole")}</span>
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
