import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar";
import Skeleton from "../../components/Skeleton";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";
import { MapPin, DollarSign, AlertCircle, MessageCircle } from "lucide-react";

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, startConversation } = useUserStore();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactLoading, setContactLoading] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(`/api/requests/${id}`);
                setRequest(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load request details");
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to contact");
            navigate("/user-login");
            return;
        }

        if (user._id === request.postedBy._id) {
            toast.error("You cannot contact yourself");
            return;
        }

        setContactLoading(true);
        try {
            // Assuming generic conversation start logic
            const { success, conversationId, error } = await startConversation({
                recipientId: request.postedBy._id,
                productId: request._id, // Using productId field for context reference
                contextType: "Request" // If backend supports custom context type, else might need adjustment
            });

            if (success) {
                // Send initial message
                await useUserStore.getState().sendMessage(conversationId, `Hi, I can help with your request: "${request.title}"`);
                navigate("/user-messages");
            } else {
                toast.error(error || "Failed to start conversation");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setContactLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div style={styles.container}>
                    <Skeleton width="60%" height="40px" style={{marginBottom: 20}} />
                    <Skeleton width="100%" height="200px" />
                </div>
            </div>
        );
    }

    if (!request) return <div style={styles.center}>Request not found</div>;

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>{request.title}</h1>
                        <div style={styles.badges}>
                            <span style={styles.categoryBadge}>{request.category}</span>
                            <span style={{...styles.urgencyBadge, backgroundColor: getUrgencyColor(request.urgency)}}>
                                {request.urgency} Priority
                            </span>
                        </div>
                    </div>

                    <div style={styles.meta}>
                        <div style={styles.metaItem}>
                            <MapPin size={18} />
                            <span>{request.location}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <DollarSign size={18} />
                            <span>Budget: {request.budget}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <AlertCircle size={18} />
                            <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Description</h2>
                        <p style={styles.description}>{request.description}</p>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Requested By</h2>
                        <div style={styles.userCard}>
                            <div style={styles.avatar}>
                                {request.postedBy.name?.charAt(0) || "U"}
                            </div>
                            <div style={styles.userInfo}>
                                <p style={styles.userName}>{request.postedBy.name}</p>
                                <p style={styles.userEmail}>Verified Member</p>
                            </div>
                            <button 
                                onClick={handleContact} 
                                disabled={contactLoading}
                                style={styles.contactBtn}
                            >
                                {contactLoading ? "Starting Chat..." : (
                                    <>
                                        <MessageCircle size={18} />
                                        Contact Requester
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
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
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
    },
    content: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    header: {
        marginBottom: "24px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#111827",
        marginBottom: "16px",
    },
    badges: {
        display: "flex",
        gap: "12px",
    },
    categoryBadge: {
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
    },
    urgencyBadge: {
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
    },
    meta: {
        display: "flex",
        gap: "32px",
        padding: "24px 0",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "32px",
        color: "#4b5563",
    },
    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
    },
    section: {
        marginBottom: "40px",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: "16px",
    },
    description: {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#4b5563",
        whiteSpace: "pre-wrap",
    },
    userCard: {
        display: "flex",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#2563EB",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "bold",
        marginRight: "16px",
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: "bold",
        fontSize: "18px",
        color: "#111827",
    },
    userEmail: {
        color: "#6b7280",
        fontSize: "14px",
    },
    contactBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#2563EB",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "background-color 0.2s",
    },
    center: {
        textAlign: "center",
        padding: "40px",
        fontSize: "18px",
        color: "#6b7280",
    }
};
