import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import Button from "../../components/atomic/Button/Button";
import { useLogin } from "../../hooks/useLogin";
import signIn1 from "../../assets/images/signIn1.png";
import signIn2 from "../../assets/images/signIn2.png";
import { useLanguage } from "../../context/LanguageProvider";

const Login = () => {
  const { t } = useLanguage();
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const { login, error, loading } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginValues);
  };

  return (
    <section className={styles.login}>
      <div className={styles.login__box}>
        <div className={styles.login__info}>
          <h2>Gymero</h2>
          <p>{t("login.logInToYourAccount")}</p>
        </div>
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <div className={styles.login__form__group}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={t("login.email")}
              onChange={(e) =>
                setLoginValues({
                  ...loginValues,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.login__form__group}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("login.password")}
              onChange={(e) =>
                setLoginValues({
                  ...loginValues,
                  password: e.target.value,
                })
              }
            />
          </div>
          <Button variant="loginRegister" submit disabled={loading}>
            {loading ? t("login.loggingIn") : t("login.logInToYourAccount")}
          </Button>
          {error && <p className={styles.error}>{error}</p>}
          <p>
            {t("login.noAccount")}{" "}
            <Link to="/multistepregister">
              <span className={styles.signUp}>
                {t("register.signUpYourAccount")}
              </span>
            </Link>
          </p>
        </form>
      </div>
      <div className={styles.images}>
        <img
          src={signIn1}
          alt="sign in image 1"
          className={styles.images__image1}
        />
        <img
          src={signIn2}
          alt="sign in image 2"
          className={styles.images__image2}
        />
      </div>
    </section>
  );
};

export default Login;
