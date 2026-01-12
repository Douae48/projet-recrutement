const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

// Routes pour les compétences (Candidat)
router.post('/add-skill', DataController.addSkill);
router.get('/my-skills', DataController.getMySkills);
router.delete('/remove-skill', DataController.removeSkill);

// Routes pour le profil
router.get('/profile', DataController.getProfile);
router.put('/profile', DataController.updateProfile);

// Route pour poster un job (Recruteur)
router.post('/post-job', DataController.postJob);

// Routes pour gérer les offres (Recruteur)
router.delete('/jobs/:jobId', DataController.deleteJob);
router.put('/jobs/:jobId', DataController.updateJob);

module.exports = router;