import apiClient from './client';

export const getJobRecommendations = async (candidateId) => {
  try {
    const response = await apiClient.get(`/jobs/recommendations/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};