import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  searchUser: null,
  friend: [],
  requests: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: " + error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  bio: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-bio", data);
      set({ authUser: res.data });
      toast.success("Bio Updated Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture Uploaded Successfully");
    } catch (error) {
      console.log("Error While Uploading");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io("http://localhost:5001", {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  search: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/search-user", data);
      set({ searchUser: res.data });
      //toast.success("search successfull");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  addFriend: async (data) => {
    const { authUser } = get();
    try {
      const res = await axiosInstance.post(`/auth/friend/${authUser}`, data);
      const updatedContacts = res.data.contacts;

      // Update users in Chat Store
      const currentUsers = useChatStore.getState().users;
      const updatedUsers = currentUsers.map((user) =>
        user._id === authUser ? { ...user, contacts: updatedContacts } : user
      );
      useChatStore.getState().setUsers(updatedUsers);

      //toast.success("Friend added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  FriendRequest: async (data) => {
    const { authUser } = get();
    try {
      const res = await axiosInstance.post(
        `/auth/friendrequest/${authUser}`,
        data
      );
      const updatedRequests = res.data.requests;
      toast.success("Request Sent" + updatedRequests);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getRequests: async () => {
    try {
      const res = await axiosInstance.get("/auth/requests");
      set({ requests: res.data });
      //toast.success("Requests Retrieved Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}));
