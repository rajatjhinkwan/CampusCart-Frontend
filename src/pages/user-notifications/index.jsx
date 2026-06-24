import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import { Bell, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserNotifications = () => {
  const [searches, setSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      setSearches(JSON.parse(saved));
    }
  }, []);

  const removeSearch = (index) => {
    const newSearches = [...searches];
    newSearches.splice(index, 1);
    setSearches(newSearches);
    localStorage.setItem("savedSearches", JSON.stringify(newSearches));
    toast.success("Notification alert removed");
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "30px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1e293b",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #e2e8f0",
    },
    info: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    query: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0f172a",
    },
    meta: {
      fontSize: "14px",
      color: "#64748b",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    btn: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <Bell size={28} color="#2563eb" />
          <h1 style={styles.title}>Notification Alerts</h1>
        </div>

        {searches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: "20px" }} />
            <p>You haven't set up any search alerts yet.</p>
            <p style={{ fontSize: "14px", marginTop: "10px" }}>
              Search for items and click "Notify Me" to get alerts.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {searches.map((s, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.info}>
                  <span style={styles.query}>"{s.query}"</span>
                  <span style={styles.meta}>
                    Category: {s.tab} • Alert active since {new Date(s.date).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.btn, background: "#eff6ff", color: "#2563eb" }}
                    onClick={() => navigate(`/search-results?q=${encodeURIComponent(s.query)}&tab=${s.tab}`)}
                  >
                    <Search size={16} /> View Results
                  </button>
                  <button
                    style={{ ...styles.btn, background: "#fee2e2", color: "#ef4444" }}
                    onClick={() => removeSearch(i)}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserNotifications;
