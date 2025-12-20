import { useState, useRef, useEffect } from "react";
import { User, Lock, Rocket, Eye, EyeOff, Mail, MapPin, UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useJsApiLoader } from '@react-google-maps/api';

import { useUserStore } from "../../store/userStore";

const libraries = ['places', 'geometry'];

export default function Signup() {
    const navigate = useNavigate();
    const isAuthenticated = useUserStore((s) => s.isAuthenticated);
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
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // OTP State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [userIdForOtp, setUserIdForOtp] = useState(null);
    
    // Location Autocomplete State
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef(null);
    const [autocompleteService, setAutocompleteService] = useState(null);

    useEffect(() => {
        if (isLoaded && !autocompleteService && window.google) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
        }
    }, [isLoaded, autocompleteService]);

    const handleLocationSearch = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        // --- GOOGLE PLACES AUTOCOMPLETE ---
        if (autocompleteService) {
            try {
                const res = await autocompleteService.getPlacePredictions({
                    input: query,
                    types: ['(cities)']
                });
                if (res && res.predictions) {
                    const cities = res.predictions.map(p => p.description);
                    setSuggestions(cities);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error("Google Autocomplete failed", err);
            }
        }
        
        // --- BACKUP: PHOTON (COMMENTED) ---
        /*
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            // Use backend proxy to avoid CORS/mixed-content issues
            const photonBase = `${API_BASE}/api/geo/photon`;
            const res = await fetch(`${photonBase}/?q=${encodeURIComponent(query)}&limit=5&lang=en`);
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
        */
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
    const verifyOtp = useUserStore((state) => state.verifyOtp);
    const googleLogin = useUserStore((state) => state.googleLogin);
    const setAppLocation = useUserStore((s) => s.setAppLocation);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/homepage");
        }
    }, [isAuthenticated, navigate]);

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
            location: formData.location,
        };

        const result = await signup(payload);

        if (result.success) {
            setUserIdForOtp(result.userId);
            if (formData.location) {
                // Location sent in signup, just update local state
                await setAppLocation(formData.location, { saveToProfile: false });
            }
            setShowOtpModal(true);
        } else {
            console.error("Signup failed:", result.error);
            setError(result.error || "Signup failed");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }
        
        const result = await verifyOtp({ userId: userIdForOtp, otp });
        if (result.success) {
            setShowOtpModal(false);
            navigate("/homepage");
        } else {
            setError(result.error || "OTP Verification failed");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
             navigate("/homepage");
        } else {
            setError(result.error || "Google Login failed");
        }
    };
    
    const handleGoogleError = () => {
        setError("Google Login Failed");
    };

    const styles = {
        container: {
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "Arial, sans-serif",
        },
        card: {
            width: "100%",
            maxWidth: "1040px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(2, 6, 23, 0.1)",
        },
        leftPanel: {
            padding: "48px",
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
            padding: "48px",
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
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            padding: "12px 36px 12px 36px",
            fontSize: "14px",
            marginBottom: "20px",
            outline: "none",
            backgroundColor: "#ffffff",
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
            borderRadius: "10px",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: "600",
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

    const modalStyles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        },
        content: {
            backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', position: 'relative'
        },
        input: {
            width: '100%', padding: '12px', fontSize: '18px', letterSpacing: '4px', textAlign: 'center',
            marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1'
        }
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
            {/* OTP Modal */}
            {showOtpModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <button onClick={() => setShowOtpModal(false)} style={{position: 'absolute', right: 10, top: 10, border: 'none', background: 'transparent', cursor: 'pointer'}}>
                            <X size={20} />
                        </button>
                        <h3 style={{marginBottom: '10px', fontSize: '20px', fontWeight: 'bold'}}>Verify Email</h3>
                        <p style={{marginBottom: '20px', color: '#64748b', fontSize: '14px'}}>
                            Enter the 6-digit code sent to your email.
                        </p>
                        <form onSubmit={handleVerifyOtp}>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                style={modalStyles.input}
                            />
                            {error && <p style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>{error}</p>}
                            <button type="submit" style={styles.button}>Verify Code</button>
                        </form>
                    </div>
                </div>
            )}

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

                    {/* Google Login */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                        <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '13px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    </div>

                    {/* ROLE SELECTION REMOVED - Defaulting to Buyer internally */}
                    {/* <div style={styles.radioContainer}>
                        <div
                            style={{ ...styles.radio, ...(formData.role === "buyer" ? styles.radioActive : {}) }}
                            onClick={() => setFormData(prev => ({ ...prev, role: "buyer" }))}
                        >
                            Buyer
                        </div>
                        <div
                            style={{ ...styles.radio, ...(formData.role === "seller" ? styles.radioActive : {}) }}
                            onClick={() => setFormData(prev => ({ ...prev, role: "seller" }))}
                        >
                            Seller
                        </div>
                    </div> */}

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
                    <button type="submit" style={styles.button} disabled={loading}><UserPlus size={18} /> {loading ? "Creating Account..." : "Sign Up"}</button>

                    <p style={styles.loginText} onClick={() => navigate("/user-login")}>
                        Already have an account?
                        <span style={styles.loginLink}>Sign In</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
