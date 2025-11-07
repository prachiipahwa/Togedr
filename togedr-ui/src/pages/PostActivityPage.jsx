// src/pages/PostActivityPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const PostActivityPage = () => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Study');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleManualLocationSearch = async () => {
    if (!locationText) return;
    setError('');
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationText)}&format=json&limit=1`);
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocationText(display_name);
      } else {
        setError('Location not found. Try being more specific.');
      }
    } catch (error) {
      setError('Failed to search for location.');
    }
  };

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
    if (!location) {
      setError('Please select a location on the map.');
      return;
    }
    setError('');
    try {
      const activityData = {
        title, description, tag, time, imageUrl, locationName: locationText, isPrivate,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        }
      };
      const response = await api.post('/activities', activityData);
      navigate(`/activity/${response.data._id}`);
    } catch (err) {
      setError('Failed to post activity.');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">Post a New Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div><label className="block text-sm font-medium text-gray-700">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Tag</label><input type="text" value={tag} onChange={e => setTag(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Time</label><input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity Image</label>
          {imageUrl && <img src={imageUrl} alt="Activity preview" className="mt-2 rounded-lg w-full h-48 object-cover"/>}
          <div className="mt-2">
            <label htmlFor="imageUpload" className="cursor-pointer bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
              {isUploading ? 'Uploading...' : 'Upload Image'}
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
              <label htmlFor="public" className="ml-2 block text-sm text-gray-900">Public (Visible to everyone)</label>
            </div>
            <div className="flex items-center">
              <input id="private" name="visibility" type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-900">Private (Invite only)</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input type="text" value={locationText} onChange={e => setLocationText(e.target.value)} placeholder="Search for an area or click the map" className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-l-md" />
            <button type="button" onClick={handleManualLocationSearch} className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100">Search</button>
          </div>
        </div>
        <div className="h-64 w-full rounded-lg overflow-hidden border">
           <MapContainer center={[30.7333, 76.7794]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEventsAndMarker 
                location={location} 
                onPositionChange={setLocation} 
                onAddressChange={setLocationText} 
              />
          </MapContainer>
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Post Activity</button>
      </form>
    </div>
  );
};

export default PostActivityPage;