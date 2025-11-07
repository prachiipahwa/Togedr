// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Make sure Link is imported
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setInterests(user.interests || []);
      setProfilePictureUrl(user.profilePictureUrl);
    }
    const fetchExtraData = async () => {
      try {
        const tagsRes = await api.get('/tags');
        setAvailableTags(tagsRes.data);
        const activityRes = await api.get('/users/profile');
        setActivities(activityRes.data.activities);
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtraData();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setProfilePictureUrl(data.secure_url);
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };
  
  const handleSave = async () => {
    try {
      const { data } = await api.put('/users/profile', { bio, interests, profilePictureUrl });
      updateUser(data); 
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleAddInterest = async () => {
    if (newInterest && !interests.includes(newInterest)) {
      try {
        await api.post('/tags', { name: newInterest });
        setInterests([...interests, newInterest]);
        setAvailableTags([...availableTags, newInterest]);
        setNewInterest('');
      } catch (error) {
        console.error("Failed to add new tag", error);
      }
    }
  };

  if (loading || !user) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <img src={isEditing ? profilePictureUrl : user.profilePictureUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover" />
          <div>
            <h1 className="text-3xl font-bold font-display" style={{ fontFamily: '"Funnel Display", sans-serif' }}>{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 font-cursive" style={{ fontFamily: 'Condiment, cursive' }}>About Me</h2>
          {isEditing ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full p-2 border rounded-md" rows="3"></textarea>
          ) : (
            <p className="text-gray-700">{user.bio || 'No bio yet.'}</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 font-cursive" style={{ fontFamily: 'Condiment, cursive' }}>My Interests</h2>
          {isEditing ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)} className={`px-3 py-1 rounded-full text-sm ${interests.includes(interest) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {interest}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex">
                <input type="text" value={newInterest} onChange={e => setNewInterest(e.target.value)} placeholder="Add a custom interest" className="flex-grow p-2 border rounded-l-md" />
                <button type="button" onClick={handleAddInterest} className="bg-gray-200 px-4 rounded-r-md">Add</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? user.interests.map(interest => (
                <span key={interest} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{interest}</span>
              )) : <p className="text-gray-500">No interests selected.</p>}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-right">
          {isEditing ? (
            <div className="flex flex-col items-end space-y-4">
              <div>
                <label htmlFor="imageUpload" className="cursor-pointer bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  Change Photo
                </label>
                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">Save Changes</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">Edit Profile</button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Funnel Display", sans-serif' }}>My Activities</h2>
        <div className="space-y-4">
          {activities.length > 0 ? activities.map(act => (
            // --- THIS IS THE FIX ---
            <Link to={`/activity/${act._id}`} key={act._id} className="block">
              <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md hover:border-blue-500 transition-all duration-200">
                <h3 className="font-bold text-gray-800">{act.title}</h3>
                <p className="text-sm text-gray-500">{new Date(act.time).toLocaleDateString()}</p>
              </div>
            </Link>
          )) : <p>You haven't joined or created any activities yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;