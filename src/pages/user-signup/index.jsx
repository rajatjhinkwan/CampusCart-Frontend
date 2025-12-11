import { useState } from "react";
import { User, Lock, ShieldCheck, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../../store/userStore";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "buyer",
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const res = await axios.post(
      "http://localhost:5000/api/auth/signup",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Signup success:", res.data);

    const { user, accessToken, refreshToken } = res.data;

    // ============================
    // 💾 Save in Zustand global store
    // ============================
    useUserStore.setState({
      user,
      accessToken,
      refreshToken,
    });

    // ============================
    // 💾 Persist in localStorage
    // ============================
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Redirect
    navigate("/homepage");
  } catch (err) {
    console.error("Signup ERROR Status:", err.response?.status);
    console.error("Signup ERROR Details:", err.response?.data);
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
            maxWidth: "1100px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        },
        leftPanel: {
            padding: "40px",
            borderRight: "1px solid #e5e7eb",
        },
        title: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "8px",
        },
        subtitle: {
            fontSize: "15px",
            color: "#475569",
            marginBottom: "30px",
            lineHeight: "1.5",
        },
        listItem: {
            display: "flex",
            gap: "15px",
            marginBottom: "30px",
        },
        listTitle: {
            fontWeight: "600",
            color: "#1e293b",
        },
        listDesc: {
            fontSize: "13px",
            color: "#64748b",
        },
        rightPanel: {
            padding: "40px",
        },
        formTitle: {
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "30px",
        },
        radioContainer: {
            display: "flex",
            gap: "12px",
            marginBottom: "25px",
        },
        radio: {
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center",
            fontSize: "14px",
            cursor: "pointer",
        },
        radioActive: {
            borderColor: "#2563eb",
            background: "#eff6ff",
        },
        inputLabel: {
            fontSize: "13px",
            fontWeight: "600",
            color: "#334155",
            marginBottom: "6px",
            display: "block",
        },
        input: {
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "10px",
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
        },
        loginText: {
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#475569",
        },
        loginLink: {
            color: "#2563eb",
            marginLeft: "4px",
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* LEFT SECTION */}
                <div style={styles.leftPanel}>
                    <h2 style={styles.title}>Welcome to Campus Cart</h2>
                    <p style={styles.subtitle}>
                        Create an account to list items, trade securely, and connect with buyers and sellers on your campus.
                    </p>

                    <div style={styles.listItem}>
                        <User color="#8b5cf6" />
                        <div>
                            <p style={styles.listTitle}>Easy Communication</p>
                            <p style={styles.listDesc}>Chat directly with buyers and sellers.</p>
                        </div>
                    </div>

                    <div style={styles.listItem}>
                        <Lock color="#d97706" />
                        <div>
                            <p style={styles.listTitle}>Secure Platform</p>
                            <p style={styles.listDesc}>Protected with modern security standards.</p>
                        </div>
                    </div>

                    <div style={styles.listItem}>
                        <Rocket color="#e11d48" />
                        <div>
                            <p style={styles.listTitle}>Boost Listings</p>
                            <p style={styles.listDesc}>Reach more potential buyers.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <form style={styles.rightPanel} onSubmit={handleSubmit}>
                    <h2 style={styles.formTitle}>Create Account</h2>

                    {/* ROLE */}
                    <div style={styles.radioContainer}>
                        <label
                            style={{
                                ...styles.radio,
                                ...(formData.role === "student" ? styles.radioActive : {}),
                            }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="student"
                                style={{ display: "none" }}
                                checked={formData.role === "student"}
                                onChange={handleChange}
                            />
                            Student User
                        </label>

                        <label
                            style={{
                                ...styles.radio,
                                ...(formData.role === "admin" ? styles.radioActive : {}),
                            }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                style={{ display: "none" }}
                                checked={formData.role === "admin"}
                                onChange={handleChange}
                            />
                            Campus Admin
                        </label>
                    </div>

                    {/* FULL NAME */}
                    <label style={styles.inputLabel}>Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    {/* EMAIL */}
                    <label style={styles.inputLabel}>Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    {/* PASSWORD */}
                    <label style={styles.inputLabel}>Password *</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    {/* BUTTON */}
                    <button type="submit" style={styles.button}>Sign Up</button>

                    <p style={styles.loginText} onClick={() => navigate("/user-login")}>
                        Already have an account?
                        <a href="/login" style={styles.loginLink}>Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    );
}