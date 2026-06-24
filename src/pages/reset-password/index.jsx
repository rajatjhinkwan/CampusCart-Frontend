import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../store/userStore";



export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

    const resetPassword = useUserStore((state) => state.resetPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        const result = await resetPassword(token, password);
        setLoading(false);

        if (result.success) {
            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/user-login"), 2000);
        } else {
            setError(result.error);
        }
    };

    const styles = {
        container: {
            minHeight: "100vh",
            background: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "sans-serif",
        },
        card: {
            width: "100%",
            maxWidth: "400px",
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
        },
        title: {
            fontSize: "24px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "8px",
        },
        subtitle: {
            fontSize: "14px",
            color: "#64748b",
            marginBottom: "30px",
        },
        input: {
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            marginBottom: "15px",
            outline: "none",
        },
        button: {
            width: "100%",
            background: "#2563eb",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
            marginBottom: "20px",
        },
        message: {
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
        },
        success: {
            background: "#d1fae5",
            color: "#065f46",
        },
        error: {
            background: "#fee2e2",
            color: "#991b1b",
        },
        backLink: {
            fontSize: "14px",
            color: "#2563eb",
            cursor: "pointer",
        },
    };

    if (!token) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Invalid Reset Link</h2>
                    <p style={styles.subtitle}>
                        This password reset link is invalid or has expired.
                    </p>
                    <div style={styles.backLink} onClick={() => navigate("/forgot-password")}>
                        Request a new password reset
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Password</h2>
                <p style={styles.subtitle}>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                        minLength={6}
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                        minLength={6}
                    />

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <div style={{ ...styles.message, ...styles.success }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{ ...styles.message, ...styles.error }}>
                        {error}
                    </div>
                )}

                <div style={styles.backLink} onClick={() => navigate("/user-login")}>
                    Back to Sign In
                </div>
            </div>
        </div>
    );
}
