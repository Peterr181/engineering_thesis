import styles from "./EmailPassword.module.scss";
import { Button, TextField } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const EmailPassword = () => {
  const userProfile = useAuth();
  return (
    <div className={styles.emailpassword}>
      <div className={styles.emailpassword__header}>
        <div>
          <h2>Email & Password</h2>
          <p>Change your profile security data</p>
        </div>
        <div>
          <Button variant="contained" color="success">
            Save changes
          </Button>
        </div>
      </div>
      <div className={styles.emailpassword__box}>
        <div className={styles.emailpassword__box__item}>
          <label>Email</label>
          <TextField
            id="outlined-email"
            label="Email"
            variant="outlined"
            value={userProfile?.email || ""}
            className={styles.emailpassword__textfield}
            // You may want to add an onChange handler to manage email updates
          />
        </div>
        <div className={styles.emailpassword__box__item}>
          <label>Password</label>
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            className={styles.emailpassword__textfield}
          />
        </div>
        <div className={styles.emailpassword__box__item}>
          <label>Repeat password</label>
          <TextField
            id="outlined-repeat-password"
            label="Repeat Password"
            variant="outlined"
            className={styles.emailpassword__textfield}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPassword;
