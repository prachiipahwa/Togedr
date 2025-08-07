// src/pages/PostActivityPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const PostActivityPage = () => {
  const { isAuthenticated } = useAuth();
  const handleSubmit = (event) =>{
    event.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in first to post an activity!");
      return;
    }
    alert("Activity posted successfully!");
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Home</Link>

      <div className="bg-white border rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Activity</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Morning Walk" />
          </div>

          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Interest Tag</label>
            <select id="tag" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option>Study</option>
              <option>Football</option>
              <option>Coffee</option>
              <option>Walk</option>
              <option>Gaming</option>
            </select>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input type="datetime-local" id="time" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Add a short description..."></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Post Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostActivityPage;