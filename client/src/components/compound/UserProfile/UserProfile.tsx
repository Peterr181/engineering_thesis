import { useEffect } from "react";
import styles from "./UserProfile.module.scss";
import { useParams } from "react-router-dom";
import PlatformWrapper from "../PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import { useWorkouts } from "../../../hooks/useWorkout";
import { useMeals } from "../../../hooks/useMeals";
import { usePersonalInfo } from "../../../hooks/usePersonalInfo";
import useUsers from "../../../hooks/useUsers";
import avatarImages from "../../../utils/avatarImages";
import { iconFile } from "../../../assets/iconFile";
import Workout, { Category } from "../Workout/Workout";
import UserMealsPlan from "../../../pages/MealsPlan/UserMealsPlan";
import { Button } from "@mui/material";

const labelMappings: { [key: string]: string } = {
  favorite_training_type: "Favorite Training",
  current_fitness_goals: "Current Fitness Goals",
  water_drunk_daily: "Water Drunk Daily",
  steps_daily: "Steps Daily",
  skill_level: "Level of Skill in Sports",
  caloric_intake_goal: "Daily Caloric",
  body_measurements: "Height",
  workout_frequency: "Workout Frequency",
  personal_bests: "Personal Bests",
  weight: "Weight",
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

const UserProfile = () => {
  const { userId } = useParams<{ userId: string; username: string }>();
  const { selectedUser, fetchUserById } = useUsers();

  useEffect(() => {
    fetchUserById(Number(userId));
  }, [userId]);

  const {
    workouts,
    fetchWorkouts,
    loading: workoutsLoading,
  } = useWorkouts(userId);
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
                      alt="User avatar"
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
                      ? "Beginner"
                      : selectedUser?.sportLevel === "2"
                      ? "Intermediate"
                      : "Advanced"}
                  </p>
                  <div
                    className={
                      styles.userprofile__topSection__firstcol__buttons
                    }
                  >
                    <Button variant="contained" color="primary">
                      Message
                    </Button>
                    <Button variant="contained" color="success">
                      Follow
                    </Button>
                  </div>
                </div>

                <div className={styles.userprofile__topSection__personalInfo}>
                  <ul
                    className={
                      styles.userprofile__topSection__personalInfo__items
                    }
                  >
                    {personalInfoData.map((info) => {
                      const label = labelMappings[info.label] || info.label;
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
                          <div>{info.value || "N/A"}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {workoutsLoading || personalInfoLoading ? (
                <p>Loading data...</p>
              ) : (
                <>
                  <div className={styles.userprofile__workouts}>
                    <h3 className={styles.userprofile__workouts__header}>
                      Workouts
                    </h3>
                    {workouts.length === 0 ? (
                      <p>No workouts found for this user.</p>
                    ) : (
                      workouts.map((workout) => (
                        <Workout
                          key={workout.id}
                          id={workout.id}
                          exercise_name={workout.exercise_name}
                          exercise_type={workout.exercise_type}
                          day={workout.day}
                          month={workout.month}
                          name={workout.exercise_name ?? "Unnamed Workout"}
                          category={getWorkoutCategory(
                            workout.exercise_type ?? "gym"
                          )}
                          minutes={workout.minutes}
                        />
                      ))
                    )}
                  </div>

                  <div className={styles.userprofile__meals}>
                    <h3 className={styles.userprofile__meals__header}>Meals</h3>
                    <UserMealsPlan meals={meals} />
                  </div>
                </>
              )}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default UserProfile;
