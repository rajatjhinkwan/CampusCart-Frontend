import React, { useEffect } from "react";
import Routes from "./Routes";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useUserStore } from "./store/userStore"; // Import the store

const App = () => {
  // Get the checkAuth function from the store
  const checkAuth = useUserStore((state) => state.checkAuth);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchWishlist = useUserStore((state) => state.fetchWishlist);

  useEffect(() => {
    // Check if user is logged in when app loads/refreshes
    checkAuth();
  }, []); // Remove checkAuth from dependencies to prevent infinite loop

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  return (
    <div>
      <Routes />
    </div>
  );
};

export default App;
