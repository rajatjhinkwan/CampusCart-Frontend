import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const wrapperStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "40px 0",
    backgroundColor: "#fff",
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(5, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "24px",
    width: "100%",
    maxWidth: "1280px",
    padding: "0 24px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "20px",
    width: "100%",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    border: "1px solid #f1f5f9",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  };

  const iconBox = (bgColor) => ({
    backgroundColor: bgColor, // Keep original color but maybe adjust opacity in icon
    background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -20)} 100%)`,
    color: "#fff",
    borderRadius: "14px",
    width: "56px",
    height: "56px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  });

  // Helper to darken color for gradient
  function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "8px",
    letterSpacing: "-0.01em",
  };

  const subTextStyle = {
    fontSize: "14px",
    color: "#64748B",
    lineHeight: "1.5",
  };

  const cards = [
    { icon: "fa-bag-shopping", name: "Product Resell", desc: "Buy and sell pre-owned products", color: "#3B82F6", route: "/browse?tab=Products" },
    { icon: "fa-house", name: "Rooms", desc: "Find rooms & roommates nearby", color: "#10B981", route: "/browse?tab=Rooms" },
    { icon: "fa-screwdriver-wrench", name: "Services", desc: "Hire local professionals & experts", color: "#8B5CF6", route: "/browse?tab=Services" },
    { icon: "fa-briefcase", name: "Jobs", desc: "Find jobs & internship opportunities", color: "#EF4444", route: "/browse?tab=Jobs" },
    { icon: "fa-car-side", name: "Ride Share", desc: "Carpooling & ride sharing services", color: "#0EA5E9", route: "/rides" },
  ];

  return (
    <div style={wrapperStyle}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
      <div style={containerStyle}>
        {cards.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onClick={() => navigate(item.route)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
              e.currentTarget.style.borderColor = "#f1f5f9";
            }}
          >
            <div style={{
              ...iconBox(item.color),
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`
            }}>
              <i
                className={`fa-solid ${item.icon}`}
                style={{ fontSize: "24px" }}
              ></i>
            </div>

            <div>
              <h2 style={titleStyle}>{item.name}</h2>
              <p style={subTextStyle}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
