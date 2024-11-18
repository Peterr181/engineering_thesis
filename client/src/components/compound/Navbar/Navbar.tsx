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
import avatarImages from "../../../utils/avatarImages";
import useMessages from "../../../hooks/useMessages";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import englishFlag from "../../../assets/images/englishFlag.png";
import polishFlag from "../../../assets/images/polishFlag.png";

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { changeLanguage } = useLanguage();
  const { fetchWorkouts, workouts } = useWorkouts();
  const userProfile = useAuth();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const { unreadMessages, markAllMessagesAsRead, fetchUnreadMessages } =
    useMessages();

  const menuItems = [
    {
      id: "dashboard",
      icon: iconFile.dashboardIcon,
      text: t("sidebar.dashboard"),
      link: "/",
    },
    {
      id: "workouts",
      icon: iconFile.barbellIcon,
      text: t("sidebar.workouts"),
      link: "/workouts",
    },
    {
      id: "chats",
      icon: iconFile.onlineChat,
      text: t("sidebar.chats"),
      link: "/chatrooms",
    },
    {
      id: "meals",
      icon: iconFile.mealIcon,
      text: t("sidebar.diet"),
      link: "/meals",
    },
    {
      id: "workoutplan",
      icon: iconFile.workoutPlan,
      text: t("sidebar.workoutplan"),
      link: "/workoutplan",
    },

    {
      id: "finder",
      icon: iconFile.mapIcon,
      text: t("sidebar.finder"),
      link: "/finder",
    },
    // {
    //   id: "statistics",
    //   icon: iconFile.statisticsIcon,
    //   text: t("sidebar.statistics"),
    //   link: "/statistics",
    // },
    {
      id: "users",
      icon: iconFile.usersIcon,
      text: t("sidebar.users"),
      link: "/leaderboard",
    },
    // {
    //   id: "goals",
    //   icon: iconFile.goalsIcon,
    //   text: t("sidebar.goals"),
    //   link: "/goals",
    // },
  ];

  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  const { hasPersonalData } = usePersonalInfo();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [showLanguageChangeMessage, setShowLanguageChangeMessage] =
    useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleTheme = () => {
    const isDark =
      document.querySelector("body")?.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.querySelector("body")?.setAttribute("data-theme", "light");
      setIsDarkMode(false);
    } else {
      document.querySelector("body")?.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    fetchWorkouts(false);
  }, []);

  useEffect(() => {
    const unreadMessagesExist = unreadMessages.length > 0;
    setHasUnreadMessages(unreadMessagesExist);
  }, [unreadMessages]);

  const handleLogout = () => {
    axios
      .get(`${apiUrl}/auth/logout`)
      .then(() => {
        localStorage.removeItem("token");
        location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleNotifyIconClick = () => {
    setNotifyDropdownOpen(!notifyDropdownOpen);
    if (notifyDropdownOpen && hasUnreadMessages) {
      markAllMessagesAsRead();
      setHasUnreadMessages(false);
    }
  };

  const handleHamburgerToggle = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle("hamburger-menu-open", !isHamburgerOpen);
  };

  const handleLanguageIconClick = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLanguageSelect = (lang: string) => {
    changeLanguage(lang);
    setShowLanguageChangeMessage(true);
    setTimeout(() => {
      setShowLanguageChangeMessage(false);
    }, 2000);
    setLanguageDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar__wrapper}>
      <section>
        <MaxWidthWrapper>
          <div className={styles.navbar}>
            <div className={styles.navbar__left}>
              {!hasPersonalData && userProfile && (
                <>
                  <div className={styles.topText}>
                    <Text textStyle="lg">{t("navbar.setWorkoutPlan")}</Text>
                  </div>
                  <div className={styles.topText}>
                    <Link to="/personaldetails">
                      <Button variant="primaryOutlineRed">
                        <Text textStyle="md">
                          {t("navbar.setWorkoutButton")}
                        </Text>
                      </Button>
                    </Link>
                  </div>
                </>
              )}
              {hasPersonalData && workouts && (
                <>
                  <div className={styles.topText}>
                    <Text textStyle="lg">{t("navbar.workoutPlan")}</Text>
                  </div>
                  <Link to="/workoutplan">
                    <Button variant="primaryOutline">
                      <Text textStyle="md">
                        {t("navbar.workoutPlanButton")}
                      </Text>
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div
              className={styles.hamburgerIcon}
              onClick={handleHamburgerToggle}
            >
              {iconFile.hamburgerIcon}
            </div>
            <div className={styles.navbar__right}>
              {userProfile ? (
                <>
                  <div className={styles.navbar__right__icons}>
                    <span
                      onClick={toggleTheme}
                      className={styles.iconWithTransition}
                    >
                      {isDarkMode ? iconFile.moonIconFilled : iconFile.moonIcon}
                    </span>

                    {/* Notification Icon with Unread Message Indicator */}
                    <div
                      className={styles.notificationIconWrapper}
                      onClick={handleNotifyIconClick}
                    >
                      <span>{iconFile.notifyIcon}</span>
                      {hasUnreadMessages && (
                        <div className={styles.unreadIndicator}></div>
                      )}
                    </div>

                    <span onClick={handleLanguageIconClick}>
                      {iconFile.languageIcon}
                    </span>
                    {languageDropdownOpen && (
                      <div className={styles.languageDropdown}>
                        <div
                          className={styles.languageDropdown__item}
                          onClick={() => handleLanguageSelect("en")}
                        >
                          <p>ENG</p>
                          <img src={englishFlag} alt="English flag" />
                        </div>
                        <div
                          className={styles.languageDropdown__item}
                          onClick={() => handleLanguageSelect("pl")}
                        >
                          <p>PL</p>
                          <img src={polishFlag} alt="English flag" />
                        </div>
                      </div>
                    )}
                    {showLanguageChangeMessage && (
                      <div className={styles.languageChangeMessage}>
                        {t("navbar.languageChanged")}
                      </div>
                    )}
                  </div>
                  <div className={styles.navbar__right__profile}>
                    <div
                      onClick={handleDropdownToggle}
                      className={styles.navbar__right__profile__userImage}
                    >
                      <img
                        src={
                          avatarImages[
                            userProfile.avatar as keyof typeof avatarImages
                          ] || humanFace
                        }
                        alt={t("navbar.humanFaceAlt")}
                      />
                    </div>

                    {dropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.dropdownMenu__user}>
                          <div>
                            <img
                              src={
                                avatarImages[
                                  userProfile.avatar as keyof typeof avatarImages
                                ] || humanFace
                              }
                              alt={t("navbar.humanFaceAlt")}
                            />
                          </div>
                          <div className={styles.navbar__right__profile__data}>
                            <Text textStyle="lg">{userProfile?.username}</Text>
                            <p
                              className={
                                styles.navbar__right__profile__data__level
                              }
                            >
                              {userProfile?.sportLevel === 1
                                ? t("navbar.beginner")
                                : userProfile?.sportLevel === 2
                                ? t("navbar.intermediate")
                                : t("navbar.advanced")}
                            </p>
                          </div>
                        </div>

                        <div className={styles.dropdownMenu__elements}>
                          <Link to="/mealsplan">
                            <div
                              className={styles.dropdownMenu__elements__element}
                            >
                              {iconFile.dietIcon}
                              <p>{t("navbar.diet")}</p>
                            </div>
                          </Link>
                          <Link to="/workoutplan">
                            <div
                              className={styles.dropdownMenu__elements__element}
                            >
                              {iconFile.workoutPlan}
                              <p>{t("navbar.trainings")}</p>
                            </div>
                          </Link>
                          <Link to="/profile">
                            <div
                              className={styles.dropdownMenu__elements__element}
                            >
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
                </>
              ) : (
                <Link to="/login">
                  <Button variant="filter">
                    <p>{t("navbar.signin")}</p>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {isHamburgerOpen && (
        <div
          className={`${styles.hamburgerMenu} ${
            isHamburgerOpen ? styles.hamburgerMenuOpen : ""
          }`}
        >
          {/* Hamburger menu content */}
          {userProfile ? (
            <>
              <Link to="/">
                <div>
                  <p className={styles.logoDropdown}>Gymero</p>
                </div>
              </Link>
              <div className={styles.hamburgerMenu__profile}>
                <img
                  src={
                    avatarImages[
                      userProfile.avatar as keyof typeof avatarImages
                    ] || humanFace
                  }
                  alt={t("navbar.humanFaceAlt")}
                />
                <Text textStyle="lg">{userProfile?.username}</Text>
                <p className={styles.navbar__right__profile__data__level}>
                  {userProfile?.sportLevel === 1
                    ? t("navbar.beginner")
                    : userProfile?.sportLevel === 2
                    ? t("navbar.intermediate")
                    : t("navbar.advanced")}
                </p>
              </div>

              <div className={styles.hamburgerItems}>
                <Link to="/mealsplan">
                  <div className={styles.hamburgerMenu__element}>
                    {iconFile.dietIcon}
                    <p>{t("navbar.diet")}</p>
                  </div>
                </Link>
                <Link to="/workoutplan">
                  <div className={styles.hamburgerMenu__element}>
                    {iconFile.workoutPlan}
                    <p>{t("navbar.trainings")}</p>
                  </div>
                </Link>
                <Link to="/profile">
                  <div className={styles.hamburgerMenu__element}>
                    {iconFile.settingsIcon}
                    <p>{t("navbar.settings")}</p>
                  </div>
                </Link>

                {menuItems.map((item) => (
                  <Link key={item.id} to={item.link}>
                    <div className={styles.hamburgerMenu__element}>
                      {item.icon}
                      <p>{item.text}</p>
                    </div>
                  </Link>
                ))}
                <div
                  onClick={handleLogout}
                  className={styles.hamburgerMenu__element}
                >
                  {iconFile.logoutIcon}
                  <p>{t("navbar.logout")}</p>
                </div>
                <div
                  className={`${styles.mobileIcons} ${styles.navbar__right__icons}`}
                >
                  <span
                    onClick={toggleTheme}
                    className={styles.iconWithTransition}
                  >
                    {isDarkMode ? iconFile.moonIconFilled : iconFile.moonIcon}
                  </span>

                  {/* Notification Icon with Unread Message Indicator */}
                  <div
                    className={styles.notificationIconWrapper}
                    onClick={handleNotifyIconClick}
                  >
                    <span>{iconFile.notifyIcon}</span>
                    {hasUnreadMessages && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>

                  <span onClick={handleLanguageIconClick}>
                    {iconFile.languageIcon}
                  </span>
                  {languageDropdownOpen && (
                    <div className={styles.languageDropdown}>
                      <div onClick={() => handleLanguageSelect("en")}>ENG</div>
                      <div onClick={() => handleLanguageSelect("pl")}>PL</div>
                    </div>
                  )}
                  {showLanguageChangeMessage && (
                    <div className={styles.languageChangeMessage}>
                      {t("navbar.languageChanged")}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="filter">
                <p>{t("navbar.signin")}</p>
              </Button>
            </Link>
          )}
        </div>
      )}

      {notifyDropdownOpen && (
        <div className={styles.dropdownMessages}>
          {unreadMessages.length === 0 ? (
            <div className={styles.noNotificationsMessage}>
              {t("navbar.noNotifications")}
            </div>
          ) : (
            unreadMessages.map((message) => (
              <div key={message.id} className={styles.dropdownMessageItem}>
                <span>{message.sender_username}</span> {t("navbar.sentMessage")}
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
