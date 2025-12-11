import React from "react";
// Import Lucide icons for a professional look
import { PlusCircle, MessageSquare, Heart, User, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming navigation might be used

const QuickActions = () => {
  const navigate = useNavigate(); // Initialize navigate

  const containerStyle = {
    width: "500px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px", // Slightly larger border-radius for modern feel
    backgroundColor: "#fff",
    padding: "25px", // Increased padding
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // Softer, more pronounced shadow
    fontFamily: "'Inter', sans-serif", // Consistent modern font
  };

  const headerStyle = {
    fontSize: "20px", // Slightly larger header
    fontWeight: "700", // Bolder header
    color: "#1f2937",
    marginBottom: "20px", // More space below header
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px", // Increased gap between cards
    marginBottom: "25px", // More space before stats
  };

  const cardBox = (bgColor, borderColor) => ({
    border: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
    borderRadius: "12px", // Consistent border-radius for cards
    padding: "20px", // More padding inside cards
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Smooth transitions
    ":hover": { // Hover effect (illustrative for inline styles)
      transform: "translateY(-3px)",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    }
  });

  const iconCircle = (color) => ({
    width: "40px", // Slightly larger icon circles
    height: "40px",
    borderRadius: "50%",
    backgroundColor: color,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px", // Icon size, Lucide icons will scale better
    color: "#fff",
    marginBottom: "12px", // More space below icon
  });

  const textTitle = {
    fontWeight: "600",
    fontSize: "15px",
    marginBottom: "6px", // Adjusted spacing
    color: "#1f2937",
  };

  const textSub = {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.4", // Better readability
  };

  const badgeStyle = { // Centralized badge style
    position: "absolute",
    top: "10px", // Adjusted position
    right: "10px",
    backgroundColor: "#e03131", // Clear red for notifications
    color: "white",
    borderRadius: "50%",
    width: "20px", // Slightly larger badge
    height: "20px",
    fontSize: "12px", // Larger text in badge
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "1", // Ensure vertical centering
    border: "2px solid #fff", // White border for pop
  };

  const statsContainer = {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "1px solid #e5e7eb", // More prominent separator
    paddingTop: "20px", // More padding
  };

  const statBox = {
    textAlign: "center",
    flex: 1, // Distribute space evenly
  };

  const statValue = {
    fontWeight: "700",
    fontSize: "20px", // Larger stat values
    color: "#1f2937",
    marginBottom: "4px",
  };

  const statLabel = {
    fontSize: "13px",
    color: "#6b7280",
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Quick Actions</h3>

      <div style={gridStyle}>
        {/* Post New Ad */}
        <div style={cardBox("#f0f4ff", "#d9e2ef")} onClick={() => navigate("/sell-item")}>
          <div style={iconCircle("#4c6ef5")}>
            <PlusCircle size={20} /> {/* Professional Plus icon */}
          </div>
          <div>
            <div style={textTitle}>Post New Ad</div>
            <div style={textSub}>Create a new listing</div>
          </div>
        </div>

        {/* Messages */}
        <div style={cardBox("#e6fcf5", "#c6f6d6")} onClick={() => navigate("/user-messages")}>
          <div style={iconCircle("#22c35e")}>
            <MessageSquare size={20} /> {/* Professional Message icon */}
          </div>
          <div>
            <div style={textTitle}>Messages</div>
            <div style={textSub}>Check your conversations</div>
          </div>
          {/* Badge for messages */}
          <div style={badgeStyle}>
            3
          </div>
        </div>

        {/* Favorites */}
        <div style={cardBox("#fff7ed", "#ffe8cc")} onClick={() => navigate("/user-favorites")}>
          <div style={iconCircle("#fa5252")}>
            <Heart size={20} /> {/* Professional Heart icon */}
          </div>
          <div>
            <div style={textTitle}>Favorites</div>
            <div style={textSub}>View your saved items</div>
          </div>
        </div>

        {/* Profile */}
        <div style={cardBox("#f8f0fc", "#e8daff")} onClick={() => navigate("/settings")}>
          <div style={iconCircle("#845ef7")}>
            <User size={20} /> {/* Professional User icon */}
          </div>
          <div>
            <div style={textTitle}>Profile</div>
            <div style={textSub}>Edit your account details</div>
          </div>
        </div>
      </div>

      <div style={statsContainer}>
        <div style={statBox}>
          <div style={statValue}>4.8</div>
          <div style={statLabel}>
            Rating <span style={{ color: "#fcc419" }}><Star size={14} style={{ verticalAlign: "middle", marginRight: "2px" }} />4.8</span>
          </div>
        </div>
        <div style={statBox}>
          <div style={statValue}>98%</div>
          <div style={statLabel}>
            Response Rate <span style={{ color: "#22c55e", fontWeight: "600" }}>Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;