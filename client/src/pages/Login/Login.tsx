// Login.tsx
import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/atomic/Button/Button";

const Login = () => {
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/login", loginValues)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/home");
        } else {
          alert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.login}>
      <div className={styles.login__box}>
        <div className={styles.login__info}>
          <h2>Gymero</h2>
          <p>Log in to your account</p>
        </div>
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <div className={styles.login__form__group}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              onChange={(e) =>
                setLoginValues({
                  ...loginValues,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.login__form__group}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              onChange={(e) =>
                setLoginValues({
                  ...loginValues,
                  password: e.target.value,
                })
              }
            />
          </div>
          <Button variant="loginRegister" submit>
            Log In
          </Button>
          <p>
            Don't have an account?{" "}
            <Link to="/multistepregister">
              <span className={styles.signUp}>Sign up</span>
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
