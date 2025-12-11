import React from "react";

function LatestListings() {
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 320px)",
    justifyContent: "center",
    gap: "34px",
    backgroundColor: "#F8FAFF",
    padding: "40px",
    with: "90vw",
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

  const contentStyle = {
    padding: "16px 20px",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "6px",
  };

  const priceStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "8px",
  };

  const oldPriceStyle = {
    textDecoration: "line-through",
    color: "#94A3B8",
    fontSize: "14px",
    marginLeft: "8px",
  };

  const locationStyle = {
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "8px",
  };

  const tagBox = {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  };

  const tagStyle = (bg, color) => ({
    backgroundColor: bg,
    color: color,
    fontSize: "12px",
    fontWeight: "500",
    padding: "4px 8px",
    borderRadius: "6px",
  });

  const footerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #E2E8F0",
    padding: "12px 20px",
  };

  const userBox = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const userAvatar = (color) => ({
    backgroundColor: color,
    color: "white",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  });

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#FBBF24",
    fontWeight: "600",
  };

  const cards = [
    {
      image: "https://images.unsplash.com/photo-1599202860130-f600f4948364?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
      title: "iPhone 15 Pro Max – Excellent Condition",
      price: "₹1,18,999",
      oldPrice: "₹1,29,999",
      location: "Gopeshwar, Chamoli",
      tags: [
        { text: "Electronics", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Like New", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Aman Rawat", color: "#2563EB", rating: 4.9 },
    },
    {
      image: "https://imgs.search.brave.com/uBsDv-bwqdV_TnYfiCjdmvYoFkKriIEysHuyo7BoOug/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4u/YmlrZWRla2hvLmNv/bS9wcm9jZXNzZWRp/bWFnZXMvaGVyby1t/b3RvY29ycC9oZXJv/LW1vdG9jb3JwLXNw/bGVuZG9yLzIwNFgx/MzQvaGVyby1tb3Rv/Y29ycC1zcGxlbmRv/cjY4YTZmYmZmZTli/MDEuanBnP3RyPXct/MjMw",
      title: "Hero Splendor Plus 2022 – Low Mileage",
      price: "₹68,000",
      location: "Kothiyalsain, Chamoli",
      tags: [
        { text: "Vehicles", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Excellent", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Tanuja Negi", color: "#3B82F6", rating: 4.8 },
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "2 BHK Flat for Rent – Fully Furnished",
      price: "₹16,500/month",
      location: "Chamoli Bazar, Chamoli",
      tags: [
        { text: "Real Estate", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Excellent", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Manjeet Singh", color: "#6366F1", rating: 4.7 },
    },
    {
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      title: "MacBook Air M2 – 8GB RAM, 512GB SSD",
      price: "₹1,05,999",
      oldPrice: "₹1,19,999",
      location: "Nandprayag, Chamoli",
      tags: [
        { text: "Electronics", bg: "#FEF3C7", color: "#92400E" },
        { text: "Warranty", bg: "#E0F2FE", color: "#0369A1" },
      ],
      user: { name: "Divya Bhatt", color: "#EF4444", rating: 4.6 },
    },
    {
      image: "https://imgs.search.brave.com/fPgb5G6ajwPGWslGrK3h41uHfXS4pOnFoFA1xTnfwN8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9tb3Vu/dGFpbi1iaWtlLXRv/dXItbGFuZHNjYXBl/LTUwMDMyMjUzLmpw/Zw",
      title: "Hero Mountain Bike – Good Condition",
      price: "₹12,000",
      location: "Pursadi, Chamoli",
      tags: [
        { text: "Sports", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Used", bg: "#FEF3C7", color: "#92400E" },
      ],
      user: { name: "Suresh Rana", color: "#10B981", rating: 4.5 },
    },
    {
      image: "https://imgs.search.brave.com/oxpc07VfvHA-GEz2WowR7IwdxMdKv0Yo_2aAFYPt8_c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aG9tZXRvd24uaW4v/Y2RuL3Nob3AvZmls/ZXMvTWlyYW5vXzUu/anBnP3Y9MTc1ODI2/NTUzMCZ3aWR0aD00/MTA3",
      title: "Wooden Sofa Set – 3 Seater, Cream Color",
      price: "₹21,500",
      location: "Ghingran, Chamoli",
      tags: [
        { text: "Home", bg: "#F0F9FF", color: "#075985" },
        { text: "Good Condition", bg: "#FEF3C7", color: "#92400E" },
      ],
      user: { name: "Kavita Joshi", color: "#8B5CF6", rating: 4.4 },
    },
    {
      image: "https://imgs.search.brave.com/cMyBV69XPCXymdrCAgz5k8pNajVcpyAn-gvzVAq9L-w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmRl/bGwuY29tL2lzL2lt/YWdlL0RlbGxDb250/ZW50L2NvbnRlbnQv/ZGFtL3NzMi9wcm9k/dWN0LWltYWdlcy9k/ZWxsLWNsaWVudC1w/cm9kdWN0cy9ub3Rl/Ym9va3MvZGVsbC1w/bHVzL2RiMDQyNTUv/bWVkaWEtZ2FsbGVy/eS9pY2UtYmx1ZS9s/YXB0b3AtZGVsbC1w/bHVzLWRiMDQyNTV0/LWljZS1ibC1nYWxs/ZXJ5LTMucHNkP2Zt/dD1wbmctYWxwaGEm/cHNjYW49YXV0byZz/Y2w9MSZoZWk9ODA0/JndpZD0xMjE3JnFs/dD0xMDAsMSZyZXNN/b2RlPXNoYXJwMiZz/aXplPTEyMTcsODA0/JmNocnNzPWZ1bGw",
      title: "Dell Inspiron Laptop – 16GB RAM, i7",
      price: "₹58,000",
      location: "Joshimath, Chamoli",
      tags: [
        { text: "Electronics", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Like New", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Rohit Nautiyal", color: "#F59E0B", rating: 4.8 },
    },
    {
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      title: "Study Table with Chair – Perfect for Students",
      price: "₹4,500",
      location: "Pokhri, Chamoli",
      tags: [
        { text: "Furniture", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Good Condition", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Neha Bhandari", color: "#EC4899", rating: 4.6 },
    },
    {
      image: "https://imgs.search.brave.com/YfWsXL1kKmeYkoshtFXsckiiqQ_PmUeHD3DqPy6Jrl8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi93aGl0/ZS1zb255LXBsYXlz/dGF0aW9uLWNvbnRy/b2xsZXItdGFibGUt/a2hhcmtpdi11a3Jh/aW5lLWp1bHktMzk1/ODA2Mzc1LmpwZw",
      title: "PlayStation 5 Digital Edition – Like New",
      price: "₹45,000",
      oldPrice: "₹52,000",
      location: "Karnprayag, Chamoli",
      tags: [
        { text: "Electronics", bg: "#E0F2FE", color: "#0369A1" },
        { text: "Like New", bg: "#DCFCE7", color: "#15803D" },
      ],
      user: { name: "Arjun Sharma", color: "#06B6D4", rating: 4.9 },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flexstart",
        flexDirection: "column",
        backgroundColor: "#F8FAFF",
      }}
    >
      <div
        // style={{
        //   display: "flex",
        //   justifyContent: "flex-start",
        //   alignItems: "flex-start",
        //   flexDirection: "column",
        //   textAlign: "left",
        //   marginLeft: "20px", // optional: adds spacing from left edge
        // }}
      >
        <p
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          LATEST LISTINGS
        </p>
        <p
          style={{
            color: "gray",
            marginTop: "5px",
          }}
        >
          Fresh items just posted by our community
        </p>
      </div>

      <div style={containerStyle}>
        {cards.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, cardStyle)
            }
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
                <span
                  style={{
                    fontSize: "14px",
                    color: "#1E293B",
                    fontWeight: "500",
                  }}
                >
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
}

export default LatestListings;
