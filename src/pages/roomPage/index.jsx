import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, startConversation } = useUserStore();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactLoading, setContactLoading] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");

    useEffect(() => {
        axios.get(`/api/rooms/${id}`)
            .then((res) => {
                setRoom(res.data.data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (!room) return <div style={styles.loading}>Room not found</div>;

    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to contact owner");
            navigate("/login");
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
                navigate("/messages");
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
        <div style={styles.page}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                        <div style={styles.priceBox}>
                            ₹ {room.rent?.toLocaleString("en-IN") || "N/A"}
                        </div>
                        <button 
                            onClick={handleContact} 
                            disabled={contactLoading}
                            style={{
                                padding: "10px 20px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: contactLoading ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                opacity: contactLoading ? 0.7 : 1
                            }}
                        >
                            {contactLoading ? "Processing..." : "Contact Owner"}
                        </button>
                    </div>
                </div>

                {/* LOCATION */}
                <p style={styles.location}>
                    📍 {room.location?.area}, {room.location?.city}
                </p>

                {/* SPECS GRID */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>Room Specifications</h2>

                    <div style={styles.grid}>
                        <Spec label="Type" value={room.roomType || "N/A"} />
                        <Spec label="BHK" value={room.bhk || "N/A"} />
                        <Spec label="Available From" value={new Date(room.availableFrom).toDateString()} />
                        <Spec label="Furnished" value={room.furnished || "N/A"} />

                        <Spec label="Attached Bathroom" value={room.features?.attachedBathroom ? "Yes" : "No"} />
                        <Spec label="Attached Toilet" value={room.features?.attachedToilet ? "Yes" : "No"} />
                        <Spec label="Attached Kitchen" value={room.features?.attachedKitchen ? "Yes" : "No"} />
                        <Spec label="Balcony" value={room.features?.balcony ? "Yes" : "No"} />

                        <Spec label="WiFi" value={room.features?.wifi ? "Yes" : "No"} />
                        <Spec label="Geyser" value={room.features?.geyser ? "Yes" : "No"} />
                        <Spec label="Fan" value={room.features?.fan ? "Yes" : "No"} />
                        <Spec label="Parking" value={room.features?.parking ? "Yes" : "No"} />
                    </div>
                </div>

                {/* RULES */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>House Rules</h2>
                    <ul>
                        <Rule label="Smoking" value={room.rules?.smoking} />
                        <Rule label="Alcohol" value={room.rules?.alcohol} />
                        <Rule label="Visitors" value={room.rules?.visitors} />
                        <Rule label="Pets Allowed" value={room.rules?.pets} />
                    </ul>
                </div>

                {/* DESCRIPTION */}
                <div style={styles.section}>
                    <h2 style={styles.subHeading}>Description</h2>
                    <p>{room.description || "No description available."}</p>
                </div>

                <div style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 8 }}>Report Room</div>
                    <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 8 }}
                    >
                        <option value="">Select a reason</option>
                        <option value="spam">Spam or misleading</option>
                        <option value="fraud">Fraud or fake</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="duplicate">Duplicate listing</option>
                        <option value="illegal">Illegal offer</option>
                    </select>
                    <textarea
                        placeholder="Optional details"
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        style={{ width: "100%", padding: 8, minHeight: 80, marginBottom: 8 }}
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
                        style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6 }}
                    >
                        Report
                    </button>
                </div>
            </div>
        </div>
    );
};

/* COMPONENTS */
const Spec = ({ label, value }) => (
    <div style={styles.specBox}>
        <p style={styles.specLabel}>{label}</p>
        <p style={styles.specValue}>{value}</p>
    </div>
);

const Rule = ({ label, value }) => (
    <li>
        {label}: <strong>{value ? "Allowed" : "Not Allowed"}</strong>
    </li>
);

/* STYLES */
const styles = {
    page: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
    },
    loading: { padding: "50px", textAlign: "center", fontSize: "20px" },

    imageGallery: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "15px",
        marginBottom: "30px",
    },
    galleryImg: {
        width: "100%",
        height: "250px",
        objectFit: "cover",
        borderRadius: "12px",
    },

    content: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: "26px", fontWeight: "600" },
    priceBox: {
        background: "#1d4ed8",
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: "20px",
        fontWeight: "bold",
    },

    location: {
        marginTop: "5px",
        color: "#64748b",
        fontSize: "16px",
        marginBottom: "20px",
    },

    section: { marginBottom: "25px" },
    subHeading: { marginBottom: "10px", fontSize: "20px" },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "15px",
    },
    specBox: {
        padding: "12px",
        borderRadius: "10px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
    },
    specLabel: { color: "#64748b", fontSize: "14px" },
    specValue: { fontSize: "16px", fontWeight: "600" },
};

export default RoomDetails;
