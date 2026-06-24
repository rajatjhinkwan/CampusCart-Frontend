import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import ProductCard from "../../components/product/productCard.jsx";
import Skeleton from "../../components/Skeleton";
import axios from "../../lib/axios";
import { ArrowLeft, Plus } from "lucide-react";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const styles = {
    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "40px auto",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "20px",
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    header: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#1f2937",
    },
    actions: {
      display: "flex",
      gap: 10,
    },
    backBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      color: "#111827",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 13,
    },
    createBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "#2563eb",
      border: "none",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      alignItems: "stretch",
    },
    loadingText: {
      textAlign: "center",
      padding: "40px",
      color: "#6b7280",
      fontSize: "16px",
    },
    noDataText: {
      textAlign: "center",
      padding: "40px",
      color: "#6b7280",
      width: "100%",
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/my-products');

        console.log("API Response:", response.data);

        if (response.data && response.data.success) {
          const formattedProducts = response.data.products.map((item) => {
            // Handle Images
            const imageUrl = (item.images && item.images.length > 0)
              ? item.images[0].url
              : "https://via.placeholder.com/300x200?text=No+Image";

            // Handle Ratings
            const ratingValue = item.reviews.length > 0
              ? (item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length).toFixed(1)
              : "New";

            return {
              id: item._id,
              title: item.title,
              price: `₹ ${item.price.toLocaleString("en-IN")}`,
              image: imageUrl,
              seller: item.seller?.name || "Unknown Seller",
              rating: ratingValue,
              condition: item.condition,
              // Truncate long locations
              location: item.location.length > 25 ? item.location.substring(0, 25) + "..." : item.location,
              date: new Date(item.createdAt).toLocaleDateString("en-IN"),
              featured: false,
            };
          });

          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching listings:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <div style={styles.header}>My Listings</div>
          </div>
          <div style={styles.actions}>
            <Skeleton width="120px" height="36px" borderRadius="10px" />
          </div>
        </div>

        <div style={styles.grid}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", height: "350px", display: "flex", flexDirection: "column" }}>
              <Skeleton width="100%" height="200px" />
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton width="40%" height="24px" />
                  <Skeleton width="28%" height="16px" />
                </div>
                <Skeleton width="90%" height="20px" />
                <Skeleton width="60%" height="20px" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
                  <Skeleton width="30%" height="20px" />
                  <Skeleton width="30%" height="20px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <div style={styles.header}>My Listings {products.length > 0 && `(${products.length})`}</div>
          </div>
          <div style={styles.actions}>
            <button style={styles.createBtn} onClick={() => navigate('/sell-item')}>
              <Plus size={18} /> Create Listing
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} style={{ height: "350px" }}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div style={styles.noDataText}>No listings found. Start selling today!</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductGrid;
