import { useState, useEffect } from "react";
import styles from "./Streak.module.scss";
import dolar from "../../../assets/images/dollar.png";
import confetti from "../../../assets/images/confetti.png";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import StreakItem from "./StreakItem";
import useDailyStreak from "../../../hooks/useDailyStreak";

const Streak = () => {
  const { streakData } = useDailyStreak();
  const [streakPage, setStreakPage] = useState(0); // Tracks the current page of streaks
  const streakDaysPerPage = 12;

  // Generate streak data based on the current page
  const generateStreakData = () => {
    const startDay = streakPage * streakDaysPerPage + 1;
    return Array.from({ length: streakDaysPerPage }, (_, index) => {
      const day = startDay + index;
      return {
        points: day * 10,
        day: `Day ${day}`,
        isCurrent: streakData ? day === streakData.streakCount : false,
      };
    });
  };

  // Load initial or updated streak data
  const [currentStreakData, setCurrentStreakData] =
    useState(generateStreakData);

  // Update streak data whenever streakPage or streakData changes
  useEffect(() => {
    setCurrentStreakData(generateStreakData());
  }, [streakPage, streakData]);

  // Check if the streak count is at the last day of the current page and load the next page
  useEffect(() => {
    if (
      streakData &&
      streakData.streakCount === (streakPage + 1) * streakDaysPerPage
    ) {
      setStreakPage((prevPage) => prevPage + 1);
    }
  }, [streakData, streakPage]);

  return (
    <div className={styles.streak}>
      <WhiteCardWrapper additionalClass={styles.streak__wrapper}>
        <div className={styles.streak__header}>
          <div>
            <h2>Streak</h2>
            <p>Look how consistent you are as a person on Gymero platform</p>
          </div>
          <div>
            <img src={confetti} alt="confetti" />
          </div>
        </div>
        <div className={styles.streak__items}>
          {currentStreakData.map((item, index) => (
            <StreakItem
              key={index}
              points={item.points}
              day={item.day}
              image={dolar}
              additionalClass={item.isCurrent ? styles.currentStreak : ""}
            />
          ))}
        </div>
      </WhiteCardWrapper>
    </div>
  );
};

export default Streak;
