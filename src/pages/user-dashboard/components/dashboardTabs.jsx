import React from "react";
import { useNavigate } from "react-router-dom";
// Ensure you have lucide-react installed
import { 
  LayoutDashboard, Package, Heart, 
  MessageSquare, Settings 
} from "lucide-react";


function DashboardTabs() {
  const navigate = useNavigate();

  const styles = {
    container: {
      width: "95%",
      margin: "30px auto",
      backgroundColor: "#ffffff",
      border: "1px solid #f1f5f9", // Very subtle border
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Better spacing distribution
      padding: "6px", // Padding for the internal "pill" look
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Soft modern shadow
      fontFamily: "'Inter', sans-serif",
    },

    // Base style for all tabs
    tabBase: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      padding: "12px 24px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      flex: 1, // Make tabs take equal width
      textAlign: "center",
    },

    // Style for the inactive tabs
    tabInactive: {
      color: "#64748b", // Slate-500
      backgroundColor: "transparent",
    },

    // Style for the active tab (Overview)
    tabActive: {
      color: "#2563eb", // Primary Blue
      backgroundColor: "#eff6ff", // Blue-50 background
      fontWeight: "600",
    },

    // Wrapper to help center content inside the flex item
    contentWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    // Badge styling (Counters)
    badge: {
      backgroundColor: "#f1f5f9", // Slate-100
      color: "#475569", // Slate-600
      borderRadius: "20px",
      padding: "2px 8px",
      fontSize: "12px",
      fontWeight: "600",
      minWidth: "24px",
      textAlign: "center",
      border: "1px solid #e2e8f0",
    },

    // Specific badge style for the active tab (if needed) or high priority
    badgeActive: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      border: "1px solid #bfdbfe",
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Active Tab: Overview */}
      <div style={{...styles.tabBase, ...styles.tabActive}} >
        <div style={styles.contentWrapper}>
          <LayoutDashboard size={18} strokeWidth={2.5} />
          Overview
        </div>
      </div>

      {/* Listings Tab */}
      <div 
        style={{...styles.tabBase, ...styles.tabInactive}} 
        onClick={() => { navigate('/user-listings') }}
      >
        <div style={styles.contentWrapper}>
          <Package size={18} />
          My Listings
          <span style={styles.badge}>24</span>
        </div>
      </div>

      {/* Favorites Tab */}
      <div 
        style={{...styles.tabBase, ...styles.tabInactive}} 
        onClick={() => { navigate('/user-favorites') }}
      >
        <div style={styles.contentWrapper}>
          <Heart size={18} />
          Favorites
          <span style={styles.badge}>12</span>
        </div>
      </div>

      {/* Messages Tab */}
      <div 
        style={{...styles.tabBase, ...styles.tabInactive}} 
        onClick={() => { navigate('/user-messages') }}
      >
        <div style={styles.contentWrapper}>
          <MessageSquare size={18} />
          Messages
          <span style={styles.badge}>3</span>
        </div>
      </div>

      {/* Settings Tab */}
      <div 
        style={{...styles.tabBase, ...styles.tabInactive}} 
        onClick={() => { navigate('/settings') }}
      >
        <div style={styles.contentWrapper}>
          <Settings size={18} />
          Settings
        </div>
      </div>

    </div>
  );
}

export default DashboardTabs;