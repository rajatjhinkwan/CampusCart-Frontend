import React from "react";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

// Ensure you have installed: npm install react-icons
import {
  MdDashboard,
  MdMailOutline,
  MdPersonOutline,
  MdListAlt,
  MdFavoriteBorder,
  MdSettings,
  MdExitToApp
} from 'react-icons/md';

function Profile() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const conversations = useUserStore((state) => state.conversations || []);
  const unreadCount = Array.isArray(conversations) ? conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) : 0;

  const logout = useUserStore((state) => state.logout);

  const logoutUser = () => {
    logout();
    localStorage.clear();
    navigate("/homepage");
  };

  const styles = {
    container: {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      width: "350px",
      padding: "20px", // Reduced container padding
      borderRadius: "16px", // Slightly smaller border radius
      fontFamily: "'Inter', sans-serif",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04)",
      border: "1px solid #edf2f7",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px", // Reduced bottom margin
      borderBottom: "1px solid #e2e8f0",
      paddingBottom: "15px", // Reduced bottom padding
    },
    profileImage: {
      width: "56px", // Reduced from 64px
      height: "56px", // Reduced from 64px
      borderRadius: "50%",
      background: "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px", // Adjusted font size
      fontWeight: "600",
      marginRight: "15px", // Reduced margin
      boxShadow: "0 3px 8px rgba(99, 102, 241, 0.2)",
    },
    verified: {
      color: "#10b981",
      fontSize: "13px", // Slightly smaller font
      marginLeft: "8px", // Reduced margin
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
    },
    email: {
      color: "#6b7280",
      fontSize: "13px", // Smaller font
      marginTop: "1px", // Reduced margin
    },
    member: {
      color: "#9ca3af",
      fontSize: "11px", // Smallest font for least important info
      marginTop: "2px", // Reduced margin
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 10px", // Key change: Reduced vertical padding (was 16px)
      borderRadius: "8px",
      borderBottom: "1px solid #f3f4f6",
      cursor: "pointer",
      transition: "background-color 0.2s ease, transform 0.1s ease",
    },
    menuIcon: {
      fontSize: "20px", // Slightly smaller icons
      marginRight: "12px", // Reduced margin
      color: "#6366f1",
      minWidth: "22px", // Consistent width
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    menuText: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
    mainText: {
      fontSize: "16px", // Slightly smaller
      fontWeight: "500",
      color: "#1f2937",
    },
    subText: {
      fontSize: "12px", // Slightly smaller
      color: "#9ca3af",
      marginTop: "2px", // Reduced margin
    },
    badge: {
      backgroundColor: "#ef4444",
      borderRadius: "10px",
      minWidth: "20px",
      height: "20px",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 6px", // Reduced horizontal padding
      marginLeft: "10px",
    },
    chevron: {
      color: "#cbd5e1",
      fontSize: "16px", // Smaller chevron
      marginLeft: "10px",
    },
    signOut: {
      marginTop: "15px", // Reduced margin
      paddingTop: "15px", // Reduced padding
      borderTop: "1px solid #e2e8f0",
      fontSize: "16px",
      color: "#ef4444",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px", // Reduced gap
      paddingLeft: "10px",
      transition: "color 0.2s ease",
    },
    signOutIcon: {
      fontSize: "20px", // Smaller icon
      color: "#ef4444",
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Profile */}
      <div style={styles.profileSection}>
        <div style={styles.profileImage}>
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "17px", color: "#1f2937", display: "flex", alignItems: "center" }}>
            {user?.name || "Unknown User"}
            <span style={styles.verified}>
              <span style={{ fontSize: '15px', marginRight: '3px' }}>✓</span> Verified
            </span>
          </div>
          <div style={styles.email}>{user?.email || "Not Available"}</div>
          <div style={styles.member}>Member since 2023</div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ ...styles.menuItem, borderTop: "1px solid #f3f4f6" }} onClick={() => navigate('/user-dashboard')}>
        <div style={styles.menuIcon}><MdDashboard /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText} >Dashboard</span>
          <span style={styles.subText}>Manage your listings</span>
        </div>
        <span style={styles.chevron}>&gt;</span>
      </div>
      {user?.role === 'admin' && (
        <div style={styles.menuItem} onClick={() => navigate('/admin-dashboard')}>
          <div style={styles.menuIcon}><MdDashboard /></div>
          <div style={styles.menuText}>
            <span style={styles.mainText}>Admin Dashboard</span>
            <span style={styles.subText}>Manage users & reports</span>
          </div>
          <span style={styles.chevron}>&gt;</span>
        </div>
      )}

      <div style={styles.menuItem} onClick={() => navigate('/user-messages')}>
        <div style={styles.menuIcon}><MdMailOutline /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText}>Messages</span>
          <span style={styles.subText}>Chat with buyers & sellers</span>
        </div>
        <div style={styles.badge}>3</div>
      </div>

      <div style={styles.menuItem} onClick={() => navigate('/user-profile')}>
        <div style={styles.menuIcon}><MdPersonOutline /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText}>My Profile</span>
          <span style={styles.subText}>View and edit profile</span>
        </div>
        <span style={styles.chevron}>&gt;</span>
      </div>

      <div style={styles.menuItem} onClick={() => navigate('/user-listings')}>
        <div style={styles.menuIcon}><MdListAlt /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText}>My Listings</span>
          <span style={styles.subText}>Active and sold items</span>
        </div>
        <div style={styles.badge}>2</div>
      </div>

      <div style={styles.menuItem} onClick={() => navigate('/user-favorites')}>
        <div style={styles.menuIcon}><MdFavoriteBorder /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText}>Favorites</span>
          <span style={styles.subText}>Saved items</span>
        </div>
        <div style={styles.badge}>1</div>
      </div>

      <div style={{ ...styles.menuItem, borderBottom: 'none' }} onClick={() => navigate('/settings')}>
        <div style={styles.menuIcon}><MdSettings /></div>
        <div style={styles.menuText}>
          <span style={styles.mainText}>Settings</span>
          <span style={styles.subText}>Account preferences</span>
        </div>
        <span style={styles.chevron}>&gt;</span>
      </div>

      {/* Logout Button */}
      <div style={styles.signOut} onClick={logoutUser}>
        <MdExitToApp style={styles.signOutIcon} /> Sign Out
      </div>
    </div>
  );
}

export default Profile;
