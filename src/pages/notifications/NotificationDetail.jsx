import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const accents = {
    product: { bg: "#fffbeb", border: "#fde68a" },
    room: { bg: "#ecfdf5", border: "#a7f3d0" },
    service: { bg: "#eef2ff", border: "#c7d2fe" },
    job: { bg: "#fef2f2", border: "#fecaca" },
    message: { bg: "#eff6ff", border: "#bfdbfe" },
    system: { bg: "#f9fafb", border: "#e5e7eb" },
  };
  const icons = {
    product: "🛍️",
    room: "🏠",
    service: "🛠️",
    job: "💼",
    message: "💬",
    system: "🔔",
  };

  const load = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      setItem(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, [id]);

  const goToRelated = () => {
    if (item?.link) navigate(item.link);
  };

  const markRead = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`;
      const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      setItem(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "100px auto 40px", padding: 20 }}>
        {!item ? (
          <div>Loading...</div>
        ) : (
          <div style={{ border: `1px solid ${accents[item.type || 'system'].border}`, borderRadius: 16, padding: 24, background: "#fff" }}>
            <div style={{ height: 8, borderRadius: 8, background: accents[item.type || 'system'].bg, marginBottom: 16 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: accents[item.type || 'system'].bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {icons[item.type || 'system']}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "0.2px", color: "#0f172a" }}>{item.title}</h2>
            </div>
            <div style={{ color: "#64748b", marginTop: 8, fontSize: 12 }}>{new Date(item.createdAt).toLocaleString()}</div>
            <div style={{ marginTop: 14, fontSize: 16, color: "#334155", lineHeight: 1.7 }}>{item.message}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={markRead} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                {item.isRead ? "Already Read" : "Mark as Read"}
              </button>
              {item.link && (
                <button onClick={goToRelated} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff" }}>
                  Open Related
                </button>
              )}
              <button onClick={() => navigate("/notifications")} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
