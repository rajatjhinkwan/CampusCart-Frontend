import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../store/userStore";
import { MapPin, Calendar, MessageSquare, AlertTriangle, ShieldCheck } from "lucide-react";

export default function PublicProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reporting state
    const [checkingReport, setCheckingReport] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");

    const currentUser = useUserStore((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch User Info
                const userRes = await axios.get(`/api/users/${userId}`);
                setUser(userRes.data.user);

                // 2. Fetch User's Listings
                const productsRes = await axios.get(`/api/products/seller/${userId}`);
                setProducts(productsRes.data.products);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportReason) return toast.error("Please select a reason");

        try {
            setCheckingReport(true);
            await axios.post(`/api/reports/user/${userId}`, {
                reason: reportReason,
                message: reportMessage,
            });
            toast.success("User reported successfully");
            setIsReportModalOpen(false);
            setReportReason("");
            setReportMessage("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to report user");
        } finally {
            setCheckingReport(false);
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
    if (!user) return <div style={{ padding: "40px", textAlign: "center" }}>User not found</div>;

    const styles = {
        container: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
        },
        sidebar: {
            flex: "1 1 300px",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            height: "fit-content",
            textAlign: "center",
        },
        main: {
            flex: "2 1 600px",
        },
        avatar: {
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
            border: "4px solid #f1f5f9",
        },
        name: {
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "8px",
        },
        role: {
            display: "inline-block",
            background: user.role === "seller" ? "#dcfce7" : "#e0f2fe",
            color: user.role === "seller" ? "#166534" : "#0369a1",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "20px",
        },
        bio: {
            color: "#64748b",
            lineHeight: "1.6",
            marginBottom: "24px",
            fontSize: "14px",
        },
        infoRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#475569",
            marginBottom: "10px",
            fontSize: "14px",
        },
        actionBtn: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "12px",
            transition: "0.2s",
        },
        messageBtn: {
            background: "#2563eb",
            color: "white",
        },
        reportBtn: {
            background: "#fee2e2",
            color: "#991b1b",
        },
        sectionTitle: {
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "20px",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
        },
        card: {
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "transform 0.2s",
            cursor: "pointer",
        },
        cardImg: {
            width: "100%",
            height: "180px",
            objectFit: "cover",
        },
        cardContent: {
            padding: "16px",
        },
        cardPrice: {
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "4px",
        },
        cardTitle: {
            fontSize: "14px",
            color: "#475569",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },

        // Modal Styles
        modalOverlay: {
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        },
        modal: {
            background: "white", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "400px"
        },
        input: {
            width: "100%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #e2e8f0"
        },
        select: {
            width: "100%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #e2e8f0"
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar - User Info */}
            <div style={styles.sidebar}>
                <img
                    src={user.avatar || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"}
                    alt={user.name}
                    style={styles.avatar}
                />
                <h1 style={styles.name}>{user.name}</h1>
                <span style={styles.role}>{user.role.toUpperCase()}</span>

                {user.bio && <p style={styles.bio}>{user.bio}</p>}

                <div style={styles.infoRow}>
                    <MapPin size={16} />
                    {user.location || "Location not set"}
                </div>
                <div style={styles.infoRow}>
                    <Calendar size={16} />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                {user.isVerified && (
                    <div style={{ ...styles.infoRow, color: "#16a34a" }}>
                        <ShieldCheck size={16} /> Verified User
                    </div>
                )}

                {currentUser && currentUser.id !== user._id && (
                    <>
                        <button
                            style={{ ...styles.actionBtn, ...styles.messageBtn }}
                            onClick={() => navigate('/user-messages')}
                        >
                            <MessageSquare size={18} /> Message
                        </button>
                        <button
                            style={{ ...styles.actionBtn, ...styles.reportBtn }}
                            onClick={() => setIsReportModalOpen(true)}
                        >
                            <AlertTriangle size={18} /> Report User
                        </button>
                    </>
                )}
            </div>

            {/* Main Content - Listings */}
            <div style={styles.main}>
                <h2 style={styles.sectionTitle}>Active Listings ({products.length})</h2>

                {products.length === 0 ? (
                    <div style={{ padding: "40px", background: "#fff", borderRadius: "12px", textAlign: "center", color: "#64748b" }}>
                        No active listings found for this user.
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {products.map((product) => (
                            <div
                                key={product._id}
                                style={styles.card}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <img
                                    src={product.images[0]?.url || "https://via.placeholder.com/300"}
                                    alt={product.title}
                                    style={styles.cardImg}
                                />
                                <div style={styles.cardContent}>
                                    <div style={styles.cardPrice}>₹{product.price.toLocaleString('en-IN')}</div>
                                    <div style={styles.cardTitle}>{product.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div style={styles.modalOverlay} onClick={() => setIsReportModalOpen(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>Report User</h3>
                        <p>Help us keep the community safe. Why are you reporting this user?</p>

                        <select
                            style={styles.select}
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option value="Spam">Spam or Scam</option>
                            <option value="Inappropriate Content">Inappropriate Content</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Fake Profile">Fake Profile</option>
                            <option value="Other">Other</option>
                        </select>

                        <textarea
                            placeholder="Additional details (optional)..."
                            style={{ ...styles.input, height: "100px", resize: "none" }}
                            value={reportMessage}
                            onChange={(e) => setReportMessage(e.target.value)}
                        />

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                style={{ ...styles.actionBtn, background: "#f1f5f9", color: "#000" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReport}
                                disabled={checkingReport}
                                style={{ ...styles.actionBtn, ...styles.reportBtn, background: checkingReport ? "#ccc" : "#ef4444", color: "white" }}
                            >
                                {checkingReport ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
