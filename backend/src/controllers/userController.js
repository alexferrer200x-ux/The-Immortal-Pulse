const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
const getUserStats = async (req, res) => {
  try {
    const postCount = await Post.countDocuments({ 
      author: req.params.id, 
      isDeleted: false 
    });
    
    res.json({
      postCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, getUserStats };