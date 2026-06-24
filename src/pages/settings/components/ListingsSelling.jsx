import React from "react";

export default function ListingsSelling({ sellingPrefs, onChange }) {
  const prefs = sellingPrefs || {};

  const toggle = (key) => {
    onChange({ ...prefs, [key]: !prefs[key] });
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Listings & Selling</h2>
      <p style={styles.subText}>Manage all your Listings, Selling Dashboard, and Preferences.</p>

      {/* STATS */}
      <div style={styles.statsContainer}>
        {[
          { label: "Active Listings", value: 12 },
          { label: "Sold Items", value: 4 },
          { label: "Saved Drafts", value: 8 },
        ].map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statIcon}>{icons.box}</div>
            <h3 style={styles.statValue}>{stat.value}</h3>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <h3 style={styles.sectionTitle}>Quick Actions</h3>

      <div style={styles.actionsGrid}>
        {[
          "Create New Listing",
          "View Selling Dashboard",
          "Manage Payment Methods",
        ].map((act, index) => (
          <div key={index} style={styles.actionCard}>
            <span>{act}</span>
            <span style={styles.arrow}>→</span>
          </div>
        ))}
      </div>

      {/* SELLING PREFERENCES */}
      <h3 style={styles.sectionTitle}>Selling Preferences</h3>

      <div style={styles.preferencesList}>
        {[
          "Auto-renew listings",
          "Enable buyer offer requests",
          "Promote listings automatically",
        ].map((label, index) => (
          <div key={index} style={styles.preferenceRow}>
            <span style={styles.prefLabel}>{label}</span>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={
                label === "Auto-renew listings"
                  ? !!prefs.autoRenewListings
                  : label === "Enable buyer offer requests"
                  ? !!prefs.enableOfferRequests
                  : !!prefs.promoteListings
              }
              onChange={() =>
                toggle(
                  label === "Auto-renew listings"
                    ? "autoRenewListings"
                    : label === "Enable buyer offer requests"
                    ? "enableOfferRequests"
                    : "promoteListings"
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const icons = {
  box: "📦",
  bolt: "⚡",
  draft: "📝",
};

const styles = {
  container: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  subText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
  },

  // STATS SECTION
  statsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "32px",
  },

  statCard: {
    flex: 1,
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  },

  statIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },

  // QUICK ACTIONS
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "10px 0 16px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "14px",
    marginBottom: "32px",
  },

  actionCard: {
    background: "#eef2ff",
    padding: "14px 18px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid #c7d2fe",
    transition: "0.3s",
  },

  arrow: {
    fontSize: "20px",
  },

  // PREFERENCES
  preferencesList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  preferenceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fafb",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },

  prefLabel: {
    fontSize: "15px",
    fontWeight: "500",
  },

  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
};
