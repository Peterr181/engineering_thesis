import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styles from "./WorkoutPlan.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import Workout from "../../components/compound/Workout/Workout";
import { Status, Category } from "../../components/compound/Workout/Workout";
import "react-calendar/dist/Calendar.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useWorkouts } from "../../hooks/useWorkout";
import { monthMap } from "../../constants/other";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useLanguage } from "../../context/LanguageProvider";
const WorkoutPlan = () => {
  const { t } = useLanguage();
  const {
    workouts,
    fetchWorkouts,
    fetchWeeklyWorkouts,
    loading,
    error,
    finishWorkout,
    weeklyWorkouts,
  } = useWorkouts();
  const [currentView, setCurrentView] = useState<
    "all" | "weekly" | "finished" | "gym"
  >("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    fetchWorkouts(false);
  }, []);

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleCurrentWeekClick = () => {
    fetchWeeklyWorkouts();
    setCurrentView("weekly");
    setFilterDialogOpen(false);
  };

  const handleShowAllClick = () => {
    fetchWorkouts(false);
    setCurrentView("all");
    setFilterDialogOpen(false);
  };

  const handleShowFinishedClick = () => {
    setCurrentView("finished");
    setFilterDialogOpen(false);
  };

  const handleShowGymClick = () => {
    setCurrentView("gym");
    setFilterDialogOpen(false);
  };

  // Filter workouts to highlight only unfinished workouts on the calendar
  const workoutDays = (currentView === "weekly" ? weeklyWorkouts : workouts)
    .filter((workout) => !workout.finished)
    .map((workout) => {
      const monthNumber = monthMap[workout.month];
      return new Date(2024, monthNumber, workout.day);
    });

  const highlightWorkouts = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const isWorkoutDay = workoutDays.some(
        (workoutDate) => workoutDate.getTime() === date.getTime()
      );
      if (isWorkoutDay) {
        return styles.highlightedDay;
      }
    }
    return null;
  };

  const displayedWorkouts =
    currentView === "finished"
      ? workouts.filter((workout) => workout.finished)
      : currentView === "weekly"
      ? weeklyWorkouts
      : currentView === "gym"
      ? workouts.filter((workout) => workout.exercise_type === Category.GYM)
      : workouts.filter((workout) => !workout.finished);

  return (
    <PlatformWrapper>
      <div className={styles.workoutPlanWrapper}>
        <MaxWidthWrapper>
          <div className={styles.workoutPlan}>
            <div className={styles.workoutPlan__trainings}>
              <WhiteCardWrapper additionalClass={styles.wrapperClass}>
                <div className={styles.workoutPlan__trainings__header}>
                  <div>
                    <div
                      className={styles.workoutPlan__trainings__header__heading}
                    >
                      <h2>{t("workoutPlan.title")}</h2>
                      <span
                        className={styles.currentView}
                      >{`(${currentView.toUpperCase()})`}</span>
                    </div>
                    <p>{t("workoutPlan.description")}</p>
                  </div>
                  <div className={styles.workoutPlan__trainings__buttons}>
                    <Link to="/creatingworkout">
                      <div>
                        <Button variant="contained" color="success">
                          {t("workoutPlan.addNew")}
                        </Button>
                      </div>
                    </Link>

                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFilterClick}
                      >
                        {t("workoutPlan.filter")}
                      </Button>
                    </div>
                    <Link to="/gymplancreator">
                      <div>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleShowGymClick}
                        >
                          {t("workoutPlan.gym")}
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className={styles.workoutPlan__trainings__trainingsList}>
                  {loading && <p>{t("workoutPlan.loading")}</p>}
                  {error && (
                    <p style={{ color: "red" }}>{t("workoutPlan.error")}</p>
                  )}
                  {displayedWorkouts.map((workout, index) => {
                    const workoutCategory =
                      Category[
                        (workout.exercise_type?.toUpperCase() as keyof typeof Category) ||
                          Category.GYM
                      ] || Category.GYM;
                    return (
                      <Workout
                        key={index}
                        id={workout.id}
                        day={workout.day}
                        month={workout.month}
                        minutes={workout.minutes}
                        name={workout.exercise_name || "Unnamed Workout"}
                        status={
                          workout.finished
                            ? Status.FINISHED
                            : Status.NOT_STARTED
                        }
                        category={workoutCategory}
                        onFinish={() => finishWorkout(workout.id)}
                      />
                    );
                  })}
                </div>
              </WhiteCardWrapper>
            </div>

            <div className={styles.workoutPlan__calendar}>
              <WhiteCardWrapper>
                <h2>{t("workoutPlan.calendarTitle")}</h2>
                <p>{t("workoutPlan.calendarDescription")}</p>
                <div className={styles.workoutPlan__calendar__content}>
                  <Calendar
                    tileClassName={highlightWorkouts}
                    className={styles.customCalendar}
                  />
                </div>
              </WhiteCardWrapper>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{t("workoutPlan.filterDialogTitle")}</DialogTitle>
        <DialogContent>
          <div className={styles.workoutPlan__trainings__buttons}>
            <Button
              onClick={handleShowAllClick}
              color="primary"
              variant="contained"
            >
              {t("workoutPlan.showAll")}
            </Button>
            <Button
              onClick={handleCurrentWeekClick}
              color="primary"
              variant="contained"
            >
              {t("workoutPlan.currentWeek")}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleShowFinishedClick}
            >
              {t("workoutPlan.checkFinished")}
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            {t("workoutPlan.cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </PlatformWrapper>
  );
};

export default WorkoutPlan;
