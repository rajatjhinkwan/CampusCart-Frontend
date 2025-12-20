import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar.jsx";
import NotificationsTabs from "./components/NotificationsTabs.jsx";
import NotificationsList from "./components/NotificationsList.jsx";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2000);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const status = activeTab === "all" ? "" : activeTab;
      const q = [];
      if (status) q.push(`status=${status}`);
      if (typeFilter) q.push(`type=${typeFilter}`);
      if (searchTerm && searchTerm.trim()) q.push(`q=${encodeURIComponent(searchTerm.trim())}`);
      const qs = q.length ? `?${q.join("&")}` : "";
      const url = `/api/notifications${qs}`;
      const res = await axios.get(url);

      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, typeFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchNotifications();
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const toggleRead = async (n) => {
    try {
      const id = n._id || n.id;
      const url = `/api/notifications/${id}/toggle`;
      setNotifications((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, isRead: !x.isRead } : x))
      );
      const res = await axios.patch(url, {});
      setNotifications((prev) =>
        prev.map((x) => ((x._id || x.id) === (res.data._id || res.data.id) ? res.data : x))
      );
      showToast(res.data.isRead ? "Marked as read" : "Marked as unread", "success");
    } catch (e) {
      console.error(e);
      // revert optimistic change
      setNotifications((prev) => prev.map((x) => {
        const orig = notifications.find((o) => (o._id || o.id) === (x._id || x.id));
        return orig ? orig : x;
      }));
      showToast("Failed to update", "error");
    }
  };

  const markAllRead = async () => {
    try {
      const url = `/api/notifications/mark-all-read`;
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      await axios.patch(url, {});
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      showToast("All marked as read", "success");
    } catch (e) {
      console.error(e);
      // revert optimistic change
      setNotifications((prev) => prev.map((x) => {
        const orig = notifications.find((o) => (o._id || o.id) === (x._id || x.id));
        return orig ? orig : x;
      }));
      showToast("Failed to mark all", "error");
    }
  };

  const types = [
    { key: "", label: "All" },
    { key: "product", label: "Products" },
    { key: "room", label: "Rooms" },
    { key: "service", label: "Services" },
    { key: "job", label: "Jobs" },
    { key: "message", label: "Messages" },
    { key: "system", label: "System" },
  ];

  const groupLabel = (d) => {
    const date = new Date(d);
    const today = new Date();
    const y = new Date();
    y.setDate(today.getDate() - 1);
    const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, y)) return "Yesterday";
    return "Earlier";
  };

  const grouped = notifications.reduce((acc, n) => {
    const lbl = groupLabel(n.createdAt || n.date);
    acc[lbl] = acc[lbl] || [];
    acc[lbl].push(n);
    return acc;
  }, {});

  return (

    <>
    <Navbar/>
      <style>{`@keyframes pulse {0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}`}</style>
      {toast && (
        <div style={{
          position: "fixed",
          top: 72,
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "success" ? "#10b981" : toast.type === "error" ? "#ef4444" : "#374151",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          zIndex: 9999,
          fontSize: 14,
          fontWeight: 600,
        }}>
          {toast.text}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '10px', paddingTop: '100px', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
          <NotificationsTabs active={activeTab} onChange={setActiveTab} />
          <button onClick={markAllRead} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff" }}>
            Mark all as read
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications"
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", width: "40vw" }}
          />
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {notifications.filter((n) => !n.isRead).length} unread • {notifications.length} total
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: typeFilter === t.key ? "#1e3a8a" : "#fff",
                color: typeFilter === t.key ? "#fff" : "#111827",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ width: "70vw" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, width: "100%" }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ height: 72, borderRadius: 14, background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, textAlign: "center", background: "#fff" }}>
              <div style={{ fontSize: 36 }}>🔔</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>No notifications</div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Try changing filters or search terms.</div>
            </div>
          ) : (
            Object.keys(grouped).map((k) => (
              <div key={k} style={{ marginBottom: 16, width: "100%" }}>
                <div style={{ fontSize: 12, color: "#6b7280", margin: "8px 0", fontWeight: 600 }}>{k}</div>
                <NotificationsList notifications={grouped[k]} onToggleRead={toggleRead} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
