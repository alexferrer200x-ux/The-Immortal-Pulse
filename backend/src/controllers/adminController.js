const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get dashboard statistics
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalComments, bannedUsers, unreadMessages] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments({ isDeleted: false }),
      Comment.countDocuments({ isDeleted: false }),
      User.countDocuments({ isBanned: true }),
      ContactMessage.countDocuments({ isRead: false })
    ]);
    
    res.json({ totalUsers, totalPosts, totalComments, bannedUsers, unreadMessages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users (with online status)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);
    
    res.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Ban a user
const banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot ban an admin user' });
    
    user.isBanned = true;
    user.banReason = reason || 'Violation of community guidelines';
    user.bannedAt = new Date();
    await user.save();
    
    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Unban a user
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
    await user.save();
    
    res.json({ message: 'User unbanned successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete an admin user' });
    
    await Post.updateMany({ author: user._id }, { isDeleted: true });
    await Comment.updateMany({ author: user._id }, { isDeleted: true });
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Change user role (promote/demote)
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(403).json({ error: 'You cannot change your own role' });
    }
    
    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      success: true,
      message: `${user.username} is now a ${role === 'admin' ? 'Admin' : 'regular user'}`,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all posts (admin view)
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      Post.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username email rank isOnline'),
      Post.countDocuments({ isDeleted: false })
    ]);
    
    res.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete any post (admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.isDeleted = true;
    await post.save();
    await User.findByIdAndUpdate(post.author, { $inc: { postCount: -1 } });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all contact messages
const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [messages, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments()
    ]);
    
    res.json({ messages, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Mark message as read
const markMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    
    message.isRead = true;
    await message.save();
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete contact message
const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ isBanned: false })
      .select('username ign rank rankPoints avatarUrl isOnline')
      .sort({ rankPoints: -1 })
      .limit(50);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  changeUserRole,
  getAllPosts,
  deletePost,
  getAllMessages,
  markMessageRead,
  deleteMessage,
  getLeaderboard
};
