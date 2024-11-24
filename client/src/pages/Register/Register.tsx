import React, { useState } from "react";
import styles from "./Register.module.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atomic/Button/Button";
import { useLanguage } from "../../context/LanguageProvider";

const Register = () => {
  const { t } = useLanguage();
  const [registerValues, setRegisterValues] = useState({
    username: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/auth/register`, registerValues)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/login");
        } else {
          alert("Error during registration");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.register}>
      <div className={styles.register__box}>
        <div className={styles.register__info}>
          <h2>Gymero</h2>
          <p>{t("register.signUpYourAccount")}</p>
        </div>
        <form className={styles.register__form} onSubmit={handleSubmit}>
          <div className={styles.register__form__group}>
            <label htmlFor="username">{t("register.username")}:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder={t("register.username")}
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.register__form__group}>
            <label htmlFor="password">{t("register.password")}:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("register.password")}
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.register__form__group}>
            <label htmlFor="email">{t("register.email")}:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("register.email")}
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  email: e.target.value,
                })
              }
            />
          </div>
          <Button variant="loginRegister" submit>
            {t("register.signUpYourAccount")}
          </Button>
          <p>
            {t("register.alreadyHaveAccount")}{" "}
            <Link to="/login">
              <span className={styles.signIn}>
                {t("login.logInToYourAccount")}
              </span>
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
