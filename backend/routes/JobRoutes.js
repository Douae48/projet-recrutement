const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');

<<<<<<< HEAD
router.get('/', JobController.getAllJobs);
=======
// L'URL sera : /api/jobs/recommendations/can1
router.get('/recommendations/:id', JobController.getRecommendedJobs);

// L'URL sera : /api/jobs/stats
router.get('/stats', JobController.getStats);
>>>>>>> main

module.exports = router;