// FILE: src/pages/productPage/components/SellerInfo.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import showLoginToast from "../../../utils/showLoginToast";
import toast from "react-hot-toast";

const SellerInfo = ({ seller, productId }) => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);
  const startConversation = useUserStore((s) => s.startConversation);

  // Safely extract values
  const sellerName = seller?.name || "Unknown Seller";
  const sellerEmail = seller?.email || "No email provided";

  const styles = {
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },
    row: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
    },
    avatar: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      marginRight: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "700",
      color: "#64748b"
    },
    name: { 
        fontSize: "18px", 
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "4px"
    },
    email: {
        fontSize: "14px",
        color: "#64748b"
    },
    chatButton: {
      width: "100%",
      padding: "12px",
      border: "1px solid #3b82f6",
      background: "#eff6ff",
      color: "#2563eb",
      fontWeight: "600",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "15px",
      transition: "all 0.2s"
    },
  };

  if (!seller) {
    return (
      <div
        style={{
          padding: "20px",
          borderRadius: "16px",
          background: "#fff",
          marginTop: "24px",
          textAlign: "center",
          color: "#94a3b8",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}
      >
        Loading seller details...
      </div>
    );
  }

  const handleChat = async () => {
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }
    const sellerId = seller?._id || seller?.id;
    const myId = user?._id || user?.id;
    if (!sellerId) {
      toast.error("Seller information is unavailable.");
      return;
    }
    if (String(sellerId) === String(myId)) {
      toast.error("You cannot message yourself about your own listing.");
      return;
    }
    const { success, conversationId } = await startConversation({ recipientId: sellerId, productId, contextType: "Product" });
    if (success && conversationId) {
      const store = useUserStore.getState();
      await store.sendMessage(conversationId, "Hi, I have a query about your product.");
      navigate(`/user-messages?conversation=${conversationId}`);
      return;
    }
    navigate("/user-messages");
  };

  return (
    <div style={styles.card}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Seller Information
      </h3>
      <div style={styles.row} onClick={() => navigate(`/profile/${seller?._id}`)}>
          {seller?.avatar ? (
              <img src={seller.avatar} alt={sellerName} style={{...styles.avatar, objectFit: "cover", background: "none"}} />
          ) : (
              <div style={styles.avatar}>{sellerName.charAt(0).toUpperCase()}</div>
          )}
          <div>
              <div style={styles.name}>{sellerName}</div>
              <div style={styles.email}>{sellerEmail}</div>
          </div>
      </div>

      <button 
          style={styles.chatButton}
          onClick={handleChat}
      >
          Message Seller
      </button>
    </div>
  );
};

export default SellerInfo;
