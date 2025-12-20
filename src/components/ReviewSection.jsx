import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";

const ReviewSection = ({ targetId, targetType }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useUserStore();

  const getEndpoint = () => {
    switch (targetType) {
      case "room":
        return `/api/rooms/${targetId}/reviews`;
      case "service":
        return `/api/services/${targetId}/reviews`;
      case "product":
        return `/api/products/${targetId}/reviews`;
      default:
        return "";
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(getEndpoint());
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId && targetType) {
      fetchReviews();
    }
  }, [targetId, targetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }
    if (!text.trim()) {
      toast.error("Please write some text");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(getEndpoint(), { rating, text });
      toast.success("Review submitted!");
      setText("");
      setRating(5);
      fetchReviews(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const styles = {
    container: {
      marginTop: "30px",
      padding: "20px",
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1e293b",
    },
    star: {
      color: "#f59e0b",
      fontSize: "20px",
      fontWeight: "bold",
    },
    reviewList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginTop: "20px",
    },
    reviewItem: {
      padding: "16px",
      borderRadius: "12px",
      background: "#f8fafc",
      border: "1px solid #f1f5f9",
    },
    userHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: "#3b82f6",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "14px",
    },
    userName: {
      fontWeight: "600",
      fontSize: "15px",
      color: "#0f172a",
    },
    date: {
      fontSize: "12px",
      color: "#64748b",
    },
    comment: {
      fontSize: "14px",
      color: "#334155",
      lineHeight: "1.5",
    },
    form: {
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid #e2e8f0",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      minHeight: "80px",
      marginTop: "10px",
      marginBottom: "10px",
      fontFamily: "inherit",
      fontSize: "14px",
    },
    submitBtn: {
      padding: "10px 20px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      opacity: submitting ? 0.7 : 1,
    },
    select: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      marginLeft: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reviews</h3>
        <span style={styles.star}>★ {avgRating}</span>
        <span style={{ color: "#64748b" }}>({reviews.length} reviews)</span>
      </div>

      {/* Review List */}
      <div style={styles.reviewList}>
        {reviews.length === 0 ? (
          <p style={{ color: "#64748b", fontStyle: "italic" }}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} style={styles.reviewItem}>
              <div style={styles.userHeader}>
                <Link to={`/profile/${rev.user?._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={styles.avatar}>
                    {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span style={styles.userName}>{rev.user?.name || "User"}</span>
                </Link>
                <span style={styles.date}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ marginBottom: "6px", color: "#f59e0b", fontSize: "14px" }}>
                {"★".repeat(rev.rating)}
                <span style={{ color: "#cbd5e1" }}>{"★".repeat(5 - rev.rating)}</span>
              </div>
              <p style={styles.comment}>{rev.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Form */}
      {isAuthenticated ? (
        <form style={styles.form} onSubmit={handleSubmit}>
          <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>Write a Review</h4>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", color: "#475569" }}>Rating:</label>
            <select
              style={styles.select}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Share your experience..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div style={{ marginTop: "20px", padding: "15px", background: "#f1f5f9", borderRadius: "8px", textAlign: "center", fontSize: "14px" }}>
          Please login to write a review.
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
