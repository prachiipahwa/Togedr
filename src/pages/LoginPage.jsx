// src/pages/LoginPage.jsx
import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const mockUser = { id: 'user4', name: 'Prachi'};

  const handleLogin = (event) => {
    event.preventDefault();
    login(mockUser); // Set the user in our context
    navigate('/'); // Redirect to home page after login
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Log in to Togedr</h1>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input 
              type="email" 
              id="email" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;