import React, { useState } from "react";
import styles from "./Profile.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import { iconFile } from "../../assets/iconFile";
import PersonalInfo from "./PersonalInfo";
import EmailPassword from "./EmailPassword";
import Notifications from "./Messages";
import Information from "./Information";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Personal info");

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <PlatformWrapper>
      <div className={styles.profileContainer}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.profileWrapper}>
              <div className={styles.profile}>
                <h2>User profile</h2>
                <div className={styles.profile__nav}>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === "Personal info" ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick("Personal info")}
                  >
                    {iconFile.usersIcon}
                    <p>Personal info</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === "Email & password" ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick("Email & password")}
                  >
                    {iconFile.emailIcon}
                    <p>Email & password</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === "Notifications" ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick("Notifications")}
                  >
                    {iconFile.notifyIcon}
                    <p>Notifications</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === "Information" ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick("Information")}
                  >
                    {iconFile.infoIcon}
                    <p>Information</p>
                  </div>
                </div>
              </div>
              {activeTab === "Personal info" && <PersonalInfo />}
              {activeTab === "Email & password" && <EmailPassword />}
              {activeTab === "Notifications" && <Notifications />}
              {activeTab === "Information" && <Information />}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </div>
    </PlatformWrapper>
  );
};

export default Profile;
