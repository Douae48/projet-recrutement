const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');
const auth = require('../middlewares/authMiddleware');

router.post('/add-skill', auth, DataController.addSkill);
router.post('/post-job', auth, DataController.postJob);

module.exports = router;