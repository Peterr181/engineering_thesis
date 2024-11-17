import React, { useEffect, useState, useRef } from "react";
import styles from "./ChatRoom.module.scss";
import { io, Socket } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import PlatformWrapper from "../PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../MaxWidthWrapper/MaxWidthWrapper";
import axios from "axios";
import { iconFile } from "../../../assets/iconFile";
import chat from "../../../assets/images/chat.png";
import chat2 from "../../../assets/images/chat2.png";
import Button from "../../atomic/Button/Button";

interface Message {
  nickname: string;
  userId: string;
  message: string;
  username?: string;
  timestamp?: string;
}

const ChatRoom: React.FC = () => {
  const userProfile = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = String(userProfile?.id);
  const userNickname = userProfile?.username;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchRoomName = async (roomId: number) => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/chat/rooms/${roomId}/name`
        );
        setRoomName(response.data.roomName);
      } catch (error) {
        console.error("Error fetching room name:", error);
      }
    };
    fetchRoomName(Number(roomId));
  }, [roomId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/chat/rooms/${roomId}/history`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [roomId]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${apiUrl}`, {
        withCredentials: true,
      });

      socketRef.current.emit("joinRoom", roomId);

      socketRef.current.on("receiveMessage", (data: Message) => {
        if (data.userId !== userId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message && socketRef.current) {
      const newMessage: Message = {
        userId,
        message,
        username: userNickname,
        nickname: userNickname || "",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current.emit("sendMessage", {
        roomId,
        userId,
        message,
        userNickname,
      });
      setMessage("");
    }
  };

  // Handle key down event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatRoomWrapper}>
      <PlatformWrapper>
        <MaxWidthWrapper>
          <div className={styles.chatRoomContainer}>
            <div className={styles.chatRoomContainer__header}>
              <div className={styles.chatHeader}>{roomName} Room</div>
              <Link to="/chatrooms">
                <Button variant="primaryOutline">Back</Button>
              </Link>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((msg, index) => (
                <div className={styles.messageContainer} key={index}>
                  <div
                    className={`${styles.message} ${
                      msg.username === userNickname
                        ? styles["message--mine"]
                        : styles["message--other"]
                    }`}
                  >
                    {iconFile.userIcon}
                    <strong>{msg.username || msg.userId}:</strong>{" "}
                    <p className={styles.contentMessage}>{msg.message}</p>
                    <div className={styles.timestampContainer}>
                      {msg.timestamp && (
                        <span className={styles.timestamp}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />{" "}
            </div>
            <div className={styles.chatInputWrapper}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.chatInput}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} className={styles.sendButton}>
                Send
              </button>
            </div>
          </div>
        </MaxWidthWrapper>
      </PlatformWrapper>
      <div className={styles.chatRoomWrapper__images}>
        <div className={styles.firstImg}>
          <img src={chat2} alt="chat" className={styles.image1} />
        </div>
        <img src={chat} alt="chat2" className={styles.image2} />
      </div>
    </div>
  );
};

export default ChatRoom;
