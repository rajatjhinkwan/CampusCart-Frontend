// FILE: src/pages/productPage/index.jsx

import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useUserStore } from "../../store/userStore";
import { useParams } from "react-router-dom";
import Skeleton from "../../components/Skeleton";
import Navbar from "../../components/navbar"; // Added Navbar

import ImageGallery from "./components/ImageGallery";
import DetailsCard from "./components/DetailsCard";
import SellerInfo from "./components/SellerInfo";
import BuySection from "./components/BuySection";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const productId = id;
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isMobile = width < 768; // Changed to 768 for tablet consistency
  const isTablet = width >= 768 && width < 1024;

  useEffect(() => {
    axios
      .get(`/api/products/${productId}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const styles = {
    page: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "20px 15px" : "30px 20px",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    container: {
      display: "flex",
      gap: "30px",
      marginTop: "30px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    left: { flex: 2, minWidth: isMobile ? "100%" : "600px" },
    right: { flex: 1, minWidth: isMobile ? "100%" : "350px" },
    loading: { fontSize: "20px", textAlign: "center", marginTop: "50px", color: "#64748b" },
    reportCard: {
        marginTop: "24px", 
        padding: "30px", 
        background: "#fff", 
        borderRadius: "24px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        border: "1px solid #f1f5f9"
    }
  };

  // Loading UI
  if (loading) {
    return (
      <>
      <Navbar />
      <div style={styles.page}>
        {/* Image Gallery Skeleton */}
        <div style={{ display: "flex", gap: "10px", height: "420px", marginBottom: "20px" }}>
            {!isMobile && (
                <div style={{ width: "80px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Skeleton width="80px" height="80px" style={{ borderRadius: "4px" }} />
                    <Skeleton width="80px" height="80px" style={{ borderRadius: "4px" }} />
                    <Skeleton width="80px" height="80px" style={{ borderRadius: "4px" }} />
                    <Skeleton width="80px" height="80px" style={{ borderRadius: "4px" }} />
                </div>
            )}
            <Skeleton width={isMobile ? "100%" : "calc(100% - 90px)"} height="100%" style={{ borderRadius: "8px" }} />
        </div>

        <div style={styles.container}>
          <div style={styles.left}>
            {/* Details Card Skeleton */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "30px", border: "1px solid #f1f5f9" }}>
                <Skeleton width="60%" height="40px" style={{ marginBottom: 16 }} />
                <Skeleton width="120px" height="24px" borderRadius="20px" style={{ marginBottom: 24 }} />
                
                <Skeleton width="40%" height="20px" style={{ marginBottom: 10 }} />
                <Skeleton width="80%" height="24px" style={{ marginBottom: 24 }} />

                <Skeleton width="40%" height="20px" style={{ marginBottom: 10 }} />
                <Skeleton width="80%" height="24px" style={{ marginBottom: 24 }} />
                
                <Skeleton width="100%" height="100px" style={{ borderRadius: "8px", marginTop: 20 }} />
            </div>
          </div>
          <div style={styles.right}>
            {/* Buy Section Skeleton */}
            <Skeleton width="100%" height="180px" style={{ marginBottom: 20, borderRadius: "16px" }} />
            {/* Seller Info Skeleton */}
            <Skeleton width="100%" height="120px" style={{ marginBottom: 20, borderRadius: "16px" }} />
            {/* Report Card Skeleton */}
            <Skeleton width="100%" height="200px" style={{ borderRadius: "24px" }} />
          </div>
        </div>
      </div>
      </>
    );
  }

  // No Product Found
  if (!product)
    return (
        <>
            <Navbar />
            <h2 style={styles.loading}>Product not found.</h2>
        </>
    );

  // Fallback image (because your product.images is sometimes empty)
  const imageList =
    product?.images?.length > 0
      ? product.images
      : [
        {
          url:
            product.image ||
            "https://via.placeholder.com/800x600?text=No+Image",
        },
      ];

  return (
    <>
    <Navbar />
    <div style={styles.page} className="fade-in">
      {/* Image Section */}
      <ImageGallery images={imageList} />

      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <DetailsCard data={product} />
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <BuySection product={product} />
          
          <SellerInfo seller={product.seller} productId={product._id || id} />

          <div style={styles.reportCard}>
            <div style={{ fontWeight: "700", marginBottom: "16px", color: "#ef4444", fontSize: "18px" }}>Report Listing</div>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", color: "#475569", backgroundColor: "#f8fafc" }}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam or misleading</option>
              <option value="fraud">Fraud or fake</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="duplicate">Duplicate listing</option>
              <option value="illegal">Illegal item/service</option>
            </select>
            <textarea
              placeholder="Optional details about your report..."
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", minHeight: "100px", marginBottom: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", fontFamily: "inherit", resize: "vertical", backgroundColor: "#f8fafc" }}
            />
            <button
              onClick={async () => {
                try {
                  const token = useUserStore.getState().accessToken;
                  if (!token) {
                    toast.error("Please login to report");
                    return;
                  }
                  if (!reportReason) {
                    toast.error("Select a reason");
                    return;
                  }
                  await axios.post(`/api/reports/product/${productId}`, {
                    reason: reportReason,
                    message: reportMessage,
                  });
                  toast.success("Report submitted");
                  setReportReason("");
                  setReportMessage("");
                } catch (e) {
                  toast.error(e.response?.data?.message || "Failed to submit report");
                }
              }}
              style={{ padding: "12px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s", width: "100%" }}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductPage;
