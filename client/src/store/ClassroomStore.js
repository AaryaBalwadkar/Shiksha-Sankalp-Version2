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
		try{
			const response = await axios.get(`${API_URL}/${classroomId}`);
			// Add console log to debug the response
			console.log('Channels response:', response.data);
			
			// Handle both array and single object responses
			const channelsData = Array.isArray(response.data) ? response.data[0] : response.data;
			if (!channelsData) {
				console.error('No channels data received');
				return;
			}
			
			set({ channels: Array.isArray(channelsData) ? channelsData : [channelsData] });
		} catch (error) {
			console.error('Error fetching channels:', error);
			set({ error: error.response?.data?.message || "Error in fetching channels", isLoading: false });
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
	subscribeToNewChannels: (classroomId) => {
		const socket = useAuthStore.getState().socket;
		if (!socket || !classroomId) {
			console.error("Cannot subscribe to new channels: socket or classroomId missing");
			return;
		}

		console.log("Subscribing to new channels for classroom:", classroomId);

		const newChannelHandler = (newChannel) => {
			console.log("Socket received new channel event:", newChannel);
			
			const channelClassroomName = newChannel.classroomName;
			
			// Convert IDs to strings for comparison
			const currentId = String(classroomId);
			const newChannelId = String(channelClassroomName);
			
			// Only proceed if the channel belongs to current classroom
			if (currentId === newChannelId) {
				set((state) => {
					// Check if a channel with same name already exists in this classroom
					const isDuplicate = state.channels.some(ch => 
						ch.channelName === newChannel.channelName && 
						String(ch.classroomName) === String(newChannel.classroomName)
					);
					
					if (isDuplicate) {
						console.log("Duplicate channel detected, ignoring:", newChannel.channelName);
						return state;
					}
					
					return {
						channels: [...state.channels, newChannel]
					};
				});
			} else {
				console.log("Ignoring channel from different classroom");
			}
		};

		socket.off('newChannel', newChannelHandler); // Remove any existing listeners
		socket.on('newChannel', newChannelHandler);
		
		// Join the classroom room
		socket.emit("joinClassroom", classroomId);
	},

	subscribeToChannelDeletions: (classroomId) => {
		const socket = useAuthStore.getState().socket;
		if (!socket || !classroomId) {
			console.error("Cannot subscribe to channel deletions: socket or classroomId missing");
			return;
		}

		console.log("Subscribing to channel deletions for classroom:", classroomId);

		const channelDeletedHandler = (deletedChannelId) => {
			console.log("Channel deleted:", deletedChannelId);
			set((state) => ({
				channels: state.channels.filter(
					(channel) => channel._id !== deletedChannelId
				),
			}));
		};

		// Clean up previous listener and set up new one
		socket.off('channelDeleted', channelDeletedHandler);
		socket.on('channelDeleted', channelDeletedHandler);
	},

	subscribeToChannelUpdates: (classroomId) => {
		const socket = useAuthStore.getState().socket;
		if (!socket || !classroomId) {
			console.error("Cannot subscribe to channel updates: socket or classroomId missing");
			return;
		}

		console.log("Subscribing to channel updates for classroom:", classroomId);

		const channelUpdatedHandler = (updatedChannel) => {
			if (updatedChannel.classroomId === classroomId) {
				console.log("Channel updated:", updatedChannel);
				set((state) => ({
					channels: state.channels.map((channel) =>
						channel._id === updatedChannel._id ? updatedChannel : channel
					),
				}));
			}
		};

		// Clean up previous listener and set up new one
		socket.off('channelUpdated', channelUpdatedHandler);
		socket.on('channelUpdated', channelUpdatedHandler);
	},

	subscribeToAllChannelEvents: (classroomId) => {
		const store = get();
		if (!classroomId) {
			console.error("Cannot subscribe to channel events: classroomId missing");
			return;
		}

		const socket = useAuthStore.getState().socket;
		console.log("Current socket state:", socket ? "Connected" : "Not connected");
		console.log("Subscribing to all events for classroom:", classroomId);

		// Subscribe to all channel-related events
		store.subscribeToNewChannels(classroomId);
		store.subscribeToChannelDeletions(classroomId);
		store.subscribeToChannelUpdates(classroomId);
	},

	unsubscribeFromChannel: (classroomId) => {
		const socket = useAuthStore.getState().socket;
		if (!socket || !classroomId) {
			console.error("Cannot unsubscribe from channel: socket or classroomId missing");
			return;
		}

		console.log("Unsubscribing from all channel events for classroom:", classroomId);

		// Remove all channel-related event listeners
		socket.off('newChannel');
		socket.off('channelDeleted');
		socket.off('channelUpdated');
		socket.emit("leaveClassroom", classroomId);
	},
}));