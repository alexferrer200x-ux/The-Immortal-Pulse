const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for like status)
router.get('/', optionalAuth, getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes (require authentication)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;