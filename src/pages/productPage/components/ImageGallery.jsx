import React, { useState } from "react";

const ImageGallery = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  // SAFETY CHECK – if images not loaded
  const hasImages = images && images.length > 0;
  const currentImage =
    hasImages && images[index]?.url
      ? images[index].url
      : "/placeholder.jpg"; // fallback

  const styles = {
    wrapper: {
      display: "flex",
      gap: "10px",
      height: "420px",
      marginBottom: "20px",
    },
    thumbnails: {
      width: "80px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    thumbnail: (active) => ({
      width: "100%",
      height: "80px",
      objectFit: "cover",
      borderRadius: "4px",
      cursor: "pointer",
      border: active ? "2px solid #007bff" : "2px solid transparent",
    }),
    main: {
      flex: 1,
      background: "#000",
      borderRadius: "8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    mainImg: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    arrow: (side) => ({
      position: "absolute",
      top: "50%",
      [side]: "10px",
      transform: "translateY(-50%)",
      color: "#fff",
      background: "rgba(0,0,0,0.4)",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "22px",
    }),
    emptyState: {
      width: "100%",
      height: "100%",
      fontSize: "20px",
      color: "#aaa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const prev = () => {
    if (!hasImages) return;
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  };

  const next = () => {
    if (!hasImages) return;
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  };

  // If images haven't arrived
  if (!hasImages) {
    return (
      <div style={styles.main}>
        <div style={styles.emptyState}>No Images Available</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Thumbnails */}
      <div style={styles.thumbnails}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img?.url}
            style={styles.thumbnail(i === index)}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Main Image */}
      <div style={styles.main}>
        <span style={styles.arrow("left")} onClick={prev}>
          {"<"}
        </span>

        <img
          src={currentImage}
          style={styles.mainImg}
          alt="product"
        />

        <span style={styles.arrow("right")} onClick={next}>
          {">"}
        </span>
      </div>
    </div>
  );
};

export default ImageGallery;
