import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Configure axios defaults
axios.defaults.baseURL = API;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API}/api/auth/refresh`, {
            token: refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userDetails");
          window.location.href = "/user-login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

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

          if (!accessToken || !user) {
            throw new Error("Invalid response from server");
          }

          // Persistence into localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userDetails", JSON.stringify(user));

          // Set axios default header
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || "Login failed";
          set({ loading: false, error: errorMessage });
          return {
            success: false,
            error: errorMessage,
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

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Validate token by fetching user profile
          const res = await axios.get(`${API}/api/auth/me`);
          const user = res.data || (userData ? JSON.parse(userData) : null);

          set({
            user,
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
                user: profileRes.data || (userData ? JSON.parse(userData) : null),
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
          await axios.post(`${API}/api/messages`, {
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
