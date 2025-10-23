import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./AuthStore";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/assignments" : "/api/assignments";

export const useAssignmentsStore = create((set, get) => ({
    assignments: [],

    getAssignments: async (classroomId, channelId) => {
        try {
            const response = await axios.get(`${API_URL}/getassignments`, {
                params: { classroomId, channelId }
            });
            set({ assignments: response.data });
        } catch (error) {
            console.error("Error fetching assignments:", error);
            throw error;
        }
    }
}));