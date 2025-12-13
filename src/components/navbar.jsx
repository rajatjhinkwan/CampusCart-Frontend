import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import Profile from "./smallComponents/Profile.jsx";
import { Search, Home, MessageCircle, Grid, Bell } from "lucide-react";
import useUserStore from "../store/userStore.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Tracks current URL
  
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showProfileCard, setShowProfileCard] = useState(false); // Changed default to false (cleaner)

  const profileRef = useRef(null);

  // ✅ ZUSTAND SYNC: Automatically updates when store changes
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Helper to check active path for styling
  const isActive = (path) => location.pathname === path;

  // --------------------------- UI STYLES ---------------------------
  const styles = {
    navbar: {
      width: "100%",
      backgroundColor: "#fff",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 50,
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
    },
    logoBox: {
      backgroundColor: "#2563eb",
      borderRadius: "10px",
      padding: "7px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontWeight: "700",
      fontSize: "20px",
      color: "#111827",
      letterSpacing: "0.5px",
    },
    searchSection: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      overflow: "hidden",
      width: "620px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
      backgroundColor: "#fff",
    },
    searchInput: {
      flex: 1,
      padding: "10px 14px",
      border: "none",
      outline: "none",
      fontSize: "15px",
      color: "#374151",
    },
    dropdown: {
      padding: "10px",
      borderLeft: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
    },
    searchButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 15px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "28px",
    },
    navLink: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      fontSize: "15px",
      color: "#374151",
      fontWeight: 500,
      transition: "0.2s",
    },
    activeLink: {
      color: "#2563eb",
      fontWeight: 600,
    },
    loginButton: {
      backgroundColor: "#2563eb",
      padding: "8px 14px",
      borderRadius: "6px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: 600,
    },
    profileWrapper: {
      position: "relative",
    },
    profileImg: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      cursor: "pointer",
      border: "2px solid #e5e7eb",
    },
    profileCard: {
      position: "absolute",
      right: 0,
      top: "50px", // Increased slightly for spacing
      zIndex: 100,
    },
  };

  return (
    <nav style={styles.navbar}>
      {/* LOGO */}
      <div style={styles.logoSection} onClick={() => navigate("/")}>
        <div style={styles.logoBox}>
          <Grid color="#fff" size={20} />
        </div>
        <h2 style={styles.logoText}>CAMPUS CART</h2>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchSection}>
        <Search color="#6b7280" size={18} style={{ marginLeft: "10px" }} />
        <input
          type="text"
          placeholder="What are you looking for?"
          style={styles.searchInput}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Category</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothes">Clothes</option>
          <option value="Hostel Items">Hostel Items</option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Location</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>

        <button
          style={styles.searchButton}
          onClick={() => {
            if (searchQuery.trim()) {
              const params = new URLSearchParams({
                q: searchQuery.trim(),
                ...(category && { category }),
                ...(locationFilter && { location: locationFilter }),
              });
              navigate(`/search-results?${params.toString()}`);
            }
          }}
        >
          <Search size={18} />
        </button>
      </div>

      {/* RIGHT SIDE NAV */}
      <div style={styles.rightSection}>
        <div
          style={{ ...styles.navLink, ...(isActive("/browse") ? styles.activeLink : {}) }}
          onClick={() => navigate("/browse")}
        >
          <Home size={18} /> Browse
        </div>

        <div
          style={{ ...styles.navLink, ...(isActive("/user-messages") ? styles.activeLink : {}) }}
          onClick={() => navigate("/user-messages")} // Changed to match your MessagesPage route
        >
          <MessageCircle size={18} /> Messages
        </div>

        <div
          style={{ ...styles.navLink, ...(isActive("/notifications") ? styles.activeLink : {}) }}
          onClick={() => navigate("/notifications")}
        >
          <Bell size={18} /> Notifications
        </div>

        <div
          style={{ ...styles.navLink, ...(isActive("/user-dashboard") ? styles.activeLink : {}) }}
          onClick={() => navigate("/user-dashboard")}
        >
          <Grid size={18} /> Dashboard
        </div>

        {/* LOGIN / PROFILE */}
        {isLoggedIn ? (
          <div style={styles.profileWrapper} ref={profileRef}>
            <img
              src={user?.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              style={styles.profileImg}
              onClick={() => setShowProfileCard((prev) => !prev)}
              alt="Profile"
            />

            {showProfileCard && (
              <div style={styles.profileCard}>
                <Profile isVerified={true} />
              </div>
            )}
          </div>
        ) : (
          <div
            style={styles.loginButton}
            onClick={() => navigate("/user-login")}
          >
            Login
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;