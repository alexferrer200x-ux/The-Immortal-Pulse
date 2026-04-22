const express = require('express');
const router = express.Router();
const { getUserProfile, getUserStats } = require('../controllers/userController');
const { optionalAuth } = require('../middleware/auth');

router.get('/:id', optionalAuth, getUserProfile);
router.get('/:id/stats', getUserStats);

module.exports = router;
