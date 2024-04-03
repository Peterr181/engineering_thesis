import React, { useState } from "react";
import styles from "./Register.module.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [registerValues, setRegisterValues] = useState({
    username: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/register", registerValues)
      .then((res) => {
        if (res.data.status === "Success") {
          // Move the navigation inside this block
          navigate("/login");
        } else {
          alert("Error");
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
          <p>Sign up your account</p>
        </div>
        <form className={styles.register__form} onSubmit={handleSubmit}>
          <div className={styles.register__form__group}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.register__form__group}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.register__form__group}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="hello@example.com"
              onChange={(e) =>
                setRegisterValues({
                  ...registerValues,
                  email: e.target.value,
                })
              }
            />
          </div>
          <button className={styles.buttonRegister} type="submit">
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/login">
              <span className={styles.signIn}>Sign in</span>
            </Link>
          </p>
        </form>
        {/* Form ends here */}
      </div>
    </section>
  );
};

export default Register;
