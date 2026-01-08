// src/api/client.js
// Client Axios configuré avec intercepteur pour le token JWT

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANT: Utiliser http:// (pas https) pour le développement local
// Remplacer localhost par votre IP locale si vous testez sur appareil physique
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : Ajoute automatiquement le token JWT
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur récupération token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion globale des erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si erreur 401, le token est invalide/expiré
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      // Ici on pourrait déclencher une déconnexion automatique
    }
    return Promise.reject(error);
  }
);

export default apiClient;
