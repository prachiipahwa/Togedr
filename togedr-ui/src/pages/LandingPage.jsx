// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeroCollage from '../components/HeroCollage'; // <-- Import the new component

const LandingPage = () => {
  return (
    <div 
      className="relative text-white text-center flex flex-col items-center justify-center" 
      style={{ height: 'calc(100vh - 68px)' }} // Full height minus navbar
    >
      {/* --- The Collage is now the background --- */}
      <HeroCollage />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
      
      {/* All text content is now positioned on top of the collage */}
      <div className="relative z-30 p-4">
        <h1 
          className="text-5xl md:text-7xl font-extrabold leading-tight" 
          style={{ fontFamily: '"Funnel Display", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          Do More, Togedr.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          From study groups to weekend hikes, find your people and make it happen. Discover spontaneous activities and create your own.
        </p>
        <div className="mt-8">
          <Link 
            to="/activities" 
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Find Activities Nearby
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;