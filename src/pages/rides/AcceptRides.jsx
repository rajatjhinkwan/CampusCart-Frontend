import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import OpenRidesList from '../../components/rides/OpenRidesList';
import LiveMap from '../../components/rides/LiveMap';
import { useUserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../lib/axios';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places', 'geometry'];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const DEFAULT_OSRM = `${API_BASE}/api/osrm`;

const AcceptRides = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [selectedRide, setSelectedRide] = useState(null);
  const [showSameInstitution, setShowSameInstitution] = useState(false);
  const [detailsDistanceKm, setDetailsDistanceKm] = useState(null);
  const [detailsEtaMins, setDetailsEtaMins] = useState(null);
  const [detailsRoute, setDetailsRoute] = useState([]);
  const [isAccepting, setIsAccepting] = useState(false);

  const isDriverApproved = !!(
    user?.role === 'driver' ||
    user?.settings?.selling?.driverApproved === true
  );
  const isDriverRegistered = !!(user?.settings?.selling?.driverRegistered === true);
  const canAccept = !!(user?._id) && (isDriverApproved || isDriverRegistered);

  const handleRideAccepted = (ride) => {
    toast.success(`You have accepted the ride for ${ride.passengerId?.name || 'the passenger'}`);
    navigate(`/rides/live/${ride._id}`);
  };

  const onAcceptFromModal = async () => {
    if (!selectedRide) return;
    if (!user?._id) {
        toast.error('Please log in to accept rides');
        return;
    }
    if (!canAccept) {
        toast.error('Register as a driver to accept rides');
        return;
    }

    setIsAccepting(true);
    try {
        const response = await axios.post(`/api/rides/${selectedRide._id}/accept`, {
            driverId: user._id
        });
        handleRideAccepted(response.data.ride);
    } catch (error) {
        console.error('Error accepting ride:', error);
        toast.error(error.response?.data?.message || 'Failed to accept ride');
    } finally {
        setIsAccepting(false);
    }
  };

  const handleShowDetails = (ride) => {
    setSelectedRide(ride);
  };

  const closeDetails = () => {
    setSelectedRide(null);
    setDetailsDistanceKm(null);
    setDetailsEtaMins(null);
    setDetailsRoute([]);
  };

  useEffect(() => {
    const compute = async () => {
      if (!selectedRide || !selectedRide.from || !selectedRide.to || !isLoaded || !window.google) return;
      const a = selectedRide.from;
      const b = selectedRide.to;
      if (!Number.isFinite(a.lat) || !Number.isFinite(a.lng) || !Number.isFinite(b.lat) || !Number.isFinite(b.lng)) return;
      
      try {
        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
            origin: { lat: a.lat, lng: a.lng },
            destination: { lat: b.lat, lng: b.lng },
            travelMode: window.google.maps.TravelMode.DRIVING
        });

        if (result.routes && result.routes.length > 0) {
            const leg = result.routes[0].legs[0];
            const distKm = leg.distance.value / 1000;
            const durMins = Math.round(leg.duration.value / 60);
            
            setDetailsDistanceKm(distKm);
            setDetailsEtaMins(durMins);
            // Route geometry is handled by LiveMap via DirectionsRenderer, 
            // but if we need coords we can decode overview_polyline
            // For now, LiveMap handles the visual route.
        }
      } catch (e) { 
          console.warn("Google Directions failed", e);
          // Fallback to straight line
          try {
             const fromLoc = new window.google.maps.LatLng(a.lat, a.lng);
             const toLoc = new window.google.maps.LatLng(b.lat, b.lng);
             const distMeters = window.google.maps.geometry.spherical.computeDistanceBetween(fromLoc, toLoc);
             setDetailsDistanceKm(distMeters / 1000);
             setDetailsEtaMins(Math.round((distMeters / 1000) * 2)); // Rough estimate 30km/h
          } catch (err) { console.warn(err); }
      }
    };
    compute();
  }, [selectedRide, isLoaded]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb', // gray-50
    },
    main: {
      maxWidth: '1280px', // max-w-7xl
      margin: '0 auto',
      padding: '32px 16px', // py-8 px-4
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    // Media query handling via JS is tricky, but for basic layout we can assume flex column for mobile and row for desktop if we want, 
    // but the original had md:flex-row. Since we are doing inline styles, we might lose responsiveness without a hook or library.
    // However, the user asked for inline styles. I'll stick to a simple flex layout that works reasonably well.
    // To maintain some responsiveness without media queries in inline styles, we can use flex-wrap.
    flexContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
    },
    leftPanel: {
      flex: '1',
      minWidth: '300px',
    },
    header: {
      marginBottom: '24px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    },
    title: {
      fontSize: '24px', // text-2xl
      fontWeight: '700', // font-bold
      color: '#111827', // text-gray-900
      margin: 0,
    },
    subtitle: {
      color: '#4b5563', // text-gray-600
      marginTop: '4px',
      margin: 0,
    },
    filterBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#ffffff',
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      accentColor: '#2563EB', // blue-600
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151', // text-gray-700
      cursor: 'pointer',
    },
    listContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    listWrapper: {
        height: 'calc(100vh - 250px)',
        minHeight: '500px',
    },
    
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      overflowY: 'auto',
      backgroundColor: 'rgba(107, 114, 128, 0.75)', // gray-500 bg-opacity-75
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
      transform: 'transition-all',
      width: '100%',
      maxWidth: '512px', // max-w-lg
    },
    modalBody: {
      padding: '24px', // p-6
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '16px',
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB', // gray-50
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    userName: {
        fontWeight: '600',
        color: '#111827',
        margin: 0,
    },
    rating: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0,
    },
    rideCost: {
        textAlign: 'right',
    },
    price: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    seats: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0,
    },
    locations: {
        borderLeft: '2px solid #E5E7EB',
        marginLeft: '8px',
        paddingLeft: '16px',
        paddingTop: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    locationItem: {
        position: 'relative',
    },
    dotPickup: {
        position: 'absolute',
        left: '-21px',
        top: '4px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#22C55E', // green-500
        border: '2px solid white',
    },
    dotDropoff: {
        position: 'absolute',
        left: '-21px',
        top: '4px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#EF4444', // red-500
        border: '2px solid white',
    },
    locationLabel: {
        fontSize: '12px',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        margin: 0,
    },
    locationAddress: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#111827',
        margin: 0,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginTop: '24px',
    },
    statBoxBlue: {
        backgroundColor: '#EFF6FF', // blue-50
        padding: '12px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    statBoxIndigo: {
        backgroundColor: '#EEF2FF', // indigo-50
        padding: '12px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    statLabelBlue: {
        fontSize: '12px',
        color: '#2563EB',
        fontWeight: '600',
        margin: 0,
    },
    statValueBlue: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1E3A8A', // blue-900
        margin: 0,
    },
    statLabelIndigo: {
        fontSize: '12px',
        color: '#4F46E5', // indigo-600
        fontWeight: '600',
        margin: 0,
    },
    statValueIndigo: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#312E81', // indigo-900
        margin: 0,
    },
    modalFooter: {
        backgroundColor: '#F9FAFB',
        padding: '12px 24px',
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    closeButton: {
        display: 'inline-flex',
        justifyContent: 'center',
        borderRadius: '6px',
        border: '1px solid #D1D5DB',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: '8px 16px',
        backgroundColor: 'white',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        cursor: 'pointer',
        width: 'auto',
    },
    acceptButton: {
        display: 'inline-flex',
        justifyContent: 'center',
        borderRadius: '6px',
        border: '1px solid transparent',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: '8px 16px',
        backgroundColor: '#10B981', // green-500
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        cursor: 'pointer',
        width: 'auto',
        marginLeft: '12px',
    },
    disabledButton: {
        opacity: 0.5,
        cursor: 'not-allowed',
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <div style={styles.flexContainer}>
          
          {/* Main Content - Ride List */}
          <div style={styles.leftPanel}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>Accept Rides</h1>
                <p style={styles.subtitle}>Find and accept ride requests near you</p>
              </div>
              
              <div style={styles.filterBox}>
                 <input
                    type="checkbox"
                    id="sameInstitutionPage"
                    checked={showSameInstitution}
                    onChange={(e) => setShowSameInstitution(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <label htmlFor="sameInstitutionPage" style={styles.label}>
                    {user?.institution ? `My Institution Only (${user.institution})` : 'My Institution Only'}
                  </label>
              </div>
            </div>

            <div style={styles.listContainer}>
               {/* We wrap OpenRidesList to control its height or layout if needed */}
               <div style={styles.listWrapper}>
                  <OpenRidesList
                    onRideAccepted={handleRideAccepted}
                    sameInstitutionFilter={showSameInstitution}
                    currentUserInstitution={user?.institution}
                    onShowDetails={handleShowDetails}
                    style={{ height: '100%', boxShadow: 'none', border: 'none' }}
                  />
               </div>
            </div>
          </div>

          {/* Side Panel / Details Modal */}
          {selectedRide && (
            <div style={styles.modalOverlay} onClick={closeDetails}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalBody}>
                    <h3 style={styles.modalTitle}>
                        Ride Details
                    </h3>
                    
                    <div style={styles.modalHeader}>
                        <div style={styles.userInfo}>
                            <img 
                                src={selectedRide.passengerId?.avatar || 'https://via.placeholder.com/40'} 
                                alt="" 
                                style={styles.avatar}
                            />
                            <div>
                                <p style={styles.userName}>{selectedRide.passengerId?.name || 'Passenger'}</p>
                                <p style={styles.rating}>★ 4.8 Rating</p>
                            </div>
                        </div>
                        <div style={styles.rideCost}>
                            <p style={styles.price}>${selectedRide.distanceKm ? Math.max(10, Math.round(2 + selectedRide.distanceKm * 1)) : 10}</p>
                            <p style={styles.seats}>{selectedRide.seatsRequested} Seat{selectedRide.seatsRequested > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div style={styles.locations}>
                        <div style={styles.locationItem}>
                            <div style={styles.dotPickup}></div>
                            <p style={styles.locationLabel}>Pickup</p>
                            <p style={styles.locationAddress}>{selectedRide.from?.address}</p>
                        </div>
                        <div style={styles.locationItem}>
                            <div style={styles.dotDropoff}></div>
                            <p style={styles.locationLabel}>Dropoff</p>
                            <p style={styles.locationAddress}>{selectedRide.to?.address}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 12, height: 240, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <LiveMap
                        from={selectedRide?.from ? { lat: selectedRide.from.lat, lng: selectedRide.from.lng } : null}
                        to={selectedRide?.to ? { lat: selectedRide.to.lat, lng: selectedRide.to.lng } : null}
                        showDriverMarker={false}
                        passengerLocation={null}
                        driverLocation={null}
                        pickupCoords={detailsRoute}
                      />
                    </div>

                    <div style={styles.statsGrid}>
                        <div style={styles.statBoxBlue}>
                            <p style={styles.statLabelBlue}>DISTANCE</p>
                            <p style={styles.statValueBlue}>{(detailsDistanceKm != null ? detailsDistanceKm : selectedRide.distanceKm)?.toFixed ? (detailsDistanceKm != null ? detailsDistanceKm : selectedRide.distanceKm).toFixed(1) : (detailsDistanceKm != null ? detailsDistanceKm : selectedRide.distanceKm)} km</p>
                        </div>
                        <div style={styles.statBoxIndigo}>
                            <p style={styles.statLabelIndigo}>EST. TIME</p>
                            <p style={styles.statValueIndigo}>{detailsEtaMins != null ? detailsEtaMins : (selectedRide.estimatedDurationMins || '—')} min</p>
                        </div>
                    </div>
                  </div>
                  
                  <div style={styles.modalFooter}>
                    <button 
                      type="button" 
                      style={styles.closeButton}
                      onClick={closeDetails}
                    >
                      Close
                    </button>
                  </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcceptRides;
