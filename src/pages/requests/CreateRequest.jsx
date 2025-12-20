import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar";
import toast from "react-hot-toast";

export default function CreateRequest() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        location: "",
        budget: "",
        urgency: "Medium"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/requests", formData);
            toast.success("Request posted successfully!");
            navigate("/requests");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to post request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Post a Service Request</h1>
                    <p style={styles.subtitle}>Let others know what you need help with.</p>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Need a plumber for leaking tap"
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={styles.select}
                            >
                                <option value="General">General</option>
                                <option value="Home Services">Home Services</option>
                                <option value="Education">Education</option>
                                <option value="IT & Tech">IT & Tech</option>
                                <option value="Creative">Creative</option>
                                <option value="Events">Events</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Budget (Optional)</label>
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g. $50 or Negotiable"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Urgency</label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, Area or Zip Code"
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your request in detail..."
                                required
                                style={styles.textarea}
                                rows={5}
                            />
                        </div>

                        <div style={styles.actions}>
                            <button
                                type="button"
                                onClick={() => navigate("/requests")}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={loading ? styles.disabledBtn : styles.submitBtn}
                            >
                                {loading ? "Posting..." : "Post Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
    },
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#1f2937",
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: "32px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
    },
    row: {
        display: "flex",
        gap: "24px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
    },
    select: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        backgroundColor: "white",
    },
    textarea: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        resize: "vertical",
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "16px",
        marginTop: "16px",
    },
    cancelBtn: {
        padding: "12px 24px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        backgroundColor: "white",
        color: "#374151",
        cursor: "pointer",
        fontWeight: "600",
    },
    submitBtn: {
        padding: "12px 24px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#2563EB",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },
    disabledBtn: {
        padding: "12px 24px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#93C5FD",
        color: "white",
        cursor: "not-allowed",
        fontWeight: "600",
    }
};
