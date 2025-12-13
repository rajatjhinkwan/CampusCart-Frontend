import React from "react";

const NotificationsTabs = ({ active, onChange }) => {
    const tabs = ["all", "unread", "read"];
    return (
        <div style={styles.container}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    style={{
                        ...styles.tab,
                        backgroundColor: active === tab ? "#1e3a8a" : "white",
                        color: active === tab ? "white" : "black",
                    }}
                >
                    {tab.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
    },
    tab: {
        padding: "10px 20px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "0.2s",
    },
};

export default NotificationsTabs;
