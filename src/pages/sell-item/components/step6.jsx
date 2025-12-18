import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import ProgressBar from "./progressBar";
import { useNavigate } from "react-router-dom";



export default function Step6ReviewPublish({
  formData = {},
  prevStep,
  onPublish,
  isSubmitting,
  isSubmitted,
}) {
  const navigate = useNavigate();

  const location = formData.location || {};
  const priceDetails = formData.priceDetails || {};
  const photos = formData.photos || [];
  const categoryType = formData.categoryType || "Product";

  // --- FIX: More robust URL management using useState vs useMemo ---
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (photos.length === 0) {
      setPreviewUrls([]);
      return;
    }

    // 1. Create new URLs for the current files
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // 2. Cleanup: Revoke THESE specific URLs when the component unmounts
    // or when the photos prop changes. This pattern is often more stable
    // against browser fetch timing errors than useMemo.
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);
  // ----------------------------------------------------------------

  return (
    <>{!isSubmitted ? (
      <div style={styles.container}>
        <ProgressBar currentStep={6} totalSteps={6} />
        <h2 style={styles.heading}>Review & Publish</h2>
        <p style={styles.subheading}>Verify details before publishing.</p>

        <div style={styles.sectionsContainer}>
          {/* Images Section */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Images</h3>
            <div style={styles.imageWrapper}>
              {previewUrls.length > 0 ? (
                previewUrls.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={imgSrc}
                    alt={`Item ${index + 1}`}
                    style={styles.image}
                  />
                ))
              ) : (
                <p style={styles.emptyText}>No images uploaded</p>
              )}
            </div>
          </div>

          {/* Details Section (Basic & Price) */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Details</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <b style={styles.listLabel}>Title:</b>{" "}
                <span>{formData.title}</span>
              </li>
              <li style={styles.listItem}>
                <b style={styles.listLabel}>Category:</b>{" "}
                <span>{formData.category}</span>
              </li>
              {categoryType === "Product" && (
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Condition:</b>{" "}
                  <span>{formData.condition}</span>
                </li>
              )}
              {categoryType === "Product" && (
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Price:</b>{" "}
                  <span>
                    {priceDetails.price
                      ? `₹ ${Number(priceDetails.price).toLocaleString('en-IN')} (${priceDetails.mode})`
                      : "N/A"}
                  </span>
                </li>
              )}
              {categoryType === "Room" && (
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Rent:</b>{" "}
                  <span>{priceDetails.rent ? `₹ ${Number(priceDetails.rent).toLocaleString('en-IN')}` : "N/A"}</span>
                </li>
              )}
              {categoryType === "Job" && (
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Salary:</b>{" "}
                  <span>{priceDetails.salary ? `₹ ${Number(priceDetails.salary).toLocaleString('en-IN')}` : "N/A"}</span>
                </li>
              )}
              {categoryType === "Service" && (
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Rate:</b>{" "}
                  <span>{priceDetails.rate ? `₹ ${Number(priceDetails.rate).toLocaleString('en-IN')}` : "N/A"}</span>
                </li>
              )}
              <li style={styles.listItem}>
                <b style={styles.listLabel}>Description:</b>{" "}
                <span style={styles.longText}>{formData.description}</span>
              </li>
            </ul>
          </div>

          {/* Location Section */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Location</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <b style={styles.listLabel}>Address:</b>{" "}
                <span style={styles.longText}>
                  {location.address}, {location.city}, {location.state} -{" "}
                  {location.pincode}
                </span>
              </li>
            </ul>
          </div>

          {/* Room-specific Section */}
          {categoryType === "Room" && (
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Room Details</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Room Type:</b>{" "}
                  <span>{formData.roomType || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>BHK:</b>{" "}
                  <span>{formData.bhk || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Furnished:</b>{" "}
                  <span>{formData.furnished || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Available From:</b>{" "}
                  <span>{formData.availableFrom || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Contact Number:</b>{" "}
                  <span>{formData.contactNumber || "N/A"}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Job-specific Section */}
          {categoryType === "Job" && (
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Job Details</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Job Type:</b>{" "}
                  <span>{formData.jobType || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Experience:</b>{" "}
                  <span>{formData.experience || "N/A"}</span>
                </li>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Skills:</b>{" "}
                  <span>{formData.skills ? formData.skills.join(", ") : "N/A"}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Service-specific Section */}
          {categoryType === "Service" && (
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Service Details</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  <b style={styles.listLabel}>Service Type:</b>{" "}
                  <span>{formData.serviceType || "N/A"}</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button
            onClick={prevStep}
            style={styles.backBtn}
            disabled={isSubmitting}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={onPublish}
            style={styles.publishBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 size={18} /> : <Check size={18} />}
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </div>
    ) : (
      <div style={styles.container}>
        <h2 style={styles.heading}>Listing Published!</h2>
        {navigate('/user-listings') && <p style={styles.subheading}>Your item is now live. You can view and manage your listings in your user dashboard.</p>}
      </div>
    )}</>
  );
}

// --- STRICT INLINE STYLES OBJECT ---
const styles = {
  container: {
    width: "90%",
    maxWidth: "800px",
    margin: "40px auto",
    background: "#f9fafb",
    padding: "32px",
    borderRadius: "16px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#111827",
  },
  subheading: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "32px",
  },
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sectionCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: "17px",
    marginBottom: "12px",
    color: "#111827",
  },
  imageWrapper: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #d1d5db",
    flexShrink: 0,
  },
  emptyText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    color: "#374151",
  },
  listItem: {
    marginBottom: "12px",
    display: "flex",
    fontSize: "15px",
    lineHeight: "1.5",
    flexDirection: "row",
  },
  listLabel: {
    minWidth: "120px",
    color: "#111827",
    fontWeight: "600",
  },
  longText: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    flex: 1,
  },
  buttonRow: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#fff",
    color: "#374151",
    fontWeight: "500",
  },
  publishBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 24px",
    background: "#10b981",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    fontWeight: "600",
  },
};