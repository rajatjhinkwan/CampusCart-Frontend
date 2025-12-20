import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// const DEFAULT_PHOTON = `${API_BASE}/api/geo/photon`;
// const DEFAULT_OSM = `${API_BASE}/api/geo/osm`;

const libraries = ['places', 'geometry'];

const RideRequestForm = ({ onRideRequested, onLocationsChange, compact = false, onSearch }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [fromCoords, setFromCoords] = useState(null);
    const [toCoords, setToCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromHighlight, setFromHighlight] = useState(-1);
    const [toHighlight, setToHighlight] = useState(-1);
    const [searchingFrom, setSearchingFrom] = useState(false);
    const [searchingTo, setSearchingTo] = useState(false);
    const [error, setError] = useState('');
    const fromTimeoutRef = useRef(null);
    const toTimeoutRef = useRef(null);

    const styles = {
        form: { display: 'flex', flexDirection: 'column', gap: '16px' },
        label: { display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#111827', fontSize: '14px' },
        input: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', backgroundColor: '#ffffff' },
        suggestionsBox: { position: 'relative' },
        suggestionsList: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', marginTop: '6px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', zIndex: 10 },
        suggestionItem: { padding: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer' },
        suggestionItemActive: { backgroundColor: '#f3f4f6' },
        row: { display: 'flex', gap: '12px' },
        smallButton: { backgroundColor: '#10b981', color: '#ffffff', padding: '8px 12px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
        smallButtonDisabled: { backgroundColor: '#d1d5db', color: '#ffffff', cursor: 'not-allowed' },
        passengersInput: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' },
        button: { backgroundColor: '#3b82f6', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
        buttonDisabled: { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
        chipRow: { display: 'flex', gap: '8px', marginTop: '8px' },
        chip: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '9999px', fontSize: '12px' },
        chipVerified: { backgroundColor: '#E7F6EF', color: '#065F46', border: '1px solid #A7F3D0' },
        chipSearching: { backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' },
        errorBox: { backgroundColor: '#FEE2E2', color: '#7F1D1D', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px' },
        bar: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' },
        barInput: { flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
        barSelect: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff' },
        barButton: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }
    };

    // --- GOOGLE MAPS IMPLEMENTATION ---
    const autocompleteServiceRef = useRef(null);
    const geocoderRef = useRef(null);

    useEffect(() => {
        if (isLoaded && window.google) {
            if (!autocompleteServiceRef.current) {
                autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            }
            if (!geocoderRef.current) {
                geocoderRef.current = new window.google.maps.Geocoder();
            }
        }
    }, [isLoaded]);

    const googleGeocode = async (address) => {
        if (!geocoderRef.current) return null;
        try {
            const res = await geocoderRef.current.geocode({ address });
            if (res.results && res.results.length > 0) {
                const result = res.results[0];
                const loc = result.geometry.location;
                return {
                    lat: loc.lat(),
                    lng: loc.lng(),
                    address: result.formatted_address
                };
            }
        } catch (err) {
            console.error("Google Geocoding error:", err);
        }
        return null;
    };

    const googleReverseGeocode = async (lat, lng) => {
        if (!geocoderRef.current) return null;
        try {
            const res = await geocoderRef.current.geocode({ location: { lat, lng } });
            if (res.results && res.results.length > 0) {
                return res.results[0].formatted_address;
            }
        } catch (err) {
            console.error("Google Reverse Geocoding error:", err);
        }
        return null;
    };

    const googleSearchSuggestions = async (input) => {
        if (!isLoaded || !window.google) return [];
        if (!autocompleteServiceRef.current) {
             autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
        
        if (!input || input.trim().length < 3) return [];
        
        return new Promise((resolve) => {
            try {
                autocompleteServiceRef.current.getPlacePredictions({ input }, (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        resolve(predictions.map(p => ({
                            label: p.description,
                            placeId: p.place_id
                        })));
                    } else {
                        console.warn("Google Autocomplete status:", status);
                        resolve([]);
                    }
                });
            } catch (err) {
                console.error("Google Autocomplete error:", err);
                resolve([]);
            }
        });
    };

    const getPlaceDetails = async (placeId) => {
        if (!window.google || !placeId) return null;
        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
        return new Promise((resolve) => {
            placesService.getDetails({ placeId }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry && place.geometry.location) {
                    resolve({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        address: place.formatted_address
                    });
                } else {
                    resolve(null);
                }
            });
        });
    };

    // --- BACKUP: PHOTON / OSM IMPLEMENTATION (COMMENTED) ---
    /*
    const photonLabel = (props) => {
        const parts = [
            props.name,
            props.street,
            props.city || props.town || props.village,
            props.state,
            props.country
        ].filter(Boolean);
        return parts.join(', ');
    };
    const geocodeAddress = async (query) => {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const photonBase = `${API_BASE}/api/geo/photon`;
        const res = await fetch(`${photonBase}/?q=${encodeURIComponent(query)}&limit=1`, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
            const data = await res.json();
            const feat = Array.isArray(data.features) ? data.features[0] : null;
            if (feat && feat.geometry && feat.properties) {
                const [lng, lat] = feat.geometry.coordinates || [];
                return { lat: parseFloat(lat), lng: parseFloat(lng), address: photonLabel(feat.properties) || query };
            }
        }
        const osmBase = `${API_BASE}/api/geo/osm`;
        const contact = import.meta.env.VITE_NOMINATIM_CONTACT || 'admin@campuscart.com';
        const url = `${osmBase}/search?format=jsonv2&limit=1&email=${encodeURIComponent(contact)}&q=${encodeURIComponent(query)}`;
        const res2 = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res2.ok) throw new Error('GEOCODE_FAILED');
        const data2 = await res2.json();
        if (!Array.isArray(data2) || data2.length === 0) throw new Error('GEOCODE_NOT_FOUND');
        const first = data2[0];
        return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), address: first.display_name };
    };
    const searchSuggestions = async (q) => {
        if (!q || q.trim().length < 3) return [];
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const photonBase = `${API_BASE}/api/geo/photon`;
        const res = await fetch(`${photonBase}/?q=${encodeURIComponent(q)}&limit=5`, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
            const data = await res.json();
            const feats = Array.isArray(data.features) ? data.features : [];
            return feats.map(f => {
                const [lng, lat] = (f.geometry && f.geometry.coordinates) || [];
                const label = photonLabel(f.properties || {}) || q;
                return { label, lat: parseFloat(lat), lng: parseFloat(lng) };
            });
        }
        const osmBase = `${API_BASE}/api/geo/osm`;
        const contact = import.meta.env.VITE_NOMINATIM_CONTACT || 'admin@campuscart.com';
        const url = `${osmBase}/search?format=jsonv2&email=${encodeURIComponent(contact)}&q=${encodeURIComponent(q)}&addressdetails=0&limit=5`;
        const res2 = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res2.ok) return [];
        const data2 = await res2.json();
        return (data2 || []).map(d => ({ label: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }));
    };
    */
    
    // Wrapper functions to switch between Google and Backup
    const geocodeAddress = async (query) => {
        // Use Google Maps Geocoding
        const result = await googleGeocode(query);
        if (result) return result;
        throw new Error('GEOCODE_NOT_FOUND');
    };

    const searchSuggestions = async (q) => {
        // Use Google Maps Autocomplete
        return await googleSearchSuggestions(q);
    };

    useEffect(() => {
        if (loadError) console.error("Google Maps Load Error:", loadError);
    }, [loadError]);

    const handleFromChange = (e) => {
        const val = e.target.value;
        setFrom(val);
        setFromCoords(null);
        setFromHighlight(-1);
        
        if (!val || val.length < 3) {
            setFromSuggestions([]);
            return;
        }

        setSearchingFrom(true);
        if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);
        fromTimeoutRef.current = setTimeout(async () => {
            try {
                // Ensure Google Maps is loaded
                if (!isLoaded || !window.google) {
                    console.warn("Google Maps not ready");
                    return;
                }
                const results = await googleSearchSuggestions(val);
                setFromSuggestions(results);
            } catch (err) {
                console.error("Suggestion error:", err);
                setFromSuggestions([]);
            } finally {
                setSearchingFrom(false);
            }
        }, 300);
    };
    const handleToChange = (e) => {
        const val = e.target.value;
        setTo(val);
        setToCoords(null);
        setToHighlight(-1);
        
        if (!val || val.length < 3) {
            setToSuggestions([]);
            return;
        }

        setSearchingTo(true);
        if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);
        toTimeoutRef.current = setTimeout(async () => {
            try {
                 // Ensure Google Maps is loaded
                if (!isLoaded || !window.google) {
                    console.warn("Google Maps not ready");
                    return;
                }
                const results = await googleSearchSuggestions(val);
                setToSuggestions(results);
            } catch (err) {
                console.error("Suggestion error:", err);
                setToSuggestions([]);
            } finally {
                setSearchingTo(false);
            }
        }, 300);
    };
    const selectFromSuggestion = async (s) => {
        setFrom(s.label);
        
        let coords = { lat: s.lat, lng: s.lng };
        // If Google Place ID is present, fetch details
        if (s.placeId) {
             const details = await getPlaceDetails(s.placeId);
             if (details) coords = { lat: details.lat, lng: details.lng };
        }

        setFromCoords(coords);
        setFromSuggestions([]);
        setFromHighlight(-1);
        if (typeof onLocationsChange === 'function') {
            onLocationsChange({ ...coords, address: s.label }, toCoords ? { lat: toCoords.lat, lng: toCoords.lng, address: to } : null);
        }
    };
    const selectToSuggestion = async (s) => {
        setTo(s.label);

        let coords = { lat: s.lat, lng: s.lng };
        // If Google Place ID is present, fetch details
        if (s.placeId) {
             const details = await getPlaceDetails(s.placeId);
             if (details) coords = { lat: details.lat, lng: details.lng };
        }

        setToCoords(coords);
        setToSuggestions([]);
        setToHighlight(-1);
        if (typeof onLocationsChange === 'function') {
            onLocationsChange(fromCoords ? { lat: fromCoords.lat, lng: fromCoords.lng, address: from } : null, { ...coords, address: s.label });
        }
    };

    const onFromKeyDown = (e) => {
        if (fromSuggestions.length === 0) return;
        if (e.key === 'ArrowDown') setFromHighlight(h => Math.min(h + 1, fromSuggestions.length - 1));
        else if (e.key === 'ArrowUp') setFromHighlight(h => Math.max(h - 1, 0));
        else if (e.key === 'Enter' && fromHighlight >= 0) selectFromSuggestion(fromSuggestions[fromHighlight]);
    };
    const onToKeyDown = (e) => {
        if (toSuggestions.length === 0) return;
        if (e.key === 'ArrowDown') setToHighlight(h => Math.min(h + 1, toSuggestions.length - 1));
        else if (e.key === 'ArrowUp') setToHighlight(h => Math.max(h - 1, 0));
        else if (e.key === 'Enter' && toHighlight >= 0) selectToSuggestion(toSuggestions[toHighlight]);
    };
    const useMyLocation = async () => {
        setError('');
        if (!isLoaded || !window.google) {
             setError('Maps service not ready. Please wait.');
             return;
        }
        if (!geocoderRef.current) {
            geocoderRef.current = new window.google.maps.Geocoder();
        }
        
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
            });
            
            const { latitude, longitude } = pos.coords;
            
            // --- GOOGLE MAPS REVERSE GEOCODING ---
            let address = await googleReverseGeocode(latitude, longitude);
            
            if (!address) {
                 address = `${latitude}, ${longitude}`;
            }

            setFrom(address);
            setFromCoords({ lat: latitude, lng: longitude });
            setFromSuggestions([]);
            setFromHighlight(-1);
            if (typeof onLocationsChange === 'function') {
                onLocationsChange({ lat: latitude, lng: longitude, address }, toCoords ? { lat: toCoords.lat, lng: toCoords.lng, address: to } : null);
            }
            
        } catch (err) {
            console.error(err);
            setError('Unable to get current location');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let finalFrom = null;
        let finalTo = null;
        try {
            const [fromGeo, toGeo] = await Promise.all([
                fromCoords ? Promise.resolve({ lat: fromCoords.lat, lng: fromCoords.lng, address: from }) : geocodeAddress(from),
                toCoords ? Promise.resolve({ lat: toCoords.lat, lng: toCoords.lng, address: to }) : geocodeAddress(to)
            ]);
            finalFrom = { lat: fromGeo.lat, lng: fromGeo.lng, address: fromGeo.address || from };
            finalTo = { lat: toGeo.lat, lng: toGeo.lng, address: toGeo.address || to };
            setFrom(finalFrom.address);
            setTo(finalTo.address);
            setFromCoords({ lat: finalFrom.lat, lng: finalFrom.lng });
            setToCoords({ lat: finalTo.lat, lng: finalTo.lng });
            if (typeof onLocationsChange === 'function') {
                onLocationsChange(finalFrom, finalTo);
            }
        } catch {
            setError('Please enter valid addresses');
            return;
        }

        // In compact search bar mode, this acts as a search (no ride creation)
        if (compact) {
            const seats = parseInt(passengers, 10) || 1;
            if (typeof onSearch === 'function') {
                onSearch({
                    origin: finalFrom.address,
                    destination: finalTo.address,
                    passengers: seats
                });
            }
            return;
        }

        setLoading(true);

        const seats = parseInt(passengers, 10);
        if (!Number.isFinite(seats) || seats < 1 || seats > 10) {
            setLoading(false);
            setError('Please enter passengers between 1 and 10');
            return;
        }

        const rideRequest = {
            from: {
                address: finalFrom.address,
                lat: finalFrom.lat,
                lng: finalFrom.lng
            },
            to: {
                address: finalTo.address,
                lat: finalTo.lat,
                lng: finalTo.lng
            },
            seatsRequested: seats,
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

    if (compact) {
        return (
            <form onSubmit={handleSubmit} style={styles.bar}>
                <div style={{ ...styles.suggestionsBox, flex: 1 }}>
                    <input
                        ref={fromInputRef}
                        type="text"
                        value={from}
                        onChange={handleFromChange}
                        onKeyDown={onFromKeyDown}
                        placeholder="Origin"
                        style={styles.barInput}
                        required
                    />
                    {fromSuggestions.length > 0 && (
                        <div style={{ ...styles.suggestionsList, top: '110%' }}>
                            {fromSuggestions.map((s, i) => (
                                <div
                                    key={`${s.label}-${i}`}
                                    style={{ ...styles.suggestionItem, ...(i === fromHighlight ? styles.suggestionItemActive : {}) }}
                                    onMouseEnter={() => setFromHighlight(i)}
                                    onMouseLeave={() => setFromHighlight(-1)}
                                    onClick={() => selectFromSuggestion(s)}
                                >
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ ...styles.suggestionsBox, flex: 1 }}>
                    <input
                        ref={toInputRef}
                        type="text"
                        value={to}
                        onChange={handleToChange}
                        onKeyDown={onToKeyDown}
                        placeholder="Destination"
                        style={styles.barInput}
                        required
                    />
                    {toSuggestions.length > 0 && (
                        <div style={{ ...styles.suggestionsList, top: '110%' }}>
                            {toSuggestions.map((s, i) => (
                                <div
                                    key={`${s.label}-${i}`}
                                    style={{ ...styles.suggestionItem, ...(i === toHighlight ? styles.suggestionItemActive : {}) }}
                                    onMouseEnter={() => setToHighlight(i)}
                                    onMouseLeave={() => setToHighlight(-1)}
                                    onClick={() => selectToSuggestion(s)}
                                >
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <input
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    min="1"
                    max="10"
                    style={{ width: '80px', ...styles.barInput }}
                    placeholder="1+"
                />
                <button type="submit" style={styles.barButton}>Search</button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            {loadError && (
                <div style={styles.errorBox}>
                    Error loading maps: {loadError.message}
                </div>
            )}
            <div>
                <label htmlFor="from" style={styles.label}>
                    From:
                </label>
                <div style={styles.row}>
                    <div style={{ flex: 1, ...styles.suggestionsBox }}>
                        <input
                            ref={fromInputRef}
                            type="text"
                            id="from"
                            value={from}
                            onChange={handleFromChange}
                            onKeyDown={onFromKeyDown}
                            placeholder="Enter pickup location"
                            required
                            style={styles.input}
                        />
                        {searchingFrom && <div style={{ position: 'absolute', top: '100%', marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>Searching...</div>}
                        {fromSuggestions.length > 0 && (
                            <div style={styles.suggestionsList}>
                                {fromSuggestions.map((s, i) => (
                                    <div
                                        key={`${s.label}-${i}`}
                                        style={{ ...styles.suggestionItem, ...(i === fromHighlight ? styles.suggestionItemActive : {}) }}
                                        onMouseEnter={() => setFromHighlight(i)}
                                        onMouseLeave={() => setFromHighlight(-1)}
                                        onClick={() => selectFromSuggestion(s)}
                                    >
                                        {s.label}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={styles.chipRow}>
                            {fromCoords && <span style={{ ...styles.chip, ...styles.chipVerified }}>Verified</span>}
                            {searchingFrom && <span style={{ ...styles.chip, ...styles.chipSearching }}>Searching</span>}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={useMyLocation}
                        style={{ ...styles.smallButton, width: '160px' }}
                    >
                        Use my location
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="to" style={styles.label}>
                    To:
                </label>
                <div style={styles.suggestionsBox}>
                    <input
                        ref={toInputRef}
                        type="text"
                        id="to"
                        value={to}
                        onChange={handleToChange}
                        onKeyDown={onToKeyDown}
                        placeholder="Enter destination"
                        required
                        style={styles.input}
                    />
                    {searchingTo && <div style={{ position: 'absolute', top: '100%', marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>Searching...</div>}
                    {toSuggestions.length > 0 && (
                        <div style={styles.suggestionsList}>
                            {toSuggestions.map((s, i) => (
                                <div
                                    key={`${s.label}-${i}`}
                                    style={{ ...styles.suggestionItem, ...(i === toHighlight ? styles.suggestionItemActive : {}) }}
                                    onMouseEnter={() => setToHighlight(i)}
                                    onMouseLeave={() => setToHighlight(-1)}
                                    onClick={() => selectToSuggestion(s)}
                                >
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={styles.chipRow}>
                        {toCoords && <span style={{ ...styles.chip, ...styles.chipVerified }}>Verified</span>}
                        {searchingTo && <span style={{ ...styles.chip, ...styles.chipSearching }}>Searching</span>}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="passengers" style={styles.label}>
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
                    style={styles.passengersInput}
                />
            </div>
            {error && <div style={styles.errorBox}>{error}</div>}
            <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            >
                {loading ? 'Requesting...' : 'Request Ride'}
            </button>
        </form>
    );
};

export default RideRequestForm;
