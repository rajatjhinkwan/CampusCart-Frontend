import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(res.data.data || null);
            } catch (err) {
                console.error(err);
                setError("Unable to load job details");
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    if (loading) return <div style={styles.center}>Loading job details...</div>;
    if (error || !job) return <div style={styles.center}>{error || "Job not found"}</div>;

    const location =
        typeof job.location === "string" ? job.location : "Location not specified";

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.headerCard}>
                <div style={styles.logoWrapper}>
                    <img
                        src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                        alt="Company Logo"
                        style={styles.companyLogo}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={styles.title}>{job.title}</h1>
                    <p style={styles.companyName}>{job.companyName}</p>
                    <p style={styles.location}>{location}</p>

                    <div style={styles.salaryBox}>
                        💸 {job.salary || "Not disclosed"}
                    </div>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Job Description</h2>
                <p style={styles.text}>{job.description || "No description provided."}</p>
            </div>

            {/* KEY DETAILS */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Key Details</h2>
                <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>📌 <b>Type:</b> {job.jobType || "N/A"}</div>
                    <div style={styles.detailItem}>🕒 <b>Duration:</b> {job.duration || "N/A"}</div>
                    <div style={styles.detailItem}>👥 <b>Applicants:</b> {job.applicantsCount || 0}</div>
                    <div style={styles.detailItem}>🗓 <b>Posted:</b> {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN") : "N/A"}</div>
                </div>
            </div>

            {/* SKILLS */}
            {job.skillsRequired?.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Skills Required</h2>
                    <div style={styles.skillBox}>
                        {job.skillsRequired.map((skill, i) => (
                            <span key={i} style={styles.skillTag}>{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* CONTACT */}
            <div style={styles.contactCard}>
                <h2 style={styles.sectionTitle}>Contact</h2>
                <p style={styles.text}>📞 {job.postedBy?.email || "Not available"}</p>
                <button style={styles.applyBtn}>Apply Now</button>
            </div>
        </div>
    );
}

const styles = {
    page: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px 20px",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
    },
    center: {
        textAlign: "center",
        padding: "80px",
        fontSize: "18px",
        color: "#64748b",
    },
    headerCard: {
        display: "flex",
        gap: "25px",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
        marginBottom: "35px",
        transition: "all 0.3s ease",
    },
    logoWrapper: {
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        backgroundColor: "#f0f9ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    },
    companyLogo: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    title: {
        margin: 0,
        fontSize: "30px",
        fontWeight: 700,
        color: "#0f172a",
    },
    companyName: {
        color: "#475569",
        fontSize: "18px",
        margin: "8px 0",
    },
    location: {
        color: "#64748b",
        marginBottom: "12px",
        fontSize: "14px",
    },
    salaryBox: {
        display: "inline-block",
        padding: "10px 18px",
        borderRadius: "50px",
        background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "16px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
    },
    section: {
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    },
    sectionTitle: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: "16px",
    },
    text: {
        fontSize: "15px",
        color: "#475569",
        lineHeight: 1.8,
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
    },
    detailItem: {
        backgroundColor: "#f0f9ff",
        padding: "12px 15px",
        borderRadius: "15px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#0f172a",
        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    },
    skillBox: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },
    skillTag: {
        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff",
        fontWeight: 500,
        fontSize: "13px",
        padding: "6px 14px",
        borderRadius: "12px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
    },
    contactCard: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        marginBottom: "40px",
    },
    applyBtn: {
        marginTop: "20px",
        padding: "16px 30px",
        fontSize: "18px",
        fontWeight: 700,
        borderRadius: "50px",
        border: "none",
        background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
};
