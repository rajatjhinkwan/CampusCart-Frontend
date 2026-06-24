import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import { useUserStore } from "../../store/userStore.js";
import Navbar from "../../components/navbar.jsx";
import Skeleton from "../../components/Skeleton.jsx";
import ReviewSection from "../../components/ReviewSection.jsx";

// ------------------------------------
// NORMALIZE LOCATION
// ------------------------------------
const normalizeLocation = (loc) => {
    if (!loc) return "Unknown";
    if (typeof loc === "string") return loc;

    if (typeof loc === "object") {
        const { address, area, city, state, pincode } = loc;
        return [address, area, city, state, pincode].filter(Boolean).join(", ");
    }
    return "Unknown";
};

// ------------------------------------
// SERVICE DETAIL PAGE
// ------------------------------------
export default function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, startConversation } = useUserStore();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactLoading, setContactLoading] = useState(false);

    const [activeImage, setActiveImage] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const dummyReviews = [
        { id: 1, user: "Meera", rating: 5, date: "2025-08-01", text: "Excellent service, quick response and professional." },
        { id: 2, user: "Sanjay", rating: 4, date: "2025-07-12", text: "Good work, reasonable pricing." },
        { id: 3, user: "Isha", rating: 5, date: "2025-06-25", text: "Highly recommended, very polite and punctual." }
    ];
    const avgRating = dummyReviews.reduce((a, r) => a + r.rating, 0) / dummyReviews.length;

    useEffect(() => {
        fetchService();
    }, []);

    const fetchService = async () => {
        try {
            const res = await axios.get(`/api/services/${id}`);
            const data = res.data;

            const svc = data.data || data.service;

            setService(svc);
            const firstImg = Array.isArray(svc?.images) && svc.images.length > 0
                ? (typeof svc.images[0] === "string" ? svc.images[0] : (svc.images[0]?.url || svc.image))
                : (svc?.image || "https://via.placeholder.com/600");
            setActiveImage(firstImg);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching service:", err);
            setLoading(false);
        }
    };

    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to contact provider");
            navigate("/user-login");
            return;
        }
        const providerId = service.provider?._id || service.provider;
        if (!providerId) {
            toast.error("Provider info missing");
            return;
        }
        
        const myId = useUserStore.getState().user?._id;
        if (myId === providerId) {
            toast.error("You cannot chat with yourself");
            return;
        }

        setContactLoading(true);
        try {
            const { success, conversationId, error } = await startConversation({
                recipientId: providerId,
                productId: service._id,
                contextType: "Service"
            });
            
            if (success && conversationId) {
                // Send initial inquiry message
                await useUserStore.getState().sendMessage(conversationId, `Hi, I'm interested in your service "${service.title}".`);
                navigate("/user-messages");
            } else {
                toast.error(error || "Failed to start chat");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setContactLoading(false);
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div style={styles.page}>
                <div style={styles.topContainer}>
                    {/* Gallery Skeleton */}
                    <div style={styles.gallery}>
                        <Skeleton width="100%" height="400px" style={{ borderRadius: "16px", marginBottom: "16px" }} />
                        <div style={styles.thumbnailRow}>
                            <Skeleton width="80px" height="80px" style={{ borderRadius: "12px" }} />
                            <Skeleton width="80px" height="80px" style={{ borderRadius: "12px" }} />
                            <Skeleton width="80px" height="80px" style={{ borderRadius: "12px" }} />
                        </div>
                    </div>
                    
                    {/* InfoBox Skeleton */}
                    <div style={{ ...styles.infoBox, height: "auto" }}>
                        <Skeleton width="80%" height="40px" style={{ marginBottom: "16px" }} />
                        <Skeleton width="40%" height="32px" style={{ marginBottom: "24px" }} />
                        
                        <div style={{ marginBottom: "16px" }}>
                            <Skeleton width="100%" height="1px" style={{ marginBottom: "16px" }} />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Skeleton width="30%" height="20px" />
                                <Skeleton width="40%" height="20px" />
                            </div>
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                            <Skeleton width="100%" height="1px" style={{ marginBottom: "16px" }} />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Skeleton width="30%" height="20px" />
                                <Skeleton width="40%" height="20px" />
                            </div>
                        </div>

                        <Skeleton width="100%" height="50px" style={{ borderRadius: "12px", marginTop: "25px" }} />
                    </div>
                </div>

                {/* Description Skeleton */}
                <div style={styles.section}>
                    <Skeleton width="200px" height="30px" style={{ marginBottom: "16px" }} />
                    <Skeleton width="100%" height="20px" style={{ marginBottom: "10px" }} />
                    <Skeleton width="100%" height="20px" style={{ marginBottom: "10px" }} />
                    <Skeleton width="80%" height="20px" />
                </div>
            </div>
        </>
    );
    if (!service)
        return (
            <>
                <Navbar />
                <h2 style={{ textAlign: "center", marginTop: 60 }}>Service Not Found</h2>
            </>
        );

    return (
        <>
            <Navbar />
            <div style={styles.page} className="fade-in">
            {/* ---------------------------------- */}
            {/* IMAGE GALLERY + DETAILS */}
            {/* ---------------------------------- */}
            <div style={styles.topContainer}>
                {/* LEFT SIDE — IMAGE GALLERY */}
                <div style={styles.gallery}>
                    <img src={activeImage} alt="service" style={styles.mainImage} />

                    {/* THUMBNAILS */}
                    <div style={styles.thumbnailRow}>
                        {(service?.images?.length ? service.images : [service.image]).map(
                            (img, i) => (
                                <img
                                    key={i}
                                    src={typeof img === "string" ? img : (img?.url || service.image)}
                                    alt="thumb"
                                    style={{
                                        ...styles.thumbnail,
                                        border:
                                            activeImage === img
                                                ? "3px solid #2563eb"
                                                : "2px solid #e2e8f0",
                                    }}
                                    onClick={() => setActiveImage(typeof img === "string" ? img : (img?.url || service.image))}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE — INFO BOX */}
                <div style={styles.infoBox}>
                    <h1 style={styles.title}>{service.title}</h1>

                    <p style={styles.price}>
                        ₹ {service.price?.toLocaleString("en-IN") || "N/A"}
                    </p>

                    {service.negotiable && <p style={styles.negotiable}>Negotiable</p>}

                    <div style={styles.infoLine}>
                        <span style={styles.label}>Location:</span>
                        <span style={styles.value}>
                            {normalizeLocation(service.location)}
                        </span>
                    </div>

                    <div style={styles.infoLine}>
                        <span style={styles.label}>Category:</span>
                        <span style={styles.value}>{service.category || "N/A"}</span>
                    </div>

                    <div style={styles.infoLine}>
                        <span style={styles.label}>Posted On:</span>
                        <span style={styles.value}>
                            {new Date(service.createdAt).toLocaleDateString("en-IN")}
                        </span>
                    </div>

                    <button 
                        style={{...styles.contactBtn, opacity: contactLoading ? 0.7 : 1, cursor: contactLoading ? 'not-allowed' : 'pointer'}} 
                        onClick={handleContact}
                        disabled={contactLoading}
                    >
                        {contactLoading ? "Processing..." : "Contact Provider"}
                    </button>
                    <div style={{ marginTop: 24, padding: "20px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                        <div style={{ fontWeight: "700", marginBottom: "12px", color: "#1e293b", fontSize: "16px" }}>Report Service</div>
                        <select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", color: "#475569" }}
                        >
                            <option value="">Select a reason</option>
                            <option value="spam">Spam or misleading</option>
                            <option value="fraud">Fraud or fake</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="duplicate">Duplicate listing</option>
                            <option value="illegal">Illegal service</option>
                        </select>
                        <textarea
                            placeholder="Optional details"
                            value={reportMessage}
                            onChange={(e) => setReportMessage(e.target.value)}
                            style={{ width: "100%", padding: "12px", minHeight: "80px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }}
                        />
                        <button
                            onClick={async () => {
                                try {
                                    const token = useUserStore.getState().accessToken;
                                    if (!token) { toast.error("Please login to report"); return; }
                                    if (!reportReason) { toast.error("Select a reason"); return; }
                                    await axios.post(
                                        `/api/reports/service/${service._id}`,
                                        { reason: reportReason, message: reportMessage }
                                    );
                                    toast.success("Report submitted");
                                    setReportReason("");
                                    setReportMessage("");
                                } catch (e) {
                                    toast.error(e.response?.data?.message || "Failed to submit report");
                                }
                            }}
                            style={{ padding: "10px 16px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
                        >
                            Report
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------------------------- */}
            {/* DESCRIPTION SECTION */}
            {/* ---------------------------------- */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>About This Service</h2>
                <p style={styles.desc}>
                    {service.description || "No description provided."}
                </p>
            </div>

            <ReviewSection targetId={service._id} targetType="service" />

            {/* ---------------------------------- */}
            {/* PROVIDER DETAILS */}
            {/* ---------------------------------- */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Service Provider</h2>
                <div style={styles.sellerCard}>
                    <div style={styles.sellerAvatar}>
                        {service.provider?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                        <p style={styles.sellerName}>
                            {service.provider?.name || "Service Provider"}
                        </p>
                        <p style={styles.sellerLabel}>Verified Provider</p>
                    </div>
                </div>
            </div>

            {/* ---------------------------------- */}
            {/* LOCATION SECTION */}
            {/* ---------------------------------- */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Location</h2>
                <p style={styles.value}>{normalizeLocation(service.location)}</p>

                <div style={styles.mapPlaceholder}>
                    <p style={{ textAlign: "center", paddingTop: 35 }}>
                        Map Placeholder
                        <br />
                        (Google Maps integration later)
                    </p>
                </div>
            </div>
            </div>
        </>
    );
}

// ------------------------------------
// MAIN STYLES
// ------------------------------------
const styles = {
    page: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: "30px 20px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
    },

    topContainer: {
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
        marginBottom: 35,
    },

    gallery: {
        flex: 1.5,
        minWidth: 350,
    },

    mainImage: {
        width: "100%",
        height: 400,
        objectFit: "cover",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    },

    thumbnailRow: {
        display: "flex",
        gap: 12,
        marginTop: 16,
        flexWrap: "wrap",
    },

    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        objectFit: "cover",
        cursor: "pointer",
        transition: "transform 0.2s",
    },

    infoBox: {
        flex: 1,
        minWidth: 320,
        background: "white",
        padding: 30,
        borderRadius: 20,
        boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
        height: "fit-content",
    },

    title: {
        fontSize: 32,
        fontWeight: 800,
        color: "#0f172a",
        lineHeight: 1.2,
    },

    price: {
        marginTop: 12,
        fontSize: 28,
        fontWeight: 700,
        color: "#2563eb",
    },

    negotiable: {
        marginTop: 8,
        display: "inline-block",
        background: "#10b981",
        color: "white",
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
    },

    infoLine: {
        marginTop: 16,
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: 8,
    },

    label: {
        fontSize: 15,
        color: "#64748b",
        fontWeight: 500,
    },

    value: {
        fontSize: 16,
        fontWeight: 600,
        color: "#1e293b",
    },

    contactBtn: {
        marginTop: 25,
        padding: "16px 0",
        width: "100%",
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
        transition: "transform 0.1s",
    },

    section: {
        background: "white",
        padding: 30,
        borderRadius: 20,
        marginBottom: 35,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 16,
        color: "#1e293b",
    },

    desc: {
        fontSize: 16,
        color: "#475569",
        lineHeight: 1.7,
    },

    sellerCard: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingTop: 10,
    },

    sellerAvatar: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        color: "white",
        fontSize: 28,
        fontWeight: 700,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    sellerName: {
        fontSize: 20,
        fontWeight: 700,
        color: "#1e293b",
    },

    sellerLabel: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 2,
    },

    mapPlaceholder: {
        width: "100%",
        height: 200,
        marginTop: 20,
        background: "#f1f5f9",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontWeight: 500,
    },
};


