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
      navigate("/login");
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
        
        navigate("/messages");
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
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "20px",
      textAlign: "center",
    },
    price: { fontSize: "28px", fontWeight: "bold", marginBottom: "15px", color: isRent ? "#b45309" : "#000" },
    subPrice: { fontSize: "14px", color: "#666", marginBottom: "15px" },
    inputGroup: { marginBottom: "15px", textAlign: "left" },
    label: { display: "block", fontSize: "14px", color: "#333", marginBottom: "5px" },
    input: { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
    total: { fontSize: "16px", fontWeight: "600", color: "#333", margin: "15px 0", borderTop: "1px dashed #ccc", paddingTop: "10px" },
    button: {
      width: "100%",
      padding: "12px",
      background: isRent ? "#f59e0b" : "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      opacity: loading ? 0.7 : 1,
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
