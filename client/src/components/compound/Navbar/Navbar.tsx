import styles from "./Navbar.module.scss";
import { iconFile } from "../../../assets/iconFile";
import humanFace from "../../../assets/images/personDefault.jpg";
import Button from "../../atomic/Button/Button";
import { useLanguage } from "../../../context/LanguageProvider";
import Text from "../../atomic/Text/Text";

const Navbar = () => {
  const { t, changeLanguage, language } = useLanguage();

  return (
    <nav className={styles.navbar__wrapper}>
      <section className={styles.navbar}>
        <div className={styles.navbar__left}>
          <Text textStyle="lg">{t("navbar.setWorkoutPlan")}</Text>
          <Button variant="primaryOutline">
            <Text textStyle="md">{t("navbar.setWorkoutButton")}</Text>
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
            <div className={styles.navbar__right__profile__data}>
              <Text textStyle="lg">{t("navbar.userName")}</Text>
              <Text textStyle="md" boldness={500}>
                {t("navbar.userRole")}
              </Text>
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
