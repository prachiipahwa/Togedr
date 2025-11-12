// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data is in localStorage when the app loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (updatedUserData) => {
    const newUserState = { ...user, ...updatedUserData };
    setUser(newUserState);
    localStorage.setItem('user', JSON.stringify(newUserState));
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const loggedInUser = { ...response.data, isNewUser: false };
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const newUser = { ...response.data, isNewUser: true };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // --- NEW FUNCTION ---
  const markMomentAsComplete = useCallback(async (activityId) => {
    if (!user) return; // Not logged in

    try {
      // 1. Call the backend API
      await api.post('/swipes/complete', { activityId });

      // 2. Update local state immediately
      const updatedMoments = [...(user.completedMoments || []), activityId];
      updateUser({ completedMoments: updatedMoments });

    } catch (error) {
      console.error("Failed to mark moment as complete:", error);
    }
  }, [user]); // Re-create function if user object changes

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        updateUser, 
        markMomentAsComplete // <-- Expose the new function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};