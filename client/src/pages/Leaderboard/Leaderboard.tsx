import styles from "./Leaderboard.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import useUsers from "../../hooks/useUsers";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import avatarImages from "../../utils/avatarImages";
import dolar from "../../assets/images/dollar.png";
import { useLanguage } from "../../context/LanguageProvider";

const Leaderboard = () => {
  const { users, fetchUsers } = useUsers();
  const userProfile = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Trigger re-render when language changes
    // Add any necessary logic here if needed
  }, [t]);

  const getSportLevelLabel = (level: number): string => {
    switch (level) {
      case 3:
        return t("advanced");
      case 2:
        return t("intermediate");
      case 1:
        return t("beginner");
      default:
        return t("unknown");
    }
  };

  return (
    <PlatformWrapper>
      <section className={styles.leaderboard}>
        <MaxWidthWrapper>
          <WhiteCardWrapper additionalClass={styles.wrapperClass}>
            <h2>{t("leaderboard")}</h2>
            <p>{t("browseUsers")}</p>
            <div className={styles.userList}>
              {users
                .filter((user) => user.id !== userProfile?.id)
                .map((user) => (
                  <Link to={`/users/${user.id}`} key={user.id}>
                    <div className={styles.userItem}>
                      <div className={styles.userItem__data}>
                        <div>
                          <img
                            src={
                              avatarImages[
                                (user.avatar as keyof typeof avatarImages) ??
                                  "avatar1.png"
                              ]
                            }
                            alt={`${user.username}'s avatar`}
                            className={styles.avatar}
                          />
                        </div>
                        <div className={styles.userInfo}>
                          <span className={styles.sportLevel}>
                            {getSportLevelLabel(Number(user.sportLevel))}
                          </span>
                          <span className={styles.username}>
                            {user.username}
                          </span>
                        </div>
                      </div>
                      <div className={styles.dollars}>
                        <p className={styles.points}>{user.total_points}</p>
                        <img src={dolar} alt={t("dollarAlt")} />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </section>
    </PlatformWrapper>
  );
};

export default Leaderboard;
