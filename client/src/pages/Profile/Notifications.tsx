import { useEffect } from "react";
import styles from "./Notifications.module.scss";
import useMessages from "../../hooks/useMessages";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageProvider";

const Messages = () => {
  const { t } = useLanguage();
  const userProfile = useAuth();
  const otherUserId = Number(userProfile?.id);
  const { unreadMessages, fetchUnreadMessages, markAllMessagesAsRead } =
    useMessages();

  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  const handleMarkAllAsRead = async () => {
    await markAllMessagesAsRead();
    fetchUnreadMessages();
  };

  return (
    <div className={styles.notifications}>
      <div className={styles.notifications__header}>
        <div>
          <h2>{t("messages.title")}</h2>
          <p>{t("messages.description")}</p>
        </div>
        <Link to="/leaderboard">
          <Button variant="contained" color="primary">
            {t("messages.communityButton")}
          </Button>
        </Link>
      </div>

      {unreadMessages.length === 0 ? (
        <p>{t("messages.noNewMessages")}</p>
      ) : (
        <div className={styles.notifications__list}>
          {unreadMessages.map((message) => (
            <div key={message.id} className={styles.notifications__listItem}>
              <div className={styles.notifications__card}>
                <div className={styles.notifications__cardContent}>
                  <div className={styles.notifications__cardContent__username}>
                    <h3>{message.sender_username}</h3>
                    <p className={styles.notifications__date}>
                      {new Date(message.date_sent).toLocaleString()}
                    </p>
                  </div>
                  <div className={styles.messageContent}>
                    <p className={styles.notifications__messageContent}>
                      {t("navbar.sentMessage")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={handleMarkAllAsRead}
            variant="contained"
            color="secondary"
          >
            {t("messages.markAllAsRead")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Messages;
