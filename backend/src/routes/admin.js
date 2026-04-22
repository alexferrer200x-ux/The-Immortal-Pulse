const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllMessages,
  markMessageRead,
  deleteMessage,
  getLeaderboard,
  changeUserRole
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// All admin routes require authentication AND admin role
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/stats', getStats);
router.get('/leaderboard', getLeaderboard);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

// Post management
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);

// Message management
router.get('/messages', getAllMessages);
router.put('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
