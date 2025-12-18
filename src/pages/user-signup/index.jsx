import { useState } from "react";
import { User, Lock, Rocket, Eye, EyeOff, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
import { useUserStore } from "../../store/userStore";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer",
        location: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const loading = useUserStore((s) => s.loading);
    
    // Location Autocomplete State
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef(null);

    const handleLocationSearch = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        
        try {
            const photonBase = import.meta.env.VITE_PHOTON_PROXY_BASE || 'https://photon.komoot.io';
            const res = await fetch(`${photonBase}/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`);
            if (res.ok) {
                const data = await res.json();
                const cities = data.features.map(f => {
                    const p = f.properties;
                    return p.city || p.town || p.village || p.name;
                }).filter((v, i, a) => v && a.indexOf(v) === i);
                setSuggestions(cities);
                setShowSuggestions(true);
            }
        } catch (err) {
            console.error("Location search failed", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'location') {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                handleLocationSearch(value);
            }, 300);
        }
    };

    const selectSuggestion = (city) => {
        setFormData(prev => ({ ...prev, location: city }));
        setShowSuggestions(false);
    };


    const signup = useUserStore((state) => state.signup);
    const setAppLocation = useUserStore((s) => s.setAppLocation);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!formData.fullName.trim()) {
            setError("Full name is required");
            return;
        }
        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const payload = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };

        const result = await signup(payload);

        if (result.success) {
            if (formData.location) {
                await setAppLocation(formData.location, { saveToProfile: true });
            }
            navigate("/homepage");
        } else {
            console.error("Signup failed:", result.error);
            setError(result.error || "Signup failed");
            // Optional: set local error state to display in UI if desired, 
            // but toast is already handled in store.
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
            padding: "10px 36px 10px 36px",
            fontSize: "14px",
            marginBottom: "20px",
            outline: "none",
        },
        inputIcon: {
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            width: "18px",
            height: "18px",
        },
        toggleBtn: {
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6b7280",
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
        strengthBar: {
            height: "6px",
            backgroundColor: "#e5e7eb",
            borderRadius: "9999px",
            marginTop: "6px",
            marginBottom: "14px",
        },
        strengthFill: (pct) => ({
            width: `${pct}%`,
            height: "100%",
            borderRadius: "9999px",
            background: pct >= 75 ? "#16a34a" : pct >= 50 ? "#f59e0b" : "#ef4444",
        }),
    };

    const passwordStrength = (pwd) => {
        let score = 0;
        if (!pwd) return 0;
        if (pwd.length >= 6) score += 25;
        if (pwd.length >= 10) score += 25;
        if (/[A-Z]/.test(pwd)) score += 15;
        if (/\d/.test(pwd)) score += 15;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
        return Math.min(score, 100);
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
                                ...(formData.role === "buyer" ? styles.radioActive : {}),
                            }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="buyer"
                                style={{ display: "none" }}
                                checked={formData.role === "buyer"}
                                onChange={handleChange}
                            />
                            Buyer
                        </label>

                        <label
                            style={{
                                ...styles.radio,
                                ...(formData.role === "seller" ? styles.radioActive : {}),
                            }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="seller"
                                style={{ display: "none" }}
                                checked={formData.role === "seller"}
                                onChange={handleChange}
                            />
                            Seller
                        </label>
                    </div>

                    {/* FULL NAME */}
                    <label style={styles.inputLabel}>Full Name *</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <User style={styles.inputIcon} />
                    </div>

                    {/* EMAIL */}
                    <label style={styles.inputLabel}>Email Address *</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <Mail style={styles.inputIcon} />
                    </div>

                    {/* LOCATION (CITY) */}
                    <label style={styles.inputLabel}>Your City (for Nearby)</label>
                    <div style={{ position: "relative", display: 'flex', gap: 8 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input
                              type="text"
                              name="location"
                              placeholder="e.g. Chamoli, Dehradun, Lucknow"
                              value={formData.location}
                              onChange={handleChange}
                              onFocus={() => formData.location.length >= 3 && setShowSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                              style={styles.input}
                              autoComplete="off"
                          />
                          <MapPin style={styles.inputIcon} />
                          
                          {/* Suggestions Dropdown */}
                          {showSuggestions && suggestions.length > 0 && (
                              <div style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  background: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  marginTop: '4px',
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                  zIndex: 50,
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}>
                                  {suggestions.map((s, i) => (
                                      <div
                                          key={i}
                                          onClick={() => selectSuggestion(s)}
                                          style={{
                                              padding: '10px 12px',
                                              cursor: 'pointer',
                                              borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                                              fontSize: '14px',
                                              color: '#374151'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                          {s}
                                      </div>
                                  ))}
                              </div>
                          )}
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <label style={styles.inputLabel}>Password *</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <Lock style={styles.inputIcon} />
                        <button type="button" onClick={() => setShowPassword((s) => !s)} style={styles.toggleBtn} aria-label="Toggle password visibility">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div style={styles.strengthBar}>
                        <div style={styles.strengthFill(passwordStrength(formData.password))} />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <label style={styles.inputLabel}>Confirm Password *</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <Lock style={styles.inputIcon} />
                        <button type="button" onClick={() => setShowConfirm((s) => !s)} style={styles.toggleBtn} aria-label="Toggle confirm visibility">
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* BUTTON */}
                    {error ? (
                        <div style={{ marginBottom: "12px", background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "8px", fontSize: "13px" }}>
                            {error}
                        </div>
                    ) : null}
                    <button type="submit" style={styles.button} disabled={loading}>{loading ? "Creating Account..." : "Sign Up"}</button>

                    <p style={styles.loginText} onClick={() => navigate("/user-login")}>
                        Already have an account?
                        <span style={styles.loginLink}>Sign In</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
