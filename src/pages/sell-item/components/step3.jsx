import React, { useState, useCallback, useMemo, useEffect } from "react";
import axios from "../../../lib/axios";
import toast from "react-hot-toast";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import ProgressBar from "./progressBar"; // Ensure correct path to your ProgressBar component

export default function Step3({
  photos = [],
  onPhotosChange,
  onNext,
  onBack,
  categoryType,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // --- 1. Generate Previews on the Fly ---
  // useMemo creates the preview URLs whenever the 'photos' prop changes.
  const previewPhotos = useMemo(() => {
    return photos.map((file) => URL.createObjectURL(file));
  }, [photos]);

  // Cleanup effect: Revoke old URLs when photos change or component unmounts to prevent memory leaks.
  useEffect(() => {
    return () => {
      previewPhotos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewPhotos]);

  // --- 2. File Handling Logic ---

  // Central function to process incoming files (from input or drop)
  const processFiles = useCallback(
    (incomingFiles) => {
      // Filter to ensure only images get through using regex
      const validImageFiles = incomingFiles.filter((file) =>
        file.type.match(/^image\//)
      );

      if (validImageFiles.length < incomingFiles.length) {
        alert("Some files were skipped because they were not compatible images.");
      }

      if (validImageFiles.length > 0) {
        // IMPORTANT: Create a NEW array reference containing existing + new photos
        const combinedPhotos = [...photos, ...validImageFiles];
        // Call the parent function to update master state
        onPhotosChange(combinedPhotos);

        const first = validImageFiles[0];
        if (first && categoryType === "Product") {
          const fd = new FormData();
          fd.append("image", first);
          axios
            .post("/api/ml/predict", fd, { headers: { "Content-Type": "multipart/form-data" } })
            .then((res) => {
              const data = res?.data?.data || {};
              const label = data.label || data.prediction || data.class || (data.result && data.result.label) || "Item";
              toast.success(`${label} detected by ML`);
            })
            .catch((err) => {
              const msg = err?.response?.data?.message || err?.message || "ML detection failed";
              toast.error(msg);
            });
        }
      }
    },
    [photos, onPhotosChange, categoryType]
  );

  // Handle standard file input selection
  const handleFileSelect = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        processFiles(newFiles);
      }
      // Reset input value so the same file can be selected again if needed elsewhere
      e.target.value = "";
    },
    [processFiles]
  );

  // --- Drag & Drop Event Handlers ---
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if leaving the main container target
    if (e.target === e.currentTarget) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  // --- 3. Remove Photo Logic ---
  const removePhoto = useCallback(
    (indexToRemove) => {
      // IMPORTANT: Create a NEW array reference by filtering out the item
      const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
      onPhotosChange(updatedPhotos);
    },
    [photos, onPhotosChange]
  );

  // --- 4. Dynamic Styles ---
  const uploadBoxStyle = {
    ...styles.uploadBox,
    ...(isDragging ? styles.uploadBoxActive : {}),
  };

  // Disable "Next" button if no photos are selected
  const currentNextButtonStyle =
    photos.length === 0
      ? { ...styles.nextButton, ...styles.disabledButton }
      : styles.nextButton;

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerWrapper}>
        <ProgressBar currentStep={3} totalSteps={6} />
        <h2 style={styles.heading}>Upload Photos</h2>
        <p style={styles.subheading}>
          Add clear images to attract buyers. You can add multiple photos.
        </p>
      </div>

      {/* Upload Area (Label acts as the dropzone) */}
      <label
        style={uploadBoxStyle}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp, image/heic"
          style={styles.fileInput}
          onChange={handleFileSelect}
        />
        <div style={styles.uploadContent}>
          <div style={styles.iconWrapper}>
            <UploadCloud size={32} color={isDragging ? "#0ea5e9" : "#64748b"} />
          </div>
          <p style={styles.uploadMainText}>
            <span style={styles.linkText}>Click to upload</span> or drag and drop
          </p>
          <p style={styles.uploadSubText}>PNG, JPG, WEBP (max 10MB)</p>
        </div>
      </label>

      {/* Image Previews Grid */}
      <div style={styles.gridContainer}>
        {previewPhotos.length > 0 ? (
          <div style={styles.previewGrid}>
            {previewPhotos.map((src, index) => (
              <div key={index} style={styles.previewCard}>
                <img
                  src={src}
                  alt={`preview ${index}`}
                  style={styles.previewImage}
                />
                {/* The Remove Button */}
                <button
                  style={styles.removeButton}
                  onClick={(e) => {
                    e.preventDefault(); // Stop propagation to prevent opening file dialog
                    removePhoto(index);
                  }}
                  type="button"
                  title="Remove photo"
                >
                  <X size={16} color="#ffffff" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Empty State placeholder
          !isDragging && (
            <div style={styles.emptyState}>
              <ImageIcon size={40} color="#e2e8f0" />
              <p>No photos added yet</p>
            </div>
          )
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={styles.buttonRow}>
        <button style={styles.backButton} onClick={onBack}>
          Back
        </button>
        <button
          style={currentNextButtonStyle}
          onClick={onNext}
          disabled={photos.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: {
    width: "80vw",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  headerWrapper: {
    marginBottom: "24px",
    textAlign: "left",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1e293b",
  },
  subheading: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  // --- Upload Box Styles ---
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "180px",
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    background: "#f8fafc",
    transition: "all 0.2s ease-in-out",
    boxSizing: "border-box",
  },
  uploadBoxActive: {
    borderColor: "#0ea5e9",
    background: "#f0f9ff",
  },
  fileInput: { display: "none" },
  uploadContent: {
    pointerEvents: "none",
  },
  iconWrapper: {
    marginBottom: "16px",
    padding: "12px",
    borderRadius: "50%",
    background: "#e2e8f0",
    display: "inline-flex",
  },
  uploadMainText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "6px",
  },
  linkText: {
    color: "#0ea5e9",
  },
  uploadSubText: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  // --- Preview Grid Styles ---
  gridContainer: {
    marginTop: "32px",
    minHeight: "150px",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "20px",
  },
  previewCard: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e2e8f0",
    aspectRatio: "1 / 1",
    backgroundColor: "#fff",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.2s ease",
  },

  // --- Remove Button Styles ---
  removeButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(0, 0, 0, 0.6)",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s",
    zIndex: 2,
  },

  // --- Empty State ---
  emptyState: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "20px",
    border: "1px solid #f1f5f9",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  // --- Button Row Styles ---
  buttonRow: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  backButton: {
    padding: "12px 24px",
    background: "#fff",
    color: "#334155",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  nextButton: {
    padding: "12px 24px",
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
    background: "#94a3b8",
  },
};
