import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
// SKELETON UI (Shimmer)
// ------------------------------------
const Skeleton = () => (
    <div style={{ padding: "20px" }}>
        <div style={skeletonStyles.bigImage}></div>
        <div style={{ marginTop: 20 }}>
            <div style={skeletonStyles.line}></div>
            <div style={skeletonStyles.lineShort}></div>
            <div style={skeletonStyles.line}></div>
            <div style={skeletonStyles.line}></div>
            <div style={skeletonStyles.lineShort}></div>
        </div>
    </div>
);

// ------------------------------------
// SERVICE DETAIL PAGE
// ------------------------------------
export default function ServiceDetail() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        fetchService();
    }, []);

    const fetchService = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/services/${id}`);
            const data = await res.json();

            const svc = data.data || data.service;

            setService(svc);
            setActiveImage(
                svc?.images?.length > 0
                    ? svc.images[0]
                    : svc?.image || "https://via.placeholder.com/600"
            );

            setLoading(false);
        } catch (err) {
            console.error("Error fetching service:", err);
            setLoading(false);
        }
    };

    if (loading) return <Skeleton />;
    if (!service)
        return (
            <h2 style={{ textAlign: "center", marginTop: 60 }}>Service Not Found</h2>
        );

    return (
        <div style={styles.page}>
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
                                    src={img}
                                    alt="thumb"
                                    style={{
                                        ...styles.thumbnail,
                                        border:
                                            activeImage === img
                                                ? "3px solid #2563eb"
                                                : "2px solid #e2e8f0",
                                    }}
                                    onClick={() => setActiveImage(img)}
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

                    <button style={styles.contactBtn}>Contact Provider</button>
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
    );
}

// ------------------------------------
// MAIN STYLES
// ------------------------------------
const styles = {
    page: {
        maxWidth: 1200,
        margin: "30px auto",
        padding: "0 20px",
        fontFamily: "Inter, sans-serif",
    },

    topContainer: {
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
        marginBottom: 30,
    },

    gallery: {
        flex: 1,
        minWidth: 350,
    },

    mainImage: {
        width: "100%",
        height: 380,
        objectFit: "cover",
        borderRadius: 12,
        boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
    },

    thumbnailRow: {
        display: "flex",
        gap: 12,
        marginTop: 12,
        flexWrap: "wrap",
    },

    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 10,
        objectFit: "cover",
        cursor: "pointer",
    },

    infoBox: {
        flex: 1,
        minWidth: 300,
        background: "white",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: 28,
        fontWeight: 700,
    },

    price: {
        marginTop: 10,
        fontSize: 26,
        fontWeight: 700,
        color: "#1e293b",
    },

    negotiable: {
        marginTop: 6,
        display: "inline-block",
        background: "#10b981",
        color: "white",
        padding: "5px 12px",
        borderRadius: 8,
        fontSize: 14,
    },

    infoLine: {
        marginTop: 14,
    },

    label: {
        fontSize: 14,
        color: "#64748b",
    },

    value: {
        fontSize: 16,
        fontWeight: 500,
        color: "#1e293b",
    },

    contactBtn: {
        marginTop: 25,
        padding: "14px 0",
        width: "100%",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 16,
        cursor: "pointer",
    },

    section: {
        background: "white",
        padding: 25,
        borderRadius: 12,
        marginBottom: 30,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 12,
    },

    desc: {
        fontSize: 16,
        color: "#334155",
        lineHeight: 1.6,
    },

    sellerCard: {
        display: "flex",
        alignItems: "center",
        gap: 15,
        paddingTop: 10,
    },

    sellerAvatar: {
        width: 55,
        height: 55,
        borderRadius: "50%",
        background: "#2563eb",
        color: "white",
        fontSize: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    sellerName: {
        fontSize: 18,
        fontWeight: 600,
    },

    sellerLabel: {
        fontSize: 14,
        color: "#64748b",
    },

    mapPlaceholder: {
        width: "100%",
        height: 150,
        marginTop: 15,
        background: "#e2e8f0",
        borderRadius: 12,
    },
};

// ------------------------------------
// SKELETON STYLES
// ------------------------------------
const skeletonStyles = {
    bigImage: {
        width: "100%",
        height: 350,
        borderRadius: 12,
        background: "linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)",
        animation: "shimmer 1.5s infinite",
        backgroundSize: "200% 100%",
    },

    line: {
        height: 20,
        marginBottom: 12,
        borderRadius: 8,
        background: "linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)",
        animation: "shimmer 1.5s infinite",
    },

    lineShort: {
        height: 20,
        width: "50%",
        marginBottom: 12,
        borderRadius: 8,
        background: "linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)",
        animation: "shimmer 1.5s infinite",
    },
};
