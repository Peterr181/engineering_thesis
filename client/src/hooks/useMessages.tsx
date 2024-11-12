import { useState } from "react";
import axios from "axios";

interface Message {
  id: number;
  message: string;
  sender_id: number;
  recipient_id: number;
  date_sent: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      console.log("API Response:", res.data); // Debug: Log API response
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
        console.log("Messages set:", res.data.messages); // Debug: Log messages set in state
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
    fetchMessages,
    sendMessage,
    error,
    loading,
  };
};

export default useMessages;
