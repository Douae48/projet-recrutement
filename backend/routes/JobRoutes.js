const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
// L'URL sera : /api/jobs/stats
router.get('/stats', JobController.getStats);

// Route protégée pour les candidats (nécessite auth pour extraire l'ID du token)
// L'URL sera : /api/jobs/recommendations/me
router.get('/recommendations/:id', authMiddleware, JobController.getRecommendedJobs);

// Routes protégées pour recruteurs
// Récupérer les offres du recruteur connecté
router.get('/my-jobs', authMiddleware, JobController.getRecruiterJobs);

// Récupérer tous les candidats recommandés pour toutes les offres du recruteur
router.get('/all-candidates', authMiddleware, JobController.getAllRecommendedCandidates);

// Récupérer les candidats recommandés pour une offre (doit être après les routes spécifiques)
router.get('/:jobId/candidates', authMiddleware, JobController.getRecommendedCandidates);


module.exports = router;