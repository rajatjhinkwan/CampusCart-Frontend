import React from "react";
import { Package, MessageCircle, Eye, TrendingUp } from "lucide-react";

const DashboardMetrics = ({ metricsData }) => {
  const defaults = [
    { title: "Total Ads", value: "0", change: "", icon: <Package color="#3b82f6" size={24} />, iconBg: "#e0edff" },
    { title: "Messages", value: "0", change: "", icon: <MessageCircle color="#22c55e" size={24} />, iconBg: "#d1fae5" },
    { title: "Profile Views", value: "0", change: "", icon: <Eye color="#a855f7" size={24} />, iconBg: "#f3e8ff" },
    { title: "Successful Sales", value: "0", change: "", icon: <TrendingUp color="#10b981" size={24} />, iconBg: "#dcfce7" },
  ];

  const fallbackByTitle = (title) => {
    switch (title) {
      case "Total Ads":
        return { icon: <Package color="#3b82f6" size={24} />, iconBg: "#e0edff" };
      case "Messages":
        return { icon: <MessageCircle color="#22c55e" size={24} />, iconBg: "#d1fae5" };
      case "Profile Views":
        return { icon: <Eye color="#a855f7" size={24} />, iconBg: "#f3e8ff" };
      case "Successful Sales":
        return { icon: <TrendingUp color="#10b981" size={24} />, iconBg: "#dcfce7" };
      default:
        return { icon: null, iconBg: "#f3f4f6" };
    }
  };

  const data = Array.isArray(metricsData) && metricsData.length
    ? metricsData.map((m) => {
        const fb = fallbackByTitle(m.title);
        return {
          ...m,
          icon: m.icon ?? fb.icon,
          iconBg: m.iconBg ?? fb.iconBg,
        };
      })
    : defaults;

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
      {data.map((metric, index) => (
        <div
          key={index}
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <div>
            <p style={titleStyle}>{metric.title}</p>
            <h2 style={valueStyle}>{metric.value || "0"}</h2>
            <p style={changeStyle}>{metric.change || ""}</p>
          </div>
          <div style={iconBox(metric.iconBg)}>{metric.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
