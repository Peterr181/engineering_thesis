import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ChatRooms.module.scss";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import { roomIcons } from "../../constants/exercises";
import { useLanguage } from "../../context/LanguageProvider";

interface ChatRoom {
  id: number;
  name: string;
}

const ChatRooms: React.FC = () => {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/chat/rooms`);
        setRooms(response.data.rooms);
      } catch (err) {
        setError(t("error.fetchChatRooms"));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [t]);

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <PlatformWrapper>
      <div className={styles.chatRoomsWrapper}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <h2>{t("chatRooms.title")}</h2>
            <p>{t("chatRooms.description")}</p>
            <div className={styles.roomsGrid}>
              {rooms.map((room) => (
                <Link
                  to={`/chat/${room.id}`}
                  key={room.id}
                  className={styles.roomCard}
                >
                  <div className={styles.roomDetails}>
                    <h3>{room.name}</h3>
                    <p>{t("chatRooms.joinMessage")}</p>
                  </div>
                  <div className={styles.roomIcon}>
                    {roomIcons[room.name] || "💬"}{" "}
                  </div>
                </Link>
              ))}
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </div>
    </PlatformWrapper>
  );
};

export default ChatRooms;
