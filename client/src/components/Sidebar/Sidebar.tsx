import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { iconFile } from "../../assets/iconFile";
import calendar from "../../assets/images/calendar.png";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  const [showText, setShowText] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const menuItems = [
    { icon: iconFile.dashboardIcon, text: "Dashboard", link: "/" },
    { icon: iconFile.barbellIcon, text: "Workouts", link: "/" },
    { icon: iconFile.onlineChat, text: "Chats", link: "/" },
    { icon: iconFile.mealIcon, text: "Diet", link: "/" },
    { icon: iconFile.trainerIcon, text: "Trainer", link: "/" },
    { icon: iconFile.mapIcon, text: "Finder", link: "/" },
    { icon: iconFile.statisticsIcon, text: "Statistics", link: "/" },
    { icon: iconFile.usersIcon, text: "Users", link: "/" },
  ];

  return (
    <div
      className={`${styles.sidebar} ${showText ? styles.expanded : ""}`}
      onMouseEnter={() => setShowText(true)}
      onMouseLeave={() => setShowText(false)}
    >
      <div className={styles.sidebar__top}>
        <Link to="/" className={styles.sidebar__top__logo}>
          <span className={styles.logo}>G</span>
          {showText && <span className={styles.logo}>Gymero.</span>}
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
                {/* <div>
                  <span>{iconFile.arrowRight}</span>
                </div> */}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.sidebar__bottom}>
        {/* <div className={styles.sidebar__bottom__workout}>
          <img src={calendar} alt="Calendar image" />
          <p>Connect with your band</p>
        </div> */}
        {/* <div className={styles.sidebar__bottom__author}>
          <p>Gymero Fitness Dashboard</p>
          <p>© 2023 All Rights Reserved</p>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
