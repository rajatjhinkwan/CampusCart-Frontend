import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
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
        const [productsRes, convsRes] = await Promise.all([
          axios.get("/api/products/my-products"),
          axios.get("/api/conversations"),
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

        {/* Dashboard Guide */}
        <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd', width: '100%', maxWidth: '800px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0369a1', marginBottom: 8 }}>Dashboard Guide</h4>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e0edff' }}></span>
                    <span>Total Ads</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#d1fae5' }}></span>
                    <span>Messages</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f3e8ff' }}></span>
                    <span>Profile Views</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dcfce7' }}></span>
                    <span>Successful Sales</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardIndex;
