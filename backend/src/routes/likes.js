const express = require('express');
const router = express.Router();
const { toggleLike, getUserLikes } = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/post/:postId', protect, toggleLike);
router.get('/me', protect, getUserLikes);

module.exports = router;
