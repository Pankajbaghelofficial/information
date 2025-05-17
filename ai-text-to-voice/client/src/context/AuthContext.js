import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Registration successful!');
        navigate('/dashboard');
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Login successful!');
        navigate('/dashboard');
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/users/profile', userData);
      
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile updated successfully');
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      return false;
    }
  };

  // Upgrade user plan
  const upgradePlan = async (plan) => {
    try {
      const res = await axios.post('/api/users/upgrade', { plan });
      
      if (res.data.success) {
        setUser(res.data.data);
        toast.success(`Upgraded to ${plan.replace('_', ' ')} plan!`);
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to upgrade plan';
      toast.error(message);
      return false;
    }
  };

  // Update user credits (after TTS conversion)
  const updateCredits = (newCredits) => {
    if (user) {
      setUser({
        ...user,
        credits: newCredits
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        updateProfile,
        upgradePlan,
        updateCredits,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

