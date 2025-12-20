import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LiveMap from '../../components/rides/LiveMap';
import axios from '../../lib/axios';
import { io } from 'socket.io-client';
import { useUserStore } from '../../store/userStore';
import toast from 'react-hot-toast';

const LiveRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [ride, setRide] = useState(null);
  const [driverLoc, setDriverLoc] = useState(null);
  const [passengerLoc, setPassengerLoc] = useState(null);
  const [etaMins, setEtaMins] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [pickupRouteCoords, setPickupRouteCoords] = useState([]);
  const [showFareModal, setShowFareModal] = useState(false);
  
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  const apiBase = useMemo(() => (import.meta.env.VITE_API_BASE_URL || window.location.origin), []);

  // Helper to check if current user is driver
  const isDriver = useMemo(() => {
    if (!ride || !user) return false;
    const driverId = ride.assignedDriverId?._id || ride.assignedDriverId;
    const userId = user._id || user.id;
    return String(driverId) === String(userId);
  }, [ride, user]);

  useEffect(() => {
    const loadRide = async () => {
      try {
        const res = await axios.get(`/api/rides/${rideId}`);
        const r = res.data?.ride || res.data;
        setRide(r);
        if (r.status === 'COMPLETED') {
            setShowFareModal(true);
        }
      } catch {
        toast.error('Failed to load ride');
      }
    };
    loadRide();
  }, [rideId]);

  useEffect(() => {
    const token = useUserStore.getState().accessToken;
    const s = io(apiBase, { auth: { token } });
    socketRef.current = s;
    s.on('driverLocationUpdate', (payload) => {
      if (!payload || String(payload.rideId) !== String(rideId)) return;
      const { lat, lng } = payload;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setDriverLoc({ lat, lng });
      }
    });
    s.on('rideStatusUpdate', (p) => {
      if (p && String(p.rideId) === String(rideId)) {
        setRide((r) => r ? { ...r, status: p.status } : r);
      }
    });
    s.on('rideStarted', (p) => {
        if (p && String(p.rideId) === String(rideId)) {
            setRide((r) => r ? { ...r, status: 'ON_ROUTE', startedAt: new Date() } : r);
            toast.success('Ride is now ON ROUTE');
        }
    });
    s.on('rideCancelled', (p) => {
        if (p && String(p.rideId) === String(rideId)) {
            setRide((r) => r ? { ...r, status: 'CANCELLED' } : r);
            toast.error(`Ride cancelled: ${p.reason || 'No reason'}`);
            if (p.cancelledBy !== user?._id) {
                navigate('/rides/accept');
            }
        }
    });
    s.on('rideCompleted', (p) => {
        if (p && String(p.rideId) === String(rideId)) {
            setRide((r) => r ? { ...r, status: 'COMPLETED', fare: p.fare, actualDurationMins: p.duration } : r);
            setShowFareModal(true);
        }
    });

    return () => {
      s.disconnect();
    };
  }, [apiBase, rideId]);

  useEffect(() => {
    const base = import.meta.env.VITE_OSRM_PROXY_BASE || '/api/osrm';
    const compute = async () => {
      const isPassenger = ride && user && (ride.passengerId?._id === (user._id || user.id));
      const target = isPassenger
        ? passengerLoc
        : (ride?.from ? { lat: ride.from.lat, lng: ride.from.lng } : null);
      if (!driverLoc || !target) return;
      try {
        const url = `${base}/route?a_lon=${driverLoc.lng}&a_lat=${driverLoc.lat}&b_lon=${target.lng}&b_lat=${target.lat}&overview=full&geometries=geojson`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP_${res.status}`);
        const data = await res.json();
        const r = data?.routes?.[0];
        if (r) {
          const meters = r.distance || 0;
          const seconds = r.duration || 0;
          setDistanceKm(Math.round(meters / 10) / 100);
          setEtaMins(Math.max(1, Math.round(seconds / 60)));
          const coords = Array.isArray(r.geometry?.coordinates)
            ? r.geometry.coordinates.map(([lng, lat]) => [lat, lng])
            : [];
          setPickupRouteCoords(coords);
        }
      } catch (err) {
        console.warn(err);
        try {
          const { haversineDistance, estimateETAmins } = await import('../../utils/haversine.js');
          const d = haversineDistance([driverLoc.lat, driverLoc.lng], [target.lat, target.lng]);
          setDistanceKm(Math.round(d * 100) / 100);
          setEtaMins(estimateETAmins(d));
          setPickupRouteCoords([]);
        } catch (e2) {
          console.warn(e2);
        }
      }
    };
    compute();
  }, [driverLoc, passengerLoc, ride, user]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    try {
      const id = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords || {};
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          setPassengerLoc({ lat: latitude, lng: longitude });
        }
      }, (err) => { console.warn(err); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
      watchIdRef.current = id;
    } catch (err) { console.warn(err); }
    return () => {
      const id = watchIdRef.current;
      if (id && navigator.geolocation && navigator.geolocation.clearWatch) {
        try { navigator.geolocation.clearWatch(id); } catch (err) { console.warn(err); }
      }
    };
  }, []);

  const handleBack = () => {
    navigate('/rides/accept');
  };

  const handleStartRide = async () => {
    try {
        setRide(prev => ({ ...prev, status: 'ON_ROUTE', startedAt: new Date() }));
        await axios.post(`/api/rides/${rideId}/start`);
        toast.success('Ride started');
    } catch (err) {
        setRide(prev => ({ ...prev, status: 'ASSIGNED' })); // revert
        toast.error('Failed to start ride');
    }
  };

  const handleCompleteRide = async () => {
    try {
        await axios.post(`/api/rides/${rideId}/complete`, {
            actualDurationMins: etaMins // Using estimated as actual for simplicity, or could calculate diff
        });
        toast.success('Ride completed');
    } catch (err) {
        toast.error('Failed to complete ride');
    }
  };

  const handleCancelRide = async () => {
      if(!window.confirm("Are you sure you want to cancel?")) return;
      try {
          await axios.post(`/api/rides/${rideId}/cancel`, { reason: 'Driver cancelled' });
          toast.success('Ride cancelled');
          navigate('/rides/accept');
      } catch (err) {
          toast.error('Failed to cancel ride');
      }
  }

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '20px', position: 'relative' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    title: { fontSize: 24, fontWeight: 800, color: '#111827' },
    backBtn: { border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: 20 },
    actionBtn: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'opacity 0.2s'
    },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: 'white', padding: '30px', borderRadius: '24px',
        width: '90%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  };

  if (!ride) return <div style={{padding: 20}}>Loading ride...</div>;

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.title}>Live Ride</div>
          <button style={styles.backBtn} onClick={handleBack}>Back</button>
        </div>
        <div style={styles.grid}>
          <div style={styles.card}>
            <LiveMap
              from={ride?.from ? { lat: ride.from?.lat, lng: ride.from?.lng } : null}
              to={ride?.to ? { lat: ride.to?.lat, lng: ride.to?.lng } : null}
              driverLocation={driverLoc}
              passengerLocation={ride && user && (ride.passengerId?._id === (user._id || user.id)) ? passengerLoc : null}
              pickupCoords={pickupRouteCoords}
              showDriverMarker={true}
            />
          </div>
          
          <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <img src={ride.passengerId?.avatar || "https://via.placeholder.com/40"} alt="" style={{width: 40, height: 40, borderRadius: '50%'}} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{ride.passengerId?.name || 'Passenger'}</div>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>Passenger</div>
                    </div>
                </div>
                <div style={{ 
                    padding: '6px 12px', 
                    borderRadius: 20, 
                    fontSize: 12, 
                    fontWeight: 600,
                    backgroundColor: ride.status === 'ON_ROUTE' ? '#dbeafe' : '#f3f4f6',
                    color: ride.status === 'ON_ROUTE' ? '#1e40af' : '#374151'
                }}>
                    {ride.status}
                </div>
              </div>
              
              <div style={{ fontSize: 15, color: '#111827', marginBottom: 8 }}>
                <strong>From:</strong> {ride.from?.address}
              </div>
              <div style={{ fontSize: 15, color: '#111827', marginBottom: 16 }}>
                <strong>To:</strong> {ride.to?.address}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f9fafb', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>EST. TIME</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{etaMins ? `${etaMins} min` : '—'}</div>
                </div>
                <div style={{ padding: 12, background: '#f9fafb', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>DISTANCE</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{distanceKm != null ? `${distanceKm} km` : '—'}</div>
                </div>
              </div>

              {/* Driver Controls */}
              {isDriver && ride.status !== 'COMPLETED' && ride.status !== 'CANCELLED' && (
                  <div style={{ marginTop: 20 }}>
                      {ride.status === 'ASSIGNED' && (
                          <button 
                            onClick={handleStartRide}
                            style={{ ...styles.actionBtn, backgroundColor: '#10b981' }}
                          >
                              Start Ride
                          </button>
                      )}
                      
                      {ride.status === 'ON_ROUTE' && (
                          <button 
                            onClick={handleCompleteRide}
                            style={{ ...styles.actionBtn, backgroundColor: '#000000' }}
                          >
                              Complete Ride
                          </button>
                      )}

                      <button 
                        onClick={handleCancelRide}
                        style={{ ...styles.actionBtn, backgroundColor: '#ef4444', marginTop: 12 }}
                      >
                          Cancel Ride
                      </button>
                  </div>
              )}
          </div>
        </div>
      </main>

      {/* Fare Summary Modal */}
      {showFareModal && (
          <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                  <div style={{fontSize: 40, marginBottom: 10}}>🎉</div>
                  <h2 style={{fontSize: 24, fontWeight: 800, marginBottom: 8}}>Ride Completed!</h2>
                  <p style={{color: '#6b7280', marginBottom: 24}}>Here is the trip summary</p>
                  
                  <div style={{marginBottom: 20}}>
                      <div style={{fontSize: 36, fontWeight: 800, color: '#10b981'}}>
                          ${ride.fare || '0.00'}
                      </div>
                      <div style={{fontSize: 14, color: '#6b7280'}}>
                          {isDriver ? 'Collect Cash' : 'Total Fare'}
                      </div>
                  </div>

                  <div style={{display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30}}>
                      <div>
                          <div style={{fontWeight: 700}}>{ride.distanceKm} km</div>
                          <div style={{fontSize: 12, color: '#6b7280'}}>Distance</div>
                      </div>
                      <div>
                          <div style={{fontWeight: 700}}>{ride.actualDurationMins} min</div>
                          <div style={{fontSize: 12, color: '#6b7280'}}>Duration</div>
                      </div>
                  </div>

                  <button 
                    onClick={() => navigate(isDriver ? '/rides/accept' : '/rides')}
                    style={{...styles.actionBtn, backgroundColor: '#2563eb', marginTop: 0}}
                  >
                      {isDriver ? 'Find New Rides' : 'Close'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default LiveRide;
