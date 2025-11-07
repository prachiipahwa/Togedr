// src/hooks/useLocation.js
import { useState, useEffect } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
    };

    const handleError = (err) => {
      setError(`Unable to retrieve location: ${err.message}`);
      setLoading(false);
    };

    // --- THIS IS THE FIX ---
    // Add options to the request, including a 5-second timeout.
    const options = {
      enableHighAccuracy: true,
      timeout: 5000, // 5 seconds
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

  }, []);

  return { location, loading, error };
};

export default useLocation;