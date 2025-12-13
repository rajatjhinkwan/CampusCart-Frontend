import React, { useState } from "react";
import { MessageSquare, Tag, FileText, Bell, ShoppingBag, Home, Briefcase, Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationsList = ({ notifications, onToggleRead }) => {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);
    return (
        <div style={styles.list}>
            {notifications.map((n) => {
                const accent = getAccent(n.type, n.isRead);
                return (
                    <div
                        key={n._id || n.id}
                        style={{
                            ...styles.item,
                            backgroundColor: accent.bg,
                            border: `1px solid ${accent.border}`,
                            boxShadow: n.isRead ? "none" : "0 6px 16px rgba(0,0,0,0.06)",
                            transform: hoveredId === (n._id || n.id) ? "translateY(-2px)" : "none"
                        }}
                        onClick={() => navigate(`/notifications/${n._id || n.id}`)}
                        onMouseEnter={() => setHoveredId(n._id || n.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <div style={styles.row}>
                            <div style={{ ...styles.iconCircle, backgroundColor: accent.iconBg, color: accent.iconFg }}>
                                {getIcon(n.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={styles.headerLine}>
                                    <div style={styles.headerLeft}>
                                        <span style={styles.title}>{n.title || n.message}</span>
                                        <span style={{ ...styles.badge, background: accent.badgeBg, color: accent.badgeFg }}>{labelForType(n.type)}</span>
                                        {n.event && <span style={styles.event}>{formatEvent(n.event)}</span>}
                                        {!n.isRead && <span style={styles.unreadDot} />}
                                    </div>
                                    <div style={styles.headerRight}>
                                        <span style={styles.time}>{formatTime(n.createdAt || n.date)}</span>
                                    </div>
                                </div>
                                <div style={styles.message}>{n.message}</div>
                            </div>
                            <div style={styles.ctaGroup}>
                                <button
                                    style={{ ...styles.readAction, background: accent.buttonBg, color: accent.buttonFg }}
                                    onClick={(e) => { e.stopPropagation(); onToggleRead && onToggleRead(n); }}
                                >
                                    {n.isRead ? "Mark Unread" : "Mark Read"}
                                </button>
                                <button
                                    style={styles.openAction}
                                    onClick={(e) => { e.stopPropagation(); if (n.link) navigate(n.link); }}
                                >
                                    Open <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const getIcon = (type) => {
    if (type === "product") return <ShoppingBag size={20} strokeWidth={2} />;
    if (type === "room") return <Home size={20} strokeWidth={2} />;
    if (type === "service") return <Wrench size={20} strokeWidth={2} />;
    if (type === "job") return <Briefcase size={20} strokeWidth={2} />;
    if (type === "message") return <MessageSquare size={20} strokeWidth={2} />;
    return <Bell size={20} strokeWidth={2} />;
};

const getAccent = (type, isRead) => {
    const base = {
        product: { iconBg: "#fef3c7", iconFg: "#92400e", bg: isRead ? "#fff" : "#fffbeb", border: "#fde68a", buttonBg: "#f59e0b", buttonFg: "#fff", badgeBg: "#fff7ed", badgeFg: "#92400e" },
        room: { iconBg: "#d1fae5", iconFg: "#065f46", bg: isRead ? "#fff" : "#ecfdf5", border: "#a7f3d0", buttonBg: "#10b981", buttonFg: "#fff", badgeBg: "#ecfeff", badgeFg: "#065f46" },
        service: { iconBg: "#e0e7ff", iconFg: "#3730a3", bg: isRead ? "#fff" : "#eef2ff", border: "#c7d2fe", buttonBg: "#6366f1", buttonFg: "#fff", badgeBg: "#eef2ff", badgeFg: "#3730a3" },
        job: { iconBg: "#fee2e2", iconFg: "#991b1b", bg: isRead ? "#fff" : "#fef2f2", border: "#fecaca", buttonBg: "#ef4444", buttonFg: "#fff", badgeBg: "#fff1f2", badgeFg: "#991b1b" },
        message: { iconBg: "#dbeafe", iconFg: "#1d4ed8", bg: isRead ? "#fff" : "#eff6ff", border: "#bfdbfe", buttonBg: "#3b82f6", buttonFg: "#fff", badgeBg: "#eff6ff", badgeFg: "#1d4ed8" },
        system: { iconBg: "#f3f4f6", iconFg: "#111827", bg: isRead ? "#fff" : "#f9fafb", border: "#e5e7eb", buttonBg: "#6b7280", buttonFg: "#fff", badgeBg: "#f3f4f6", badgeFg: "#111827" },
    };
    return base[type] || base.system;
};

const labelForType = (type) => {
    if (type === "product") return "Product";
    if (type === "room") return "Room";
    if (type === "service") return "Service";
    if (type === "job") return "Job";
    if (type === "message") return "Message";
    return "System";
};

const formatEvent = (event) => {
    if (event === "created") return "New";
    if (event === "updated") return "Updated";
    if (event === "sold") return "Sold";
    if (event === "offer") return "Offer";
    if (event === "price_drop") return "Price Drop";
    if (event === "applied") return "Applied";
    if (event === "accepted") return "Accepted";
    if (event === "rejected") return "Rejected";
    if (event === "message") return "Message";
    return "Info";
};

const formatTime = (dateLike) => {
    const d = new Date(dateLike);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};

const styles = {
    list: { display: "flex", flexDirection: "column", gap: "18px", padding: "10px" },
    item: { padding: "18px 20px", borderRadius: "14px", transition: "transform .15s ease, box-shadow .15s ease", cursor: "pointer" },

    row: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },

    iconCircle: {
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "bold",
        flexShrink: 0,
    },

    headerLine: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
    headerLeft: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 },
    headerRight: { display: "flex", alignItems: "center", gap: 8 },
    title: {
        fontSize: "17px",
        fontWeight: "700",
        color: "#111827",
        letterSpacing: "0.2px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    badge: { fontSize: 12, borderRadius: 999, padding: "4px 8px", border: "1px solid #e5e7eb" },
    event: { fontSize: 12, borderRadius: 999, padding: "4px 8px", background: "#f3f4f6", color: "#111827" },
    unreadDot: { width: 8, height: 8, borderRadius: "50%", background: "#2563eb" },

    message: {
        fontSize: "14px",
        color: "#334155",
        fontWeight: "500",
        lineHeight: "1.5",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },

    time: {
        fontSize: "12px",
        color: "#6b7280",
        whiteSpace: "nowrap",
    },

    readAction: { border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginLeft: "10px", padding: "8px 12px", borderRadius: "8px" },
    ctaGroup: { display: "flex", alignItems: "center", gap: 8 },
    openAction: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#111827", display: "flex", alignItems: "center", gap: 6 }
};

export default NotificationsList;
