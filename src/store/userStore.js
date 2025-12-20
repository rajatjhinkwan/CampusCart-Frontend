import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: null,
            checkedAuth: false,
            isAuthenticated: false,
            appLocation: null,

            // Helper to reset error
            clearError: () => set({ error: null }),

            signup: async ({ name, email, password, role, location }) => {
                set({ loading: true, error: null });
                try {
                    const res = await axios.post('/api/auth/signup', { name, email, password, role, location });
                    // Signup now sends OTP, does not return tokens yet
                    set({ loading: false });
                    toast.success(res.data.message || 'OTP Sent!');
                    return { success: true, userId: res.data.userId, email: res.data.email };
                } catch (error) {
                    console.error("Signup error:", error);
                    const message = error.response?.data?.message || 'Signup failed';
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            verifyOtp: async ({ userId, otp }) => {
                set({ loading: true, error: null });
                try {
                    const res = await axios.post('/api/auth/verify-otp', { userId, otp });
                    set({
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                        loading: false,
                        isAuthenticated: true,
                    });
                    toast.success('Email verified successfully!');
                    return { success: true };
                } catch (error) {
                    console.error("OTP Verification error:", error);
                    const message = error.response?.data?.message || 'Verification failed';
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            googleLogin: async (credential) => {
                set({ loading: true, error: null });
                try {
                    const res = await axios.post('/api/auth/google', { token: credential });
                    set({
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                        loading: false,
                        isAuthenticated: true,
                    });
                    toast.success('Google Login Successful!');
                    return { success: true };
                } catch (error) {
                    console.error("Google Login error:", error);
                    const message = error.response?.data?.message || 'Google Login failed';
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            login: async ({ email, password }) => {
                set({ loading: true, error: null });
                try {
                    const res = await axios.post('/api/auth/login', { email, password });
                    set({
                        user: res.data.user, // Ensure backend returns 'user' object structure as expected
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                        loading: false,
                        isAuthenticated: true,
                    });
                    toast.success('Logged in successfully!');
                    return { success: true };
                } catch (error) {
                    console.error("Login error:", error);
                    const message = error.response?.data?.message || 'Login failed';
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            logout: async () => {
                set({ loading: true });
                try {
                    await axios.post('/api/auth/logout');
                    // Even if API call fails, we clear local state
                } catch (error) {
                    console.error("Logout warning:", error);
                } finally {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        loading: false,
                        isAuthenticated: false,
                    });
                    toast.success('Logged out');
                }
                return { success: true };
            },

            checkAuth: async () => {
                // If we have no token, don't bother calling API, but mark as checked
                const token = get().accessToken;
                if (!token) {
                    set({ checkedAuth: true, isAuthenticated: false });
                    return;
                }

                set({ loading: true });
                try {
                    const res = await axios.get('/api/auth/me');
                    set({ user: res.data, loading: false, checkedAuth: true, isAuthenticated: true });
                } catch (error) {
                    console.error("CheckAuth error:", error);
                    // If 401, token is invalid. Try refresh or logout.
                    if (error.response?.status === 401) {
                        await get().regenerateAccessToken();
                    } else {
                        // Some other error, maybe offline? 
                        set({ loading: false, checkedAuth: true, isAuthenticated: false });
                    }
                }
            },

            // Action to refresh access token
            regenerateAccessToken: async () => {
                const rToken = get().refreshToken;
                if (!rToken) {
                    set({ user: null, accessToken: null, refreshToken: null, loading: false, checkedAuth: true, isAuthenticated: false });
                    return;
                }

                try {
                    // Assuming endpoint expects token in body or cookie. 
                    // Based on controller: req.body.token || req.cookies.refreshToken
                    const res = await axios.post('/api/auth/refresh', { token: rToken });
                    set({ accessToken: res.data.accessToken, loading: false, checkedAuth: true, isAuthenticated: true });
                    // Optionally retry original failed request here if this was triggered primarily by an interceptor,
                    // but since this is a manual checkAuth/refresh flow, we just update state.
                } catch (err) {
                    console.error("Refresh token failed:", err);
                    set({ user: null, accessToken: null, refreshToken: null, loading: false, checkedAuth: true, isAuthenticated: false });
                    toast.error("Session expired, please login again.");
                }
            },

            updateProfile: async (data) => {
                set({ loading: true, error: null });
                try {
                    // 'data' can be FormData (for images) or plain object
                    // Use canonical users/me endpoint which the backend provides
                    const res = await axios.put('/api/users/me', data);
                    // backend may return { user: { ... } } or just the user object
                    set({ user: (res.data?.user || res.data), loading: false });
                    toast.success('Profile updated');
                } catch (error) {
                    set({ loading: false, error: error.response?.data?.message || 'Update failed' });
                    toast.error("Failed to update profile");
                }
            },

            // Set application-level location (used by Near Me, filters, etc.)
            setAppLocation: async (locationString, options = {}) => {
                const { saveToProfile = true } = options;
                set({ appLocation: locationString });
                try {
                    // Optionally persist to user profile when authenticated
                    if (saveToProfile && get().isAuthenticated) {
                        await axios.put('/api/users/me', { location: locationString });
                        const me = await axios.get('/api/users/me');
                        set({ user: (me.data?.user || me.data) });
                    }
                } catch (err) {
                    // non-fatal; keep local appLocation
                    console.warn('setAppLocation failed', err?.message || err);
                }
            },

            forgotPassword: async (email) => {
                set({ loading: true, error: null });
                try {
                    await axios.post('/api/auth/forgot-password', { email });
                    set({ loading: false });
                    toast.success("Password reset link sent to email");
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || "Available only for registered users";
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            resetPassword: async (token, password) => {
                set({ loading: true, error: null });
                try {
                    await axios.post(`/api/auth/reset-password/${token}`, { password });
                    set({ loading: false });
                    toast.success("Password reset successful, please login.");
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || "Failed to reset password";
                    set({ loading: false, error: message });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            // ============================================
            // 💬 MESSAGING ACTIONS
            // ============================================
            conversations: [],
            selectedConversation: null,
            messages: { messages: [] }, // Structure matches API response { messages: [] }
            conversationsLoading: false,
            messagesLoading: false,
            conversationsError: null,
            messagesError: null,

            fetchConversations: async () => {
                set({ conversationsLoading: true, conversationsError: null });
                try {
                    const res = await axios.get('/api/conversations');
                    set({ conversations: res.data, conversationsLoading: false });
                } catch (error) {
                    console.error("Fetch conversations error:", error);
                    set({
                        conversationsLoading: false,
                        conversationsError: error.response?.data?.message || 'Failed to load conversations'
                    });
                }
            },

            startConversation: async ({ recipientId, productId, contextType }) => {
                try {
                    console.log(`Starting conversation with ${recipientId} for ${productId} (${contextType})`);
                    const res = await axios.post('/api/conversations', {
                        receiverId: recipientId,
                        productId, // kept for backward compatibility if needed, but backend uses it as contextId
                        contextId: productId, // explicitly sending as contextId too
                        contextType: contextType || "Product", // Default to Product
                    });
                    const conv = res.data?.conversation || res.data || {};
                    const convId = (conv._id || conv.id || '').toString();
                    await get().fetchConversations();
                    if (convId) {
                        set({ selectedConversation: convId });
                    }
                    return { success: true, conversationId: convId };
                } catch (error) {
                    console.error("Start conversation error:", error);
                    const msg = error.response?.data?.message || 'Failed to start conversation';
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },

            selectConversation: (conversationId) => {
                set({ selectedConversation: conversationId });
                // Optionally clear messages or keep them until new ones load
                // get().fetchMessages(conversationId); // Usually handled by component effect, but can be here too.
                // We'll let the component trigger fetchMessages to allow refined control
            },

            fetchMessages: async (conversationId) => {
                if (!conversationId) return;
                set({ messagesLoading: true, messagesError: null });
                try {
                    const res = await axios.get(`/api/messages/conversation/${conversationId}`);
                    set({ messages: res.data, messagesLoading: false });
                } catch (error) {
                    console.error("Fetch messages error:", error);
                    set({
                        messagesLoading: false,
                        messagesError: error.response?.data?.message || 'Failed to load messages'
                    });
                }
            },

            markMessagesRead: async (conversationId) => {
                try {
                    if (!conversationId) return;
                    await axios.put(`/api/messages/conversation/${conversationId}/read`);
                } catch (error) {
                    console.error("Mark messages read error:", error);
                }
            },

            sendMessage: async (conversationId, content) => {
                try {
                    // Optimistic update could go here, but for now we wait for server
                    const res = await axios.post('/api/messages', {
                        conversationId,
                        text: content
                    });

                    // The socket usually listens for 'newMessage' to update the UI, 
                    // but we can also manually append if we want instant feedback without socket lag
                    // However, MessagesPage logic relies on fetching or socket events.
                    // We'll just return success.
                    // Optionally refresh messages if you want to be sure (or rely on socket)
                    const currentMessages = get().messages;
                    if (currentMessages && currentMessages.messages) {
                        // safety check to make sure we are adding to the right conversation context if needed
                        // For simplicity, we assume the socket will handle the update or component re-fetch.
                        // But appending here makes it snappy:
                        set({
                            messages: {
                                messages: [...currentMessages.messages, res.data]
                            }
                        });
                    }

                    return { success: true };
                } catch (error) {
                    console.error("Send message error:", error);
                    const msg = error.response?.data?.message || "Failed to send message";
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },
            
            uploadMessageAttachments: async (files, onProgress) => {
                try {
                    const fd = new FormData();
                    Array.from(files || []).forEach((f) => fd.append('images', f));
                    const res = await axios.post('/api/messages/attachments', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (evt) => {
                            if (!evt.total) return;
                            const pct = Math.round((evt.loaded / evt.total) * 100);
                            if (typeof onProgress === 'function') onProgress(pct);
                        }
                    });
                    const urls = res.data?.attachments || [];
                    return { success: true, urls };
                } catch (error) {
                    console.error("Upload attachments error:", error);
                    const msg = error.response?.data?.message || "Failed to upload attachments";
                    toast.error(msg);
                    return { success: false, error: msg, urls: [] };
                }
            },
            
            sendMessageWithAttachments: async (conversationId, content, attachments = []) => {
                try {
                    const res = await axios.post('/api/messages', {
                        conversationId,
                        text: content,
                        attachments
                    });
                    const currentMessages = get().messages;
                    if (currentMessages && currentMessages.messages) {
                        set({
                            messages: {
                                messages: [...currentMessages.messages, res.data]
                            }
                        });
                    }
                    return { success: true };
                } catch (error) {
                    console.error("Send message with attachments error:", error);
                    const msg = error.response?.data?.message || "Failed to send message";
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },

            wishlistProductIds: [],
            fetchWishlist: async () => {
                try {
                    const res = await axios.get('/api/wishlist/me');
                    const products = res.data?.wishlist?.products || [];
                    const ids = products.map((p) => (p._id || p.id || '').toString()).filter(Boolean);
                    set({ wishlistProductIds: ids });
                } catch (error) {
                    console.error("Fetch wishlist error:", error);
                }
            },
            addToWishlist: async (productId) => {
                try {
                    const id = (productId || '').toString();
                    await axios.post('/api/wishlist/add', { productId: id });
                    const prev = get().wishlistProductIds;
                    const next = prev.includes(id) ? prev : [...prev, id];
                    set({ wishlistProductIds: next });
                    toast.success('Added to favorites');
                    return { success: true };
                } catch (error) {
                    const msg = error.response?.data?.message || 'Failed to add to favorites';
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },
            removeFromWishlist: async (productId) => {
                try {
                    const id = (productId || '').toString();
                    await axios.post('/api/wishlist/remove', { productId: id });
                    const prev = get().wishlistProductIds;
                    const next = prev.filter((x) => x !== id);
                    set({ wishlistProductIds: next });
                    toast.success('Removed from favorites');
                    return { success: true };
                } catch (error) {
                    const msg = error.response?.data?.message || 'Failed to remove from favorites';
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },
            toggleWishlist: async (productId) => {
                const id = (productId || '').toString();
                const exists = get().wishlistProductIds.includes(id);
                return exists ? get().removeFromWishlist(id) : get().addToWishlist(id);
            }

        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            }), // Only persist these fields
        }
    )
);
