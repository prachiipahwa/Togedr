// src/pages/SetupProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SetupProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || 'https://i.imgur.com/6VBx3io.png');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await api.get('/tags');
        setAvailableTags(data);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };
    fetchTags();
  }, []);

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
      updateUser(data); // Update global state
      navigate('/activities');
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

  return (
    <div className="container mx-auto p-4 max-w-xl flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: '"Funnel Display", sans-serif' }}>Welcome, {user?.name}!</h1>
        <p className="text-gray-600 text-center mb-6">Let's set up your profile.</p>

        <div className="mt-6 flex flex-col items-center">
          <img src={profilePictureUrl} alt="Profile Preview" className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover mb-4" />
          <label htmlFor="imageUpload" className="cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors">
            Upload Photo
          </label>
          <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Condiment, cursive' }}>About Me (Optional)</h2>
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full p-2 border rounded-md" rows="3" placeholder="Write a short bio..."></textarea>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Condiment, cursive' }}>Select Your Interests</h2>
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

        <div className="mt-8">
          <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg">Save and Continue</button>
        </div>
      </div>
    </div>
  );
};

export default SetupProfilePage;