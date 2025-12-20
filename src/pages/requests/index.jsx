import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar";
import Skeleton from "../../components/Skeleton";
import { Plus, MapPin, DollarSign } from "lucide-react";

export default function RequestsList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get("/api/requests");
            setRequests(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load requests.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Service Requests</h1>
                        <p style={styles.subtitle}>See what others are looking for and offer your help.</p>
                    </div>
                    <button onClick={() => navigate("/requests/create")} style={styles.createButton}>
                        <Plus size={18} />
                        Post a Request
                    </button>
                </div>

                {loading ? (
                    <div style={styles.grid}>
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} style={styles.card}>
                                <Skeleton width="60%" height="24px" style={{marginBottom: 10}} />
                                <Skeleton width="100%" height="16px" style={{marginBottom: 6}} />
                                <Skeleton width="80%" height="16px" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div style={styles.error}>{error}</div>
                ) : requests.length === 0 ? (
                    <div style={styles.empty}>
                        <p>No requests found. Be the first to post one!</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {requests.map((req) => (
                            <Link to={`/requests/${req._id}`} key={req._id} style={styles.cardLink}>
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.categoryBadge}>{req.category}</span>
                                        <span style={{...styles.urgencyBadge, backgroundColor: getUrgencyColor(req.urgency)}}>
                                            {req.urgency}
                                        </span>
                                    </div>
                                    <h3 style={styles.cardTitle}>{req.title}</h3>
                                    <p style={styles.cardDesc}>{req.description.substring(0, 100)}...</p>
                                    
                                    <div style={styles.cardMeta}>
                                        <div style={styles.metaItem}>
                                            <MapPin size={14} />
                                            <span>{req.location}</span>
                                        </div>
                                        <div style={styles.metaItem}>
                                            <DollarSign size={14} />
                                            <span>{req.budget}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardFooter}>
                                        <span style={styles.date}>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        <span style={styles.user}>Posted by {req.postedBy?.name || "User"}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const getUrgencyColor = (urgency) => {
    switch (urgency) {
        case "Urgent": return "#EF4444";
        case "High": return "#F97316";
        case "Medium": return "#EAB308";
        default: return "#22C55E";
    }
};

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#111827",
    },
    subtitle: {
        color: "#6b7280",
        marginTop: "4px",
    },
    createButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#2563EB",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
    },
    cardLink: {
        textDecoration: "none",
        color: "inherit",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
        border: "1px solid #e5e7eb",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
    },
    categoryBadge: {
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },
    urgencyBadge: {
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: "8px",
    },
    cardDesc: {
        color: "#4b5563",
        fontSize: "14px",
        lineHeight: "1.5",
        marginBottom: "16px",
        flex: 1,
    },
    cardMeta: {
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
        color: "#6b7280",
        fontSize: "13px",
    },
    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    cardFooter: {
        borderTop: "1px solid #f3f4f6",
        paddingTop: "12px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#9ca3af",
    },
    error: {
        textAlign: "center",
        color: "#EF4444",
        padding: "40px",
    },
    empty: {
        textAlign: "center",
        color: "#6b7280",
        padding: "40px",
    }
};
