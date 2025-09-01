import axios from 'axios';

const API_URL = 'http://localhost:8000/auth'; // change selon ton backend

export const authService = {
  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { access_token, user } = response.data;

    // Stocker le token dans le localStorage ou cookie
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return { access_token, user };
  },

  async logout() {
    // Supprimer le token localement
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // (optionnel) appeler l'endpoint logout
    await axios.post(`${API_URL}/logout`);

    return { message: 'Déconnexion réussie' };
  },

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data; // contient resetToken
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};
