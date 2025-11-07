// src/pages/ActivityPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ActivityPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivity = useCallback(async () => {
    try {
      const response = await api.get(`/activities/${id}`);
      setActivity(response.data);
    } catch (err) {
      setError('Could not fetch activity details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleJoin = async () => {
    try {
      await api.post(`/activities/${id}/join`);
      fetchActivity();
    } catch (err) {
      console.error('Failed to join activity', err);
    }
  };

  const handleLeave = async () => {
    try {
      await api.post(`/activities/${id}/leave`);
      fetchActivity();
    } catch (err) {
      console.error('Failed to leave activity', err);
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/activities/${id}/complete`);
      navigate(`/activity/${id}/moment`);
    } catch (err) {
      console.error('Failed to complete activity', err);
    }
  };
  
  // --- NEW: Function to handle deleting an activity ---
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await api.delete(`/activities/${id}`);
        navigate('/activities');
      } catch (err) {
        console.error('Failed to delete activity', err);
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading activity...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!activity) return <div className="text-center p-8">Activity not found.</div>;

  const isMember = user && activity.members.some(member => member._id === user._id);
  const isCreator = user && activity.creator._id === user._id;

  const activityDate = new Date(activity.time).toDateString();
  const activityTime = new Date(activity.time).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl animate-fade-in-up">
      <Link to="/activities" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to all activities</Link>

      <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
        <img src={activity.imageUrl} alt={activity.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full font-semibold">{activity.tag}</span>
          <h1 className="text-3xl font-bold text-gray-900 my-3" style={{ fontFamily: '"Funnel Display", sans-serif' }}>{activity.title}</h1>
          <p className="text-gray-600 mb-4">{activity.description}</p>

          <div className="border-t pt-4">
            <p className="text-md text-gray-800"><strong>Hosted by:</strong> <Link to={`/users/${activity.creator._id}`} className="text-blue-600 hover:underline">{activity.creator.name}</Link></p>
            <p className="text-md text-gray-800"><strong>When:</strong> {activityDate} at {activityTime}</p>
          </div>
          
          <div className="mt-6 w-full flex flex-col space-y-2">
            {user && isCreator && activity.status === 'upcoming' && (
              <button onClick={handleComplete} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">Mark Activity as Complete</button>
            )}
            {user && isMember && activity.status === 'completed' && (
              <Link to={`/activity/${activity._id}/moment`} className="w-full text-center bg-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700">Begin Swiping</Link>
            )}
            {user && isMember && (
              <Link to={`/activity/${activity._id}/chat`} className="w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Go to Group Chat</Link>
            )}
            {user && !isCreator && activity.status === 'upcoming' && (
                isMember ? (
                  <button onClick={handleLeave} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Leave Activity</button>
                ) : (
                  <button onClick={handleJoin} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Join Activity</button>
                )
            )}
            {user && isCreator && activity.status === 'upcoming' && (
              <div className="flex items-center space-x-2 pt-2">
                <Link to={`/activity/${id}/edit`} className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Edit</Link>
                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Delete</button>
              </div>
            )}
          </div>
        </div>
        
        {/* --- NEW: Members List --- */}
        <div className="border-t p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Participants ({activity.members.length})</h3>
            <div className="flex flex-wrap gap-4">
              {activity.members.map(member => (
                <Link to={`/users/${member._id}`} key={member._id} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <img src={member.profilePictureUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-700">{member.name}</span>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;