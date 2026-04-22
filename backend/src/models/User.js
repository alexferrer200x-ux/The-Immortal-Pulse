const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RANKS = ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory', 'Mythical Immortal'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  bannedAt: Date,
  
  // Online Status
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  // Profile Picture
  profilePicture: {
    type: String,
    default: ''
  },
  
  // MLBB Profile
  ign: {
    type: String,
    trim: true,
    maxlength: [30, 'IGN cannot exceed 30 characters']
  },
  gameId: {
    type: String,
    trim: true,
    match: [/^\d+$/, 'Game ID must contain only numbers']
  },
  rank: {
    type: String,
    enum: RANKS,
    default: 'Warrior'
  },
  rankPoints: {
    type: Number,
    default: 0,
    min: 0,
    max: 2000
  },
  
  // Profile
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Stats
  postCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update lastActive on any interaction
userSchema.methods.updateActivity = async function() {
  this.lastActive = new Date();
  this.isOnline = true;
  await this.save();
};

// Set offline after inactivity (called from logout)
userSchema.methods.setOffline = async function() {
  this.isOnline = false;
  this.lastSeen = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
