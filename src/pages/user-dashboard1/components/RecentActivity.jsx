// pages/user-dashboard/components/RecentActivity.jsx
import React from "react";
import { CheckCircle, AlertCircle, MessageCircle, Package, ShoppingBag } from "lucide-react";

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 16,
    height: "100%",
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 6,
  },
  activityItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
};

// 🔥 CampusKart Marketplace Activities
const activities = [
  {
    icon: ShoppingBag,
    color: "#2563eb",
    bgColor: "#eff6ff",
    title: "Product purchased",
    description: "You bought 'HP Laptop i5 10th Gen'",
    time: "1 hour ago",
  },
  {
    icon: MessageCircle,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    title: "New message received",
    description: "Rahul is interested in your 'Cycle for sale'",
    time: "3 hours ago",
  },
  {
    icon: AlertCircle,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    title: "Ad pending approval",
    description: "Your ad 'Hostel Table & Chair Set' is under review",
    time: "5 hours ago",
  },
  {
    icon: Package,
    color: "#4f46e5",
    bgColor: "#eef2ff",
    title: "Order shipped",
    description: "'Samsung J7 Phone' has been shipped",
    time: "1 day ago",
  },
  {
    icon: CheckCircle,
    color: "#16a34a",
    bgColor: "#f0fdf4",
    title: "Ad approved",
    description: "Your ad 'Scooty Access 125' is now live",
    time: "2 days ago",
  },
];

export function RecentActivity() {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Recent Activity</h3>

      <div style={styles.activityList}>
        {activities.map((a, idx) => (
          <div key={idx} style={styles.activityItem}>
            <div style={{ ...styles.iconContainer, backgroundColor: a.bgColor }}>
              <a.icon style={{ width: 16, height: 16, color: a.color }} />
            </div>

            <div style={styles.content}>
              <div style={styles.activityTitle}>{a.title}</div>
              <div style={styles.activityDescription}>{a.description}</div>
              <div style={styles.activityTime}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
