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

const Leaderboard = () => {
  const { users, fetchUsers } = useUsers(); // Removed addStarToUser
  const userProfile = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  const getSportLevelLabel = (level: number): string => {
    switch (level) {
      case 3:
        return "Advanced";
      case 2:
        return "Intermediate";
      case 1:
        return "Beginner";
      default:
        return "Unknown";
    }
  };

  return (
    <PlatformWrapper>
      <section className={styles.leaderboard}>
        <MaxWidthWrapper>
          <WhiteCardWrapper additionalClass={styles.wrapperClass}>
            <h2>Leaderboard</h2>
            <p>Browse users workout plans, diets, and special points.</p>
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
                        <img src={dolar} alt="dolar" />
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
