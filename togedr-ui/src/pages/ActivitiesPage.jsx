// src/pages/ActivitiesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';
import ActivityCard from '../components/ActivityCard';
import useLocation from '../hooks/useLocation';
import { useAuth } from '../context/AuthContext';

// --- Icon Components ---
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;


const ActivitiesPage = () => {
  const [view, setView] = useState('map');
  const [feed, setFeed] = useState('all');
  const { user } = useAuth();
  
  const [listActivities, setListActivities] = useState([]);
  const [mapActivities, setMapActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { location, loading: locationLoading, error: locationError } = useLocation();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      try {
        if (view === 'map') {
          if (!location) return;
          const response = await api.get(`/activities?lng=${location.lng}&lat=${location.lat}`);
          setMapActivities(response.data);
        } else {
          const response = await api.get(feed === 'forYou' ? '/activities/foryou' : '/activities/all');
          setListActivities(response.data);
        }
      } catch (err) {
        setError('Could not fetch activities.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [view, location, feed]);
  
  const renderContent = () => {
    if (locationLoading) return <div className="text-center p-8">Getting your location...</div>;
    if (locationError) return <div className="text-center p-8 text-red-500">{locationError}</div>;
    if (loading) return <div className="text-center p-4">Loading activities...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    if (view === 'map') {
      return (
        <div className="h-[600px] w-full rounded-lg overflow-hidden border shadow-md relative">
          {location && (
            <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              {mapActivities.map(activity => (
                <Marker key={activity._id} position={[activity.location.coordinates[1], activity.location.coordinates[0]]}>
                  <Popup>
                    <div className="text-center" style={{ fontFamily: 'sans-serif' }}>
                      <div className="font-bold text-gray-800 mb-1">{activity.title}</div>
                      <div className="text-sm text-gray-500 mb-2">{activity.tag}</div>
                      <Link to={`/activity/${activity._id}`} className="text-sm font-semibold text-blue-600 hover:underline">View Details</Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
          {mapActivities.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-center text-gray-600">No activities found near you.</p>
            </div>
          )}
        </div>
      );
    } else { 
      return (
        <div className="space-y-4">
          {listActivities.length > 0 ? listActivities.map(activity => (
            <ActivityCard key={activity._id} activity={activity} />
          )) : <p className="text-center text-gray-500">No activities found.</p>}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in-up">
      <div className="flex justify-center border-b mb-4">
        <button onClick={() => setFeed('all')} className={`px-4 py-2 font-medium text-sm ${feed === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>All Activities</button>
        <button onClick={() => setFeed('forYou')} className={`px-4 py-2 font-medium text-sm ${feed === 'forYou' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>For You</button>
      </div>

      <div className="flex justify-center my-4">
        <div className="inline-flex rounded-md shadow-sm bg-white border">
          <button onClick={() => setView('map')} className={`px-4 py-2 text-sm font-medium rounded-l-md flex items-center space-x-2 ${view === 'map' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
            <MapIcon /><span>Map</span>
          </button>
          <button onClick={() => setView('list')} className={`px-4 py-2 text-sm font-medium rounded-r-md flex items-center space-x-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
            <ListIcon /><span>List</span>
          </button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default ActivitiesPage;