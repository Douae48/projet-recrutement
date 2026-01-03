<<<<<<< HEAD
// Responsable de la gestion des offres d'emploi
exports.getAllJobs = async (req, res) => {
    res.status(200).json({ message: "Liste des jobs (en attente...)" });
=======
// On importe le service déjà codé par l'étudiante A
const RecommendationService = require('../services/RecommendationService');

// Fonction pour recommander des jobs à un candidat
exports.getRecommendedJobs = async (req, res) => {
    try {
        const candidateId = req.params.id; // On récupère l'ID depuis l'URL
        
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
>>>>>>> main
};