import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import DashboardTabs from "./components/dashboardTabs.jsx";
import DashboardMetrics from "./components/dashboardMetrics.jsx";
import ActiveListings from "./components/activeListings.jsx";
import QuickActions from "./components/quickActions.jsx";
import SavedSearches from "./components/savedSearches.jsx";
import AccountStatus from "./components/accountStatus.jsx";

const UserDashboardIndex = () => {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [productsRes, convsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products/my-products", { headers }),
          axios.get("http://localhost:5000/api/conversations", { headers }),
        ]);
        const products = productsRes.data?.products || [];
        const conversations = Array.isArray(convsRes.data) ? convsRes.data : [];
        const totalAds = String(products.length);
        const messagesCount = String(conversations.length);
        const profileViews = "0";
        const successfulSales = String(products.filter((p) => p.isSold).length);
        setMetrics([
          { title: "Total Ads", value: totalAds, change: "", icon: null, iconBg: "#e0edff" },
          { title: "Messages", value: messagesCount, change: "", icon: null, iconBg: "#d1fae5" },
          { title: "Profile Views", value: profileViews, change: "", icon: null, iconBg: "#f3e8ff" },
          { title: "Successful Sales", value: successfulSales, change: "", icon: null, iconBg: "#dcfce7" },
        ]);
      } catch {
        setMetrics(null);
      }
    };
    run();
  }, []);
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
        <DashboardMetrics metricsData={metrics} />
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

export default UserDashboardIndex;
