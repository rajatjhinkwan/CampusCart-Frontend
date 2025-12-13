import React, { useState, useEffect } from 'react';
import RideRequestForm from '../../components/rides/RideRequestForm';
import OpenRidesList from '../../components/rides/OpenRidesList';
import LiveMap from '../../components/rides/LiveMap';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';

const Rides = () => {
  const [currentRide, setCurrentRide] = useState(null);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useUserStore();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io();
    setSocket(newSocket);

    // Listen for ride events
    newSocket.on('rideAssigned', (data) => {
      console.log('Ride assigned:', data);
      setAcceptedRide(data);
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

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#6b7280'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Ride Sharing</h1>
        <p style={styles.subtitle}>Request rides or become a driver</p>
      </div>

      <div style={styles.grid}>
        {/* Ride Request Form */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Request a Ride</h2>
          <RideRequestForm onRideRequested={handleRideRequested} />
        </div>

        {/* Available Rides */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Available Rides</h2>
          <OpenRidesList onRideAccepted={handleRideAccepted} />
        </div>

        {/* Live Map */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Live Map</h2>
          <LiveMap rides={[currentRide].filter(Boolean)} />
        </div>
      </div>

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
  );
};

export default Rides;
