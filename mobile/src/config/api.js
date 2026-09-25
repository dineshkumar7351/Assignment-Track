import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the backend API URL.
 * Automatically detects host machine IP from Expo bundler connection
 * so that physical devices (Android/iOS) and emulators can reach the backend without hardcoding.
 */
export const getBackendUrl = () => {
  try {
    const hostUri =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri ||
      Constants?.manifest?.debuggerHost;

    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
        return `http://${hostIp}:5000/api`;
      }
    }
  } catch (err) {
    console.warn('[API Config] Error extracting hostUri from Expo Constants:', err);
  }

  // Fallback LAN IP for direct local Wi-Fi testing
  return 'http://10.20.24.212:5000/api';
};

export const API_BASE_URL = getBackendUrl();

console.log(`[API Config] 🌐 Connected API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API Request] Error retrieving auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
    }

    if (!error.response && error.message === 'Network Error') {
      console.warn(
        `[API Network Error]: Unable to reach backend at ${API_BASE_URL}. Ensure your phone is on the same Wi-Fi and the backend server is running on port 5000.`
      );
    }

    return Promise.reject(error);
  }
);

export default api;
