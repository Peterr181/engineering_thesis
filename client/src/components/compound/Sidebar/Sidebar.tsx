import { useState } from "react";
import { useLanguage } from "../../../context/LanguageProvider";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { iconFile } from "../../../assets/iconFile";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const { t } = useLanguage();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [showText, setShowText] = useState(false);

  const handleLogout = () => {
    axios
      .get(`${apiUrl}/auth/logout`)
      .then(() => {
        localStorage.removeItem("token");
        location.reload();
      })
      .catch((err) => console.log(err));
  };

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
    {
      id: "statistics",
      icon: iconFile.statisticsIcon,
      text: t("sidebar.statistics"),
      link: "/statistics",
    },
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

  return (
    <aside
      className={`${styles.sidebar} ${showText ? styles.expanded : ""}`}
      onMouseEnter={() => setShowText(true)}
      onMouseLeave={() => setShowText(false)}
    >
      <div className={styles.sidebar__top}>
        <Link to="/" className={styles.sidebar__top__logo}>
          <span className={styles.logo}>G</span>
          {showText && <span className={styles.logo}>Gymero</span>}
        </Link>
      </div>

      <ul className={styles.sidebar__center}>
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              ["link_nav", isActive ? styles.selected : null]
                .filter(Boolean)
                .join(" ")
            }
          >
            <li>
              <div className={styles.sidebar__center__element}>
                <div className={styles.sidebar__center__element__left}>
                  {item.icon}
                  {showText && <span>{item.text}</span>}
                </div>
              </div>
            </li>
          </NavLink>
        ))}
      </ul>
      <div className={styles.sidebar__bottom}>
        <div className={styles.sidebar__bottom__logout} onClick={handleLogout}>
          {iconFile.logoutIcon}
          {showText && <span>{t("sidebar.logout")}</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
