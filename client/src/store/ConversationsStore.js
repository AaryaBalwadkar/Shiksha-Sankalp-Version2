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
    if (!channelId) {
      console.error("No channelId provided to getChats");
      return;
    }

    try {
      console.log("Fetching chats for channel:", channelId);
      const response = await axios.get(`${API_MESSAGE_URL}/${channelId}`);
      if (response.data) {
        console.log("Received chats:", response.data);
        set({ chats: response.data });
      } else {
        console.error("No data received from getChats");
        set({ chats: [] });
      }
    } catch (error) {
      console.error("Error in getChats:", error);
      set({
        error: error.response?.data?.message || "Error fetching messages",
        isLoading: false,
        chats: []
      });
      throw error;
    }
  },
  subscribeToMessages: (channelId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !channelId) {
      console.error("Cannot subscribe to messages: socket or channelId missing");
      return;
    }

    console.log("Subscribing to messages for channel:", channelId);
    
    // Handler for new messages
    const newMessageHandler = (newMessage) => {
      if (newMessage.channelId === channelId) {
        console.log("Received new message:", newMessage);
        set((state) => ({
          chats: [...(state.chats || []), newMessage]
        }));
      }
    };

    // Clean up previous listener
    socket.off('newMessage', newMessageHandler);
    
    // Set up new listener
    socket.on('newMessage', newMessageHandler);
    
    // Join the channel room
    socket.emit('join_channel', { channelId });
  },
  unsubscribeFromMessages: (channelId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !channelId) return;

    console.log("Unsubscribing from messages for channel:", channelId);
    socket.off('newMessage');
    // Leave the channel room
    socket.emit('leave_channel', { channelId });
  },
}));

export default useConversationStore;