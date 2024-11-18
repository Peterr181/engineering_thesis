import { useLanguage } from "../../context/LanguageProvider";
import styles from "./Notifications.module.scss";
const Information = () => {
  const { t } = useLanguage();
  return (
    <div className={styles.notifications}>
      <h2>{t("information.title")}</h2>
      <p>{t("information.description")}</p>
      <a href="https://buycoffee.to/peter181" target="_blank">
        <img
          src="https://buycoffee.to/img/share-button-primary.png"
          style={{ width: "195px", height: "51px", marginTop: "20px" }}
          alt="Postaw mi kawę na buycoffee.to"
        />
      </a>
    </div>
  );
};

export default Information;
