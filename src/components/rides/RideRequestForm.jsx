import React, { useState, useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const RideRequestForm = ({ onRideRequested }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [fromCoords, setFromCoords] = useState(null);
    const [toCoords, setToCoords] = useState(null);
    const [loading, setLoading] = useState(false);

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    useEffect(() => {
        const initAutocomplete = async () => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
                libraries: ['places']
            });

            await loader.importLibrary('places');

            // Initialize autocomplete for 'from' input
            const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'us' } // Adjust country as needed
            });

            fromAutocomplete.addListener('place_changed', () => {
                const place = fromAutocomplete.getPlace();
                if (place.geometry) {
                    setFrom(place.formatted_address);
                    setFromCoords({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    });
                }
            });

            // Initialize autocomplete for 'to' input
            const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'us' } // Adjust country as needed
            });

            toAutocomplete.addListener('place_changed', () => {
                const place = toAutocomplete.getPlace();
                if (place.geometry) {
                    setTo(place.formatted_address);
                    setToCoords({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    });
                }
            });
        };

        initAutocomplete();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fromCoords || !toCoords) {
            alert('Please select valid addresses from the dropdown suggestions');
            return;
        }

        setLoading(true);

        const rideRequest = {
            from: {
                address: from,
                lat: fromCoords.lat,
                lng: fromCoords.lng
            },
            to: {
                address: to,
                lat: toCoords.lat,
                lng: toCoords.lng
            },
            seatsRequested: parseInt(passengers),
        };

        try {
            await onRideRequested(rideRequest);
            // Reset form
            setFrom('');
            setTo('');
            setPassengers(1);
            setFromCoords(null);
            setToCoords(null);
        } catch (error) {
            console.error('Error requesting ride:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label htmlFor="from" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                    From:
                </label>
                <input
                    ref={fromInputRef}
                    type="text"
                    id="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Enter pickup location"
                    required
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                    }}
                />
            </div>
            <div>
                <label htmlFor="to" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                    To:
                </label>
                <input
                    ref={toInputRef}
                    type="text"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Enter destination"
                    required
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                    }}
                />
            </div>
            <div>
                <label htmlFor="passengers" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                    Number of Passengers:
                </label>
                <input
                    type="number"
                    id="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    min="1"
                    max="8"
                    required
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                style={{
                    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Requesting...' : 'Request Ride'}
            </button>
        </form>
    );
};

export default RideRequestForm;
