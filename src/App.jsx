import React, { useEffect } from "react";
import Routes from "./Routes";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useUserStore } from "./store/userStore"; // Import the store
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import InstallPWA from "./components/pwa/InstallPWA";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const App = () => {
  // Get the checkAuth function from the store
  const checkAuth = useUserStore((state) => state.checkAuth);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const accessToken = useUserStore((state) => state.accessToken);
  const fetchWishlist = useUserStore((state) => state.fetchWishlist);
  const fetchConversations = useUserStore((state) => state.fetchConversations);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Check if user is logged in when app loads/refreshes
    checkAuth();
  }, []); // Remove checkAuth from dependencies to prevent infinite loop

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
      fetchConversations(); // Initial fetch for unread count
    }
  }, [isAuthenticated, fetchWishlist, fetchConversations]);

  // Global Socket Listener for Real-time Notifications/Unread Counts
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const socket = io(`${API}/chat`, {
      auth: { token: accessToken },
    });

    socket.on('connect', () => {
      console.log('Global socket connected');
    });

    socket.on('newMessage', (msg) => {
      console.log('New message received globally', msg);
      // Refresh conversations to update unread count
      fetchConversations();
      
      // Optional: Show toast if not on messages page
      if (!window.location.pathname.includes('/messages')) {
        const senderName = msg.sender?.name || 'Someone';
        toast(`New message from ${senderName}`, {
          icon: '💬',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, accessToken, fetchConversations]);

  return (
    <div>
      <Routes />
      <InstallPWA />
    </div>
  );
};

export default App;
