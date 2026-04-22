const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, ign, gameId } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      ign: ign || username,
      gameId: gameId || '',
      isOnline: true,
      lastSeen: new Date()
    });
    
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ign: user.ign,
        rank: user.rank,
        isOnline: user.isOnline,
        profilePicture: user.profilePicture || ''
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned', banReason: user.banReason });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    user.isOnline = true;
    user.lastActive = new Date();
    user.lastSeen = new Date();
    await user.save();
    
    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ign: user.ign,
        rank: user.rank,
        postCount: user.postCount,
        isOnline: user.isOnline,
        profilePicture: user.profilePicture || '',
        bio: user.bio || '',
        gameId: user.gameId || '',
        likeCount: user.likeCount || 0,
        commentCount: user.commentCount || 0,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { 
      isOnline: false, 
      lastSeen: new Date() 
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received');
    console.log('Body keys:', Object.keys(req.body));
    
    const { username, ign, gameId, bio, rank, rankPoints, profilePicture } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (username !== undefined) user.username = username;
    if (ign !== undefined) user.ign = ign;
    if (gameId !== undefined) user.gameId = gameId;
    if (bio !== undefined) user.bio = bio;
    if (rank !== undefined) user.rank = rank;
    if (rankPoints !== undefined) user.rankPoints = rankPoints;
    
    if (profilePicture !== undefined && profilePicture !== '') {
      console.log('Profile picture length:', profilePicture.length);
      user.profilePicture = profilePicture;
    }
    
    await user.save();
    console.log('User saved successfully');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ign: user.ign,
        gameId: user.gameId,
        bio: user.bio,
        rank: user.rank,
        rankPoints: user.rankPoints,
        postCount: user.postCount,
        isOnline: user.isOnline,
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt,
        likeCount: user.likeCount || 0,
        commentCount: user.commentCount || 0
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, logout, getMe, updateProfile };
