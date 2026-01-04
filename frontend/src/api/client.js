import axios from 'axios';

const apiClient = axios.create({
  // 10.0.2.2 is the alias for localhost in Android Emulator
  // For iOS Simulator, use http://localhost:5000
  baseURL: 'http://192.168.1.9:5000/api',
  timeout: 10000,
});

export default apiClient;