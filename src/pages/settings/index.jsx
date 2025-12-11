import React, { useState } from "react";
import { styles } from "./styles";

import Sidebar from "./components/Sidebar";

// --- UPDATED COMPONENT IMPORTS (MATCHING NEW SIDEBAR) ---
import ProfileSettings from "./components/ProfileSettings.jsx";
import SecuritySettings from "./components/SecuritySettings.jsx";
import YourProducts from "./components/YourProducts.jsx";
import SellingDashboard from "./components/SellingDashboard.jsx";
import PaymentsTransactions from "./components/PaymentsTransactions.jsx";
import NotificationsSettings from "./components/NotificationsSettings.jsx";
import PrivacySettings from "./components/PrivacySettings.jsx";
import AppPreferences from "./components/AppPreferences.jsx";
import ListingsSelling from "./components/ListingsSelling.jsx";

export default function SettingsPage() {
  // DEFAULT TAB
  const [activeTab, setActiveTab] = useState("profile");

  // RENDER SCREEN BASED ON TAB
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "products":
        return <YourProducts />;
      case "selling":
        return <SellingDashboard />;
      case "payments":
        return <PaymentsTransactions />;
      case "notifications":
        return <NotificationsSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "preferences":
        return <AppPreferences />;
      case "listings":
        return <ListingsSelling />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Settings</h1>
        <button style={styles.buttonPrimary}>Save Changes</button>
      </div>

      {/* Content Area */}
      <div style={styles.mainContent}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ flex: 1 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
