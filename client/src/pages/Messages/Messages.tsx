import { useEffect } from "react";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import styles from "./Messages.module.scss";
import useMessages from "../../hooks/useMessages";
import useAuth from "../../hooks/useAuth";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageProvider";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  date_sent: string;
  sender_username?: string;
}

const Messages = () => {
  const { t } = useLanguage();
  const userProfile = useAuth();
  const otherUserId = Number(userProfile?.id);
  const { messages, fetchMessages } = useMessages();

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (message: Message) => message.recipient_id === otherUserId
  );

  return (
    <PlatformWrapper>
      <div className={styles.notifications}>
        <MaxWidthWrapper>
          <WhiteCardWrapper additionalClass={styles.wrapper}>
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

            {filteredMessages.length === 0 ? (
              <p>{t("messages.noNewMessages")}</p>
            ) : (
              <ul className={styles.notifications__list}>
                {filteredMessages.map((message: Message) => (
                  <li
                    key={message.id}
                    className={styles.notifications__listItem}
                  >
                    <div className={styles.notifications__card}>
                      <div className={styles.notifications__cardContent}>
                        <div
                          className={
                            styles.notifications__cardContent__username
                          }
                        >
                          <h3>{message.sender_username}</h3>
                          <p className={styles.notifications__date}>
                            {new Date(message.date_sent).toLocaleString()}
                          </p>
                        </div>
                        <div className={styles.messageContent}>
                          <p className={styles.notifications__messageContent}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </div>
    </PlatformWrapper>
  );
};

export default Messages;
