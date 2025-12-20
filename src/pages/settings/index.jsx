import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { styles } from "./styles";
import { useUserStore } from "../../store/userStore";
import Skeleton from "../../components/Skeleton";

import Sidebar from "./components/Sidebar";

// --- UPDATED COMPONENT IMPORTS (MATCHING NEW SIDEBAR) ---
import ProfileSettings from "./components/ProfileSettings.jsx";
import SecuritySettings from "./components/SecuritySettings.jsx";

import SellingDashboard from "./components/SellingDashboard.jsx";

import NotificationsSettings from "./components/NotificationsSettings.jsx";
import PrivacySettings from "./components/PrivacySettings.jsx";
import AppPreferences from "./components/AppPreferences.jsx";


const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const defaultProfile = {
  name: "",
  username: "",
  bio: "",
  institution: "",
  phone: "",
  location: "",
  profileImage: "",
  avatarFile: null,
};

const defaultNotifications = {
  newMessage: true,
  productSold: true,
  priceDrop: false,
  newOffer: true,
  appUpdates: false,
};

const defaultPrivacy = {
  profileVisible: true,
  activityStatus: true,
  searchEngineListing: false,
  dataDownload: false,
  personalizedAds: true,
};

const defaultPreferences = {
  darkMode: false,
  compactView: false,
  autoPlayVideos: true,
  language: "English",
};



const defaultSecurity = {
  twoFactor: false,
  password: {
    current: "",
    newPass: "",
    confirm: "",
  },
};

export default function SettingsPage() {
  const { isAuthenticated, checkAuth } = useUserStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [preferences, setPreferences] = useState(defaultPreferences);

  const [security, setSecurity] = useState(defaultSecurity);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ensure user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      // Ensure token is set
      const res = await axios.get('/api/users/me');
      const user = res.data?.user || res.data || {};
      const userSettings = user.settings || {};

      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        profileImage: user.avatar || "",
      }));

      setNotifications({ ...defaultNotifications, ...(userSettings.notifications || {}) });
      setPrivacy({ ...defaultPrivacy, ...(userSettings.privacy || {}) });
      setPreferences({ ...defaultPreferences, ...(userSettings.preferences || {}) });
      setSecurity((prev) => ({
        ...prev,
        twoFactor: userSettings.security?.twoFactorEnabled || false,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const onAvatarSelect = (file, previewUrl) => {
    setProfile((prev) => ({
      ...prev,
      avatarFile: file,
      profileImage: previewUrl || prev.profileImage,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Ensure token is set
      // 1) Profile + avatar
      const profileForm = new FormData();
      profileForm.append("name", profile.name || "");
      profileForm.append("username", profile.username || "");
      profileForm.append("bio", profile.bio || "");
      profileForm.append("institution", profile.institution || "");
      profileForm.append("phone", profile.phone || "");
      profileForm.append("location", profile.location || "");
      if (profile.avatarFile) {
        profileForm.append("avatar", profile.avatarFile);
      }
      await axios.put('/api/users/me', profileForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2) Settings (notifications, privacy, preferences, security)
      await axios.put(
        '/api/users/me/settings',
        {
          notifications,
          privacy,
          preferences,
          security: { twoFactorEnabled: security.twoFactor },
        }
      );

      // 3) Password change (optional)
      if (
        security.password.current ||
        security.password.newPass ||
        security.password.confirm
      ) {
        if (!security.password.current || !security.password.newPass) {
          throw new Error("Please enter your current and new password to update it");
        }
        if (security.password.newPass !== security.password.confirm) {
          throw new Error("New password and confirmation do not match");
        }

        await axios.put(
          '/api/users/me/password',
          {
            currentPassword: security.password.current,
            newPassword: security.password.newPass,
          }
        );
      }

      setMessage("Settings saved successfully");
      setSecurity((prev) => ({
        ...prev,
        password: { current: "", newPass: "", confirm: "" },
      }));
      await loadSettings();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to save changes");
    } finally {
      setSaving(false);
    }
  };

  // RENDER SCREEN BASED ON TAB
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSettings
            data={profile}
            onChange={setProfile}
            onAvatarSelect={onAvatarSelect}
          />
        );
      case "security":
        return (
          <SecuritySettings
            data={security}
            onChange={setSecurity}
          />
        );

      case "notifications":
        return (
          <NotificationsSettings
            prefs={notifications}
            onChange={setNotifications}
          />
        );
      case "privacy":
        return (
          <PrivacySettings
            settings={privacy}
            onToggle={(key) =>
              setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          />
        );
      case "preferences":
        return (
          <AppPreferences
            prefs={preferences}
            onChange={setPreferences}
          />
        );

      default:
        return (
          <ProfileSettings
            data={profile}
            onChange={setProfile}
            onAvatarSelect={onAvatarSelect}
          />
        );
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Settings</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {message ? (
            <span style={{ color: "#16a34a", fontSize: "13px" }}>{message}</span>
          ) : null}
          {error ? (
            <span style={{ color: "#dc2626", fontSize: "13px" }}>{error}</span>
          ) : null}
          <button
            style={{
              ...styles.buttonPrimary,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.mainContent}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ flex: 1 }}>
          {loading ? <div>Loading settings...</div> : renderContent()}
        </div>
      </div>
    </div>
  );
}
