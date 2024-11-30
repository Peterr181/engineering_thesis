import { create } from "zustand";
import axios from "axios";

interface Message {
  sender_username: string;
  id: number;
  message: string;
  sender_id: number;
  recipient_id: number;
  date_sent: string;
  is_read: boolean;
}

interface MessagesState {
  messages: Message[];
  unreadMessages: Message[];
  error: string | null;
  loading: boolean;
  showUnreadIndicator: boolean;
  fetchMessages: () => Promise<void>;
  fetchUnreadMessages: () => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  markAllMessagesAsRead: () => Promise<void>;
  sendMessage: (recipient_id: number, message: string, sender_username?: string) => Promise<void>;
}

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useMessages = create<MessagesState>((set) => ({
  messages: [],
  unreadMessages: [],
  error: null,
  loading: false,
  showUnreadIndicator: false,

  fetchMessages: async () => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot fetch messages.", loading: false });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/messages`);
      if (res.data && res.data.messages) {
        const hasUnreadMessages = res.data.messages.some((message: Message) => !message.is_read);
        set({ messages: res.data.messages, showUnreadIndicator: hasUnreadMessages });
      } else {
        console.log("No messages found in API response");
      }
    } catch (err) {
      set({ error: "Error fetching messages." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadMessages: async () => {
    set({ loading: true, error: null });

    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot fetch unread messages.", loading: false });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(`${apiUrl}/api/messages/unread`);
      if (res.data && res.data.messages) {
        set({ unreadMessages: res.data.messages, showUnreadIndicator: res.data.messages.length > 0 });
      } else {
        set({ unreadMessages: [], showUnreadIndicator: false });
      }
    } catch (err) {
      set({ error: "Error fetching unread messages." });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  markMessagesAsRead: async () => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot mark messages as read." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${apiUrl}/api/messages/mark-as-read`);
      useMessages.getState().fetchUnreadMessages();
    } catch (err) {
      set({ error: "Error marking messages as read." });
      console.error(err);
    }
  },

  markAllMessagesAsRead: async () => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot mark messages as read." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.put(`${apiUrl}/api/messages/mark-all-as-read`);
      set((state) => ({
        messages: state.messages.map((message) => ({ ...message, is_read: true })),
        showUnreadIndicator: false,
      }));
    } catch (err) {
      set({ error: "Error marking messages as read." });
      console.error(err);
    }
  },

  sendMessage: async (recipient_id: number, message: string, sender_username?: string) => {
    if (!isAuthenticated()) {
      set({ error: "User not authenticated. Cannot send message." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${apiUrl}/api/messages/send`, {
        message,
        recipient_id,
        sender_username,
      });
      useMessages.getState().fetchMessages();
    } catch (err) {
      set({ error: "Error sending message." });
      console.error(err);
    }
  },
}));

export default useMessages;
