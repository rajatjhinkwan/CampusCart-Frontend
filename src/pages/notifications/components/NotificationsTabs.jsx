import React, { useState } from "react";

const NotificationsTabs = () => {
    const [activeTab, setActiveTab] = useState("all");

    const tabs = ["all", "unread", "read"];

    return (
        <div style={styles.container}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        ...styles.tab,
                        backgroundColor: activeTab === tab ? "#007bff" : "white",
                        color: activeTab === tab ? "white" : "black",
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
