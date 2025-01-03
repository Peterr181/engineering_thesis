import styles from "./Statistics.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WorkoutStatistics from "../../components/compound/WorkoutStatistics/WorkoutStatistics";
import { useLanguage } from "../../context/LanguageProvider";
import MealsStatistics from "../../components/compound/MealsStatistics/MealsStatistics";
import GoalsStatistics from "../../components/compound/GoalsStatistics/GoalsStatistics";
const Statistics = () => {
  const { t } = useLanguage();
  return (
    <PlatformWrapper>
      <section className={styles.statistics}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <h2>{t("statisticsSectionHeader")}</h2>
            <p>{t("statisticsSectionDesc")}</p>
            <div className={styles.statistics__workouts}>
              <WorkoutStatistics />
              <div className={styles.divider}></div>
              <MealsStatistics />
              <div className={styles.divider}></div>
              <GoalsStatistics />
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default Statistics;
