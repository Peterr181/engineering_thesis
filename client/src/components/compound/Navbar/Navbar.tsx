import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import { iconFile } from "../../../assets/iconFile";
import humanFace from "../../../assets/images/personDefault.jpg";
import Button from "../../atomic/Button/Button";
import { useLanguage } from "../../../context/LanguageProvider";
import Text from "../../atomic/Text/Text";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import { useWorkouts } from "../../../hooks/useWorkout";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";

const Navbar: React.FC = () => {
  const { t, changeLanguage, language } = useLanguage();
  const { fetchWorkouts, workouts } = useWorkouts();
  const userProfile = useAuth();

  const { hasPersonalData } = usePersonalInfo();

  useEffect(() => {
    fetchWorkouts(false);
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        location.reload();
      })
      .catch((err) => console.log(err));
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={styles.navbar__wrapper}>
      <section className={styles.navbar}>
        <div className={styles.navbar__left}>
          {!hasPersonalData && userProfile && (
            <>
              <Text textStyle="lg">
                Set your personal details to use platform correctly
              </Text>

              <Link to="/personaldetails">
                <Button variant="primaryOutlineRed">
                  <Text textStyle="md">Set Details</Text>
                </Button>
              </Link>
            </>
          )}
          {hasPersonalData && workouts && (
            <>
              <Text textStyle="lg">{t("navbar.workoutPlan")}</Text>
              <Link to="/workoutplan">
                <Button variant="primaryOutline">
                  <Text textStyle="md">{t("navbar.workoutPlanButton")}</Text>
                </Button>
              </Link>
            </>
          )}
        </div>

        {userProfile ? (
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
              <div
                onClick={handleDropdownToggle}
                className={styles.navbar__right__profile__userImage}
              >
                <img src={humanFace} alt={t("navbar.humanFaceAlt")} />
              </div>

              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownMenu__user}>
                    <div>
                      <img src={humanFace} alt={t("navbar.humanFaceAlt")} />
                    </div>
                    <div className={styles.navbar__right__profile__data}>
                      <Text textStyle="lg">{userProfile?.username}</Text>
                      <p className={styles.navbar__right__profile__data__level}>
                        {userProfile?.sportLevel === 1
                          ? "Beginner"
                          : userProfile?.sportLevel === 2
                          ? "Intermediate"
                          : "Advanced"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.dropdownMenu__elements}>
                    <Link to="/mealsplan">
                      <div className={styles.dropdownMenu__elements__element}>
                        {iconFile.dietIcon}
                        <p>{t("navbar.diet")}</p>
                      </div>
                    </Link>
                    <Link to="/workoutplan">
                      <div className={styles.dropdownMenu__elements__element}>
                        {iconFile.workoutPlan}
                        <p>{t("navbar.trainings")}</p>
                      </div>
                    </Link>
                    <Link to="/profile">
                      <div className={styles.dropdownMenu__elements__element}>
                        {iconFile.settingsIcon}
                        <p>{t("navbar.settings")}</p>
                      </div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className={styles.dropdownMenu__elements__element}
                    >
                      {iconFile.logoutIcon}
                      <p>{t("navbar.logout")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.navbar__right}>
            <Link to="/login">
              <Button variant="filter">
                <p>{t("navbar.signin")}</p>
              </Button>
            </Link>
          </div>
        )}
      </section>
    </nav>
  );
};

export default Navbar;
