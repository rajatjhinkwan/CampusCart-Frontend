import React from "react";

function nearyou() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "24px",
    padding: "40px",
    backgroundColor: "#F8FAFF",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    width: "260px",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const imageBox = {
    position: "relative",
    width: "100%",
    height: "160px",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const distanceStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const heartStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "#94A3B8",
    fontSize: "16px",
  };

  const contentStyle = {
    padding: "14px 16px 12px",
  };

  const titleStyle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "4px",
  };

  const priceStyle = {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: "15px",
    marginBottom: "6px",
  };

  const oldPriceStyle = {
    textDecoration: "line-through",
    color: "#94A3B8",
    fontSize: "13px",
    marginLeft: "6px",
  };

  const locTimeStyle = {
    fontSize: "13px",
    color: "#64748B",
  };

  const tagBox = {
    display: "inline-block",
    backgroundColor: "#F1F5F9",
    color: "#475569",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "6px",
    marginTop: "8px",
  };

  const bottomRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  };

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#FBBF24",
    fontSize: "13px",
    fontWeight: "600",
  };
  const cards = [
    {
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      distance: "2.3 km",
      title: "Apartment for Rent – 1BR",
      price: "₹12,000/month",
      location: "Gopeshwar, Chamoli",
      time: "1d ago",
      tag: "Real Estate",
      rating: 4.8,
    },
    {
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      distance: "5.1 km",
      title: "Used Textbooks – Engineering",
      price: "₹1,200",
      oldPrice: "₹4,000",
      location: "Chamoli Bazar",
      time: "2d ago",
      tag: "Books",
      rating: 4.2,
    },
    {
      image: "https://imgs.search.brave.com/B4kRJ3mpfSbF4jyh8M1erwLqCjofUPYu-hwgV68hW8k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNTI5/NzgyL3BleGVscy1w/aG90by01Mjk3ODIu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw",
      distance: "7.8 km",
      title: "Bike Rent Service",
      price: "₹450/service",
      location: "Nandprayag, Chamoli",
      time: "1d ago",
      tag: "Services",
      rating: 4.9,
    },
    {
      image: "https://imgs.search.brave.com/bRYHwE9Kru7tsTzngb75PGRW4oBBZGr9eghB-80kno0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9kaW5p/bmctdGFibGUtY29t/Zm9ydGFibGUtY2hh/aXJzLXZpbnRhZ2Ut/c3R5bGUtZWxlZ2Fu/dC1zZXR0aW5nLTcy/ODY2NjU0LmpwZw",
      distance: "2.4 km",
      title: "Coffee Table – Modern Design",
      price: "₹8,500",
      location: "Kothiyalsain, Chamoli",
      time: "3d ago",
      tag: "Furniture",
      rating: 4.6,
    },
  ];

  const getNearProducts = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const res = await fetch(`/api/products/near?lat=${lat}&lng=${lng}&radius=15`);
      const data = await res.json();

      console.log("Near you:", data);
    });
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
      <div>
        <p style={{ fontSize: "34px", fontWeight: "bold" }}>NEAR YOU</p>
        <p style={{ color: 'gray' }}>Items and services available in your area</p>
      </div>
      <div style={containerStyle}>
        {cards.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
            }}
          >
            <div style={imageBox}>
              <img src={item.image} alt={item.title} style={imageStyle} />
              <div style={distanceStyle}>
                <i className="fa-solid fa-location-arrow" /> {item.distance}
              </div>
              <i className="fa-regular fa-heart" style={heartStyle}></i>
            </div>

            <div style={contentStyle}>
              <div style={titleStyle}>{item.title}</div>
              <div style={priceStyle}>
                {item.price}
                {item.oldPrice && <span style={oldPriceStyle}>{item.oldPrice}</span>}
              </div>

              <div style={locTimeStyle}>
                <i className="fa-solid fa-location-dot"></i> {item.location} &nbsp;&nbsp;
                <span>{item.time}</span>
              </div>

              <div style={bottomRow}>
                <span style={tagBox}>{item.tag}</span>
                <div style={ratingStyle}>
                  <i className="fa-solid fa-star"></i> {item.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default nearyou;