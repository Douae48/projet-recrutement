// src/api/profile.js
// API pour la gestion du profil et des compétences

import apiClient from './client';

/**
 * Ajouter une compétence au profil du candidat
 * Endpoint: POST /api/data/add-skill
 * @param {string} label - Le nom de la compétence (ex: "React", "Node.js")
 */
export const addSkillToProfile = async (label) => {
  try {
    const response = await apiClient.post('/data/add-skill', { label });
    return response.data;
  } catch (error) {
    console.error('Erreur addSkillToProfile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer les compétences du candidat connecté
 * Endpoint: GET /api/data/my-skills
 */
export const getMySkills = async () => {
  try {
    const response = await apiClient.get('/data/my-skills');
    return response.data.skills || [];
  } catch (error) {
    console.error('Erreur getMySkills:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Supprimer une compétence du profil
 * Endpoint: DELETE /api/data/remove-skill
 * @param {string} label - Le nom de la compétence à supprimer
 */
export const removeSkillFromProfile = async (label) => {
  try {
    const response = await apiClient.delete('/data/remove-skill', { data: { label } });
    return response.data;
  } catch (error) {
    console.error('Erreur removeSkillFromProfile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer les informations du profil complet
 * Endpoint: GET /api/data/profile
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/data/profile');
    return response.data;
  } catch (error) {
    console.error('Erreur getProfile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mettre à jour le profil utilisateur
 * Endpoint: PUT /api/data/profile
 * @param {Object} updates - { name, email }
 */
export const updateProfile = async (updates) => {
  try {
    const response = await apiClient.put('/data/profile', updates);
    return response.data;
  } catch (error) {
    console.error('Erreur updateProfile:', error.response?.data || error.message);
    throw error;
  }
};