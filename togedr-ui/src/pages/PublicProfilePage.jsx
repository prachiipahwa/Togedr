// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data.user);
        setActivities(data.activities);
      } catch (error) {
        console.error("Failed to fetch public profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading || !profile) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <img src={profile.profilePictureUrl} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover" />
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: '"Funnel Display", sans-serif' }}>{profile.name}</h1>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Condiment, cursive' }}>About {profile.name}</h2>
          <p className="text-gray-700">{profile.bio || `${profile.name} hasn't written a bio yet.`}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Condiment, cursive' }}>Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests && profile.interests.length > 0 ? profile.interests.map(interest => (
              <span key={interest} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{interest}</span>
            )) : <p className="text-gray-500">No interests selected.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Funnel Display", sans-serif' }}>{profile.name}'s Activities</h2>
        <div className="space-y-4">
          {activities.length > 0 ? activities.map(act => (
            <Link to={`/activity/${act._id}`} key={act._id} className="block">
              <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md hover:border-blue-500 transition-all duration-200">
                <h3 className="font-bold text-gray-800">{act.title}</h3>
                <p className="text-sm text-gray-500">{new Date(act.time).toLocaleDateString()}</p>
              </div>
            </Link>
          )) : <p>This user hasn't joined or created any activities yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;