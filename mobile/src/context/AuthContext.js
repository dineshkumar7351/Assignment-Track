import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user state', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const token = response.data.token || response.data.data?.token;
        const userData = response.data.user || response.data.data?.user;
        if (token) {
          await AsyncStorage.setItem('auth_token', token);
        }
        if (userData) {
          await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
          setUser(userData);
        }
        return { success: true, user: userData, token };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Network error connecting to backend API',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data && response.data.success) {
        const token = response.data.token || response.data.data?.token;
        const registeredUser = response.data.user || response.data.data?.user;
        if (token) {
          await AsyncStorage.setItem('auth_token', token);
        }
        if (registeredUser) {
          await AsyncStorage.setItem('auth_user', JSON.stringify(registeredUser));
          setUser(registeredUser);
        }
        return { success: true, user: registeredUser, token };
      }
      return { success: false, message: response.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Network error during registration',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setUser(null);
    } catch (e) {
      console.error('Error logging out', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
