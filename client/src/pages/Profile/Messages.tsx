import { useEffect } from "react";
import styles from "./Notifications.module.scss";

import useMessages from "../../hooks/useMessages";
import useAuth from "../../hooks/useAuth";

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  date_sent: string;
  sender_username?: string;
}

const Messages = () => {
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
    <div className={styles.notifications}>
      <h2>Messages</h2>

      {filteredMessages.length === 0 ? (
        <p>No new messages</p>
      ) : (
        <ul className={styles.notifications__list}>
          {filteredMessages.map((message: Message) => (
            <li key={message.id} className={styles.notifications__listItem}>
              <div className={styles.notifications__card}>
                <div className={styles.notifications__cardContent}>
                  <h3>{message.sender_username}</h3>
                  <p className={styles.notifications__date}>
                    {new Date(message.date_sent).toLocaleString()}
                  </p>
                  <p className={styles.notifications__messageContent}>
                    {message.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
