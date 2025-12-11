import React from "react";
import Navbar from "../../components/navbar";
import DashboardTabs from "./components/dashboardTabs.jsx";
import DashboardMetrics from "./components/dashboardMetrics.jsx";
import ActiveListings from "./components/activeListings.jsx";
import QuickActions from "./components/quickActions.jsx";
import SavedSearches from "./components/savedSearches.jsx";
import AccountStatus from "./components/accountStatus.jsx";

const index = () => {
  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <DashboardTabs />
        <DashboardMetrics />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <ActiveListings />
          <QuickActions />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <SavedSearches />
          <AccountStatus />
        </div>
      </div>
    </div>
  );
};

export default index;
