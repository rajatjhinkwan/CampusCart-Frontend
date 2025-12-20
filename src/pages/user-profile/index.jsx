import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import Navbar from "../../components/navbar";
import axios from "../../lib/axios";
import toast from "react-hot-toast";
import Skeleton from "../../components/Skeleton";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Camera, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Edit2, 
  Save, 
  X,
  List,
  Heart
} from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    bio: "",
    location: "",
    institution: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    } else if (user) {
      // Initialize form with user data
      setFormData({
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: typeof user.location === 'string' ? user.location : 
                 (user.location?.city ? `${user.location.city}, ${user.location.state}` : ""),
        institution: user.institution || "",
      });
      setAvatarPreview(user.avatar);
    }
  }, [isAuthenticated, user, checkAuth]);

  // Redirect if not logged in
  useEffect(() => {
    const timeout = setTimeout(() => {
        if (!isAuthenticated && !useUserStore.getState().loading) {
            // navigate("/user-login"); 
            // Better to show a login prompt or let checkAuth finish
        }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size too large (max 5MB)");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    
    if (avatarFile) {
        data.append("avatar", avatarFile);
    }

    try {
      const res = await axios.put("/api/users/me", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        checkAuth(); // Refresh user store
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
        toast.error("New passwords do not match");
        return;
    }
    if (passwords.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
    }

    setLoading(true);
    try {
        await axios.put("/api/users/me/password", {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        });
        toast.success("Password changed successfully");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
      await logout();
      navigate("/user-login");
  };

  if (!user) {
      return (
          <>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
                <Skeleton width="100%" height="200px" style={{ marginBottom: 20 }} />
                <Skeleton width="100%" height="400px" />
            </div>
          </>
      );
  }

  // Styles
  const styles = {
    page: {
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "40px"
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px",
        display: "flex",
        gap: "30px",
        flexDirection: window.innerWidth < 768 ? "column" : "row"
    },
    sidebar: {
        flex: "0 0 280px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        height: "fit-content"
    },
    mainContent: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        minHeight: "500px"
    },
    menuItem: (active) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        marginBottom: "8px",
        backgroundColor: active ? "#eff6ff" : "transparent",
        color: active ? "#2563eb" : "#64748b",
        fontWeight: active ? "600" : "500",
        transition: "all 0.2s"
    }),
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        paddingBottom: "20px",
        borderBottom: "1px solid #e2e8f0"
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1e293b"
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        marginBottom: "30px",
        flexWrap: "wrap"
    },
    avatarContainer: {
        position: "relative",
        width: "100px",
        height: "100px"
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        border: "4px solid #fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    },
    cameraBtn: {
        position: "absolute",
        bottom: "0",
        right: "0",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "2px solid #fff"
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px"
    },
    formGroup: {
        marginBottom: "20px"
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "8px"
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        color: "#1e293b",
        outline: "none",
        transition: "border 0.2s"
    },
    textarea: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        color: "#1e293b",
        outline: "none",
        minHeight: "100px",
        fontFamily: "inherit"
    },
    btn: (primary) => ({
        padding: "10px 24px",
        borderRadius: "10px",
        border: primary ? "none" : "1px solid #cbd5e1",
        background: primary ? "#2563eb" : "#fff",
        color: primary ? "#fff" : "#475569",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "15px",
        transition: "all 0.2s"
    })
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container} className="fade-in">
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
            <div style={{ marginBottom: "20px", textAlign: "center", padding: "20px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: "80px", height: "80px", margin: "0 auto 12px", borderRadius: "50%", overflow: "hidden", background: "#e2e8f0" }}>
                    <img src={user.avatar || "https://via.placeholder.com/150"} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>{user.name}</h3>
                <p style={{ fontSize: "14px", color: "#64748b" }}>{user.email}</p>
            </div>

            <nav>
                <div style={styles.menuItem(activeTab === "profile")} onClick={() => setActiveTab("profile")}>
                    <User size={20} /> My Profile
                </div>
                <div style={styles.menuItem(activeTab === "security")} onClick={() => setActiveTab("security")}>
                    <Shield size={20} /> Security
                </div>
                <div style={styles.menuItem(false)} onClick={() => navigate("/user-listings")}>
                            <List size={20} /> My Listings
                        </div>
                        <div style={styles.menuItem(false)} onClick={() => navigate("/user-favorites")}>
                            <Heart size={20} /> My Wishlist
                        </div>
                <div style={{ ...styles.menuItem(false), marginTop: "20px", color: "#ef4444" }} onClick={handleLogout}>
                    <LogOut size={20} /> Logout
                </div>
            </nav>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.mainContent}>
            {activeTab === "profile" && (
                <>
                    <div style={styles.header}>
                        <h2 style={styles.title}>My Profile</h2>
                        {!editMode ? (
                            <button style={styles.btn(false)} onClick={() => setEditMode(true)}>
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button style={styles.btn(false)} onClick={() => setEditMode(false)}>
                                    <X size={18} /> Cancel
                                </button>
                                <button style={{...styles.btn(true), opacity: loading ? 0.7 : 1}} onClick={handleProfileUpdate} disabled={loading}>
                                    <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={styles.profileHeader}>
                        <div style={styles.avatarContainer}>
                            <img src={avatarPreview || "https://via.placeholder.com/150"} alt="Profile" style={styles.avatar} />
                            {editMode && (
                                <label style={styles.cameraBtn}>
                                    <Camera size={16} />
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        style={{ display: "none" }} 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                                {user.name}
                            </h3>
                            <p style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                                <MapPin size={16} /> {user.location?.city || user.location || "Location not set"}
                            </p>
                        </div>
                    </div>

                    <form style={styles.infoGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                type="text" 
                                style={styles.input} 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                disabled={!editMode}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Username</label>
                            <input 
                                type="text" 
                                style={styles.input} 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                disabled={!editMode}
                                placeholder="@username"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail size={18} style={{ position: "absolute", top: "14px", left: "12px", color: "#94a3b8" }} />
                                <input 
                                    type="email" 
                                    style={{...styles.input, paddingLeft: "40px", backgroundColor: "#f1f5f9"}} 
                                    value={user.email}
                                    disabled={true}
                                />
                            </div>
                            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>Email cannot be changed</p>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <div style={{ position: "relative" }}>
                                <Phone size={18} style={{ position: "absolute", top: "14px", left: "12px", color: "#94a3b8" }} />
                                <input 
                                    type="text" 
                                    style={{...styles.input, paddingLeft: "40px"}} 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    disabled={!editMode}
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>

                        <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
                            <label style={styles.label}>Bio</label>
                            <textarea 
                                style={styles.textarea}
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                disabled={!editMode}
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location</label>
                            <div style={{ position: "relative" }}>
                                <MapPin size={18} style={{ position: "absolute", top: "14px", left: "12px", color: "#94a3b8" }} />
                                <input 
                                    type="text" 
                                    style={{...styles.input, paddingLeft: "40px"}} 
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    disabled={!editMode}
                                    placeholder="City, State"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Institution / Workplace</label>
                            <div style={{ position: "relative" }}>
                                <Briefcase size={18} style={{ position: "absolute", top: "14px", left: "12px", color: "#94a3b8" }} />
                                <input 
                                    type="text" 
                                    style={{...styles.input, paddingLeft: "40px"}} 
                                    value={formData.institution}
                                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                    disabled={!editMode}
                                    placeholder="University or Company Name"
                                />
                            </div>
                        </div>
                    </form>
                </>
            )}

            {activeTab === "security" && (
                <>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Security Settings</h2>
                    </div>
                    
                    <form onSubmit={handlePasswordChange} style={{ maxWidth: "500px" }}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Current Password</label>
                            <input 
                                type="password" 
                                style={styles.input} 
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                style={styles.input} 
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                required
                                minLength={6}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Confirm New Password</label>
                            <input 
                                type="password" 
                                style={styles.input} 
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                required
                            />
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <button 
                                type="submit" 
                                style={{...styles.btn(true), width: "100%", justifyContent: "center"}}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
