import axios from 'axios';

const apiClient = axios.create({
  // 1. UTILISER TON LIEN LOCALTUNNEL (obligatoire pour le travail à distance)
  baseURL: 'https://crazy-beds-beam.loca.lt/api', // Remplace par ton URL LocalTunnel
  timeout: 10000,
});

// 2. AJOUTER L'INTERCEPTEUR POUR LA SÉCURITÉ (Badge 401)
apiClient.interceptors.request.use(
  async (config) => {
    // Pour tester tout de suite, elle doit mettre ici le token 
    // que tu as reçu dans Thunder Client lors de ton Login
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmN2Q5ZGJmLWU0YjMtNGFmYS05MjA2LWU3YjQ4MmZiZWFjYiIsImVtYWlsIjoiYW1pbmUucHJvQGV4YW1wbGUubWEiLCJyb2xlcyI6WyJDYW5kaWRhdGUiXSwiaWF0IjoxNzY3NTU0MTMwLCJleHAiOjE3Njc2NDA1MzB9.WkvE1Pgkf7hPKnHGnU43Q7LJ4UuCyLZ42-U1J48Ppok"; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;