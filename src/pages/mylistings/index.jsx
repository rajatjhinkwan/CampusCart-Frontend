  import React, { useEffect, useState } from "react";
  import ProductCard from "../../components/product/productCard.jsx";
  import axios from "axios";

  const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const styles = {
      container: {
        width: "100%",
        maxWidth: "1200px",
        margin: "40px auto",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "20px",
      },
      header: {
        marginBottom: "20px",
        fontSize: "22px",
        fontWeight: "700",
        color: "#1f2937",
      },
      grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
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
          // 1. Retrieve the token dynamically from Local Storage
          const token = localStorage.getItem("refreshToken");

          if (!token) {
            console.error("No token found. User might not be logged in.");
            setLoading(false);
            return;
          }

          // 2. Use the variable 'token' in the header
          const response = await axios.get('http://localhost:5000/api/products/my-products', {
            headers: {
              Authorization: `Bearer ${token}`, // <--- FIXED: Uses the variable, not the hardcoded string
              "Content-Type": "application/json",
            },
          });

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

    if (loading) return <div style={styles.loadingText}>Loading your listings...</div>;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          My Listings {products.length > 0 && `(${products.length})`}
        </div>

        <div style={styles.grid}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={styles.noDataText}>No listings found. Start selling today!</div>
          )}
        </div>
      </div>
    );
  };

  export default ProductGrid;