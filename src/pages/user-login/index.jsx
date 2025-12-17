import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

function Index() {
  const styles = {
    // 🔥 your styles are untouched
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      width: "100vw",
    },
    mainBox: {
      display: "flex",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      width: "1000px",
      overflow: "hidden",
    },
    leftSection: {
      flex: 1,
      padding: "50px",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    rightSection: {
      flex: 1,
      padding: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderLeft: "1px solid #eee",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#1e293b",
    },
    subtitle: {
      fontSize: "16px",
      color: "#475569",
      marginBottom: "40px",
    },
    feature: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      color: "#1e293b",
    },
    icon: {
      fontSize: "20px",
      marginRight: "10px",
    },
    formBox: {
      width: "100%",
      maxWidth: "350px",
      textAlign: "center",
    },
    signInTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#1e293b",
    },
    signInSubtitle: {
      color: "#6b7280",
      marginBottom: "20px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginBottom: "20px",
    },
    socialButton: {
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      color: "#374151",
    },
    facebookButton: {
      backgroundColor: "#1877f2",
      color: "#fff",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "15px",
    },
    label: {
      fontSize: "14px",
      color: "#374151",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
    },
    rememberRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "14px",
      marginBottom: "20px",
    },
    checkbox: { marginRight: "6px" },
    forgot: { color: "#2563eb", cursor: "pointer", textDecoration: "none" },
    signInButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px",
      borderRadius: "8px",
      width: "100%",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    signUpText: {
      marginTop: "20px",
      fontSize: "14px",
      color: "#374151",
    },
    signUpLink: { color: "#2563eb", cursor: "pointer", marginLeft: "5px" },
  };

  // ✅ Import login directly from store
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  // -------------------------
  // FIXED LOGIN FUNCTION
  // -------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    // 🔥 Call zustand login(email, password)
    const result = await login({ email, password });

    if (result.success) {
      navigate("/homepage");
    } else {
      console.log("Login failed:", result.error);
      alert(result.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainBox}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          <h1 style={styles.title}>Welcome back to Campus Cart</h1>
          <p style={styles.subtitle}>
            Sign in to access your account, manage your listings, and connect
            with buyers and sellers in your area.
          </p>

          <div style={styles.feature}>
            <span style={styles.icon}>💬</span>
            <div>
              <b>Chat with buyers</b>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Direct messaging system
              </div>
            </div>
          </div>

          <div style={styles.feature}>
            <span style={styles.icon}>🔒</span>
            <div>
              <b>Secure transactions</b>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Protected by advanced security
              </div>
            </div>
          </div>

          <div style={styles.feature}>
            <span style={styles.icon}>🚀</span>
            <div>
              <b>Boost your listings</b>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Reach more potential buyers
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div style={styles.rightSection}>
          <div style={styles.formBox}>
            <h2 style={styles.signInTitle}>Sign In</h2>
            <p style={styles.signInSubtitle}>Enter your credentials</p>

            <form onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.rememberRow}>
                <label>
                  <input type="checkbox" style={styles.checkbox} /> Remember me
                </label>
                <a href="#" style={styles.forgot}>
                  Forgot password?
                </a>
              </div>

              <button style={styles.signInButton}>Sign In</button>
            </form>

            <div style={styles.signUpText} onClick={() => navigate("/user-signup")}>
              Don’t have an account?
              <span style={styles.signUpLink}> Sign up for free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
