import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000,
});

// Cet intercepteur est "magique" : il s'exécute AVANT chaque appel API
apiClient.interceptors.request.use(
  async (config) => {
    // 1. On va chercher le badge dans la mémoire du téléphone
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      // 2. Si on trouve un badge, on le colle sur la requête
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 3. Si pas de badge (cas du Login/Register), la requête part "vide", et c'est normal !
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
