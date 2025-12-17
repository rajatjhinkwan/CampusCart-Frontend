import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const forgotPassword = useUserStore((state) => state.forgotPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage("Password reset link sent to your email!");
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
      marginBottom: "20px",
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
    },
    message: {
      marginTop: "20px",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
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
      marginTop: "20px",
      fontSize: "14px",
      color: "#2563eb",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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
