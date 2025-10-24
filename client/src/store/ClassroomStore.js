import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./AuthStore";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/classroom" : "/api/classroom";
const storeType_options = [
    { value: "student", label: "Student" },
    { value: "educator", label: "Educator" },
    { value: "institute", label: "Institute" }
  ]

export const useClassroom = create((set) => ({
	selectedClassroom: null,
	setSelectedClassroom: (selectedClassroom) => set({ selectedClassroom }),
}));

export const useClassroomAndChannelStore = create((set, get) => ({
	user: null,
	channels: [],

	addClassroom: async (classroomName, image) => {
		try {
			const response = await axios.post(`${API_URL}/newclassroom`, { classroomName, image });
      		console.log(response)

		} catch (error) {
			set({ error: error.response.data.message || "Error in creating classroom", isLoading: false });
			throw error;
		}
	},
	addChannel: async (classroomId, channelName, lock) => {
		try {
			const response = await axios.post(`${API_URL}/newchannel`, { classroomId, channelName, lock });
      		console.log('Channel created:', response.data);
			
			// Update local state immediately
			set((state) => ({
				channels: [...state.channels, response.data]
			}));

			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error in creating channel", isLoading: false });
			throw error;
		}
	},
	joinClassroom: async (code) => {
		try {
			const response = await axios.post(`${API_URL}/joinclassroom`, { code });
      		console.log(response)

		} catch (error) {
			set({ error: error.response.data.message || "Error in joining classroom", isLoading: false });
			throw error;
		}
	},
	deleteClassroom: async (classroomId) => {
		try {
			const response = await axios.post(`${API_URL}/deleteclassroom`, { classroomId });
      		console.log(response)

		} catch (error) {
			set({ error: error.response.data.message || "Error in deleting classroom", isLoading: false });
			throw error;
		}
	},
	removeClassroom: async (classroomId) => {
		try {
			const response = await axios.post(`${API_URL}/removeclassroom`, { classroomId });
      		console.log(response)

		} catch (error) {
			set({ error: error.response.data.message || "Error in removing classroom", isLoading: false });
			throw error;
		}
	},
	getChannels: async (classroomId) => {
		try {
			console.log('Fetching channels for classroom:', classroomId);
			const response = await axios.get(`${API_URL}/${classroomId}`);
			console.log('Channels response:', response.data);
			
			// Handle both array and single object responses
			const channelsData = Array.isArray(response.data) ? response.data[0] : response.data;
			if (!channelsData) {
				console.error('No channels data received');
				set({ channels: [] });
				return;
			}
			
			const formattedChannels = Array.isArray(channelsData) ? channelsData : [channelsData];
			console.log('Setting channels:', formattedChannels);
			set({ channels: formattedChannels });
			
			return formattedChannels;
		} catch (error) {
			console.error('Error fetching channels:', error);
			set({ 
				channels: [],
				error: error.response?.data?.message || "Error in fetching channels", 
				isLoading: false 
			});
			throw error;
		}
	},
	deleteChannel: async (channelId) => {
		try {
			const response = await axios.post(`${API_URL}/deletechannel`, { channelId });
      		console.log('Channel deleted:', channelId);

			// Update local state immediately
			set((state) => ({
				channels: state.channels.filter(channel => channel._id !== channelId)
			}));

			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error in deleting channel", isLoading: false });
			throw error;
		}
	},
	getClassroomCode: async (classroomId) => {
		try {
			const response = await axios.get(`${API_URL}/classroomcode`, { params: { classroomId } });
			console.log(response.data);
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error in fetching classroom code", isLoading: false });
			throw error;
		}
	},
	subscribeToChannel: (classroomId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !classroomId) return;

    const handlers = {
      newChannel: (newChannel) => {
        if (newChannel.classroomId === classroomId) {
          set((state) => {
            const channelExists = state.channels.some(
              (channel) => channel._id === newChannel._id
            );
            if (!channelExists) {
              return { channels: [...state.channels, newChannel] };
            }
            return state;
          });
        }
      },

      channelDeleted: (deletedChannelId) => {
        set((state) => ({
          channels: state.channels.filter(
            (channel) => channel._id !== deletedChannelId
          ),
        }));
      },

      channelUpdated: (updatedChannel) => {
        if (updatedChannel.classroomId === classroomId) {
          set((state) => ({
            channels: state.channels.map((channel) =>
              channel._id === updatedChannel._id ? updatedChannel : channel
            ),
          }));
        }
      },
    };

    // Clean up and set up listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.off(event);
      socket.on(event, handler);
    });

    // Join classroom room
    socket.emit("joinClassroom", classroomId);

    // Return cleanup function
    return () => {
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
      socket.emit("leaveClassroom", classroomId);
    };
  },

  unsubscribeFromChannel: (classroomId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !classroomId) return;

    socket.emit("leaveClassroom", classroomId);
  },
}));