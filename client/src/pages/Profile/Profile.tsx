import React, { useState, useEffect } from "react";
import styles from "./Profile.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import { iconFile } from "../../assets/iconFile";
import PersonalInfo from "./PersonalInfo";
import EmailPassword from "./EmailPassword";
import Information from "./Information";
import Messages from "./Messages";
import { useLanguage } from "../../context/LanguageProvider";

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(t("personalInfo"));

  useEffect(() => {
    setActiveTab(t("personalInfo"));
  }, [t]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveTab(t("personalInfo"));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [t]);

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <PlatformWrapper>
      <div className={styles.profileContainer}>
        <MaxWidthWrapper>
          <WhiteCardWrapper additionalClass={styles.wrapperClass}>
            <div className={styles.profileWrapper}>
              <div className={styles.profile}>
                <h2>{t("userProfile")}</h2>
                <div className={styles.profile__nav}>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === t("personalInfo") ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick(t("personalInfo"))}
                  >
                    {iconFile.usersIcon}
                    <p>{t("personalInfo")}</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === t("emailPasswordTab") ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick(t("emailPasswordTab"))}
                  >
                    {iconFile.emailIcon}
                    <p>{t("emailPasswordTab")}</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === t("messagesTab") ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick(t("messagesTab"))}
                  >
                    {iconFile.notifyIcon}
                    <p>{t("messagesTab")}</p>
                  </div>
                  <div
                    className={`${styles.profile__nav__item} ${
                      activeTab === t("informationTab") ? styles.active : ""
                    }`}
                    onClick={() => handleNavClick(t("informationTab"))}
                  >
                    {iconFile.infoIcon}
                    <p>{t("informationTab")}</p>
                  </div>
                </div>
              </div>
              {activeTab === t("personalInfo") && <PersonalInfo />}
              {activeTab === t("emailPasswordTab") && <EmailPassword />}
              {activeTab === t("messagesTab") && <Messages />}
              {activeTab === t("informationTab") && <Information />}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </div>
    </PlatformWrapper>
  );
};

export default Profile;
