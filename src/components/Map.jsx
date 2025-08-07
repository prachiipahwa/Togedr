// src/components/Map.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const Map = ({ activities }) => {
  // Set a default position, but we will update it with the user's location.
  const [position, setPosition] = useState([30.7333, 76.7794]);

  useEffect(() => {
    // This code runs when the component mounts
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Success: set the position to the user's current coordinates
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      () => {
        // Error/Permission Denied: we do nothing and leave the default position
        console.log("User denied location access.");
      }
    );
  }, []); // The empty array ensures this effect runs only once

  return (
    // The 'key' prop is important. It forces the map to re-render when the position changes.
    <MapContainer key={position.join(',')} center={position} zoom={13} style={{ height: '400px', width: '100%' }} className="rounded-lg shadow-md">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Add a marker for the user's current location */}
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Markers for all the activities */}
      {activities.map(activity => (
        <Marker key={activity._id} position={[activity.location.lat, activity.location.lng]}>
          <Popup>
            <strong>{activity.title}</strong><br />
            {activity.tag} - <Link to={`/activity/${activity._id}`} className="text-blue-500 hover:underline">View Details</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;