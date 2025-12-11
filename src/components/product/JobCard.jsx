import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Building } from "lucide-react";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  if (!job) return null;

  const handleNavigate = () => {
    const id = job.id || job._id;
    navigate(`/jobs/${id}`);
  };

  const styles = {
    card: {
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      cursor: "pointer",
      transition: "0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      marginBottom: "16px",
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
      style={styles.card}
      onClick={handleNavigate}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
      }}
    >
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
