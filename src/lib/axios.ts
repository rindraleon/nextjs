import axios from 'axios';

import { AxiosInstance } from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${token}`
  },  
  withCredentials: true, // Pour les cookies de session si nécessaire
  params: {
    // Vous pouvez ajouter des paramètres par défaut ici si nécessaire
  } 
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

// Intercepteur pour ajouter le token JWT


export const setupAxiosInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Rediriger vers la page de login si non autorisé
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
