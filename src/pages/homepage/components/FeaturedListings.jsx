import React, { useState, useEffect } from "react";
import axios from "axios";

function FeaturedListings() {
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 320px)",
    justifyContent: "center",
    gap: "34px",
    backgroundColor: "#F8FAFF",
    padding: "40px",
    width: "90vw"
  };

  const cardStyle = {
    backgroundColor: "#fff",
    width: "340px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const cardHover = {
    transform: "translateY(-6px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const imageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  };

  const contentStyle = { padding: "16px 20px" };
  const titleStyle = { fontSize: "18px", fontWeight: "600", color: "#1E293B", marginBottom: "6px" };
  const priceStyle = { fontSize: "20px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" };
  const oldPriceStyle = { textDecoration: "line-through", color: "#94A3B8", fontSize: "14px", marginLeft: "8px" };
  const locationStyle = { fontSize: "14px", color: "#64748B", marginBottom: "8px" };
  const tagBox = { display: "flex", gap: "8px", marginBottom: "12px" };
  const tagStyle = (bg, color) => ({ backgroundColor: bg, color, fontSize: "12px", fontWeight: "500", padding: "4px 8px", borderRadius: "6px" });
  const footerStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", padding: "12px 20px" };
  const userBox = { display: "flex", alignItems: "center", gap: "8px" };
  const userAvatar = (color) => ({ backgroundColor: color, color: "white", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" });
  const ratingStyle = { display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#FBBF24", fontWeight: "600" };

  const defaultCards = [
    {
      image: "https://imgs.search.brave.com/X9uBoNN0uL4kfva5ugLc1EFmzVj3FburvMkjfQYR_pU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mZG4u/Z3NtYXJlbmEuY29t/L2ltZ3Jvb3QvcmV2/aWV3cy8yNC9zYW1z/dW5nLWdhbGF4eS1z/MjQtdWx0cmEvbGlm/ZXN0eWxlLy0xMDI0/dzIvZ3NtYXJlbmFf/MDMwLmpwZw",
      title: "Samsung Galaxy S24 Ultra – 256GB Phantom Black",
      price: "₹1,19,999",
      oldPrice: "₹1,29,999",
      location: "Gopeshwar, Chamoli",
      tags: [
        { text: "Electronics", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Like New", bg: "#DCFCE7", color: "#15803D" }
      ],
      user: { name: "Rajat Singh", color: "#2563EB", rating: 4.9 }
    },
    {
      image: "https://imgs.search.brave.com/B9zcc4ghk6lwDBr7mTHTEC_WgfagCEtc7EI6dt_RR4I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkveVphVUhBN0FS/Z0kvbXFkZWZhdWx0/LmpwZw",
      title: "Honda Activa 6G – Smooth Ride, 2023 Model",
      price: "₹72,000",
      location: "Kothiyalsain, Chamoli",
      tags: [
        { text: "Vehicles", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Excellent", bg: "#DCFCE7", color: "#15803D" }
      ],
      user: { name: "Mohit Bisht", color: "#3B82F6", rating: 4.8 }
    },
    {
      image: "https://imgs.search.brave.com/uGQDmeMbB_d5sMKi1MSfoj6xobW5fQl7sQnZDzO7lrU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Q3L2Q2/LzJjL2Q3ZDYyYzky/MzcxZTk3MzNkMTJj/NTc1NDQ5Mjg2N2Y0/LmpwZw",
      title: "3 BHK Apartment for Rent – Near Main Temple",
      price: "₹18,000/month",
      location: "Chamoli Bazar",
      tags: [
        { text: "Real Estate", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Excellent", bg: "#DCFCE7", color: "#15803D" }
      ],
      user: { name: "Manish Joshi", color: "#6366F1", rating: 4.7 }
    },
    {
      image: "https://imgs.search.brave.com/uUAgQQlaylfrlYL6Eu5eONilhxBAmuF7PpOzEjCnNUs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmRl/bGwuY29tL2lzL2lt/YWdlL0RlbGxDb250/ZW50L2NvbnRlbnQv/ZGFtL3NzMi9wcm9k/dWN0LWltYWdlcy9k/ZWxsLWNsaWVudC1w/cm9kdWN0cy9ub3Rl/Ym9va3MvZGVsbC9k/YzE0MjUwL21nL3Bs/YXN0aWMvc2wvZnBy/L2xhcHRvcC1kYzE0/MjUwbnQtZnByLXBs/YXN0aWMtaW50ZWwt/c2wtZ2FsbGVyeS00/LnBzZD9mbXQ9cG5n/LWFscGhhJnBzY2Fu/PWF1dG8mc2NsPTEm/aGVpPTgwNCZ3aWQ9/MTA3OSZxbHQ9MTAw/LDEmcmVzTW9kZT1z/aGFycDImc2l6ZT0x/MDc5LDgwNCZjaHJz/cz1mdWxs",
      title: "Dell XPS 15 – 11th Gen i7, 16GB RAM",
      price: "₹1,69,999",
      oldPrice: "₹1,89,999",
      location: "Nandprayag, Chamoli",
      tags: [
        { text: "Electronics", bg: "#FEF3C7", color: "#92400E" },
        { text: "Warranty", bg: "#E0F2FE", color: "#0369A1" }
      ],
      user: { name: "Simran Bhandari", color: "#EF4444", rating: 4.6 }
    },
    {
      image: "https://imgs.search.brave.com/ghdDGtE6p7UPXq6vShWbo0k3NZea-Clx2vmr54REDfs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFHaDJ4K05aMEwu/anBn",
      title: "Firefox Mountain Bike – Red Edition",
      price: "₹14,500",
      location: "Pursadi, Chamoli",
      tags: [
        { text: "Sports", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Like New", bg: "#DCFCE7", color: "#15803D" }
      ],
      user: { name: "Vivek Negi", color: "#10B981", rating: 4.5 }
    },
    {
      image: "https://imgs.search.brave.com/3HNopml3IRV6mqWSBjoH0bd1IfcBfj0kBNEESmObGbM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aGV0/aW1iZXJndXkuY29t/L2Nkbi9zaG9wL2Zp/bGVzL01pZC1jZW50/dXJ5LVNvbGlkLVNo/ZWVzaGFtLVdvb2Qt/U3RvcmFnZS1EaW5p/bmctdGFibGUtd2l0/aC02LXJhdHRhbi1j/YW5lLWNoYWlyLWZ1/cm5pdHVyZS1zZXRf/ODAweC5wbmc_dj0x/NzYwMDM1NTU3",
      title: "Solid Wood Dining Table – 6 Chairs, Walnut Finish",
      price: "₹22,500",
      location: "Ghingran, Chamoli",
      tags: [
        { text: "Home", bg: "#F0F9FF", color: "#075985" },
        { text: "Good Condition", bg: "#FEF3C7", color: "#92400E" }
      ],
      user: { name: "Kirti Mishra", color: "#8B5CF6", rating: 4.4 }
    }
  ];

  const [featuredProducts, setFeaturedProducts] = useState(defaultCards);

  // ⭐ Corrected fetch logic
  useEffect(() => {
    axios.get("/api/")
      .then((res) => {
        console.log("Fetched featured:", res.data);

        // ✅ FIXED: Correct condition
        if (Array.isArray(res.data.data)) {
          setFeaturedProducts(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching featured:", err));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div>
        <p style={{ fontSize: "34px", fontWeight: "bold", margin: "0" }}>
          Featured Listings
        </p>
        <p style={{ color: "gray", marginTop: "5px" }}>
          Hand-picked premium ads from verified sellers
        </p>
      </div>

      <div style={containerStyle}>
        {featuredProducts.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <img src={item.image} alt={item.title} style={imageStyle} />

            <div style={contentStyle}>
              <div style={priceStyle}>
                {item.price}
                {item.oldPrice && (
                  <span style={oldPriceStyle}>{item.oldPrice}</span>
                )}
              </div>

              <h3 style={titleStyle}>{item.title}</h3>

              <p style={locationStyle}>
                <i className="fa-solid fa-location-dot"></i> {item.location}
              </p>

              <div style={tagBox}>
                {item.tags.map((tag, i) => (
                  <span key={i} style={tagStyle(tag.bg, tag.color)}>
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>

            <div style={footerStyle}>
              <div style={userBox}>
                <div style={userAvatar(item.user.color)}>
                  {item.user.name[0]}
                </div>
                <span style={{ fontSize: "14px", color: "#1E293B", fontWeight: "500" }}>
                  {item.user.name}
                </span>
              </div>

              <div style={ratingStyle}>
                <i className="fa-solid fa-star"></i> {item.user.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  export default FeaturedListings;
