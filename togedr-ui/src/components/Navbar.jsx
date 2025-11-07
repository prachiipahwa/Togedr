// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- SVG Icon Components ---
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Togedr Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-primary tracking-tight">
            Togedr
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {/* --- THIS IS THE CHANGE --- */}
              {/* The link now contains the user's profile picture */}
              <Link to="/profile" className="flex items-center space-x-2">
                <img src={user.profilePictureUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-gray-800 font-medium">Hi, {user.name}!</span>
              </Link>
              
              <Link to="/post" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <PlusCircleIcon />
                <span className="font-medium">Post Activity</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <LogoutIcon />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;