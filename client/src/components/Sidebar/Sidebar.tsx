import React from "react";
import styles from "./Sidebar.module.scss";
import { Link } from "react-router-dom";
import { iconFile } from "../../assets/iconFile";

const Sidebar = () => {
  const menuItems = [
    { icon: iconFile.dashboardIcon, text: "Dashboard", link: "/" },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        <Link to="/">
          <span className={styles.logo}>GYMERO</span>
        </Link>
      </div>
      <ul className={styles.sidebar__center}>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.link}>
              <div className={styles.sidebar__center__element}>
                <div className={styles.sidebar__center__element__left}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
                <div>
                  <span>{iconFile.arrowRight}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
