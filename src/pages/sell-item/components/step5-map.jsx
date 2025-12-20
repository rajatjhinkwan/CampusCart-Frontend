import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// --- LEAFLET / OSM IMPLEMENTATION (BACKUP) ---
/*
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMap } from "react-leaflet";
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
*/

const libraries = ['places', 'geometry'];

const Step5Map = ({ position }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Only render map if we have valid coordinates
  if (!position || !position.lat || !position.lng) return null;

  return (
    <div style={styles.mapWrapper}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={styles.mapInstance}
          center={position}
          zoom={16}
        >
          <Marker position={position} />
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
      
      {/* --- BACKUP LEAFLET RENDER (COMMENTED) --- */}
      {/*
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
        <LeafletMarker position={position}>
          <Popup>Detected Location</Popup>
        </LeafletMarker>
        <RecenterMap position={position} />
      </MapContainer>
      */}
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