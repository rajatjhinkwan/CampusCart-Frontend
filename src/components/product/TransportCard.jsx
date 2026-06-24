import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, User, CheckCircle2, Calendar, Bus, Car, Armchair } from "lucide-react";

export default function TransportCard({ transport }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  if (!transport) return null;

  const handleNavigate = () => {
    const id = transport.id || transport._id;
    // Navigate to a detail page - for now we can use a generic or create one later
    navigate(`/transport/${id}`);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.12)";
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
  };

  const styles = {
    card: {
      position: "relative",
      backgroundColor: "white",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    spotlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.08), transparent 40%)`,
      opacity: opacity,
      transition: "opacity 0.3s",
      pointerEvents: "none",
      zIndex: 1,
    },
    imageWrapper: {
      position: "relative",
      width: "100%",
      paddingTop: "60%", // Aspect ratio
      overflow: "hidden",
      backgroundColor: "#f1f5f9",
    },
    img: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    content: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      flex: 1,
      zIndex: 2,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b",
      lineHeight: "1.4",
    },
    price: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#2563eb",
    },
    route: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      color: "#475569",
      marginTop: "4px",
    },
    details: {
      display: "flex",
      gap: "12px",
      fontSize: "13px",
      color: "#64748b",
      marginTop: "8px",
      flexWrap: "wrap",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: "#f8fafc",
      padding: "4px 8px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    },
    footer: {
      marginTop: "auto",
      paddingTop: "12px",
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    driver: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "500",
      color: "#334155",
    },
    badge: {
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "4px 8px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        zIndex: 5
    }
  };

  const getIcon = (type) => {
    if (type === "Bus") return <Bus size={14} />;
    if (type === "Car" || type === "Taxi") return <Car size={14} />;
    return <Bus size={14} />;
  };

  return (
    <div
      ref={cardRef}
      style={styles.card}
      onClick={handleNavigate}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.spotlight} />
      
      {/* Image Section */}
      <div style={styles.imageWrapper}>
        <img
          src={transport.image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"}
          alt={transport.vehicleName}
          style={styles.img}
        />
        <div style={styles.badge}>
            {getIcon(transport.vehicleType)}
            {transport.vehicleType}
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.header}>
            <div style={styles.title}>{transport.vehicleName}</div>
            <div style={styles.price}>{transport.price}</div>
        </div>

        {/* Route */}
        <div style={styles.route}>
            <MapPin size={16} className="text-blue-500" />
            <span>{transport.from}</span>
            <span style={{color: '#94a3b8'}}>→</span>
            <span>{transport.to}</span>
        </div>

        {/* Details Chips */}
        <div style={styles.details}>
            <div style={styles.detailItem}>
                <Clock size={14} />
                {transport.departureTime}
            </div>
            <div style={styles.detailItem}>
                <Calendar size={14} />
                {transport.frequency === "Daily" ? "Daily" : transport.date}
            </div>
            <div style={styles.detailItem}>
                <Armchair size={14} />
                {transport.seatsAvailable} seats
            </div>
        </div>

        {/* Footer: Driver Info */}
        <div style={styles.footer}>
            <div style={styles.driver}>
                <User size={14} />
                {transport.driverName}
                {transport.isVerified && <CheckCircle2 size={12} color="#3b82f6" fill="#3b82f6" />}
            </div>
        </div>
      </div>
    </div>
  );
}
