import React from "react";
import Calendar from "react-calendar";
import styles from "./WorkoutPlan.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import Workout from "../../components/compound/Workout/Workout";
import { Status, Category } from "../../components/compound/Workout/Workout";
import "react-calendar/dist/Calendar.css"; // Import calendar styles

const WorkoutPlan = () => {
  // const { t } = useLanguage();

  // Sample workout data, where we have planned workouts on specific dates
  const workoutDays = [
    new Date(2024, 0, 1), // January 1, 2024
    new Date(2024, 0, 2), // January 2, 2024
    new Date(2024, 0, 12), // January 12, 2024
  ];

  // Function to determine if a day has a planned workout
  const highlightWorkouts = ({ date, view }: { date: Date; view: string }) => {
    // Only apply to day views, not month/year views
    if (view === "month") {
      return workoutDays.some(
        (workoutDate) => workoutDate.toDateString() === date.toDateString()
      )
        ? styles.highlightedDay // This class will apply a custom style
        : null;
    }
    return null;
  };

  return (
    <PlatformWrapper>
      <MaxWidthWrapper>
        <div className={styles.workoutPlan}>
          <div className={styles.workoutPlan__trainings}>
            <WhiteCardWrapper>
              <h2>Plan treningowy</h2>
              <p>Sprawdź kiedy masz swoje najbliższe zaplanowane treningi!</p>
              <div className={styles.workoutPlan__trainings__trainingsList}>
                <Workout
                  day={1}
                  month="Jan"
                  name="PushA"
                  status={Status.NOT_STARTED}
                  category={Category.CARDIO}
                />
                <Workout
                  day={2}
                  month="Jan"
                  name="Chest workout"
                  status={Status.NOT_STARTED}
                  category={Category.GYM}
                />
                <Workout
                  day={3}
                  month="Jan"
                  name="Chest workout"
                  status={Status.NOT_STARTED}
                  category={Category.GYM}
                />
                <Workout
                  day={4}
                  month="Jan"
                  name="Chest workout"
                  status={Status.NOT_STARTED}
                  category={Category.GYM}
                />
                <Workout
                  day={12}
                  month="Jan"
                  name="Chest workout"
                  status={Status.NOT_STARTED}
                  category={Category.GYM}
                />
              </div>
            </WhiteCardWrapper>
          </div>

          <div className={styles.workoutPlan__calendar}>
            <WhiteCardWrapper>
              <h2>Kalendarz</h2>
              <p>Sprawdź kiedy masz treningi</p>
              <div className={styles.workoutPlan__calendar__content}>
                <Calendar
                  tileClassName={highlightWorkouts}
                  className={styles.customCalendar} // Highlight workout days
                />
              </div>
            </WhiteCardWrapper>
          </div>
        </div>
      </MaxWidthWrapper>
    </PlatformWrapper>
  );
};

export default WorkoutPlan;
