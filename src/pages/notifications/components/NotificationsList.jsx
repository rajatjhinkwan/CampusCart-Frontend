import { MessageSquare, Tag, FileText, Bell } from "lucide-react";

const NotificationsList = ({ notifications }) => {
    return (
        <div style={styles.list}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        ...styles.item,
                        backgroundColor: notification.isRead ? "#fafafa" : "#eef4ff",
                        border: notification.isRead
                            ? "1px solid #e5e7eb"
                            : "1px solid #d6e5ff",
                    }}
                >
                    <div style={styles.row}>
                        {/* LEFT – Professional Icon */}
                        <div style={styles.iconCircle}>{getIcon(notification.type)}</div>

                        {/* MIDDLE – Text */}
                        <div style={{ flex: 1 }}>
                            <div style={styles.message}>{notification.message}</div>
                            <div style={styles.time}>{notification.time}</div>
                        </div>

                        {/* RIGHT – Action */}
                        <button style={styles.readAction}>
                            {notification.isRead ? "Mark as Unread" : "Mark as Read"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

/* --- CLEAN MODERN ICON SET --- */
const getIcon = (type) => {
    const icons = {
        message: <MessageSquare size={20} strokeWidth={2} />,
        offer: <Tag size={20} strokeWidth={2} />,
        listing: <FileText size={20} strokeWidth={2} />,
        default: <Bell size={20} strokeWidth={2} />,
    }; return icons[type] || icons.default;
};

/* --- STYLES --- */
const styles = {
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        padding: "10px",
    },

    item: {
        padding: "18px 20px",
        borderRadius: "14px",
        transition: "0.2s",
        cursor: "pointer",
    },

    row: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },

    iconCircle: {
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "bold",
        flexShrink: 0,
    },

    message: {
        fontSize: "15px",
        color: "#1f2937",
        fontWeight: "500",
        lineHeight: "1.4",
    },

    time: {
        marginTop: "6px",
        fontSize: "12px",
        color: "#6b7280",
    },

    readAction: {
        background: "transparent",
        border: "none",
        color: "#2563eb",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        marginLeft: "10px",
    },
};

export default NotificationsList;
