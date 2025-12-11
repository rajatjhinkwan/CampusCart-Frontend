const getNearProducts = async () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const res = await fetch(`/api/products/near?lat=${lat}&lng=${lng}&radius=15`);
    const data = await res.json();

    console.log("Near you:", data);
  });
};

export default getNearProducts;
