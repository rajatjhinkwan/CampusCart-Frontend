import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import Skeleton from "../../components/Skeleton.jsx";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar.jsx";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, startConversation } = useUserStore();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applyLoading, setApplyLoading] = useState(false);
    const [error, setError] = useState("");
    const [reportReason, setReportReason] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await axios.get(`/api/jobs/${id}`);
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

    const styles = {
        page: {
            maxWidth: "1100px",
            margin: "0 auto",
            padding: isMobile ? "20px 15px" : "40px 20px",
            fontFamily: "'Inter', sans-serif",
            backgroundColor: "#f8fafc",
            minHeight: "100vh",
        },
        center: {
            textAlign: "center",
            padding: "80px",
            fontSize: "18px",
            color: "#64748b",
        },
        headerCard: {
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "30px",
            alignItems: isMobile ? "flex-start" : "center",
            backgroundColor: "#fff",
            padding: isMobile ? "25px" : "40px",
            borderRadius: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
            marginBottom: "35px",
            border: "1px solid #f1f5f9",
        },
        logoWrapper: {
            width: isMobile ? "80px" : "120px",
            height: isMobile ? "80px" : "120px",
            borderRadius: "24px",
            backgroundColor: "#f0f9ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
        },
        companyLogo: {
            width: isMobile ? "50px" : "80px",
            height: isMobile ? "50px" : "80px",
            objectFit: "contain",
        },
        title: {
            margin: 0,
            fontSize: isMobile ? "24px" : "36px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.2,
        },
        companyName: {
            color: "#475569",
            fontSize: "18px",
            margin: "8px 0",
            fontWeight: 500,
        },
        location: {
            color: "#64748b",
            marginBottom: "16px",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        salaryBox: {
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "50px",
            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            boxShadow: "0 4px 12px rgba(14, 165, 233, 0.2)",
        },
        section: {
            backgroundColor: "#fff",
            padding: isMobile ? "25px" : "35px",
            borderRadius: "24px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            border: "1px solid #f1f5f9",
        },
        sectionTitle: {
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "2px solid #f1f5f9",
        },
        text: {
            fontSize: "16px",
            color: "#334155",
            lineHeight: 1.8,
            whiteSpace: "pre-line",
        },
        detailGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
        },
        detailItem: {
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: 500,
            color: "#334155",
            border: "1px solid #e2e8f0",
            transition: "transform 0.2s",
        },
        skillBox: {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
        },
        skillTag: {
            background: "#f1f5f9",
            color: "#334155",
            fontWeight: 600,
            fontSize: "14px",
            padding: "10px 18px",
            borderRadius: "100px",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s",
        },
        contactCard: {
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "24px",
            textAlign: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
            marginBottom: "40px",
            border: "1px solid #f1f5f9",
        },
        applyBtn: {
            marginTop: "25px",
            padding: "18px 40px",
            fontSize: "18px",
            fontWeight: 700,
            borderRadius: "50px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
            width: isMobile ? "100%" : "auto",
        },
        reportCard: {
            backgroundColor: "#fff", 
            padding: "30px", 
            borderRadius: "24px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            border: "1px solid #f1f5f9"
        }
    };

    if (loading) return (
        <>
        <Navbar />
        <div style={styles.page}>
            <div style={styles.headerCard}>
                <Skeleton width={isMobile ? "80px" : "120px"} height={isMobile ? "80px" : "120px"} borderRadius="24px" />
                <div style={{ flex: 1, width: "100%" }}>
                    <Skeleton width="60%" height="40px" style={{ marginBottom: 15 }} />
                    <Skeleton width="40%" height="25px" style={{ marginBottom: 15 }} />
                    <Skeleton width="30%" height="20px" style={{ marginBottom: 20 }} />
                    <Skeleton width="140px" height="45px" borderRadius="50px" />
                </div>
            </div>
            
            {/* Description Skeleton */}
            <div style={styles.section}>
                <Skeleton width="30%" height="30px" style={{ marginBottom: 25 }} />
                <Skeleton width="100%" height="20px" style={{ marginBottom: 12 }} />
                <Skeleton width="100%" height="20px" style={{ marginBottom: 12 }} />
                <Skeleton width="90%" height="20px" style={{ marginBottom: 12 }} />
                <Skeleton width="80%" height="20px" />
            </div>

            {/* Key Details Skeleton */}
            <div style={styles.section}>
                <Skeleton width="200px" height="30px" style={{ marginBottom: 25 }} />
                <div style={styles.detailGrid}>
                    <Skeleton width="100%" height="80px" style={{ borderRadius: "16px" }} />
                    <Skeleton width="100%" height="80px" style={{ borderRadius: "16px" }} />
                    <Skeleton width="100%" height="80px" style={{ borderRadius: "16px" }} />
                    <Skeleton width="100%" height="80px" style={{ borderRadius: "16px" }} />
                </div>
            </div>
        </div>
        </>
    );

    if (error || !job) return (
        <>
            <Navbar />
            <div style={styles.center}>{error || "Job not found"}</div>
        </>
    );

    const location = typeof job.location === "string" ? job.location : "Location not specified";

    const handleApply = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to apply");
            navigate("/user-login");
            return;
        }
        
        const employerId = job.postedBy?._id || job.postedBy;
        
        if (!employerId) {
            toast.error("Employer info missing - cannot apply");
            return;
        }

        const myId = useUserStore.getState().user?._id;
        if (myId === employerId) {
            toast.error("You cannot apply to your own job");
            return;
        }

        setApplyLoading(true);
        try {
            const { success, conversationId, error } = await startConversation({
                recipientId: employerId,
                productId: job._id,
                contextType: "Job"
            });
            
            if (success && conversationId) {
                await useUserStore.getState().sendMessage(conversationId, `Hi, I'm interested in applying for the "${job.title}" position.`);
                navigate("/user-messages");
            } else {
                toast.error(error || "Failed to start application");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setApplyLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div style={styles.page} className="fade-in">
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
                    <p style={styles.location}>📍 {location}</p>

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
                    <div style={styles.detailItem}>
                        <div style={{fontSize: '13px', color: '#64748b', marginBottom: '4px'}}>JOB TYPE</div>
                        <div style={{fontSize: '16px', fontWeight: '600'}}>{job.jobType || "N/A"}</div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{fontSize: '13px', color: '#64748b', marginBottom: '4px'}}>DURATION</div>
                        <div style={{fontSize: '16px', fontWeight: '600'}}>{job.duration || "N/A"}</div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{fontSize: '13px', color: '#64748b', marginBottom: '4px'}}>APPLICANTS</div>
                        <div style={{fontSize: '16px', fontWeight: '600'}}>{job.applicantsCount || 0} People</div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={{fontSize: '13px', color: '#64748b', marginBottom: '4px'}}>POSTED ON</div>
                        <div style={{fontSize: '16px', fontWeight: '600'}}>
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                                day: 'numeric', month: 'short', year: 'numeric'
                            }) : "N/A"}
                        </div>
                    </div>
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
                <h2 style={{...styles.sectionTitle, textAlign: 'center', borderBottom: 'none', marginBottom: '10px'}}>Interested?</h2>
                <p style={{...styles.text, textAlign: 'center'}}>
                    Connect with the employer to discuss this opportunity further.
                </p>
                <button 
                    style={{...styles.applyBtn, opacity: applyLoading ? 0.7 : 1, cursor: applyLoading ? 'not-allowed' : 'pointer'}} 
                    onClick={handleApply}
                    disabled={applyLoading}
                >
                    {applyLoading ? "Starting Application..." : "Apply Now"}
                </button>
            </div>

            {/* REPORT */}
            <div style={styles.reportCard}>
                <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "16px", color: "#ef4444" }}>Report Job</div>
                <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        borderRadius: "12px", 
                        border: "1px solid #cbd5e1", 
                        marginBottom: "12px", 
                        fontSize: "15px",
                        backgroundColor: "#f8fafc",
                        outline: "none"
                    }}
                >
                    <option value="">Select a reason</option>
                    <option value="spam">Spam or misleading</option>
                    <option value="fraud">Fraud or fake</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="duplicate">Duplicate listing</option>
                    <option value="illegal">Illegal job</option>
                </select>
                <textarea
                    placeholder="Provide more details about your report..."
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        borderRadius: "12px", 
                        border: "1px solid #cbd5e1", 
                        marginBottom: "16px", 
                        fontSize: "15px", 
                        minHeight: "100px",
                        backgroundColor: "#f8fafc",
                        outline: "none",
                        fontFamily: "inherit"
                    }}
                />
                <button
                    onClick={async () => {
                        try {
                            const token = useUserStore.getState().accessToken;
                            if (!token) { toast.error("Please login to report"); return; }
                            if (!reportReason) { toast.error("Select a reason"); return; }
                            await axios.post(
                                `/api/reports/job/${job._id}`,
                                { reason: reportReason, message: reportMessage }
                            );
                            toast.success("Report submitted successfully");
                            setReportReason("");
                            setReportMessage("");
                        } catch (e) {
                            toast.error(e.response?.data?.message || "Failed to submit report");
                        }
                    }}
                    style={{ 
                        padding: "12px 24px", 
                        borderRadius: "12px", 
                        backgroundColor: "#ef4444", 
                        color: "#fff", 
                        border: "none", 
                        fontWeight: 600, 
                        cursor: "pointer",
                        fontSize: "15px",
                        transition: "background 0.2s"
                    }}
                >
                    Submit Report
                </button>
            </div>
        </div>
        </>
    );
}
