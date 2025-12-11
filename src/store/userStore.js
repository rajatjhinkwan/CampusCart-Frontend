import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      conversations: [],
      selectedConversation: null,
      messages: [],
      conversationsLoading: false,
      messagesLoading: false,
      conversationsError: null,
      messagesError: null,

      // -----------------------------
      // SIGNUP
      // -----------------------------
      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${API}/api/auth/signup`, data);
          return { success: true, message: res.data.message };
        } catch (err) {
          return {
            success: false,
            error: err.response?.data?.message || "Signup failed",
          };
        } finally {
          set({ loading: false });
        }
      },

      // -----------------------------
      // LOGIN
      // -----------------------------
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${API}/api/auth/login`, {
            email,
            password,
          });

          const { user, accessToken, refreshToken } = res.data;

          // Persistence into localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userDetails", JSON.stringify(user));

          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (err) {
          set({ loading: false });
          return {
            success: false,
            error: err.response?.data?.message || "Login failed",
          };
        }
      },

      // -----------------------------
      // LOGOUT
      // -----------------------------
      logout: () => {
        delete axios.defaults.headers.common["Authorization"];

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userDetails");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // -----------------------------
      // CHECK AUTH ON PAGE REFRESH
      // -----------------------------
      checkAuth: async () => {
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userData = localStorage.getItem("userDetails");

        if (!token || !userData) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Validate token
          const res = await axios.get(`${API}/api/auth/me`);

          set({
            user: res.data || JSON.parse(userData),
            accessToken: token,
            refreshToken: refreshToken,
            isAuthenticated: true,
          });

        } catch (err) {
          console.log("Access token expired. Attempting to refresh...");
          if (refreshToken) {
            try {
              // Try to refresh the access token
              const refreshRes = await axios.post(`${API}/api/auth/refresh`, {
                token: refreshToken,
              });

              const newAccessToken = refreshRes.data.accessToken;

              // Update localStorage and axios headers
              localStorage.setItem("accessToken", newAccessToken);
              axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

              // Retry getting user profile with new token
              const profileRes = await axios.get(`${API}/api/auth/me`);

              set({
                user: profileRes.data || JSON.parse(userData),
                accessToken: newAccessToken,
                refreshToken: refreshToken,
                isAuthenticated: true,
              });

            } catch (refreshErr) {
              console.log("Refresh token expired or invalid. Logging out.");
              get().logout();
            }
          } else {
            console.log("No refresh token. Logging out.");
            get().logout();
          }
        }
      },

      // -----------------------------
      // FETCH CONVERSATIONS
      // -----------------------------
      fetchConversations: async () => {
        set({ conversationsLoading: true, conversationsError: null });

        try {
          const res = await axios.get(`${API}/api/conversations`);
          set({
            conversations: res.data,
            conversationsLoading: false,
          });
        } catch (err) {
          set({
            conversationsError:
              err.response?.data?.message || "Failed to fetch conversations",
            conversationsLoading: false,
          });
        }
      },

      // -----------------------------
      // SELECT CONVERSATION
      // -----------------------------
      selectConversation: async (conversationId) => {
        set({ selectedConversation: conversationId });
        await get().fetchMessages(conversationId);
      },

      // -----------------------------
      // FETCH MESSAGES
      // -----------------------------
      fetchMessages: async (conversationId) => {
        set({ messagesLoading: true, messagesError: null });

        try {
          const res = await axios.get(
            `${API}/api/messages/conversation/${conversationId}`
          );

          set({
            messages: res.data,  // messages.messages or res.data.messages is inside your UI
            messagesLoading: false,
          });
        } catch (err) {
          set({
            messagesError:
              err.response?.data?.message || "Failed to fetch messages",
            messagesLoading: false,
          });
        }
      },

      // -----------------------------
      // SEND MESSAGE (FIXED)
      // -----------------------------
      sendMessage: async (conversationId, content) => {
        try {
          const res = await axios.post(`${API}/api/messages`, {
            conversationId,
            content, // REQUIRED: backend expects content
          });

          await get().fetchMessages(conversationId);

          return { success: true };
        } catch (err) {
          return {
            success: false,
            error: err.response?.data?.message || "Failed to send message",
          };
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
