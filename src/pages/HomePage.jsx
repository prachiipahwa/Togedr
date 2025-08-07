// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockActivities, mockUsers } from '../data/mock-data';
import Map from '../components/Map';

// --- Icon Components for the Toggle ---
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);

// --- Activity Card Component ---
const ActivityCard = ({ activity }) => {
  const creator = mockUsers[activity.creator];
  const activityDate = new Date(activity.time).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const activityTime = new Date(activity.time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Link to={`/activity/${activity._id}`}>
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
        <h3 className="text-lg font-bold text-gray-800">{activity.title}</h3>
        <p className="text-sm text-gray-500 mb-2">Hosted by {creator.name}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{activity.tag}</span>
          <span>{activityDate}</span>
          <span>{activityTime}</span>
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const [view, setView] = useState('map'); // 'map' or 'list'

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* --- Toggle Buttons --- */}
      <div className="flex justify-center my-4">
        <div className="inline-flex rounded-md shadow-sm bg-white border">
          <button 
            onClick={() => setView('map')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md flex items-center space-x-2 ${view === 'map' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <MapIcon />
            <span>Map</span>
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md flex items-center space-x-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <ListIcon />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* --- Conditional Rendering --- */}
      {view === 'map' ? (
        <div className="mb-8">
          <Map activities={mockActivities} />
        </div>
      ) : (
        <div className="space-y-4">
          {mockActivities.map(activity => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
