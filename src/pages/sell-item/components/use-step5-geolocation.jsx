import { useState, useCallback } from "react";

const useStep5Geolocation = () => {
  // States specifically for the hardware geolocation process
  const [geoStatus, setGeoStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [geoError, setGeoError] = useState(null);
  const [position, setPosition] = useState(null);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoStatus("loading");
    setGeoError(null);
    setPosition(null);

    // Options: High accuracy, 20 second timeout
    const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // SUCCESS: Found GPS coordinates
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoStatus("success");
      },
      (err) => {
        // ERROR: Failed to get GPS coordinates
        console.error("GPS Error:", err);
        let errorMessage = "Could not retrieve your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enter details manually.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location signal unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
        }
        setGeoError(errorMessage);
        setGeoStatus("error");
      },
      options
    );
  }, []);

  // Reset hook state
  const resetGeo = useCallback(() => {
    setGeoStatus("idle");
    setGeoError(null);
    setPosition(null);
  }, []);

  return { position, geoStatus, geoError, getPosition, resetGeo };
};

export default useStep5Geolocation;