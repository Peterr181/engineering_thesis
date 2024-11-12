import styles from "./Streak.module.scss";
import dolar from "../../../assets/images/dollar.png";
import confetti from "../../../assets/images/confetti.png";
import WhiteCardWrapper from "../../atomic/WhiteCardWrapper/WhiteCardWrapper";
import StreakItem from "./StreakItem";
import useDailyStreak from "../../../hooks/useDailyStreak";

const Streak = () => {
  const { streakData } = useDailyStreak();

  // Sample data for illustration if needed
  const defaultStreakData = Array.from({ length: 12 }, (_, index) => ({
    points: (index + 1) * 10,
    day: `Day ${index + 1}`,
  }));

  const currentStreakData = streakData
    ? Array.from({ length: 12 }, (_, index) => ({
        points: (index + 1) * 10,
        day: `Day ${index + 1}`,
        isCurrent: index + 1 === streakData.streakCount,
      }))
    : defaultStreakData.map((item) => ({
        ...item,
        isCurrent: false,
      }));

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
