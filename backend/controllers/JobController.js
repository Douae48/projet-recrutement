// On importe le service déjà codé par l'étudiante A
const RecommendationService = require('../services/RecommendationService');

// Fonction pour recommander des jobs à un candidat
exports.getRecommendedJobs = async (req, res) => {
    try {
        // Support de 'me' pour récupérer l'ID depuis le token
        let candidateId = req.params.id;
        if (candidateId === 'me' && req.userData) {
            candidateId = req.userData.userId;
        }
        
        // On demande au "cerveau" (le service) de faire le calcul
        const jobs = await RecommendationService.getRecommendedJobs(candidateId);
        
        res.status(200).json(jobs); // On envoie le résultat en JSON
    } catch (error) {
        console.error("Erreur Controller :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des jobs" });
    }
};

// Fonction pour les statistiques
exports.getStats = async (req, res) => {
    try {
        const stats = await RecommendationService.getStats();
        res.status(200).json({ totalJobs: stats });
    } catch (error) {
        res.status(500).json({ message: "Erreur statistiques" });
    }
};

// Récupérer les offres d'un recruteur
exports.getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.userData.userId;
        const jobs = await RecommendationService.getRecruiterJobs(recruiterId);
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Erreur getRecruiterJobs:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
};

// Récupérer les candidats recommandés pour une offre spécifique
exports.getRecommendedCandidates = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidates = await RecommendationService.getRecommendedCandidates(jobId);
        res.status(200).json(candidates);
    } catch (error) {
        console.error("Erreur getRecommendedCandidates:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des candidats" });
    }
};

// Récupérer tous les candidats recommandés pour toutes les offres du recruteur
exports.getAllRecommendedCandidates = async (req, res) => {
    try {
        const recruiterId = req.userData.userId;
        const candidates = await RecommendationService.getAllRecommendedCandidatesForRecruiter(recruiterId);
        res.status(200).json(candidates);
    } catch (error) {
        console.error("Erreur getAllRecommendedCandidates:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des candidats" });
    }
};