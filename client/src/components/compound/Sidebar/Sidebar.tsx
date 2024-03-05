import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageProvider";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { iconFile } from "../../../assets/iconFile";

const Sidebar = () => {
  const { t, language } = useLanguage();

  const [showText, setShowText] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const menuItems = [
    { icon: iconFile.dashboardIcon, text: t("sidebar.dashboard"), link: "/" },
    { icon: iconFile.barbellIcon, text: t("sidebar.workouts"), link: "/" },
    { icon: iconFile.onlineChat, text: t("sidebar.chats"), link: "/" },
    { icon: iconFile.mealIcon, text: t("sidebar.diet"), link: "/" },
    { icon: iconFile.trainerIcon, text: t("sidebar.trainer"), link: "/" },
    { icon: iconFile.mapIcon, text: t("sidebar.finder"), link: "/" },
    { icon: iconFile.statisticsIcon, text: t("sidebar.statistics"), link: "/" },
    { icon: iconFile.usersIcon, text: t("sidebar.users"), link: "/" },
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
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              console.log("Clicked index:", index);
              setSelectedItem(index);
            }}
            className={selectedItem === index ? styles.selected : ""}
          >
            <Link to={item.link}>
              <div className={styles.sidebar__center__element}>
                <div className={styles.sidebar__center__element__left}>
                  {item.icon}
                  {showText && <span>{item.text}</span>}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.sidebar__bottom}>
        <div className={styles.sidebar__bottom__logout}>
          {iconFile.logoutIcon}
          {showText && <span>{t("sidebar.logout")}</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
