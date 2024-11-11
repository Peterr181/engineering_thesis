import styles from "./Leaderboard.module.scss";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import useUsers from "../../hooks/useUsers";
import { useEffect } from "react";

import avatar1 from "../../assets/images/avatar1.png";
import avatar2 from "../../assets/images/avatar2.png";
import avatar3 from "../../assets/images/avatar3.png";
import avatar4 from "../../assets/images/avatar4.png";
import avatar5 from "../../assets/images/avatar5.png";
import avatar6 from "../../assets/images/avatar6.png";
import { Link } from "react-router-dom";

const avatarImages: { [key: string]: string } = {
  "avatar1.png": avatar1,
  "avatar2.png": avatar2,
  "avatar3.png": avatar3,
  "avatar4.png": avatar4,
  "avatar5.png": avatar5,
  "avatar6.png": avatar6,
};

const Leaderboard = () => {
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <WhiteCardWrapper>
            <h2>Leaderboard</h2>
            <p>Browse users workout plans, diets, and special points.</p>
            <div className={styles.userList}>
              {users.map((user) => (
                <Link to={`/users/${user.id}`}>
                  <div key={user.id} className={styles.userItem}>
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
                    <div className={styles.userInfo}>
                      <span className={styles.sportLevel}>
                        {getSportLevelLabel(Number(user.sportLevel))}
                      </span>
                      <span className={styles.username}>{user.username}</span>
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
