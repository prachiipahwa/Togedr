// src/components/ActivityCompletionPrompt.jsx

import React from 'react';

import { Link } from 'react-router-dom';



const ActivityCompletionPrompt = ({ activity, onClose }) => {

  if (!activity) return null;



  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm mx-4">

        <h2 className="text-2xl font-bold font-display mb-4">How was "{activity.title}"?</h2>

        <p className="text-gray-600 mb-6">Let your fellow participants know if you'd like to connect!</p>

        <div className="flex justify-center space-x-4">

          <button

            onClick={onClose}

            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"

          >

            Maybe Later

          </button>

          <Link

            to={`/activity/${activity._id}/moment`}

            className="bg-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700"

          >

            Start Swiping

          </Link>

        </div>

      </div>

    </div>

  );

};



export default ActivityCompletionPrompt;