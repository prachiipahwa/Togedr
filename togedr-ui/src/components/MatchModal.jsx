// src/components/MatchModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MatchModal = ({ matchedUser, chatRoomId, onClose }) => {
  if (!matchedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">It's a Match!</h2>
        <p className="text-lg text-gray-700 mb-6">You and {matchedUser.name} are now connected.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
          >
            Keep Swiping
          </button>
          <Link
            to={`/chat/${chatRoomId}`} // Note: We will add this route later
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Send a Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;