import { useState } from "react";
import axios from "axios";

interface Message {
  sender_username: string;
  id: number;
  message: string;
  sender_id: number;
  recipient_id: number;
  date_sent: string;
  is_read: boolean; // Add is_read field to track the read status
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]); // State for unread messages
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUnreadIndicator, setShowUnreadIndicator] = useState(false); // Indicator for unread messages

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch messages.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/messages`);
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
        const hasUnreadMessages = res.data.messages.some(
          (message: Message) => !message.is_read
        );
        setShowUnreadIndicator(hasUnreadMessages);
      } else {
        console.log("No messages found in API response");
      }
    } catch (err) {
      setError("Error fetching messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot fetch unread messages.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/messages/unread`);
      console.log("Unread messages response:", res.data); // Add this log
      if (res.data && res.data.messages) {
        setUnreadMessages(res.data.messages);
        setShowUnreadIndicator(res.data.messages.length > 0);
      } else {
        setUnreadMessages([]);
        setShowUnreadIndicator(false);
      }
    } catch (err) {
      setError("Error fetching unread messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot mark messages as read.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${apiUrl}/api/messages/mark-as-read`);
      fetchUnreadMessages(); // Refresh unread messages after marking as read
    } catch (err) {
      setError("Error marking messages as read.");
      console.error(err);
    }
  };

  const markAllMessagesAsRead = async () => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot mark messages as read.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${apiUrl}/api/messages/mark-all-as-read`);
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({ ...message, is_read: true }))
      );
      setShowUnreadIndicator(false); // Ensure the indicator is set to false
    } catch (err) {
      setError("Error marking messages as read.");
      console.error(err);
    }
  };

  const sendMessage = async (
    recipient_id: number,
    message: string,
    sender_username?: string
  ) => {
    if (!isAuthenticated()) {
      setError("User not authenticated. Cannot send message.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/messages/send`, {
        message,
        recipient_id,
        sender_username, // Include sender_username in the request payload
      });
      fetchMessages(); // Refresh messages after sending
    } catch (err) {
      setError("Error sending message.");
      console.error(err);
    }
  };

  return {
    messages,
    unreadMessages,
    fetchMessages,
    fetchUnreadMessages,
    markMessagesAsRead,
    markAllMessagesAsRead, // Expose the new method
    sendMessage,
    showUnreadIndicator, // Expose the unread indicator state
    error,
    loading,
  };
};

export default useMessages;
