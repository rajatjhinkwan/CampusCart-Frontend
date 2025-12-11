import React from "react";
// Ensure you have lucide-react installed
import {
  CheckCircle2, Crown, Star, ChevronRight,
  AlertCircle, ShieldCheck, TrendingUp
} from "lucide-react";

const AccountStatus = () => {
  const styles = {
    // --- Container ---
    container: {
      width: "450px", // Slightly wider for better breathing room
      height: "620px",
      margin: "40px auto",
      border: "1px solid #f3f4f6", // Very subtle border
      borderRadius: "16px", // Modern rounded corners
      backgroundColor: "#ffffff",
      padding: "24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)", // Soft, deep shadow
    },

    header: {
      marginBottom: "20px",
    },

    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "4px",
    },

    subTitle: {
      fontSize: "13px",
      color: "#6b7280",
    },

    // --- Top Status Row ---
    statusRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },

    badge: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: "600",
      padding: "6px 12px",
      borderRadius: "20px", // Pill shape
    },

    verifiedBadge: {
      backgroundColor: "#ecfdf5", // Emerald-50
      color: "#059669", // Emerald-600
      border: "1px solid #d1fae5",
    },

    premiumBadge: {
      background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", // Amber gradient
      color: "#b45309", // Amber-700
      border: "1px solid #fde68a",
      boxShadow: "0 2px 4px rgba(251, 191, 36, 0.1)",
    },

    // --- Profile Progress Section ---
    progressSection: {
      marginBottom: "24px",
    },

    progressLabelRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#374151",
    },

    barContainer: {
      width: "100%",
      height: "8px",
      backgroundColor: "#f3f4f6",
      borderRadius: "99px",
      overflow: "hidden",
    },

    bar: {
      width: "85%",
      height: "100%",
      background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)", // Blue gradient
      borderRadius: "99px",
    },

    // --- Premium Card ---
    premiumBox: {
      background: "linear-gradient(to right, #fff7ed, #ffedd5)", // Orange-50 to Orange-100
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "24px",
      border: "1px solid #fed7aa",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    premiumTextContent: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },

    premiumTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#9a3412", // Orange-800
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    premiumDate: {
      fontSize: "12px",
      color: "#c2410c", // Orange-700
    },

    manageBtn: {
      backgroundColor: "#ffffff",
      color: "#9a3412",
      border: "1px solid #fdba74",
      borderRadius: "8px",
      padding: "8px 14px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      transition: "all 0.2s",
    },

    // --- Stats Grid ---
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
      marginBottom: "24px",
      textAlign: "center",
    },

    statBox: {
      padding: "12px",
      backgroundColor: "#f9fafb",
      borderRadius: "10px",
      border: "1px solid #f3f4f6",
    },

    statNumber: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },

    statLabel: {
      fontSize: "11px",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.02em",
      fontWeight: "600",
    },

    // --- Actions Section ---
    sectionHeader: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    actionsBox: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    actionItem: {
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      transition: "border-color 0.2s, transform 0.1s",
      // Note: Inline hover isn't natively supported, but structure supports it
    },

    actionLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    actionIconCircle: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#fee2e2", // Red-100
      color: "#dc2626", // Red-600
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    actionText: {
      display: "flex",
      flexDirection: "column",
    },

    actionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1f2937",
    },

    actionSub: {
      fontSize: "12px",
      color: "#6b7280",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Account Overview</div>
        <div style={styles.subTitle}>Manage your status and performance</div>
      </div>

      {/* Status Badges */}
      <div style={styles.statusRow}>
        <div style={{ ...styles.badge, ...styles.verifiedBadge }}>
          <CheckCircle2 size={14} strokeWidth={3} /> Verified
        </div>
        <div style={{ ...styles.badge, ...styles.premiumBadge }}>
          <Crown size={14} fill="currentColor" /> Premium
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressLabelRow}>
          <span>Profile Completion</span>
          <span>85%</span>
        </div>
        <div style={styles.barContainer}>
          <div style={styles.bar}></div>
        </div>
      </div>

      {/* Premium Subscription Card */}
      <div style={styles.premiumBox}>
        <div style={styles.premiumTextContent}>
          <div style={styles.premiumTitle}>
            <ShieldCheck size={16} /> Pro Subscription
          </div>
          <div style={styles.premiumDate}>Expires Dec 28, 2025</div>
        </div>
        <button style={styles.manageBtn}>Manage</button>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>
            4.8 <Star size={14} fill="#fbbf24" color="#fbbf24" />
          </div>
          <div style={styles.statLabel}>Trust Score</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>18</div>
          <div style={styles.statLabel}>Active Ads</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>98%</div>
          <div style={styles.statLabel}>Response</div>
        </div>
      </div>

      {/* Pending Actions */}
      <div style={styles.sectionHeader}>
        <AlertCircle size={16} color="#ef4444" /> Pending Actions
      </div>

      <div style={styles.actionsBox}>
        {/* Action 1 */}
        <div style={styles.actionItem}>
          <div style={styles.actionLeft}>
            <div style={styles.actionIconCircle}>
              <AlertCircle size={18} />
            </div>
            <div style={styles.actionText}>
              <div style={styles.actionTitle}>Complete Profile</div>
              <div style={styles.actionSub}>Add phone number for trust</div>
            </div>
          </div>
          <ChevronRight size={18} color="#9ca3af" />
        </div>

        {/* Action 2 */}
        <div style={styles.actionItem}>
          <div style={styles.actionLeft}>
            <div style={styles.actionIconCircle}>
              <ShieldCheck size={18} />
            </div>
            <div style={styles.actionText}>
              <div style={styles.actionTitle}>Verify Email</div>
              <div style={styles.actionSub}>Secure your account</div>
            </div>
          </div>
          <ChevronRight size={18} color="#9ca3af" />
        </div>
      </div>

    </div>
  );
};

export default AccountStatus;