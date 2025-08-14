// src/apiClient.js
import axios from 'axios';
import { AppConstants } from './utils/constant'; // adjust the path if needed

const apiClient = axios.create({
  baseURL: AppConstants.BACKEND_URL,
  timeout: 10000,
});

// 🔐 Add token automatically to every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;