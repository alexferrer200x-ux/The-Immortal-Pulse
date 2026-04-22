const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
const getPostComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      Comment.find({ post: req.params.postId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username ign rank avatarUrl'),
      Comment.countDocuments({ post: req.params.postId, isDeleted: false })
    ]);
    
    // Check if current user liked each comment
    if (req.user) {
      const commentIds = comments.map(c => c._id);
      const userLikes = await Like.find({
        user: req.user._id,
        targetType: 'comment',
        targetId: { $in: commentIds }
      });
      
      const likedMap = new Map(userLikes.map(l => [l.targetId.toString(), true]));
      comments.forEach(comment => {
        comment._doc.userLiked = likedMap.has(comment._id.toString());
      });
    } else {
      comments.forEach(comment => {
        comment._doc.userLiked = false;
      });
    }
    
    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Create comment
    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content
    });
    
    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    
    // Update user comment count
    await User.findByIdAndUpdate(req.user._id, { $inc: { commentCount: 1 } });
    
    // Populate author info
    await comment.populate('author', 'username ign rank avatarUrl');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check ownership or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    comment.isDeleted = true;
    await comment.save();
    
    // Update post comment count
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    
    // Update user comment count
    await User.findByIdAndUpdate(comment.author, { $inc: { commentCount: -1 } });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Like or unlike a comment
// @route   POST /api/comments/:id/like
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if already liked
    const existingLike = await Like.findOne({
      user: req.user._id,
      targetType: 'comment',
      targetId: comment._id
    });
    
    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      comment.likeCount = Math.max(0, comment.likeCount - 1);
      await comment.save();
      res.json({ liked: false, likeCount: comment.likeCount });
    } else {
      // Like
      await Like.create({
        user: req.user._id,
        targetType: 'comment',
        targetId: comment._id
      });
      comment.likeCount += 1;
      await comment.save();
      res.json({ liked: true, likeCount: comment.likeCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPostComments,
  createComment,
  deleteComment,
  likeComment
};