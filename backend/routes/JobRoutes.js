const express = require('express');
const router = express.Router();
const JobController = require('../controllers/JobController');

router.get('/', JobController.getAllJobs);

module.exports = router;