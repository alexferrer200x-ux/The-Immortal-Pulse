const express = require('express');
const router = express.Router();
const {
  getPostComments,
  createComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public route (with optional auth for like status)
router.get('/post/:postId', optionalAuth, getPostComments);

// Protected routes (require authentication)
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

module.exports = router;