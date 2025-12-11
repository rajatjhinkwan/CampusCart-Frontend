import React from "react";
import { Package, MessageCircle, Eye, TrendingUp } from "lucide-react"; // ✅ For icons

const DashboardMetrics = () => {
  // All data and text in one place
  const metricsData = [
    {
      title: "Total Ads",
      value: "24",
      change: "+3 this month",
      icon: <Package color="#3b82f6" size={24} />,
      iconBg: "#e0edff",
    },
    {
      title: "Messages",
      value: "156",
      change: "+12 this month",
      icon: <MessageCircle color="#22c55e" size={24} />,
      iconBg: "#d1fae5",
    },
    {
      title: "Profile Views",
      value: "1,247",
      change: "+89 this month",
      icon: <Eye color="#a855f7" size={24} />,
      iconBg: "#f3e8ff",
    },
    {
      title: "Successful Sales",
      value: "18",
      change: "+2 this month",
      icon: <TrendingUp color="#10b981" size={24} />,
      iconBg: "#dcfce7",
    },
  ];

  // Styling objects
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    justifyContent: "center",
    marginTop: "10px",
  };

  const cardStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "250px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const cardHover = {
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: "translateY(-3px)",
  };

  const titleStyle = {
    fontSize: "15px",
    color: "#6b7280",
    fontWeight: 500,
  };

  const valueStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#111827",
    margin: "4px 0",
  };

  const changeStyle = {
    fontSize: "14px",
    color: "#10b981",
    marginTop: "5px",
  };

  const iconBox = (bgColor) => ({
    backgroundColor: bgColor,
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  // Component rendering
  return (
    <div style={containerStyle}>
      {metricsData.map((metric, index) => (
        <div
          key={index}
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <div>
            <p style={titleStyle}>{metric.title}</p>
            <h2 style={valueStyle}>{metric.value}</h2>
            <p style={changeStyle}>{metric.change}</p>
          </div>
          <div style={iconBox(metric.iconBg)}>{metric.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
