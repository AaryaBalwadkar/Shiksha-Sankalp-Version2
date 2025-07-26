import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./AuthStore";

const API_MESSAGE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/messages"
    : "/api/messages";

const useConversationStore = create((set, get) => ({
  user: null,
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  chats: [],

  sendMessage: async (id, message) => {
    try {
      const response = await axios.post(`${API_MESSAGE_URL}/send/${id}`, {
        message,
      });

      set({ messages: (prevMessages) => [...prevMessages, response.data] });

      if (response && response.data) {
        console.log("Message sent:", response.data);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
      if (error.response) {
        console.error("API Error:", error.response.data); // Log detailed API error
      }
    }
  },
  getChats: async (channelId) => {
    try {
      const response = await axios.get(`${API_MESSAGE_URL}/${channelId}`);
      set({ chats: response.data });
    } catch (error) {
      set({
        error: error.response?.data.message || "Error in sending message",
        isLoading: false,
      });
      throw error;
    }
  },
  subscribeToMessages: () => {
    const { selectedConversation } = get();
    if (!selectedConversation) return;

    const socket = useAuthStore.getState().socket;
    
    socket.on('newMessage', (newMessage) => {
      set({ messages: (prevMessages) => [...prevMessages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },
}));

export default useConversationStore;