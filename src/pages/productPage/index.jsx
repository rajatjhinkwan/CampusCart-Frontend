// FILE: src/pages/productPage/index.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import ImageGallery from "./components/ImageGallery";
import DetailsCard from "./components/DetailsCard";
import SellerInfo from "./components/SellerInfo";
import BuySection from "./components/BuySection";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productId = id;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${productId}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const styles = {
    page: {
      maxWidth: "1200px",
      margin: "20px auto",
      padding: "0 15px",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      display: "flex",
      gap: "20px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    left: { flex: 2, minWidth: "350px" },
    right: { flex: 1, minWidth: "300px" },
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
          <BuySection price={product.oldPrice || "Price Not Available"} />

          {/* IMPORTANT FIX → Seller info is inside product.user */}
          <SellerInfo seller={product.user} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
