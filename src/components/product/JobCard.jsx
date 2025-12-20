import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Building } from "lucide-react";

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  if (!job) return null;

  const handleNavigate = () => {
    const id = job.id || job._id;
    navigate(`/jobs/${id}`);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
  };

  const styles = {
    card: {
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      marginBottom: "16px",
      position: "relative",
      overflow: "hidden",
    },
    spotlight: {
      pointerEvents: "none",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: opacity,
      background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.06), transparent 40%)`,
      zIndex: 10,
      transition: "opacity 0.2s",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "8px",
    },
    company: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    details: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginBottom: "12px",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "14px",
      color: "#475569",
    },
    salary: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#059669",
      marginBottom: "8px",
    },
    date: {
      fontSize: "12px",
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
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
      <div style={styles.title}>{job.title}</div>
      <div style={styles.company}>
        <Building size={14} />
        {job.seller}
      </div>
      <div style={styles.salary}>{job.price}</div>
      <div style={styles.details}>
        <div style={styles.detailItem}>
          <MapPin size={14} />
          {job.location}
        </div>
        <div style={styles.date}>
          <Clock size={14} />
          {job.date}
        </div>
      </div>
    </div>
  );
}
