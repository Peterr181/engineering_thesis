import styles from "./EmailPassword.module.scss";
import { TextField } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const EmailPassword = () => {
  const [auth, userProfile] = useAuth();
  return (
    <div className={styles.emailpassword}>
      <h2>Email & Password</h2>
      <p>Change your profile security data</p>
      <div className={styles.emailpassword__box}>
        <div className={styles.emailpassword__box__item}>
          <label>Email</label>
          <TextField
            id="outlined-email"
            label="Email"
            variant="outlined"
            value={auth && userProfile?.email}
            className={styles.emailpassword__textfield}
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
