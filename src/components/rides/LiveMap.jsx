import { useEffect, useState, useRef, useCallback } from "react";
// --- GOOGLE MAPS IMPLEMENTATION ---
import { GoogleMap, useJsApiLoader, Marker, Polyline as GooglePolyline, DirectionsRenderer } from '@react-google-maps/api';

// --- LEAFLET / OSM IMPLEMENTATION (BACKUP) ---
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// const DEFAULT_OSRM = `${API_BASE}/api/osrm`;
// const DEFAULT_PHOTON = `${API_BASE}/api/geo/photon`;

const libraries = ['places', 'geometry'];

const LiveMap = ({ from, to, driverLocation, passengerLocation, pickupCoords, showDriverMarker, onUserLocate }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const mapRef = useRef(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [driverTrail, setDriverTrail] = useState([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const hasFrom = !!(from && Number.isFinite(from.lat) && Number.isFinite(from.lng));
  const hasTo = !!(to && Number.isFinite(to.lat) && Number.isFinite(to.lng));
  const hasDriver = !!(driverLocation && Number.isFinite(driverLocation.lat) && Number.isFinite(driverLocation.lng));

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  // Fetch Directions
  useEffect(() => {
    if (hasFrom && hasTo && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: from.lat, lng: from.lng },
          destination: { lat: to.lat, lng: to.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
            setError("Routing unavailable");
          }
        }
      );
    } else {
      setDirectionsResponse(null);
    }
  }, [hasFrom, hasTo, from, to, isLoaded]);

  // Driver Trail
  useEffect(() => {
    if (!showDriverMarker || !hasDriver) return;
    setDriverTrail((prev) => {
      const last = prev[prev.length - 1];
      const next = { lat: driverLocation.lat, lng: driverLocation.lng };
      if (last && last.lat === next.lat && last.lng === next.lng) return prev;
      const arr = [...prev, next];
      if (arr.length > 60) arr.shift();
      return arr;
    });
  }, [showDriverMarker, hasDriver, driverLocation]);

  // Fit Bounds
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasPoints = false;

      if (hasFrom) { bounds.extend({ lat: from.lat, lng: from.lng }); hasPoints = true; }
      if (hasTo) { bounds.extend({ lat: to.lat, lng: to.lng }); hasPoints = true; }
      if (hasDriver && showDriverMarker) { bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng }); hasPoints = true; }

      if (hasPoints) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [hasFrom, hasTo, from, to, hasDriver, driverLocation, showDriverMarker, isLoaded]);


  const locateMe = async () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };

          if (mapRef.current) {
            mapRef.current.panTo(pos);
            mapRef.current.setZoom(16);
          }

          let address = `${latitude}, ${longitude}`;
          try {
            const geocoder = new window.google.maps.Geocoder();
            const response = await geocoder.geocode({ location: pos });
            if (response.results[0]) {
              address = response.results[0].formatted_address;
            }
          } catch (e) {
            console.warn("Geocoding failed", e);
          }

          if (typeof onUserLocate === 'function') {
            onUserLocate({ lat: latitude, lng: longitude, address });
          }
          setLocating(false);
        },
        () => {
          setError("Error: The Geolocation service failed.");
          setLocating(false);
        }
      );
    } else {
      setError("Error: Your browser doesn't support geolocation.");
      setLocating(false);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ width: "100%", height: "450px", position: "relative" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#111827",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={hasFrom ? { lat: from.lat, lng: from.lng } : { lat: 20.5937, lng: 78.9629 }} // Default to India center
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Directions */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                strokeColor: "#8B5CF6",
                strokeWeight: 6,
                strokeOpacity: 0.8
              },
              suppressMarkers: true // We use our own markers
            }}
          />
        )}

        {/* Markers */}
        {hasFrom && (
          <Marker
            position={{ lat: from.lat, lng: from.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#10B981",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "white",
            }}
          />
        )}
        {hasTo && (
          <Marker
            position={{ lat: to.lat, lng: to.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#EF4444",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "white",
            }}
          />
        )}
        {showDriverMarker && hasDriver && (
          <Marker
            position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#111827",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#F59E0B",
            }}
          />
        )}
        {passengerLocation && Number.isFinite(passengerLocation.lat) && Number.isFinite(passengerLocation.lng) && (
          <Marker
            position={{ lat: passengerLocation.lat, lng: passengerLocation.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#2563EB",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#93C5FD",
            }}
          />
        )}

        {/* Driver Trail */}
        {showDriverMarker && driverTrail.length > 1 && (
          <GooglePolyline
            path={driverTrail}
            options={{
              strokeColor: "#F59E0B",
              strokeWeight: 5,
              strokeOpacity: 0.9,
              geodesic: true,
              icons: [{
                icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                offset: '0',
                repeat: '20px'
              }] // Dashed effect simulation
            }}
          />
        )}

        {/* Controls overlay */}
        <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => { if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() + 1); }}
            style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700, cursor: 'pointer' }}
          >+</button>
          <button
            onClick={() => { if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() - 1); }}
            style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700, cursor: 'pointer' }}
          >−</button>
          <button
            onClick={() => {
              if (mapRef.current && (hasFrom || hasTo)) {
                const bounds = new window.google.maps.LatLngBounds();
                if (hasFrom) bounds.extend({ lat: from.lat, lng: from.lng });
                if (hasTo) bounds.extend({ lat: to.lat, lng: to.lng });
                if (hasDriver && showDriverMarker) bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
                mapRef.current.fitBounds(bounds);
              }
            }}
            style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700, cursor: 'pointer' }}
          >⧉</button>
          <button
            onClick={locateMe}
            style={{ width: 40, height: 40, borderRadius: 10, background: locating ? '#E5E7EB' : '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700, cursor: 'pointer' }}
          >🎯</button>
        </div>
      </GoogleMap>
    </div>
  );
};

export default LiveMap;

/* ==========================================================================================
   BACKUP: LEAFLET / OSM IMPLEMENTATION (COMMENTED OUT)
   ==========================================================================================
   
   /* =========================
      Auto fit map to route
   ========================= * /
   const FitBounds = ({ coords, markers }) => {
     const map = useMap();
   
     useEffect(() => {
       if (coords && coords.length > 1) {
         map.fitBounds(coords, { padding: [50, 50] });
         return;
       }
       if (markers && markers.length > 0) {
         map.fitBounds(markers, { padding: [50, 50] });
       }
     }, [coords, markers, map]);
   
     return null;
   };
   
   const LiveMap = ({ from, to, driverLocation, passengerLocation, pickupCoords, showDriverMarker, onUserLocate }) => {
     const [routeCoords, setRouteCoords] = useState([]);
     const [error, setError] = useState(null);
     const hasFrom = !!(from && Number.isFinite(from.lat) && Number.isFinite(from.lng));
     const hasTo = !!(to && Number.isFinite(to.lat) && Number.isFinite(to.lng));
     const hasDriver = !!(driverLocation && Number.isFinite(driverLocation.lat) && Number.isFinite(driverLocation.lng));
     const [driverTrail, setDriverTrail] = useState([]);
     const [locating, setLocating] = useState(false);
   
     /* =========================
        Icons
     ========================= * /
   const icon = (color) =>
     L.divIcon({
       html: `<div style="
           width:16px;
           height:16px;
           background:${color};
           border-radius:50%;
           border:3px solid white;
           "></div>`,
       iconSize: [16, 16],
       className: "",
     });
   const driverIcon = L.divIcon({
     html: `<div style="
         width:18px;
         height:18px;
         background:#111827;
         border-radius:50%;
         border:3px solid #F59E0B;
         box-shadow:0 0 0 2px #fff inset;
       "></div>`,
     iconSize: [18, 18],
     className: "",
   });
   const passengerIcon = L.divIcon({
     html: `<div style="
         width:18px;
         height:18px;
         background:#2563EB;
         border-radius:50%;
         border:3px solid #93C5FD;
         box-shadow:0 0 0 2px #fff inset;
       "></div>`,
     iconSize: [18, 18],
     className: "",
   });
   
   /* =========================
      Fetch route
   ========================= * /
   useEffect(() => {
     if (!hasFrom || !hasTo) {
       setRouteCoords([]);
       return;
     }
   
     const fetchRoute = async () => {
       try {
         setError(null);
   
         const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
         const base = `${API_BASE}/api/osrm`;
   
         const snap = async (lat, lng) => {
           try {
             const r = await fetch(`${base}/nearest?lon=${lng}&lat=${lat}&number=1`, { headers: { Accept: "application/json" } });
             if (!r.ok) throw new Error(`HTTP_${r.status}`);
             const d = await r.json();
             const loc = d.waypoints && d.waypoints[0] && d.waypoints[0].location;
             if (Array.isArray(loc) && loc.length === 2) return { lat: loc[1], lng: loc[0] };
           } catch (err) {
             console.warn("nearest failed", err);
           }
           return { lat, lng };
         };
         const a = await snap(from.lat, from.lng);
         const b = await snap(to.lat, to.lng);
   
         const routeFetch = async (coordsA, coordsB, opts = {}) => {
           const params = new URLSearchParams({
             overview: "full",
             geometries: "geojson",
           });
           if (opts.radiuses) params.set("radiuses", opts.radiuses);
           const url = `${base}/route?a_lon=${coordsA.lng}&a_lat=${coordsA.lat}&b_lon=${coordsB.lng}&b_lat=${coordsB.lat}&${params.toString()}`;
           const res = await fetch(url, { headers: { Accept: "application/json" } });
           if (!res.ok) throw new Error(`HTTP_${res.status}`);
           const data = await res.json();
           if (data.code !== "Ok" || !data.routes || !data.routes[0]) throw new Error("No route");
           return data.routes[0];
           };
   
         let route;
         try {
           route = await routeFetch(a, b);
         } catch {
           route = await routeFetch(a, b, { radiuses: "10000;10000" });
         }
   
         const coords = route.geometry.coordinates.map(
           ([lng, lat]) => [lat, lng]
         );
   
         setRouteCoords(coords);
       } catch (e) {
         console.error(e);
         setError("Routing unavailable");
       }
     };
   
     fetchRoute();
   }, [hasFrom, hasTo, from, to]);
   
   useEffect(() => {
     if (!showDriverMarker || !hasDriver) return;
     setDriverTrail((prev) => {
       const last = prev[prev.length - 1];
       const next = [driverLocation.lat, driverLocation.lng];
       if (last && last[0] === next[0] && last[1] === next[1]) return prev;
       const arr = [...prev, next];
       if (arr.length > 60) arr.shift();
       return arr;
     });
   }, [showDriverMarker, hasDriver, driverLocation?.lat, driverLocation?.lng]);
   
   const Controls = () => {
     const map = useMap();
     const centerOn = (lat, lng, z = 15) => {
       map.setView([lat, lng], z, { animate: true });
     };
     const fitAll = () => {
       const m = [
         ...(hasFrom ? [[from.lat, from.lng]] : []),
         ...(hasTo ? [[to.lat, to.lng]] : []),
         ...(showDriverMarker && hasDriver ? [[driverLocation.lat, driverLocation.lng]] : []),
       ];
       if (m.length) map.fitBounds(m, { padding: [50, 50] });
     };
     const locateMe = async () => {
       setLocating(true);
       try {
         const pos = await new Promise((res, rej) => {
           navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 });
         });
         const { latitude, longitude } = pos.coords;
         centerOn(latitude, longitude, 16);
         let address = `${latitude}, ${longitude}`;
         try {
           const photonBase = import.meta.env.VITE_PHOTON_PROXY_BASE || DEFAULT_PHOTON;
           const r = await fetch(`${photonBase}/reverse?lat=${latitude}&lon=${longitude}`, { headers: { Accept: 'application/json' } });
           if (r.ok) {
             const d = await r.json();
             const f = Array.isArray(d.features) ? d.features[0] : null;
             const labelParts = f?.properties ? [
               f.properties.name,
               f.properties.street,
               f.properties.city || f.properties.town || f.properties.village,
               f.properties.state,
               f.properties.country
             ].filter(Boolean).join(', ') : '';
             if (labelParts) address = labelParts;
           }
         } catch (err) {
           console.warn(err);
         }
         if (typeof onUserLocate === 'function') {
           onUserLocate({ lat: latitude, lng: longitude, address });
         }
       } catch (e) {
         console.error(e);
       } finally {
         setLocating(false);
       }
     };
     return (
       <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 1000 }}>
         <button
           onClick={() => map.zoomIn()}
           style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
         >+</button>
         <button
           onClick={() => map.zoomOut()}
           style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
         >−</button>
         <button
           onClick={fitAll}
           style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
         >⧉</button>
         <button
           onClick={() => { if (hasFrom) centerOn(from.lat, from.lng, 16); }}
           style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
         >📍</button>
         <button
           onClick={locateMe}
           style={{ width: 40, height: 40, borderRadius: 10, background: locating ? '#E5E7EB' : '#fff', border: '1px solid #e5e7eb', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
         >🎯</button>
       </div>
     );
   };
   
   return (
     <div style={{ width: "100%", height: "450px", position: "relative" }}>
       {error && (
         <div
           style={{
             position: "absolute",
             top: 10,
             left: 10,
             background: "#111827",
             color: "#fff",
             padding: "8px 12px",
             borderRadius: 6,
             zIndex: 1000,
           }}
         >
           {error}
         </div>
       )}
   
       <MapContainer
         center={[
           hasFrom ? from.lat : hasTo ? to.lat : hasDriver ? driverLocation.lat : 0,
           hasFrom ? from.lng : hasTo ? to.lng : hasDriver ? driverLocation.lng : 0,
         ]}
         zoom={14}
         style={{ width: "100%", height: "100%" }}
       >
         <TileLayer
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           attribution="© OpenStreetMap contributors"
         />
         <Controls />
   
         {hasFrom && <Marker position={[from.lat, from.lng]} icon={icon("#10B981")} />}
         {hasTo && <Marker position={[to.lat, to.lng]} icon={icon("#EF4444")} />}
         {showDriverMarker && hasDriver && (
           <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon} />
         )}
         {passengerLocation && Number.isFinite(passengerLocation.lat) && Number.isFinite(passengerLocation.lng) && (
           <Marker position={[passengerLocation.lat, passengerLocation.lng]} icon={passengerIcon} />
         )}
   
         {routeCoords.length > 0 && (
           <>
             <Polyline
               positions={routeCoords}
               pathOptions={{
                 color: "#0B1020",
                 weight: 14,
                 opacity: 0.9,
               }}
             />
   
             <Polyline
               positions={routeCoords}
               pathOptions={{
                 color: "#8B5CF6",
                 weight: 8,
                 opacity: 1,
                 dashArray: "10 12",
               }}
             />
           </>
         )}
   
         {Array.isArray(pickupCoords) && pickupCoords.length > 1 && (
           <Polyline
             positions={pickupCoords}
             pathOptions={{
               color: "#10B981",
               weight: 6,
               opacity: 0.95,
               dashArray: "6 8",
             }}
           />
         )}
   
         {showDriverMarker && driverTrail.length > 1 && (
           <Polyline
             positions={driverTrail}
             pathOptions={{
               color: "#F59E0B",
               weight: 5,
               opacity: 0.9,
               dashArray: "2 8",
             }}
           />
         )}
   
         <FitBounds
           coords={routeCoords}
           markers={[
             ...(hasFrom ? [[from.lat, from.lng]] : []),
             ...(hasTo ? [[to.lat, to.lng]] : []),
             ...(showDriverMarker && hasDriver ? [[driverLocation.lat, driverLocation.lng]] : []),
           ]}
         />
       </MapContainer>
     </div>
   );
   };
   
*/
