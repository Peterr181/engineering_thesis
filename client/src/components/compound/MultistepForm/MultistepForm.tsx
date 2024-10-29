import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import styles from "./MultistepForm.module.scss";
import { useMultistepForm } from "../../../hooks/useMultistepForm";
import UserBasicData from "./UserBasicData";
import SportLevel from "./SportLevel";
import ChooseAvatar from "./ChooseAvatar"; // Import your ChooseAvatar component
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import ProgressBar from "@ramonak/react-progress-bar";
import form from "../../../assets/images/form.png";
import { useNavigate } from "react-router-dom";

const MultistepForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nickname: "",
    email: "",
    password: "",
    gender: "", // Keep track of gender
    birthYear: "",
    avatar: "", // Avatar field to hold the selected avatar
    sportLevel: 1,
  });
  const [stepVisible, setStepVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <UserBasicData {...data} updateFields={updateFields} />,
      <ChooseAvatar
        avatar={data.avatar}
        gender={data.gender}
        updateFields={updateFields}
      />, // Pass gender prop
      <SportLevel {...data} updateFields={updateFields} />,
    ]);

  useEffect(() => {
    setStepVisible(true);
  }, [step]);

  function updateFields(fields: Partial<typeof data>) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) {
      return next();
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, data);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }

  const stepAnimationClass = stepVisible ? styles.stepContainerVisible : "";

  return (
    <MaxWidthWrapper>
      <div className={styles.multiStepForm}>
        <div className={styles.multiStepForm__container}>
          <div className={styles.multiStepForm__infoBox}>
            <img src={form} alt="step form image" />
            <div className={styles.stepInfo}>
              <p>{`Step ${currentStepIndex + 1}/${steps.length}`}</p>
              <h3>
                {isFirstStep
                  ? "User Info"
                  : isLastStep
                  ? "Sport Level"
                  : "Choose Avatar"}
              </h3>
            </div>
            <div className={styles.progressBarContainer}>
              <ProgressBar
                completed={Math.round(
                  (currentStepIndex + 1) * (100 / steps.length)
                )}
                bgColor="#4cbb17"
              />
            </div>
          </div>
          <div className={styles.formContainer}>
            <form onSubmit={onSubmit}>
              <div className={`${styles.stepContainer} ${stepAnimationClass}`}>
                {stepVisible && step}
              </div>
              <div className={styles.buttonsContainer}>
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={back}
                    className={styles.backBtn}
                  >
                    Back
                  </button>
                )}
                <button type="submit" className={styles.finishBtn}>
                  {isLastStep ? "Finish" : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default MultistepForm;
