// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If there's no logged-in user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the component for the route (in this case, the Outlet)
  return <Outlet />;
};

export default ProtectedRoute;