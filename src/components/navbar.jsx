import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Profile from "./smallComponents/Profile.jsx";
import { 
  Home, 
  Grid, 
  Box, 
  Building2, 
  Wrench, 
  Briefcase, 
  MapPin, 
  MessageSquare, 
  Plus, 
  Search,
  Bell
} from "lucide-react";
import { useUserStore } from "../store/userStore.js";
import axios from "../lib/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [scrolled, setScrolled] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  
  const isMobile = width < 768;
  const profileRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);
  const conversations = useUserStore((state) => state.conversations || []);
  const fetchConversations = useUserStore((state) => state.fetchConversations);

  useEffect(() => {
    if (isLoggedIn) {
      fetchConversations();
    }
  }, [isLoggedIn, fetchConversations]);

  const unreadCount = Array.isArray(conversations) ? conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) : 0;

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      if (!isLoggedIn) { setNotifCount(0); return; }
      try {
        const res = await axios.get('/api/notifications');
        const list = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
        const unread = list.filter(n => !n.read && !n.isRead).length;
        setNotifCount(unread);
      } catch {
        setNotifCount(0);
      }
    };
    fetchNotificationsCount();
  }, [isLoggedIn]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    const onScroll = () => setScrolled(window.scrollY > 10);
    
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (path) => location.pathname === path;
  const getTabFromSearch = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "";
  };
  const isBrowseActive = (tab) => location.pathname === "/browse" && getTabFromSearch() === tab;

  const styles = {
    navbar: {
      width: "100%",
      backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid transparent",
      padding: isMobile ? "0 16px" : "0 40px",
      display: "flex",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1000,
      height: isMobile ? 64 : 80,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: scrolled ? "0 4px 20px -2px rgba(0, 0, 0, 0.03)" : "none",
    },
    navContainer: {
      width: "100%",
      maxWidth: "1400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      marginRight: "20px",
    },
    brandLogo: {
      width: isMobile ? 32 : 36,
      height: isMobile ? 32 : 36,
      borderRadius: "8px",
      objectFit: "cover",
    },
    logoText: {
      fontWeight: "800",
      fontSize: isMobile ? "20px" : "24px",
      color: "#111827",
      letterSpacing: "-0.5px",
      fontFamily: "'Inter', sans-serif",
    },
    navCenter: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: isMobile ? "0" : "4px",
      borderRadius: isMobile ? "0" : "9999px",
      border: isMobile ? "none" : "1px solid #e5e7eb",
      overflowX: isMobile ? "auto" : "visible",
      position: isMobile ? "absolute" : "static",
      top: isMobile ? "64px" : "auto",
      left: 0,
      width: isMobile ? "100%" : "auto",
      height: isMobile ? "48px" : "auto",
      paddingLeft: isMobile ? "16px" : "4px",
      paddingRight: isMobile ? "16px" : "4px",
      backgroundColor: isMobile ? "#ffffff" : "#f3f4f6",
      borderBottom: isMobile ? "1px solid #f3f4f6" : "1px solid #e5e7eb",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    navLink: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 600,
      transition: "all 0.2s ease",
      padding: "8px 16px",
      borderRadius: "9999px",
      userSelect: "none",
      whiteSpace: "nowrap", // Prevent text wrapping
      flexShrink: 0, // Prevent shrinking
    },
    activeLink: {
      color: "#111827",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "16px",
    },
    iconButton: {
      position: "relative",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      color: "#6b7280",
      cursor: "pointer",
      transition: "all 0.2s",
      backgroundColor: "transparent",
    },
    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: "#ef4444",
      color: "#fff",
      borderRadius: "9999px",
      fontSize: "10px",
      fontWeight: 700,
      padding: "2px 5px",
      minWidth: 16,
      textAlign: "center",
      border: "2px solid #fff",
    },
    sellButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#111827", // Black primary
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      border: "none",
      boxShadow: "0 4px 12px rgba(17, 24, 39, 0.15)",
    },
    loginButton: {
      padding: "10px 24px",
      borderRadius: "9999px",
      backgroundColor: "#2563eb",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background-color 0.2s",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
    },
    profileWrapper: {
      position: "relative",
      marginLeft: "8px",
    },
    profileImg: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      cursor: "pointer",
      border: "2px solid #e5e7eb",
      objectFit: "cover",
      transition: "border-color 0.2s",
    },
    profileCard: {
      position: "absolute",
      right: 0,
      top: "56px",
      zIndex: 100,
      animation: "slideDown 0.2s ease-out",
    },
    spacer: {
      height: isMobile ? 112 : 80,
      width: "100%",
    },
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          {/* Logo */}
          <div style={styles.logoSection} onClick={() => navigate("/")}>
            <div style={{
              width: 36, 
              height: 36, 
              backgroundColor: "#2563eb", 
              borderRadius: "10px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "white"
            }}>
              <Box size={22} strokeWidth={2.5} />
            </div>
            <h2 style={styles.logoText}>Society Connect</h2>
          </div>

          {/* Center Navigation (Desktop) */}
          <div style={styles.navCenter}>
            <div
              style={{ ...styles.navLink, ...(isActive("/") ? styles.activeLink : {}) }}
              onClick={() => navigate("/")}
            >
              Home
            </div>
            <div
              style={{ ...styles.navLink, ...(isBrowseActive("Products") ? styles.activeLink : {}) }}
              onClick={() => navigate("/browse?tab=Products")}
            >
              Products
            </div>
            <div
              style={{ ...styles.navLink, ...(isBrowseActive("Rooms") ? styles.activeLink : {}) }}
              onClick={() => navigate("/browse?tab=Rooms")}
            >
              Rooms
            </div>
            <div
              style={{ ...styles.navLink, ...(isBrowseActive("Services") ? styles.activeLink : {}) }}
              onClick={() => navigate("/browse?tab=Services")}
            >
              Services
            </div>
            <div
              style={{ ...styles.navLink, ...(isBrowseActive("Jobs") ? styles.activeLink : {}) }}
              onClick={() => navigate("/browse?tab=Jobs")}
            >
              Jobs
            </div>
            <div
              style={{ ...styles.navLink, ...(isActive("/requests") ? styles.activeLink : {}) }}
              onClick={() => navigate("/requests")}
            >
              Requests
            </div>
          </div>

          {/* Right Actions */}
          <div style={styles.rightSection}>
            {/* Ride Share Button (Icon only on mobile, Text on Desktop) */}
            <div 
              style={{ 
                ...styles.iconButton, 
                width: "auto", 
                padding: "0 12px", 
                gap: "8px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                fontWeight: 600,
                fontSize: "13px"
              }}
              onClick={() => navigate("/rides")}
            >
              <MapPin size={18} />
              {!isMobile && "Ride Share"}
            </div>

            {isLoggedIn ? (
              <>
                {/* Messages */}
                <div
                  style={styles.iconButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  onClick={() => navigate("/user-messages")}
                >
                  <MessageSquare size={20} />
                  {unreadCount > 0 && (
                    <span style={styles.badge}>
                      {Math.min(99, unreadCount)}
                    </span>
                  )}
                </div>

                <div
                  style={styles.iconButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  onClick={() => navigate("/notifications")}
                >
                  <Bell size={20} />
                  {notifCount > 0 && (
                    <span style={styles.badge}>
                      {Math.min(99, notifCount)}
                    </span>
                  )}
                </div>

                {/* Sell Button */}
                <button 
                  style={styles.sellButton}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => navigate("/sell-item")}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  {!isMobile && "SELL"}
                </button>

                {/* Profile */}
                <div style={styles.profileWrapper} ref={profileRef}>
                  <img
                    src={(user && (user.avatar?.url || user.image)) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    style={styles.profileImg}
                    onClick={() => setShowProfileCard((prev) => !prev)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#9ca3af"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                    alt="Profile"
                  />
                  {showProfileCard && (
                    <div style={styles.profileCard}>
                      <Profile isVerified={true} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={styles.loginButton}
                onClick={() => navigate("/user-login")}
              >
                Login
              </div>
            )}
          </div>
        </div>
      </nav>
      <div style={styles.spacer} />
    </>
  );
};

export default Navbar;
