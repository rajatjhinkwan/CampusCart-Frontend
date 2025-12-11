import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Leaflet Icon Fix imports ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Apply icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Helper to auto-center map when coordinates change
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16); // Zoom level 16 for street view
    }
  }, [position, map]);
  return null;
};

const Step5Map = ({ position }) => {
  // Only render map if we have valid coordinates
  if (!position || !position.lat || !position.lng) return null;

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={styles.mapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Detected Location</Popup>
        </Marker>
        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
};

const styles = {
  mapWrapper: {
    height: "250px",
    width: "100%",
    marginTop: "24px",
    marginBottom: "24px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    // Ensure it doesn't overlap dropdowns/modals
    zIndex: 0,
    position: 'relative'
  },
  mapInstance: {
    height: "100%",
    width: "100%",
  },
};

export default Step5Map;