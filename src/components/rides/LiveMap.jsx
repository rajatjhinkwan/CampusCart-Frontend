import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const LiveMap = ({ from, to, driverLocation, showDriverMarker = false }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      const { Map } = await loader.importLibrary('maps');
      const { DirectionsService, DirectionsRenderer } = await loader.importLibrary('routes');

      const mapOptions = {
        center: { lat: from.lat, lng: from.lng },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      const newMap = new Map(mapRef.current, mapOptions);
      setMap(newMap);

      const newDirectionsService = new DirectionsService();
      const newDirectionsRenderer = new DirectionsRenderer({
        map: newMap,
        suppressMarkers: true, // We'll add custom markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      setDirectionsService(newDirectionsService);
      setDirectionsRenderer(newDirectionsRenderer);

      // Add custom markers
      const fromMarker = new google.maps.Marker({
        position: { lat: from.lat, lng: from.lng },
        map: newMap,
        title: 'Pickup Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      const toMarker = new google.maps.Marker({
        position: { lat: to.lat, lng: to.lng },
        map: newMap,
        title: 'Drop-off Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#EF4444"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      setMarkers([fromMarker, toMarker]);

      // Calculate and display route
      calculateRoute(newDirectionsService, newDirectionsRenderer, from, to);
    };

    initMap();
  }, [from, to]);

  useEffect(() => {
    if (showDriverMarker && driverLocation && map) {
      // Update or create driver marker
      let driverMarker = markers.find(m => m.title === 'Driver Location');

      if (driverMarker) {
        driverMarker.setPosition({
          lat: driverLocation.lat,
          lng: driverLocation.lng
        });
      } else {
        driverMarker = new google.maps.Marker({
          position: { lat: driverLocation.lat, lng: driverLocation.lng },
          map: map,
          title: 'Driver Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#F59E0B"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });
        setMarkers(prev => [...prev, driverMarker]);
      }
    }
  }, [driverLocation, showDriverMarker, map, markers]);

  const calculateRoute = (service, renderer, origin, destination) => {
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
        provideRouteAlternatives: false
      },
      (response, status) => {
        if (status === 'OK') {
          renderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
    </div>
  );
};

export default LiveMap;
