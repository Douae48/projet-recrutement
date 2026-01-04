import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://crazy-beds-beam.loca.lt/api',
  timeout: 10000,
});

// Ajouter l’intercepteur pour la sécurité (optionnel)
apiClient.interceptors.request.use(
  async (config) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
