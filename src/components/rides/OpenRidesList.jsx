import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { haversineDistance } from '../../utils/haversine';
import useUserStore from '../../store/userStore';

const OpenRidesList = ({ onRideAccepted }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRide, setAcceptingRide] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useUserStore();

  const fetchOpenRides = async () => {
    try {
      // Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await axios.get('/api/rides/open', {
          params: { lat: latitude, lng: longitude, radiusKm: 10 }
        });

        setRides(response.data?.rides || []);
      }, (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location');
      });
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to load available rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenRides();

    // Refresh rides every 30 seconds
    const interval = setInterval(fetchOpenRides, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRide = async (rideId) => {
    if (!user?._id) {
      toast.error('Please log in to accept rides');
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
    const newSocket = io();
    setSocket(newSocket);

    // Listen for new ride events
    newSocket.on('newRide', (rideData) => {
      // Add new ride to the list if within range
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Check if the new ride is within 10km
        const distance = haversineDistance([latitude, longitude], [rideData.from.lat, rideData.from.lng]);
        if (distance <= 10) {
          setRides(prev => [rideData, ...prev]);
        }
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px'
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
      gap: '16px'
    },
    rideCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    },
    rideHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    passengerInfo: {
      flex: 1
    },
    passengerName: {
      fontSize: '18px',
      fontWeight: '600'
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
    acceptButton: {
      width: '100%',
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    acceptButtonHover: {
      backgroundColor: '#15803d'
    },
    acceptButtonDisabled: {
      backgroundColor: '#d1d5db',
      cursor: 'not-allowed'
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Available Rides</h2>

      {rides.length === 0 ? (
        <div style={styles.noRidesText}>
          <p>No rides available in your area</p>
        </div>
      ) : (
        <div style={styles.ridesList}>
          {rides.map((ride) => (
            <div key={ride._id} style={styles.rideCard}>
              <div style={styles.rideHeader}>
                <div style={styles.passengerInfo}>
                  <h3 style={styles.passengerName}>
                    {ride.passengerId?.name || 'Anonymous Passenger'}
                  </h3>
                  <p style={styles.seatsText}>
                    {ride.seatsRequested} seat{ride.seatsRequested > 1 ? 's' : ''} requested
                  </p>
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
                  <div style={{...styles.locationDot, ...styles.pickupDot}}></div>
                  <span style={styles.locationText}>{ride.from.address}</span>
                </div>
                <div style={styles.locationItem}>
                  <div style={{...styles.locationDot, ...styles.dropoffDot}}></div>
                  <span style={styles.locationText}>{ride.to.address}</span>
                </div>
              </div>

              <button
                onClick={() => handleAcceptRide(ride._id)}
                disabled={acceptingRide === ride._id}
                style={{
                  ...styles.acceptButton,
                  ...(acceptingRide === ride._id ? styles.acceptButtonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (acceptingRide !== ride._id) {
                    e.target.style.backgroundColor = styles.acceptButtonHover.backgroundColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (acceptingRide !== ride._id) {
                    e.target.style.backgroundColor = styles.acceptButton.backgroundColor;
                  }
                }}
              >
                {acceptingRide === ride._id ? 'Accepting...' : 'Accept Ride'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenRidesList;
