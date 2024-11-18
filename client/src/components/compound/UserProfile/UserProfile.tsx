import { useEffect, useState } from "react";
import styles from "./UserProfile.module.scss";
import { useParams } from "react-router-dom";
import PlatformWrapper from "../PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { useWorkouts } from "../../../hooks/useWorkout";
import { useMeals } from "../../../hooks/useMeals";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import useUsers from "../../../hooks/useUsers";
import useMessages from "../../../hooks/useMessages";
import avatarImages from "../../../utils/avatarImages";
import { iconFile } from "../../../assets/iconFile";
import Workout, { Category } from "../Workout/Workout";
import UserMealsPlan from "../../../pages/MealsPlan/UserMealsPlan";
import love from "../../../assets/images/love.png";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageProvider";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const userProfile = useAuth();
  const { selectedUser, fetchUserById, addStarToUser } = useUsers();
  const { sendMessage } = useMessages(); // Pass userId to useMessages
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false); // State for alert
  const { t } = useLanguage();

  const labelMappings: { [key: string]: string } = {
    favorite_training_type: t("favoriteTraining"),
    current_fitness_goals: t("currentFitnessGoals"),
    water_drunk_daily: t("waterDrunkDaily"),
    steps_daily: t("stepsDaily"),
    skill_level: t("skillLevel"),
    caloric_intake_goal: t("caloricIntakeGoal"),
    body_measurements: t("bodyMeasurements"),
    workout_frequency: t("workoutFrequency"),
    personal_bests: t("personalBests"),
    weight: t("weight"),
  };

  const icons: { [key: string]: JSX.Element } = {
    nickname: iconFile.profileColorIcon,
    favorite_training_type: iconFile.trainingColorIcon,
    current_fitness_goals: iconFile.goalColorIcon,
    water_drunk_daily: iconFile.waterColorIcon,
    steps_daily: iconFile.stepsColorIcon,
    skill_level: iconFile.skillColorIcon,
    caloric_intake_goal: iconFile.mealColorIcon,
    body_measurements: iconFile.heightColorIcon,
    workout_frequency: iconFile.timeColorIcon,
    personal_bests: iconFile.personalColorIcon,
    weight: iconFile.weightColorIcon,
  };

  useEffect(() => {
    fetchUserById(Number(userId));
  }, [userId]);

  const {
    workouts,
    fetchWorkouts,
    loading: workoutsLoading,
  } = useWorkouts(userId); // Ensure userId is passed here
  const { meals, fetchMeals } = useMeals(userId);
  const {
    personalInfoData,
    fetchPersonalInfo,
    loading: personalInfoLoading,
  } = usePersonalInfo(userId);

  useEffect(() => {
    fetchWorkouts();
    fetchMeals();
    fetchPersonalInfo();
  }, [userId]);

  const getWorkoutCategory = (exerciseType: string): Category => {
    switch (exerciseType.toLowerCase()) {
      case "gym":
        return Category.GYM;
      case "cardio":
        return Category.CARDIO;
      case "flexibility":
        return Category.FLEXIBILITY;
      case "strength":
        return Category.STRENGTH;
      case "combat":
        return Category.COMBAT;
      default:
        return Category.GYM;
    }
  };

  // Open the message dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // Close the message dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setMessage(""); // Reset message input on close
  };

  // Send the message and close the dialog
  const handleSendMessage = async () => {
    const wordCount = message.trim().split(/\s+/).length;
    if (message.trim() && wordCount <= 200) {
      await sendMessage(Number(userId), message, userProfile?.username); // Pass userId, message, and selectedUser.username
      setIsDialogOpen(false);
      setMessage(""); // Reset message input on send
      setAlertOpen(true); // Show alert
    } else if (wordCount > 200) {
      alert(t("messageWordLimit"));
    }
  };

  // Close the alert
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Handle adding a star to the user
  const handleAddStar = async () => {
    await addStarToUser(Number(userId));
    fetchUserById(Number(userId)); // Refresh the user data to reflect the new star count
  };

  return (
    <PlatformWrapper>
      <section className={styles.userprofile}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <div className={styles.userprofile__wrapper}>
              <div className={styles.userprofile__topSection}>
                <div className={styles.userprofile__topSection__firstcol}>
                  <div className={styles.userprofile__topSection__avatar}>
                    <img
                      src={
                        avatarImages[
                          (selectedUser?.avatar as keyof typeof avatarImages) ??
                            "avatar1.png"
                        ]
                      }
                      alt={t("userAvatar")}
                    />
                  </div>
                  <p
                    className={
                      styles.userprofile__topSection__firstcol__username
                    }
                  >
                    {selectedUser?.username}
                  </p>
                  <p
                    className={
                      styles.userprofile__topSection__firstcol__sportlevel
                    }
                  >
                    {selectedUser?.sportLevel === "1"
                      ? t("beginner")
                      : selectedUser?.sportLevel === "2"
                      ? t("intermediate")
                      : t("advanced")}
                  </p>
                  <div
                    className={
                      styles.userprofile__topSection__firstcol__buttons
                    }
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenDialog}
                    >
                      {t("message")}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAddStar}
                    >
                      {t("like")}
                    </Button>
                  </div>
                  <div
                    className={styles.userprofile__topSection__firstcol__like}
                  >
                    <p>{selectedUser?.stars}</p>
                    <img src={love} alt={t("heartIcon")} />
                  </div>
                </div>

                <div className={styles.userprofile__topSection__personalInfo}>
                  <ul
                    className={
                      styles.userprofile__topSection__personalInfo__items
                    }
                  >
                    {personalInfoData.map((info) => {
                      const label = t(labelMappings[info.label] || info.label);
                      const icon = icons[info.label] || null;

                      return (
                        <li
                          key={info.label}
                          className={
                            styles.userprofile__topSection__personalInfo__items__item
                          }
                        >
                          <div
                            className={
                              styles.userprofile__topSection__personalInfo__items__item__header
                            }
                          >
                            <span className={styles.userprofile__infoIcon}>
                              {icon}
                            </span>
                            <strong>{label}</strong>
                          </div>
                          <div>{info.value || t("notAvailable")}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {workoutsLoading || personalInfoLoading ? (
                <p>{t("loadingData")}</p>
              ) : (
                <>
                  <div className={styles.userprofile__workouts}>
                    <h3 className={styles.userprofile__workouts__header}>
                      {t("workouts")}
                    </h3>
                    {workouts.length === 0 ? (
                      <p>{t("noWorkoutsFound")}</p>
                    ) : (
                      workouts.map((workout) => (
                        <Workout
                          key={workout.id}
                          id={workout.id}
                          workout_id={workout.workout_id}
                          exercise_type={workout.exercise_type}
                          day={workout.day}
                          month={workout.month}
                          name={workout.exercise_name ?? t("unnamedWorkout")}
                          category={getWorkoutCategory(
                            workout.exercise_type ?? "gym"
                          )}
                          minutes={workout.minutes}
                        />
                      ))
                    )}
                  </div>

                  <div className={styles.userprofile__meals}>
                    <h3 className={styles.userprofile__meals__header}>
                      {t("meals")}
                    </h3>
                    <UserMealsPlan meals={meals} />
                  </div>
                </>
              )}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg">
        <DialogTitle>
          {t("sendMessageTo")} {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("yourMessage")}
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ width: "800px", overflow: "hidden" }} // Set the width to 100%
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleSendMessage} color="primary">
            {t("send")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionProps={{ onExited: handleCloseAlert }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("messageSent")}
        </Alert>
      </Snackbar>
    </PlatformWrapper>
  );
};

export default UserProfile;
