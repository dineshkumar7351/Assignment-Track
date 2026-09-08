import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  }, []);

  // Initialize and verify user token on app mount
  useEffect(() => {
    let isMounted = true;

    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      try {
        const response = await api.get('/auth/me');
        if (isMounted && response.data && response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else if (isMounted) {
          logout();
        }
      } catch (error) {
        console.warn('Session expired or invalid:', error.message);
        if (isMounted) logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyUserSession();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      setUser(userData);
      setToken(userToken);

      return {
        success: true,
        user: userData,
        message: response.data.message || 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (registrationData) => {
    try {
      const response = await api.post('/auth/register', registrationData);
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      setUser(userData);
      setToken(userToken);

      return {
        success: true,
        user: userData,
        message: response.data.message || 'Account created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
