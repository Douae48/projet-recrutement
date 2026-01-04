import apiClient from './client';

export const loginUser = async (email, password) => {
    try {
        // On envoie les infos au backend
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data; // Contient { token, roles, user }
    } catch (error) {
        console.error("Erreur API Login:", error.response?.data || error.message);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        // userData doit contenir { name, email, password, role }
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Erreur API Register:", error.response?.data || error.message);
        throw error;
    }
};