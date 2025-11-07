// src/components/ActivityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

const ActivityCard = ({ activity }) => {
  const activityTime = new Date(activity.time).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  return (
    <Link to={`/activity/${activity._id}`} className="block animate-fade-in-up">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <img 
          src={activity.imageUrl} 
          alt={activity.title}
          className="w-full h-40 object-cover" 
        />
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full self-start">{activity.tag}</span>
          <h3 className="text-lg font-bold text-gray-800 mt-2">{activity.title}</h3>
          <p className="text-sm text-gray-500 mt-1">Hosted by {activity.creator.name}</p>
          <div className="flex-grow"></div>
          <div className="mt-3 pt-3 border-t flex items-center text-sm text-gray-500">
            <LocationIcon />
            <span className="ml-2 truncate">{activity.locationName || 'Location not specified'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;