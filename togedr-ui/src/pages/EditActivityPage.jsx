// src/pages/EditActivityPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import api from '../services/api';

function MapEventsAndMarker({ location, onPositionChange, onAddressChange }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15);
    }
  }, [location, map]);
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange({ lat, lng });
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        onAddressChange(response.data.display_name || "Address not found");
      } catch (error) {
        onAddressChange("Could not find address");
      }
    },
  });
  return location === null ? null : <Marker position={[location.lat, location.lng]}></Marker>;
}

const EditActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing activity data to pre-fill the form
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get(`/activities/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setTag(data.tag);
        const formattedDate = new Date(data.time).toISOString().slice(0, 16);
        setTime(formattedDate);
        setLocation({ lat: data.location.coordinates[1], lng: data.location.coordinates[0] });
        setLocationName(data.locationName);
        setImageUrl(data.imageUrl);
        setIsPrivate(data.isPrivate || false);
      } catch (err) {
        setError('Failed to load activity data.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      setError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activityData = { title, description, tag, time, imageUrl, locationName, isPrivate, location: { type: 'Point', coordinates: [location.lng, location.lat] } };
      await api.put(`/activities/${id}`, activityData);
      navigate(`/activity/${id}`);
    } catch (err) {
      setError('Failed to update activity.');
    }
  };

  if (loading) return <div>Loading activity for editing...</div>;
  
  return (
    <div className="container mx-auto max-w-2xl p-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold font-display text-gray-800 mb-6">Edit Your Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div><label className="block text-sm font-medium text-gray-700">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Tag</label><input type="text" value={tag} onChange={e => setTag(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Time</label><input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity Image</label>
          {imageUrl && <img src={imageUrl} alt="Activity preview" className="mt-2 rounded-lg w-full h-48 object-cover"/>}
          <div className="mt-2">
            <label htmlFor="imageUpload" className="cursor-pointer bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
              {isUploading ? 'Uploading...' : 'Change Image'}
            </label>
            <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea></div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Visibility</label>
          <div className="mt-2 flex items-center space-x-6">
            <div className="flex items-center">
              <input id="public" name="visibility" type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
              <label htmlFor="public" className="ml-2 block text-sm text-gray-900">Public</label>
            </div>
            <div className="flex items-center">
              <input id="private" name="visibility" type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-900">Private</label>
            </div>
          </div>
        </div>
        {/* You can add the map here as well if you want to allow location editing */}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg">Save Changes</button>
      </form>
    </div>
  );
};

export default EditActivityPage;