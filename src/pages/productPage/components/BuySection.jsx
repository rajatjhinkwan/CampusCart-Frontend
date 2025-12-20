// FILE: src/pages/productPage/components/BuySection.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import toast from "react-hot-toast";

const BuySection = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated, startConversation, sendMessage } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [rentalMonths, setRentalMonths] = useState(1);

  if (!product) return null;

  const isRent = product.type === "rent";
  const basePrice = product.rentalPrice || product.price;
  const displayPrice = isRent 
    ? `₹ ${basePrice} / ${product.rentalPeriod || "Month"}` 
    : `₹ ${product.price}`;
  
  const securityDeposit = Number(product.securityDeposit || 0);
  const estimatedTotal = isRent ? (Number(basePrice) * rentalMonths) + securityDeposit : Number(product.price);

  const handleAction = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/user-login");
      return;
    }

    // Identify seller ID
    const sellerId = product.seller?._id || product.seller || product.user?._id || product.user;
    if (!sellerId) {
      toast.error("Seller information missing");
      return;
    }

    // Prevent chatting with self
    const myId = useUserStore.getState().user?._id;
    if (myId === sellerId) {
      toast.error("You cannot trade with yourself");
      return;
    }

    setLoading(true);
    try {
      const { success, conversationId, error } = await startConversation({
        recipientId: sellerId,
        productId: product._id || product.id,
        contextType: "Product"
      });

      if (success && conversationId) {
        // Send initial message if starting a new interaction
        let initialMsg = "";
        if (isRent) {
            initialMsg = `Hi, I'm interested in renting "${product.title}" for ${rentalMonths} month(s).\nEstimated Total: ₹${estimatedTotal} (Rent: ₹${Number(basePrice) * rentalMonths} + Deposit: ₹${securityDeposit}).\nIs it available?`;
        } else {
            initialMsg = `Hi, I'm interested in buying "${product.title}" for ${displayPrice}. Is the price negotiable?`;
        }
        
        await sendMessage(conversationId, initialMsg);
        
        navigate("/user-messages");
      } else {
        toast.error(error || "Failed to start conversation");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "25px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },
    price: { 
        fontSize: "32px", 
        fontWeight: "800", 
        marginBottom: "8px", 
        color: isRent ? "#b45309" : "#0f172a" 
    },
    subPrice: { 
        fontSize: "14px", 
        color: "#64748b", 
        marginBottom: "24px" 
    },
    inputGroup: { 
        marginBottom: "20px", 
        textAlign: "left" 
    },
    label: { 
        display: "block", 
        fontSize: "14px", 
        color: "#475569", 
        marginBottom: "8px",
        fontWeight: "600"
    },
    input: { 
        width: "100%", 
        padding: "12px", 
        border: "1px solid #e2e8f0", 
        borderRadius: "8px",
        fontSize: "16px",
        outline: "none",
        transition: "border-color 0.2s"
    },
    total: { 
        fontSize: "18px", 
        fontWeight: "700", 
        color: "#1e293b", 
        margin: "20px 0", 
        borderTop: "1px dashed #e2e8f0", 
        paddingTop: "15px" 
    },
    button: {
      width: "100%",
      padding: "16px",
      background: isRent ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "16px",
      fontWeight: "700",
      opacity: loading ? 0.8 : 1,
      boxShadow: isRent ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "0 4px 12px rgba(37, 99, 235, 0.3)",
      transition: "transform 0.1s"
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.price}>{displayPrice}</div>
      {isRent && (
          <div style={styles.inputGroup}>
              <label style={styles.label}>Duration (Months):</label>
              <input 
                type="number" 
                min="1" 
                max="24" 
                value={rentalMonths} 
                onChange={(e) => setRentalMonths(Math.max(1, parseInt(e.target.value) || 1))}
                style={styles.input}
              />
          </div>
      )}
      {isRent && (
        <div style={styles.total}>
            Est. Total: ₹{estimatedTotal.toLocaleString()}
            <div style={{fontSize: '12px', fontWeight: 'normal', color: '#666'}}>
                (₹{Number(basePrice) * rentalMonths} Rent + ₹{securityDeposit} Deposit)
            </div>
        </div>
      )}
      {!isRent && (
          <div style={styles.subPrice}>One-time purchase</div>
      )}
      <button 
        style={styles.button}
        onClick={handleAction}
        disabled={loading}
      >
        {loading ? "Processing..." : (isRent ? "Request Rental" : "Make Offer")}
      </button>
    </div>
  );
};

export default BuySection;
