  import { create } from "zustand";
  import { axiosInstance } from "../lib/axios";
  import toast from "react-hot-toast";
  import { useAuthStore } from "./useAuthStore";

  export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    Allusers : [],
    selectedUser: null,
    isUserLoading: false,
    isAllUserLoading : false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
           // toast.success("Users Retrieved Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    setUsers: (newUsers) => {
      set({ users: [...newUsers] }); // Use a new reference
  },


    getAllUsers : async() => {
      set({ isAllUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/allusers");
            set({ Allusers: res.data });
            toast.success("Users Retrieved Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isAllUserLoading: false });
        }
  },

    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data });
        toast.success("Messages Retrieved Successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    sendMessages: async (messageData) => {
      const { selectedUser, messages } = get();
      try {
        const res = await axiosInstance.post(
          `/message/send/${selectedUser._id}`,
          messageData
        );
        set({ messages: [...messages, res.data] });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    subscribeToMessages : () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (data) => {

          if(data.senderId!== selectedUser._id) return;
          set({
            messages : [...get().messages, data],
          })
        })
    },
    unsubscribeToMessages : () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => {
      set({ selectedUser });
    },
  }));
