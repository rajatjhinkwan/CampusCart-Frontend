import React, { useEffect, useState } from "react";
import axios from "../../../lib/axios";
// Assuming Lucide icons are available
import {
  Plus, Search, MapPin, Clock, Settings,
  Trash2, Bell, BellOff, Package, BarChart2, DollarSign, ChevronRight
} from "lucide-react";

const SavedSearches = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const styles = {
    // --- Main Container ---
    container: {
      width: "1000px",
      // maxWidth: "1000px", // Wide enough for columns
      margin: "40px auto",
      backgroundColor: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)", // Softer, more pronounced shadow
      overflow: "hidden",
      height: "600px",
    },

    // --- Header ---
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 32px",
      borderBottom: "1px solid #f3f4f6",
      backgroundColor: "#ffffff",
    },

    titleGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },

    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
    },

    subTitle: {
      fontSize: "14px",
      color: "#6b7280",
    },

    newAlertBtn: {
      backgroundColor: "#2563eb",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
    },

    // --- Header Row (Labels for Symmetry) ---
    // This row provides visual titles for the columns below
    columnHeaderRow: {
      display: "flex",
      padding: "12px 32px",
      backgroundColor: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },

    // --- List Item (The Row) ---
    row: {
      display: "flex",
      alignItems: "center", // Vertical center alignment
      padding: "20px 32px",
      borderBottom: "1px solid #f3f4f6",
      backgroundColor: "#fff",
      transition: "background-color 0.2s",
    },

    // --- Column 1: Product Info (40% width) ---
    colProduct: {
      flex: "0 0 40%", // Fixed 40% width
      display: "flex",
      alignItems: "center",
      gap: "16px",
      paddingRight: "10px",
    },

    imageContainer: {
      width: "64px",
      height: "64px",
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      border: "1px solid #e5e7eb",
      flexShrink: 0,
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    productText: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    itemTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#1f2937",
    },
    itemCategory: {
      fontSize: "13px",
      color: "#6b7280",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    newBadge: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      fontSize: "10px",
      fontWeight: "700",
      padding: "2px 6px",
      borderRadius: "4px",
      marginLeft: "8px",
      display: "inline-block",
      verticalAlign: "middle",
    },

    // --- Column 2: Price & Location (20% width) ---
    colCriteria: {
      flex: "0 0 20%", // Fixed 20% width
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    price: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#059669", // Emerald
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    location: {
      fontSize: "13px",
      color: "#6b7280",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    // --- Column 3: Stats & Time (20% width) ---
    colStats: {
      flex: "0 0 20%", // Fixed 20% width
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    resultsText: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    updatedText: {
      fontSize: "12px",
      color: "#9ca3af",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    // --- Column 4: Actions (20% width) ---
    colActions: {
      flex: "0 0 20%", // Fixed 20% width
      display: "flex",
      flexDirection: "column", // Stack Alert toggle and icons vertically
      alignItems: "flex-end",
      gap: "10px",
    },

    alertToggle: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      borderRadius: "16px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      border: "1px solid",
      transition: "all 0.2s",
      width: "fit-content",
    },
    alertActive: {
      backgroundColor: "#ecfdf5",
      color: "#047857",
      borderColor: "#a7f3d0",
    },
    alertInactive: {
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      borderColor: "#e5e7eb",
    },

    iconRow: {
      display: "flex",
      gap: "12px",
    },
    iconBtn: {
      color: "#9ca3af",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    deleteBtn: {
      color: "#ef4444",
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/wishlist/me");
        const wishlist = res.data?.wishlist?.products || [];
        const mapped = wishlist.map((p) => ({
          name: p.title || "Untitled",
          tag: p.category?.name || p.category || "Unknown",
          location: p.location || "",
          price: typeof p.price === "number" ? `₹${p.price}` : (p.price || "₹0"),
          results: p.views ? String(p.views) : "0",
          updated: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : (p.createdAt ? new Date(p.createdAt).toLocaleString() : ""),
          newBadge: p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 7 * 24 * 3600 * 1000 ? "NEW" : "",
          alerts: "on",
          imageUrl: Array.isArray(p.images) && p.images[0]?.url ? p.images[0].url : "https://via.placeholder.com/64",
        }));
        setItems(mapped);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.title}>Saved Searches</div>
          <div style={styles.subTitle}>Track your favorite items</div>
        </div>
        <button style={styles.newAlertBtn}>
          <Plus size={16} /> New Alert
        </button>
      </div>

      {/* Column Headers (Crucial for Symmetry perception) */}
      <div style={styles.columnHeaderRow}>
        <div style={{ flex: "0 0 40%" }}>Search Criteria</div>
        <div style={{ flex: "0 0 20%" }}>Price & Location</div>
        <div style={{ flex: "0 0 20%" }}>Activity</div>
        <div style={{ flex: "0 0 20%", textAlign: "right" }}>Actions</div>
      </div>

      {/* Rows */}
      {loading && (
        <div style={styles.row}><div style={{ color: "#64748b" }}>Loading favorites…</div></div>
      )}
      {!loading && error && (
        <div style={styles.row}><div style={{ color: "#ef4444" }}>{error}</div></div>
      )}
      {!loading && !error && items.length === 0 && (
        <div style={styles.row}><div style={{ color: "#64748b" }}>No favorites yet</div></div>
      )}
      {!loading && !error && items.slice(0, 4).map((item, index) => (
        <div key={index} style={styles.row}>

          {/* COLUMN 1: Product Info */}
          <div style={styles.colProduct}>
            <div style={styles.imageContainer}>
              <img src={item.imageUrl} alt={item.name} style={styles.productImage} />
            </div>
            <div style={styles.productText}>
              <div style={styles.itemTitle}>
                {item.name}
                {item.newBadge && <span style={styles.newBadge}>{item.newBadge}</span>}
              </div>
              <div style={styles.itemCategory}>
                <Package size={12} /> {item.tag}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Price & Location */}
          <div style={styles.colCriteria}>
            <div style={styles.price}>
              <DollarSign size={14} strokeWidth={3} /> {item.price}
            </div>
            <div style={styles.location}>
              <MapPin size={12} /> {item.location}
            </div>
          </div>

          {/* COLUMN 3: Stats */}
          <div style={styles.colStats}>
            <div style={styles.resultsText}>
              <Search size={14} /> {item.results} Results
            </div>
            <div style={styles.updatedText}>
              <Clock size={12} /> {item.updated}
            </div>
          </div>

          {/* COLUMN 4: Actions */}
          <div style={styles.colActions}>
            <div
              style={{
                ...styles.alertToggle,
                ...(item.alerts === "on" ? styles.alertActive : styles.alertInactive)
              }}
            >
              {item.alerts === "on" ? <Bell size={10} fill="currentColor" /> : <BellOff size={10} />}
              {item.alerts === "on" ? "Active" : "Paused"}
            </div>

            <div style={styles.iconRow}>
              <div style={styles.iconBtn} title="Analytics">
                <BarChart2 size={16} />
              </div>
              <div style={styles.iconBtn} title="Edit">
                <Settings size={16} />
              </div>
              <div style={{ ...styles.iconBtn, ...styles.deleteBtn }} title="Delete">
                <Trash2 size={16} />
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default SavedSearches;
