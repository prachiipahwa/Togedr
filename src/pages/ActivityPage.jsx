// src/pages/ActivityPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockActivities, mockUsers } from '../data/mock-data';

const ActivityPage = () => {
  const { id } = useParams(); // Get the activity ID from the URL
  const activity = mockActivities.find(act => act._id === id);
  const creator = mockUsers[activity.creator];

  if (!activity) {
    return <div>Activity not found!</div>;
  }

  const activityDate = new Date(activity.time).toDateString();
  const activityTime = new Date(activity.time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to all activities</Link>

      <div className="bg-white border rounded-lg p-6">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full font-semibold">{activity.tag}</span>
        <h1 className="text-3xl font-bold text-gray-900 my-3">{activity.title}</h1>
        <p className="text-gray-600 mb-4">{activity.description}</p>

        <div className="border-t pt-4">
          <p className="text-md text-gray-800"><strong>Hosted by:</strong> {creator.name}</p>
          <p className="text-md text-gray-800"><strong>When:</strong> {activityDate} at {activityTime}</p>
        </div>

        <button className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Join Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityPage;