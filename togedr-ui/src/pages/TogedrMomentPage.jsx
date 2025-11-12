// src/pages/TogedrMomentPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchModal from '../components/MatchModal';

const TogedrMomentPage = () => {
  const { id: activityId } = useParams();
  const { user, markMomentAsComplete } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState({ show: false, user: null, chatRoomId: null });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/activities/${activityId}`);
        const otherParticipants = response.data.members.filter(member => member._id !== user._id);
        setParticipants(otherParticipants);
        setCurrentIndex(otherParticipants.length - 1);
      } catch (error) {
        console.error("Failed to fetch participants", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [activityId, user._id]);

  useEffect(() => {
    // When currentIndex becomes -1, the last card was just swiped
    if (currentIndex === -1) {
      markMomentAsComplete(activityId);
    }
  }, [currentIndex, activityId, markMomentAsComplete]);

  const childRefs = useMemo(() =>
    Array(participants.length).fill(0).map(() => React.createRef()),
  [participants]);

  const swipe = async (dir) => {
    if (currentIndex >= 0 && childRefs[currentIndex].current) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleApiSwipe = async (direction, swipedUser, index) => {
    setCurrentIndex(index - 1);
    const decision = direction === 'right' ? 'yes' : 'no';
    try {
      const response = await api.post('/swipes', {
        activityId,
        swipedId: swipedUser._id,
        decision,
      });
      if (response.data.match) {
        setMatchInfo({ show: true, user: swipedUser, chatRoomId: response.data.chatRoomId });
      }
    } catch (error) {
      console.error("Failed to submit swipe", error);
    }
  };

  const closeMatchModal = () => {
    setMatchInfo({ show: false, user: null, chatRoomId: null });
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto max-w-sm p-4 text-center">
      <MatchModal
        matchedUser={matchInfo.user}
        chatRoomId={matchInfo.chatRoomId}
        onClose={closeMatchModal}
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: '"Funnel Display", sans-serif' }}>Togedr Moment</h1>

      <div className="relative w-full h-96">
        {currentIndex >= 0 ? (
          participants.map((participant, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="absolute"
              key={participant._id}
              onSwipe={(dir) => handleApiSwipe(dir, participant, index)}
              preventSwipe={['up', 'down']}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border h-96 w-full flex flex-col items-center justify-center">
                <img
                  src={participant.profilePictureUrl || 'https://i.imgur.com/6VBx3io.png'}
                  alt={participant.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200"
                />
                <h2 className="text-2xl font-semibold text-gray-900">{participant.name}</h2>
              </div>
            </TinderCard>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-10 border mt-8">
            <h2 className="text-2xl font-semibold text-gray-700">That's everyone!</h2>
            <p className="text-gray-500 mt-2">You've swiped on all the participants.</p>
            <Link to={`/activity/${activityId}`} className="text-blue-500 hover:underline mt-6 inline-block">Back to Activity</Link>
          </div>
        )}
      </div>
      
      {currentIndex >= 0 && (
        <div className="flex justify-center space-x-6 mt-8">
          <button onClick={() => swipe('left')} className="bg-red-100 text-red-600 rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold hover:bg-red-200">✗</button>
          <button onClick={() => swipe('right')} className="bg-green-100 text-green-600 rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold hover:bg-green-200">✓</button>
        </div>
      )}
    </div>
  );
};

export default TogedrMomentPage;