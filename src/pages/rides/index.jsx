import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import RideRequestForm from '../../components/rides/RideRequestForm';
import OpenRidesList from '../../components/rides/OpenRidesList';
import LiveMap from '../../components/rides/LiveMap';
import io from 'socket.io-client';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';
import { useUserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const Rides = () => {
  const [currentRide, setCurrentRide] = useState(null);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [previewFrom, setPreviewFrom] = useState(null);
  const [previewTo, setPreviewTo] = useState(null);
  const { user } = useUserStore();
  const [filters, setFilters] = useState({ origin: '', destination: '', passengers: 1 });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showSameInstitution, setShowSameInstitution] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = useUserStore.getState().accessToken;
    const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const newSocket = io(apiBase, {
      auth: { token }
    });

    // Listen for ride events
    newSocket.on('rideAssigned', (data) => {
      console.log('Ride assigned:', data);
      setAcceptedRide(data);
      if (data?.rideId) {
        navigate(`/rides/live/${data.rideId}`);
      }
    });

    newSocket.on('rideStarted', (data) => {
      console.log('Ride started:', data);
    });

    newSocket.on('rideCompleted', (data) => {
      console.log('Ride completed:', data);
      setAcceptedRide(null);
    });

    newSocket.on('rideCancelled', (data) => {
      console.log('Ride cancelled:', data);
      setAcceptedRide(null);
    });

    newSocket.on('driverLocationUpdate', (data) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  // Restore active ride state on mount
  useEffect(() => {
    const fetchActiveRides = async () => {
      if (!user?._id) return;
      try {
        const { data } = await axios.get(`/api/rides/user/${user._id}`);
        // Find the most recent active ride
        const activeRide = data.rides.find(r => 
          ['OPEN', 'ASSIGNED', 'ON_ROUTE'].includes(r.status)
        );
        
        if (activeRide) {
          console.log('Restored active ride:', activeRide);
          
          // If I am the passenger
          if (activeRide.passengerId._id === user._id) {
            setCurrentRide(activeRide);
            setPreviewFrom(activeRide.from);
            setPreviewTo(activeRide.to);
          }
          
          // If the ride is already assigned (whether I am passenger or driver)
          if (['ASSIGNED', 'ON_ROUTE'].includes(activeRide.status)) {
            setAcceptedRide(activeRide);
            // If I am the driver, also set preview
            if (activeRide.assignedDriverId?._id === user._id) {
               setPreviewFrom(activeRide.from);
               setPreviewTo(activeRide.to);
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore active ride:', err);
      }
    };

    fetchActiveRides();
  }, [user?._id]);

  // Removed personal rides section to simplify UI per design

  const handleLocationsChange = (from, to) => {
    setPreviewFrom(from || null);
    setPreviewTo(to || null);
  };

  const handleRideRequested = async (ride) => {
    if (!user?._id) {
      toast.error('Please log in to request a ride');
      return;
    }

    try {
      const rideData = {
        passengerId: user._id,
        from: ride.from,
        to: ride.to,
        seatsRequested: ride.seatsRequested
      };

      setPreviewFrom(ride.from);
      setPreviewTo(ride.to);
      const response = await axios.post('/api/rides', rideData);
      setCurrentRide(response.data.ride);
      toast.success('Ride requested successfully!');
      console.log('Ride requested:', response.data.ride);
    } catch (error) {
      console.error('Error requesting ride:', error);
      toast.error(error.response?.data?.message || 'Failed to request ride');
    }
  };

  const handleRideAccepted = (ride) => {
    setAcceptedRide(ride);
    console.log('Ride accepted:', ride);
    if (ride?._id) {
      navigate(`/rides/live/${ride._id}`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#EEF2FF',
    },
    topBar: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative'
    },
    liveBadge: {
      position: 'absolute',
      right: '24px',
      top: '26px',
      backgroundColor: '#ECFDF5',
      color: '#047857',
      padding: '6px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      border: '1px solid #A7F3D0'
    },
    layout: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 20px',
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: '16px'
    },
    leftPanel: {},
    rightPanel: {
      position: 'relative'
    },
    mapControls: {
      position: 'absolute',
      right: '12px',
      top: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 1000
    },
    controlButton: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontWeight: '700',
      color: '#1f2937'
    },
    ctaButton: {
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '24px',
      backgroundColor: '#2563EB',
      color: '#ffffff',
      border: 'none',
      padding: '14px 20px',
      borderRadius: '28px',
      boxShadow: '0 10px 20px rgba(37,99,235,0.35)',
      fontWeight: '700',
      cursor: 'pointer'
    },
    modalBackdrop: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },
    modalCard: {
      width: '650px',
      maxWidth: '95vw',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontWeight: '700',
      fontSize: '18px'
    },
    closeBtn: {
      backgroundColor: '#0F172A',
      color: '#ffffff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topBar}>
          <RideRequestForm
            compact
            onSearch={(f) => setFilters(f)}
            onLocationsChange={handleLocationsChange}
            onRideRequested={handleRideRequested}
          />
          <div style={styles.liveBadge}>
            Live • {liveCount} active rides
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.leftPanel}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
              <input
                type="checkbox"
                id="sameInstitution"
                checked={showSameInstitution}
                onChange={(e) => setShowSameInstitution(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="sameInstitution" style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', cursor: 'pointer' }}>
                Show from my institution only {user?.institution ? `(${user.institution})` : ''}
              </label>
            </div>
            <OpenRidesList
              onRideAccepted={handleRideAccepted}
              filters={filters}
              sameInstitutionFilter={showSameInstitution}
              currentUserInstitution={user?.institution}
              onCountChange={(n) => setLiveCount(n)}
              onShowDetails={(ride) => {
                setSelectedRide(ride);
                setPreviewFrom({ lat: ride.from.lat, lng: ride.from.lng, address: ride.from.address });
                setPreviewTo({ lat: ride.to.lat, lng: ride.to.lng, address: ride.to.address });
              }}
            />
            <div style={{ marginTop: '12px', color: '#6b7280', fontSize: '12px' }}>
              Scroll to view more rides
            </div>
          </div>
          <div style={styles.rightPanel}>
            {selectedRide && (
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                padding: '12px',
                zIndex: 1000,
                width: '320px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700' }}>{selectedRide.passengerId?.name || 'Passenger'}</div>
                  <button
                    onClick={() => setSelectedRide(null)}
                    style={{ background: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Close
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  ★ 4.8 • {selectedRide.seatsRequested} seats • {selectedRide.distanceKm?.toFixed(1)} km • ~{selectedRide.estimatedDurationMins} min
                </div>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  From: {selectedRide.from.address}
                </div>
                <div style={{ fontSize: '13px', marginBottom: '12px' }}>
                  To: {selectedRide.to.address}
                </div>
                <button
                  onClick={() => setSelectedRide(null)}
                  style={{ width: '100%', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: 700 }}
                >
                  View Route
                </button>
              </div>
            )}
            {currentRide || previewFrom ? (
              <LiveMap
                from={currentRide ? currentRide.from : previewFrom}
                to={currentRide ? currentRide.to : previewTo}
                driverLocation={driverLocation}
                showDriverMarker={!!acceptedRide}
                onUserLocate={(loc) => {
                  setPreviewFrom(loc);
                }}
              />
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#6b7280' }}>Search to preview the route</p>
              </div>
            )}

          </div>
        </div>

        <button
          style={styles.ctaButton}
          onClick={() => setShowRequestModal(true)}
        >
          Request a Ride
        </button>

        {showRequestModal && (
          <div style={styles.modalBackdrop} onClick={() => setShowRequestModal(false)}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <span>Request a Ride</span>
                <button style={styles.closeBtn} onClick={() => setShowRequestModal(false)}>Close</button>
              </div>
              <RideRequestForm
                onRideRequested={async (r) => {
                  await handleRideRequested(r);
                  setShowRequestModal(false);
                }}
                onLocationsChange={handleLocationsChange}
              />
            </div>
          </div>
        )}

        {/* Current Ride Status - Searching */}
        {!acceptedRide && currentRide && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '300px'
          }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Requesting Ride...</h3>
            <p style={{ fontSize: '14px' }}>
              Your ride request is live.
            </p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>
              From: {currentRide.from?.address}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>Waiting for drivers</span>
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Current Ride Status */}
        {acceptedRide && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '300px'
          }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Active Ride</h3>
            <p style={{ fontSize: '14px' }}>
              Status: {acceptedRide.status || 'Accepted'}
            </p>
            <p style={{ fontSize: '14px' }}>
              From: {acceptedRide.from?.address}
            </p>
            <p style={{ fontSize: '14px' }}>
              To: {acceptedRide.to?.address}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Rides;
