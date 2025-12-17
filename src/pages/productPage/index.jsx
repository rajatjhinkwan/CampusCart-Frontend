// FILE: src/pages/productPage/index.jsx

import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useUserStore } from "../../store/userStore";
import { useParams } from "react-router-dom";

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
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

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
      margin: isMobile ? "10px auto" : "20px auto",
      padding: isMobile ? "0 10px" : "0 15px",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      display: "flex",
      gap: isMobile ? "12px" : "20px",
      marginTop: isMobile ? "12px" : "20px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    left: { flex: 2, minWidth: isMobile ? "100%" : "350px" },
    right: { flex: 1, minWidth: isMobile ? "100%" : "300px" },
    loading: { fontSize: "20px", textAlign: "center", marginTop: "50px" },
  };

  // Loading UI
  if (loading)
    return <h2 style={styles.loading}>Loading product details...</h2>;

  // No Product Found
  if (!product)
    return <h2 style={styles.loading}>Product not found.</h2>;

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
    <div style={styles.page}>
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

          <div style={{ marginTop: 20, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Report Listing</div>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam or misleading</option>
              <option value="fraud">Fraud or fake</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="duplicate">Duplicate listing</option>
              <option value="illegal">Illegal item/service</option>
            </select>
            <textarea
              placeholder="Optional details"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              style={{ width: "100%", padding: 8, minHeight: 80, marginBottom: 8 }}
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
              style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6 }}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
