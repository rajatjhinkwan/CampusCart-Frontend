import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";

/* =========================
   Auto fit map to route
========================= */
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

const LiveMap = ({ from, to, driverLocation, showDriverMarker, onUserLocate }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [error, setError] = useState(null);
  const hasFrom = !!(from && Number.isFinite(from.lat) && Number.isFinite(from.lng));
  const hasTo = !!(to && Number.isFinite(to.lat) && Number.isFinite(to.lng));
  const hasDriver = !!(driverLocation && Number.isFinite(driverLocation.lat) && Number.isFinite(driverLocation.lng));
  const [driverTrail, setDriverTrail] = useState([]);
  const [locating, setLocating] = useState(false);

  /* =========================
     Icons
  ========================= */
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

  /* =========================
     Fetch route
  ========================= */
  useEffect(() => {
    if (!hasFrom || !hasTo) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        setError(null);

        const base =
          import.meta.env.VITE_OSRM_PROXY_BASE ||
          "/api/osrm";

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
          const photonBase = import.meta.env.VITE_PHOTON_PROXY_BASE || 'https://photon.komoot.io';
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

export default LiveMap;
