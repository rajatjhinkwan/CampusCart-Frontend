import { useState, useEffect, useRef } from 'react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { useUserStore } from '../../store/userStore';

const OpenRidesList = ({ onRideAccepted, filters = {}, sameInstitutionFilter, currentUserInstitution, onCountChange, onShowDetails }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRide, setAcceptingRide] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { user } = useUserStore();
  const isDriverApproved = !!(
    user?.role === 'driver' ||
    user?.settings?.selling?.driverApproved === true
  );
  const isDriverRegistered = registered || !!(user?.settings?.selling?.driverRegistered === true);
  const canAccept = !!(user?._id) && (isDriverApproved || isDriverRegistered);
  const registerAsDriver = async () => {
    try {
      const res = await axios.put('/api/users/me/settings', {
        selling: { driverRegistered: true }
      });
      const settings = res.data?.settings || {};
      const updated = { ...(user || {}), settings };
      useUserStore.setState({ user: updated });
      try {
        localStorage.setItem("userDetails", JSON.stringify(updated));
      } catch (e) {
        console.warn("persist driver flag failed", e);
      }
      setRegistered(true);
      toast.success('You are now registered as a driver.');
    } catch (err) {
      console.error('Driver registration error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit registration');
    }
  };

  const locationRef = useRef(null);

  const fetchOpenRides = async () => {
    try {
      const { latitude, longitude } = locationRef.current || {};
      const params = {};
      if (latitude && longitude) {
        params.lat = latitude;
        params.lng = longitude;
        params.radiusKm = 10;
      }

      const response = await axios.get('/api/rides/open', { params });
      setRides(response.data?.rides || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
      // toast.error('Failed to load available rides'); // Suppress frequent errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get location once on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationRef.current = position.coords;
          fetchOpenRides(); // Fetch immediately with location
        },
        (err) => {
          console.warn("Location access denied or failed", err);
          fetchOpenRides(); // Fetch without location
        },
        { timeout: 10000 }
      );
    } else {
      fetchOpenRides();
    }

    // Refresh rides every 30 seconds
    const interval = setInterval(fetchOpenRides, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof onCountChange === 'function') {
      onCountChange(rides.length);
    }
  }, [rides.length, onCountChange]);

  const handleAcceptRide = async (rideId) => {
    if (!user?._id) {
      toast.error('Please log in to accept rides');
      return;
    }
    if (!(isDriverApproved || isDriverRegistered)) {
      toast.error('Register as a driver to accept rides');
      return;
    }

    setAcceptingRide(rideId);
    try {
      const response = await axios.post(`/api/rides/${rideId}/accept`, {
        driverId: user._id
      });

      toast.success('Ride accepted successfully!');
      onRideAccepted && onRideAccepted(response.data.ride);

      // Remove the accepted ride from the list
      setRides(prev => prev.filter(ride => ride._id !== rideId));
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error(error.response?.data?.message || 'Failed to accept ride');
    } finally {
      setAcceptingRide(null);
    }
  };

  // Socket integration for real-time updates
  useEffect(() => {
    const token = useUserStore.getState().accessToken;
    const apiBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const newSocket = io(apiBase, {
      auth: { token }
    });

    // Listen for new ride events
    newSocket.on('newRide', () => {
      fetchOpenRides();
    });

    newSocket.on('rideAssigned', (payload) => {
      const { rideId } = payload || {};
      if (rideId) {
        setRides(prev => prev.filter(r => r._id !== rideId));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      height: 'calc(100vh - 160px)',
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    countBubble: {
      minWidth: '28px',
      height: '28px',
      borderRadius: '14px',
      backgroundColor: '#EEF2FF',
      color: '#3730A3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '14px',
    },
    cta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      backgroundColor: '#FFF7ED',
      border: '1px solid #FED7AA',
      color: '#9A3412',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    ctaButton: {
      backgroundColor: '#F59E0B',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '32px 0'
    },
    spinner: {
      width: '32px',
      height: '32px',
      border: '2px solid #e5e7eb',
      borderTop: '2px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto'
    },
    loadingText: {
      marginTop: '8px',
      color: '#6b7280'
    },
    noRidesText: {
      textAlign: 'center',
      padding: '32px 0',
      color: '#6b7280'
    },
    ridesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflowY: 'auto',
      paddingRight: '6px'
    },
    rideCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '12px',
      backgroundColor: '#ffffff'
    },
    rideHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    passengerInfo: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    passengerName: {
      fontSize: '16px',
      fontWeight: '600'
    },
    avatar: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #e5e7eb'
    },
    rating: {
      color: '#F59E0B',
      fontWeight: '700',
      marginLeft: '6px',
      fontSize: '14px'
    },
    seatsText: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px'
    },
    rideStats: {
      textAlign: 'right'
    },
    statText: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    locations: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px'
    },
    locationItem: {
      display: 'flex',
      alignItems: 'center'
    },
    locationDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      marginRight: '12px',
      flexShrink: 0
    },
    pickupDot: {
      backgroundColor: '#10b981'
    },
    dropoffDot: {
      backgroundColor: '#ef4444'
    },
    locationText: {
      fontSize: '14px'
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
      color: '#6b7280',
      fontSize: '13px'
    },
    acceptButton: {
      width: '100%',
      backgroundColor: '#2563EB',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    acceptButtonHover: {
      backgroundColor: '#1E40AF'
    },
    acceptButtonDisabled: {
      backgroundColor: '#d1d5db',
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    actionsRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px'
    },
    detailsButton: {
      backgroundColor: '#0F172A',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Available Rides</h2>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading available rides...</p>
        </div>
      </div>
    );
  }

  const applyFilters = (list) => {
    let filtered = list;
    const { origin, destination, passengers: minSeats } = filters || {};
    
    // Institution filter
    if (sameInstitutionFilter) {
      if (!currentUserInstitution) return [];
      filtered = filtered.filter(r => 
        r.passengerId?.institution && 
        r.passengerId.institution.trim().toLowerCase() === currentUserInstitution.trim().toLowerCase()
      );
    }

    if (origin && origin.trim()) {
      const q = origin.trim().toLowerCase();
      filtered = filtered.filter(r => (r.from?.address || '').toLowerCase().includes(q));
    }
    if (destination && destination.trim()) {
      const q = destination.trim().toLowerCase();
      filtered = filtered.filter(r => (r.to?.address || '').toLowerCase().includes(q));
    }
    if (minSeats && Number.isFinite(Number(minSeats))) {
      filtered = filtered.filter(r => (r.seatsRequested || 1) >= Number(minSeats));
    }
    return filtered;
  };

  const displayRides = applyFilters(rides);

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span>Available Rides</span>
        <div style={styles.countBubble}>{displayRides.length}</div>
      </div>
      {!canAccept && (
        <div style={styles.cta}>
          <span>{isDriverRegistered ? 'You are registered as a driver.' : 'Become a driver to accept rides.'}</span>
          {!isDriverRegistered && (
            <button
              style={styles.ctaButton}
              onClick={registerAsDriver}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97706')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F59E0B')}
            >
              Register as Driver
            </button>
          )}
        </div>
      )}

      {displayRides.length === 0 ? (
        <div style={styles.noRidesText}>
          <p>No rides available in your area</p>
        </div>
      ) : (
        <div style={styles.ridesList}>
          {displayRides.map((ride) => (
            <div key={ride._id} style={styles.rideCard}>
              <div style={styles.rideHeader}>
                <div style={styles.passengerInfo}>
                  <img
                    src={ride.passengerId?.avatar || 'https://via.placeholder.com/64x64.png?text=+'}
                    alt=""
                    style={styles.avatar}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={styles.passengerName}>
                        {ride.passengerId?.name || 'Anonymous Passenger'}
                      </h3>
                      {ride.passengerId?.institution && currentUserInstitution && 
                       ride.passengerId.institution.trim().toLowerCase() === currentUserInstitution.trim().toLowerCase() && (
                        <span style={{ fontSize: '10px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', border: '1px solid #93c5fd' }}>
                          SAME INSTITUTION
                        </span>
                      )}
                      <span style={styles.rating}>★ 4.8</span>
                    </div>
                    <p style={styles.seatsText}>
                      {ride.seatsRequested} seat{ride.seatsRequested > 1 ? 's' : ''} requested
                    </p>
                  </div>
                </div>
                <div style={styles.rideStats}>
                  <p style={styles.statText}>
                    {ride.distanceKm?.toFixed(1)} km
                  </p>
                  <p style={styles.statText}>
                    ~{ride.estimatedDurationMins} min
                  </p>
                </div>
              </div>

              <div style={styles.locations}>
                <div style={styles.locationItem}>
                  <div style={{ ...styles.locationDot, ...styles.pickupDot }}></div>
                  <span style={styles.locationText}>{ride.from.address}</span>
                </div>
                <div style={styles.locationItem}>
                  <div style={{ ...styles.locationDot, ...styles.dropoffDot }}></div>
                  <span style={styles.locationText}>{ride.to.address}</span>
                </div>
              </div>

              <div style={styles.metaRow}>
                <span>{new Date(ride.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span>👥 {ride.seatsRequested} • $ {ride.distanceKm ? Math.max(10, Math.round(2 + ride.distanceKm * 1)) : 10}</span>
              </div>

              <div style={styles.actionsRow}>
                <button
                  type="button"
                  style={styles.detailsButton}
                  onClick={() => onShowDetails && onShowDetails(ride)}
                >
                  Details
                </button>
                <button
                  onClick={() => handleAcceptRide(ride._id)}
                  disabled={acceptingRide === ride._id || !canAccept}
                  style={{
                    ...styles.acceptButton,
                    ...((acceptingRide === ride._id || !canAccept) ? styles.acceptButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (acceptingRide !== ride._id && canAccept) {
                      e.target.style.backgroundColor = styles.acceptButtonHover.backgroundColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (acceptingRide !== ride._id) {
                      e.target.style.backgroundColor = styles.acceptButton.backgroundColor;
                    }
                  }}
                >
                  {acceptingRide === ride._id ? 'Processing...' : (canAccept ? 'Request' : 'Driver Required')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenRidesList;
