import React from "react";

export default function SellingDashboard() {
  const stats = [
    { label: "Total Listings", value: 12 },
    { label: "Items Sold", value: 5 },
    { label: "Total Views", value: 842 },
    { label: "Followers", value: 32 },
  ];

  const insights = [
    {
      id: 1,
      title: "HP Pavilion Laptop",
      views: 210,
      inquiries: 8,
      status: "Active",
    },
    {
      id: 2,
      title: "Casual Shoes",
      views: 120,
      inquiries: 3,
      status: "Sold",
    },
  ];

  const container = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const title = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "26px",
  };

  const statCard = {
    padding: "16px",
    background: "#f1f5f9",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  };

  const statValue = {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "6px",
  };

  const statLabel = {
    fontSize: "14px",
    color: "#475569",
  };

  const insightsContainer = {
    marginTop: "10px",
  };

  const insightCard = {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    marginBottom: "14px",
  };

  const itemTitle = {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const small = {
    fontSize: "13px",
    color: "#475569",
    marginBottom: "3px",
  };

  const statusPill = (state) => ({
    display: "inline-block",
    padding: "4px 10px",
    fontSize: "12px",
    borderRadius: "20px",
    background: state === "Active" ? "#d1fae5" : "#fde7e7",
    color: state === "Active" ? "#047857" : "#991b1b",
    marginTop: "6px",
  });

  return (
    <div style={container}>
      {/* PAGE TITLE */}
      <h2 style={title}>Selling Dashboard</h2>

      {/* QUICK STATS */}
      <div style={statsGrid}>
        {stats.map((item, index) => (
          <div key={index} style={statCard}>
            <div style={statValue}>{item.value}</div>
            <div style={statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
        Product Insights
      </h3>

      <div style={insightsContainer}>
        {insights.map((item) => (
          <div key={item.id} style={insightCard}>
            <div style={itemTitle}>{item.title}</div>
            <div style={small}>Views: {item.views}</div>
            <div style={small}>Inquiries: {item.inquiries}</div>
            <div style={statusPill(item.status)}>{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
