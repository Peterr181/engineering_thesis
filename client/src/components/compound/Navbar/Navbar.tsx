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

const Navbar: React.FC = () => {
  const { t, changeLanguage, language } = useLanguage();
  const { fetchWorkouts, workouts } = useWorkouts();
  const [auth, userProfile] = useAuth();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/auth/logout")
      .then(() => {
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
          {auth && !workouts && (
            <>
              <Text textStyle="lg">{t("navbar.setWorkoutPlan")}</Text>

              <Link to="/creatingworkout">
                <Button variant="primaryOutline">
                  <Text textStyle="md">{t("navbar.setWorkoutButton")}</Text>
                </Button>
              </Link>
            </>
          )}
          {auth && workouts && (
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

        {auth ? (
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
              <div className={styles.navbar__right__profile__data}>
                <Text textStyle="lg">{userProfile?.username}</Text>
                {/* <Text textStyle="md" boldness={500}>
                  {t("navbar.userRole")}
                </Text> */}
              </div>
              <div
                className={styles.dropdownArrow}
                onClick={handleDropdownToggle}
              >
                {iconFile.arrowDown}
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Button variant="logout" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
              {/* <button onClick={handleLogout}>logout</button> */}
            </div>
          </div>
        ) : (
          <div className={styles.navbar__right}>
            <Link to="/login">
              <Button variant="filter">
                <p>Sign In</p>
              </Button>
            </Link>
          </div>
        )}
      </section>
    </nav>
  );
};

export default Navbar;
