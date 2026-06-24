import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";
import Skeleton from "../../components/Skeleton";
import Navbar from "../../components/navbar";
import ReviewSection from "../../components/ReviewSection";

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, startConversation } = useUserStore();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactLoading, setContactLoading] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    
    // Responsive state
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
    const isMobile = width < 768;

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        axios.get(`/api/rooms/${id}`)
            .then((res) => {
                setRoom(res.data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                // Handle error
            });
    }, [id]);

    const styles = {
        page: {
            maxWidth: "1100px",
            margin: "0 auto",
            padding: isMobile ? "20px 15px" : "30px 20px",
            fontFamily: "'Inter', sans-serif",
            backgroundColor: "#f8fafc",
            minHeight: "100vh",
        },
        loading: { padding: "50px", textAlign: "center", fontSize: "20px", color: "#64748b" },

        imageGallery: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
        },
        galleryImg: {
            width: "100%",
            height: isMobile ? "220px" : "300px",
            objectFit: "cover",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease",
        },

        content: {
            background: "#ffffff",
            padding: isMobile ? "20px" : "35px",
            borderRadius: "24px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
        },

        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            marginBottom: "20px",
        },
        title: { fontSize: isMobile ? "24px" : "32px", fontWeight: "700", color: "#0f172a", lineHeight: 1.2 },
        priceBox: {
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
            width: isMobile ? "100%" : "auto",
            textAlign: "center",
        },

        location: {
            marginTop: "8px",
            color: "#64748b",
            fontSize: "16px",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },

        section: { marginBottom: "35px" },
        subHeading: { marginBottom: "16px", fontSize: "22px", fontWeight: "600", color: "#1e293b" },

        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
        },
        specBox: {
            padding: "16px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            transition: "transform 0.2s",
        },
        specLabel: { color: "#64748b", fontSize: "13px", marginBottom: "4px", fontWeight: "500" },
        specValue: { fontSize: "16px", fontWeight: "600", color: "#0f172a" },
        
        reportCard: {
            marginTop: "24px", 
            padding: "30px", 
            background: "#fff", 
            borderRadius: "24px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            border: "1px solid #f1f5f9"
        }
    };

    if (loading) {
        return (
            <>
            <Navbar />
            <div style={styles.page}>
                <div style={styles.imageGallery}>
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} width="100%" height={isMobile ? "220px" : "300px"} style={{ borderRadius: "16px" }} />
                    ))}
                </div>
                <div style={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexDirection: isMobile ? "column" : "row", gap: "20px" }}>
                        <div style={{ width: isMobile ? "100%" : "60%" }}>
                            <Skeleton width="80%" height="40px" style={{ marginBottom: "10px" }} />
                            <Skeleton width="40%" height="20px" />
                        </div>
                        <div style={{ width: isMobile ? "100%" : "30%", display: "flex", flexDirection: "column", alignItems: isMobile ? "stretch" : "flex-end" }}>
                             <Skeleton width={isMobile ? "100%" : "150px"} height="50px" style={{ marginBottom: "10px", borderRadius: "12px" }} />
                             <Skeleton width={isMobile ? "100%" : "180px"} height="50px" style={{ borderRadius: "12px" }} />
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #f1f5f9", margin: "20px 0" }} />

                    <div style={styles.section}>
                        <Skeleton width="200px" height="30px" style={{ marginBottom: 20 }} />
                        <div style={styles.grid}>
                            {Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} width="100%" height="80px" style={{ borderRadius: "12px" }} />
                            ))}
                        </div>
                    </div>

                    <div style={styles.section}>
                         <Skeleton width="200px" height="30px" style={{ marginBottom: 20 }} />
                         <Skeleton width="100%" height="20px" style={{ marginBottom: 10 }} />
                         <Skeleton width="100%" height="20px" style={{ marginBottom: 10 }} />
                         <Skeleton width="80%" height="20px" />
                    </div>
                </div>
            </div>
            </>
        );
    }

    if (!room) return (
        <>
            <Navbar />
            <div style={styles.loading}>Room not found</div>
        </>
    );

    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to contact owner");
            navigate("/user-login");
            return;
        }
        const ownerId = room.seller?._id || room.seller;
        if (!ownerId) {
            toast.error("Owner info missing");
            return;
        }
        
        // Prevent chatting with self
        const myId = useUserStore.getState().user?._id;
        if (myId === ownerId) {
            toast.error("You cannot chat with yourself");
            return;
        }

        setContactLoading(true);
        try {
            const { success, conversationId, error } = await startConversation({
                recipientId: ownerId,
                productId: room._id,
                contextType: "Room"
            });
            
            if (success && conversationId) {
                // Send initial inquiry message
                await useUserStore.getState().sendMessage(conversationId, `Hi, is the room "${room.title}" still available?`);
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

    return (
        <>
        <Navbar />
        <div style={styles.page} className="fade-in">
            {/* IMAGES SECTION */}
            <div style={styles.imageGallery}>
                {room.images?.length > 0 ? (
                    room.images.map((img, index) => (
                        <img key={index} src={img.url} alt="room" style={styles.galleryImg} />
                    ))
                ) : (
                    <img
                        src="https://via.placeholder.com/600x400"
                        alt="room"
                        style={styles.galleryImg}
                    />
                )}
            </div>

            <div style={styles.content}>
                {/* TITLE + PRICE */}
                <div style={styles.header}>
                    <h1 style={styles.title}>{room.title}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: isMobile ? 'stretch' : 'flex-end', width: isMobile ? '100%' : 'auto' }}>
                        <div style={styles.priceBox}>
                            ₹ {room.rent?.toLocaleString("en-IN") || "N/A"}
                        </div>
                        <button 
                            onClick={handleContact} 
                            disabled={contactLoading}
                            style={{
                                padding: "12px 24px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                cursor: contactLoading ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                opacity: contactLoading ? 0.7 : 1,
                                width: isMobile ? "100%" : "auto",
                                fontSize: "16px",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                            }}
                        >
                            {contactLoading ? "Processing..." : "Contact Owner"}
                        </button>
                    </div>
                </div>

                {/* LOCATION */}
                <p style={styles.location}>
                    📍 {room.location?.area || "Unknown Area"}, {room.location?.city || "Unknown City"}
                </p>

                {/* SPECS GRID */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>Room Specifications</h2>

                    <div style={styles.grid}>
                        <Spec label="Type" value={room.roomType || "N/A"} styles={styles} />
                        <Spec label="BHK" value={room.bhk || "N/A"} styles={styles} />
                        <Spec label="Available From" value={room.availableFrom ? new Date(room.availableFrom).toDateString() : "N/A"} styles={styles} />
                        <Spec label="Furnished" value={room.furnished || "N/A"} styles={styles} />

                        <Spec label="Attached Bathroom" value={room.features?.attachedBathroom ? "Yes" : "No"} styles={styles} />
                        <Spec label="Attached Toilet" value={room.features?.attachedToilet ? "Yes" : "No"} styles={styles} />
                        <Spec label="Attached Kitchen" value={room.features?.attachedKitchen ? "Yes" : "No"} styles={styles} />
                        <Spec label="Balcony" value={room.features?.balcony ? "Yes" : "No"} styles={styles} />

                        <Spec label="WiFi" value={room.features?.wifi ? "Yes" : "No"} styles={styles} />
                        <Spec label="Geyser" value={room.features?.geyser ? "Yes" : "No"} styles={styles} />
                        <Spec label="Fan" value={room.features?.fan ? "Yes" : "No"} styles={styles} />
                        <Spec label="Parking" value={room.features?.parking ? "Yes" : "No"} styles={styles} />
                    </div>
                </div>

                {/* RULES */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>House Rules</h2>
                    <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#334155" }}>
                        <Rule label="Smoking" value={room.rules?.smoking} />
                        <Rule label="Alcohol" value={room.rules?.alcohol} />
                        <Rule label="Visitors" value={room.rules?.visitors} />
                        <Rule label="Pets Allowed" value={room.rules?.pets} />
                    </ul>
                </div>

                {/* DESCRIPTION */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>Description</h2>
                    <p style={{ lineHeight: "1.7", color: "#475569", whiteSpace: "pre-line" }}>{room.description || "No description available."}</p>
                </div>

                <ReviewSection targetId={room._id} targetType="room" />

                <div style={styles.reportCard}>
                    <div style={{ fontWeight: "700", marginBottom: "16px", color: "#ef4444", fontSize: "18px" }}>Report Room</div>
                    <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", color: "#475569", backgroundColor: "#f8fafc" }}
                    >
                        <option value="">Select a reason</option>
                        <option value="spam">Spam or misleading</option>
                        <option value="fraud">Fraud or fake</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="duplicate">Duplicate listing</option>
                        <option value="illegal">Illegal offer</option>
                    </select>
                    <textarea
                        placeholder="Optional details about your report..."
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", minHeight: "100px", marginBottom: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", fontFamily: "inherit", resize: "vertical", backgroundColor: "#f8fafc" }}
                    />
                    <button
                        onClick={async () => {
                            try {
                                const token = useUserStore.getState().accessToken;
                                if (!token) { toast.error("Please login to report"); return; }
                                if (!reportReason) { toast.error("Select a reason"); return; }
                                await axios.post(
                                    `/api/reports/room/${room._id}`,
                                    { reason: reportReason, message: reportMessage }
                                );
                                toast.success("Report submitted");
                                setReportReason("");
                                setReportMessage("");
                            } catch (e) {
                                toast.error(e.response?.data?.message || "Failed to submit report");
                            }
                        }}
                        style={{ padding: "12px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s", width: "100%" }}
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

/* COMPONENTS */
const Spec = ({ label, value, styles }) => (
    <div style={styles.specBox}>
        <p style={styles.specLabel}>{label}</p>
        <p style={styles.specValue}>{value}</p>
    </div>
);

const Rule = ({ label, value }) => (
    <li style={{ marginBottom: "8px" }}>
        {label}: <strong style={{ color: value ? "#10b981" : "#ef4444" }}>{value ? "Allowed" : "Not Allowed"}</strong>
    </li>
);

export default RoomDetails;
