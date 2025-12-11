import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RoomDetails = () => {
    const { id } = useParams(); // room _id from URL
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/rooms/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setRoom(data.data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (!room) return <div style={styles.loading}>Room not found</div>;

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
                    <div style={styles.priceBox}>
                        ₹ {room.rent?.toLocaleString("en-IN") || "N/A"}
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
