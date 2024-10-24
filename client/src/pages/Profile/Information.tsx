import styles from "./Notifications.module.scss";
const Information = () => {
  return (
    <div className={styles.notifications}>
      <h2>Information</h2>
      <p>Buy author some coffe for hard work.</p>
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
