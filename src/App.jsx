import React, { useEffect } from "react";
import Routes from "./Routes";
import '@fortawesome/fontawesome-free/css/all.min.css';
import useUserStore from "./store/userStore"; // Import the store

const App = () => {
  // Get the checkAuth function from the store
  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    // Check if user is logged in when app loads/refreshes
    checkAuth();
  }, []); // Remove checkAuth from dependencies to prevent infinite loop

  return (
    <div>
      <Routes />
    </div>
  );
};

export default App;