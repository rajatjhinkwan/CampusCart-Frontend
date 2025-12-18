import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, MapPin } from "lucide-react";

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

  const login = useUserStore((state) => state.login);
  const loading = useUserStore((state) => state.loading);
  const storeError = useUserStore((state) => state.error);
  const clearError = useUserStore((state) => state.clearError);
  const navigate = useNavigate();
  const setAppLocation = useUserStore((s) => s.setAppLocation);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [error, setError] = React.useState("");
  const [detecting, setDetecting] = React.useState(false);
  const [detectedCity, setDetectedCity] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setError("");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const result = await login({ email, password });

    if (result.success) {
      if (remember) {
        try {
          localStorage.setItem("remember-email", email);
        } catch (_) {}
      }
      navigate("/homepage");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const askLocation = async () => {
    if (!("geolocation" in navigator)) {
      setError("Location not supported in your browser");
      return;
    }
    setDetecting(true);
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 }));
      const { latitude, longitude } = pos.coords;
      const photonBase = import.meta.env.VITE_PHOTON_PROXY_BASE || 'https://photon.komoot.io';
      let city = "";
      try {
        const r = await fetch(`${photonBase}/reverse?lat=${latitude}&lon=${longitude}`, { headers: { Accept: 'application/json' } });
        if (r.ok) {
          const d = await r.json();
          const f = Array.isArray(d.features) ? d.features[0] : null;
          const p = f?.properties || {};
          city = p.city || p.town || p.village || p.county || "";
        }
      } catch {}
      const label = city ? city : `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
      setDetectedCity(label);
      await setAppLocation(label, { saveToProfile: true });
    } catch (e) {
      setError("Could not detect your location");
    } finally {
      setDetecting(false);
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
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={askLocation}
                  disabled={detecting}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #d1d5db', background: '#fff', color: '#111827', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
                >
                  <MapPin size={16} /> {detecting ? 'Detecting...' : 'Use my location'}
                </button>
                {detectedCity ? <span style={{ fontSize: 12, color: '#6b7280' }}>Current: {detectedCity}</span> : null}
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    style={{ ...styles.input, paddingLeft: "36px" }}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: "18px", height: "18px" }} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    style={{ ...styles.input, paddingLeft: "36px", paddingRight: "36px" }}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: "18px", height: "18px" }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "#6b7280" }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={styles.rememberRow}>
                <label>
                  <input type="checkbox" style={styles.checkbox} checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
                </label>
                <button type="button" style={styles.forgot} onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </div>

              {error || storeError ? (
                <div style={{ marginBottom: "12px", background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "8px", fontSize: "13px" }}>
                  {error || storeError}
                </div>
              ) : null}

              <button style={{ ...styles.signInButton, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
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
