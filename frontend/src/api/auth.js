import apiClient from './client';

export const loginUser = async (email, password) => {
    try {
        // On envoie les infos au backend
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data; 
    } catch (error) {
        const err = new Error(error.response?.data?.message || "Erreur de connexion");
        err.status = error.response?.status;
        throw err;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erreur lors de l'inscription";
        throw new Error(errorMessage);
    }
};