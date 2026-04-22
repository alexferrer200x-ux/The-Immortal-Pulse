const mongoose = require('mongoose');

const RANKS = ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory', 'Mythical Immortal'];

const POST_CATEGORIES = [
  'regular', 'patch_update', 'hero_guide', 'new_strategy', 
  'website_bugs', 'game_bugs', 'new_meta_heroes', 'meta_builds'
];

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: POST_CATEGORIES,
    default: 'regular'
  },
  images: {
    type: [String],
    default: []
  },
  rank: {
    type: String,
    enum: RANKS,
    default: 'Warrior'
  },
  
  // Stats
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isPublished: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true
});

// Indexes for efficient queries
postSchema.index({ createdAt: -1 });
postSchema.index({ likeCount: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model('Post', postSchema);
