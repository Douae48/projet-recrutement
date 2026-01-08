// src/api/jobs.js
// API pour les offres d'emploi et recommandations

import apiClient from './client';

/**
 * Récupérer les recommandations d'emploi pour le candidat connecté
 * Endpoint: GET /api/jobs/recommendations/:candidateId
 * Note: L'ID du candidat est extrait du token côté backend
 */
export const getRecommendedJobs = async () => {
  try {
    // Le backend extraira l'ID du candidat depuis le token JWT
    const response = await apiClient.get('/jobs/recommendations/me');
    return response.data;
  } catch (error) {
    console.error('Erreur getRecommendedJobs:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer les statistiques (nombre total d'offres)
 * Endpoint: GET /api/jobs/stats
 */
export const getStats = async () => {
  try {
    const response = await apiClient.get('/jobs/stats');
    return response.data;
  } catch (error) {
    console.error('Erreur getStats:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Publier une nouvelle offre d'emploi (Recruteur)
 * Endpoint: POST /api/data/post-job
 * @param {Object} jobData - { title, salaryRange, skills }
 */
export const postJob = async (jobData) => {
  try {
    const response = await apiClient.post('/data/post-job', jobData);
    return response.data;
  } catch (error) {
    console.error('Erreur postJob:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer les détails d'une offre
 * Endpoint: GET /api/jobs/:jobId
 */
export const getJobDetails = async (jobId) => {
  try {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur getJobDetails:', error.response?.data || error.message);
    throw error;
  }
};

// ===== FONCTIONNALITÉS RECRUTEUR =====

/**
 * Récupérer les offres postées par le recruteur connecté
 * Endpoint: GET /api/jobs/my-jobs
 */
export const getRecruiterJobs = async () => {
  try {
    const response = await apiClient.get('/jobs/my-jobs');
    return response.data;
  } catch (error) {
    console.error('Erreur getRecruiterJobs:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer les candidats recommandés pour une offre spécifique
 * Endpoint: GET /api/jobs/:jobId/candidates
 * @param {string} jobId - L'ID de l'offre
 */
export const getRecommendedCandidates = async (jobId) => {
  try {
    const response = await apiClient.get(`/jobs/${jobId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Erreur getRecommendedCandidates:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupérer tous les candidats recommandés pour toutes les offres du recruteur
 * Endpoint: GET /api/jobs/all-candidates
 */
export const getAllRecommendedCandidates = async () => {
  try {
    const response = await apiClient.get('/jobs/all-candidates');
    return response.data;
  } catch (error) {
    console.error('Erreur getAllRecommendedCandidates:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Supprimer une offre d'emploi (Recruteur)
 * Endpoint: DELETE /api/data/jobs/:jobId
 * @param {string} jobId - L'ID de l'offre à supprimer
 */
export const deleteJob = async (jobId) => {
  try {
    const response = await apiClient.delete(`/data/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur deleteJob:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mettre à jour une offre d'emploi (Recruteur)
 * Endpoint: PUT /api/data/jobs/:jobId
 * @param {string} jobId - L'ID de l'offre
 * @param {Object} updates - { title, salaryRange, skills }
 */
export const updateJob = async (jobId, updates) => {
  try {
    const response = await apiClient.put(`/data/jobs/${jobId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Erreur updateJob:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Postuler à une offre d'emploi (Candidat)
 * Endpoint: POST /api/data/apply
 * @param {string} jobId - L'ID de l'offre
 */
export const applyToJob = async (jobId) => {
  try {
    const response = await apiClient.post('/data/apply', { jobId });
    return response.data;
  } catch (error) {
    console.error('Erreur applyToJob:', error.response?.data || error.message);
    throw error;
  }
};