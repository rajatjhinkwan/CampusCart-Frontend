import React from "react";
// Assuming Lucide icons are available
import {
  Plus, Eye, MessageCircle, Edit3, Link,
  BarChart2, Trash2, MapPin, Tag, Calendar, MoreHorizontal
} from "lucide-react";

function Card12() {
  const styles = {
    // --- Container Styles ---
    container: {
      width: "95%",
      margin: "40px auto",
      border: "1px solid #f1f5f9", // Subtle border
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)", // Softer, more pronounced shadow
      overflow: "hidden",
    },

    // --- Header Styles ---
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 32px",
      borderBottom: "1px solid #f1f5f9",
      backgroundColor: "#ffffff",
    },

    headerLeft: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },

    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#0f172a", // Slate-900
      letterSpacing: "-0.02em",
    },

    subtitle: {
      fontSize: "14px",
      color: "#64748b", // Slate-500
    },

    button: {
      backgroundColor: "#0f172a", // Dark elegant button
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },

    // --- Table Styles ---
    tableWrapper: {
      width: "100%",
      overflowX: "auto", // Handle responsiveness
    },

    table: {
      width: "100%",
      borderCollapse: "separate", // Allows border radius on rows if needed
      borderSpacing: "0",
      minWidth: "900px", // Ensure it doesn't squash on small screens
    },

    thead: {
      backgroundColor: "#f8fafc", // Slate-50
    },

    th: {
      textAlign: "left",
      padding: "16px 32px",
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e2e8f0",
    },

    td: {
      padding: "20px 32px",
      fontSize: "14px",
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
      verticalAlign: "middle",
    },

    // --- Column 1: Item Details ---
    itemWrapper: {
      display: "flex",
      alignItems: "center",
    },

    imgContainer: {
      position: "relative",
      marginRight: "20px",
    },

    img: {
      width: "56px",
      height: "56px",
      borderRadius: "10px",
      objectFit: "cover",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },

    itemTitle: {
      fontWeight: "600",
      color: "#0f172a",
      fontSize: "15px",
      marginBottom: "4px",
    },

    metaRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "13px",
      color: "#64748b",
    },

    iconText: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    // --- Column 2: Price ---
    price: {
      fontWeight: "600",
      color: "#0f172a",
      fontSize: "15px",
      fontFeatureSettings: "'tnum' on, 'lnum' on", // Tabular numbers for alignment
    },

    // --- Column 3: Metrics (The Redesigned Matrix) ---
    metricsContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px", // Horizontal spacing between pills
    },

    metricPill: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 10px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "600",
      border: "1px solid transparent", // For potential border styling
    },

    // Specific styles for View counts
    viewsPill: {
      backgroundColor: "#f0f9ff", // Sky-50
      color: "#0369a1", // Sky-700
      border: "1px solid #e0f2fe",
    },

    // Specific styles for Message counts
    messagesPill: {
      backgroundColor: "#fdf4ff", // Fuchsia-50
      color: "#a21caf", // Fuchsia-700
      border: "1px solid #fae8ff",
    },

    // --- Column 4: Status ---
    statusContainer: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "capitalize",
    },

    statusDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      marginRight: "6px",
    },

    // Status Variations
    activeStatus: {
      backgroundColor: "#ecfdf5", // Emerald-50
      color: "#047857", // Emerald-700
      dotColor: "#10b981",
    },
    pendingStatus: {
      backgroundColor: "#fff7ed", // Orange-50
      color: "#c2410c", // Orange-700
      dotColor: "#f97316",
    },
    soldStatus: {
      backgroundColor: "#f1f5f9", // Slate-100
      color: "#475569", // Slate-600
      dotColor: "#94a3b8",
    },

    // --- Column 5: Actions ---
    actionsContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "flex-end",
    },

    iconButton: {
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      color: "#64748b",
      cursor: "pointer",
      transition: "background-color 0.2s",
      // Note: Hover styles are simulated in inline styles via logic or external CSS
    }
  };

  // Helper to render status
  const renderStatus = (status) => {
    let variant = styles.activeStatus;
    if (status === "Pending") variant = styles.pendingStatus;
    if (status === "Sold") variant = styles.soldStatus;

    return (
      <span style={{ ...styles.statusContainer, ...variant }}>
        <span style={{ ...styles.statusDot, backgroundColor: variant.dotColor }}></span>
        {status}
      </span>
    );
  };

  const listings = [
    {
      img: "https://images.unsplash.com/photo-1695041214514-87c1577a5c61?w=150&q=80",
      title: "iPhone 15 Pro Max",
      category: "Electronics",
      date: "Sep 25, 2025",
      price: "₹1,19,999",
      views: 245,
      messages: 12,
      status: "Active",
    },
    {
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&q=80",
      title: "2019 Honda Civic",
      category: "Vehicles",
      date: "Sep 23, 2025",
      price: "₹18,50,000",
      views: 189,
      messages: 8,
      status: "Active",
    },
    {
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&q=80",
      title: "Modern 2BR Apartment",
      category: "Property",
      date: "Sep 22, 2025",
      price: "₹2,80,000",
      views: 156,
      messages: 15,
      status: "Pending",
    },
    {
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&q=80",
      title: "MacBook Pro 16-inch",
      category: "Electronics",
      date: "Sep 20, 2025",
      price: "₹2,39,999",
      views: 98,
      messages: 6,
      status: "Sold",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Listing Overview</h2>
          <span style={styles.subtitle}>Manage your active and past listings</span>
        </div>
        <button style={styles.button}>
          <Plus size={18} /> Create Listing
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={{ ...styles.th, width: "40%" }}>Item Details</th>
              <th style={{ ...styles.th, width: "15%" }}>Price</th>
              <th style={{ ...styles.th, width: "20%" }}>Performance</th> {/* The Matrix Column */}
              <th style={{ ...styles.th, width: "10%" }}>Status</th>
              <th style={{ ...styles.th, width: "15%", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item, index) => (
              <tr key={index}>
                {/* Item Details */}
                <td style={styles.td}>
                  <div style={styles.itemWrapper}>
                    <div style={styles.imgContainer}>
                      <img src={item.img} alt={item.title} style={styles.img} />
                    </div>
                    <div>
                      <div style={styles.itemTitle}>{item.title}</div>
                      <div style={styles.metaRow}>
                        <span style={styles.iconText}>
                          <Tag size={12} /> {item.category}
                        </span>
                        <span style={styles.iconText}>
                          <Calendar size={12} /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td style={styles.td}>
                  <div style={styles.price}>{item.price}</div>
                </td>

                {/* RE-DESIGNED MATRIX COLUMN: Horizontal Pills */}
                <td style={styles.td}>
                  <div style={styles.metricsContainer}>
                    {/* Views Pill */}
                    <div style={{ ...styles.metricPill, ...styles.viewsPill }} title="Total Views">
                      <Eye size={14} strokeWidth={2.5} />
                      <span>{item.views}</span>
                    </div>

                    {/* Messages Pill */}
                    <div style={{ ...styles.metricPill, ...styles.messagesPill }} title="Total Messages">
                      <MessageCircle size={14} strokeWidth={2.5} />
                      <span>{item.messages}</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td style={styles.td}>
                  {renderStatus(item.status)}
                </td>

                {/* Actions */}
                <td style={styles.td}>
                  <div style={styles.actionsContainer}>
                    <div style={styles.iconButton} title="Analytics">
                      <BarChart2 size={18} />
                    </div>
                    <div style={styles.iconButton} title="Edit">
                      <Edit3 size={18} />
                    </div>
                    <div style={styles.iconButton} title="More">
                      <MoreHorizontal size={18} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Card12;