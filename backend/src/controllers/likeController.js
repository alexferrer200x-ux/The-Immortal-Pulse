const Like = require('../models/Like');
const Post = require('../models/Post');

// Toggle like on a post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      targetType: 'post',
      targetId: postId
    });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();
      return res.json({ liked: false, likeCount: post.likeCount });
    } else {
      // Like
      await Like.create({
        user: userId,
        targetType: 'post',
        targetId: postId
      });
      post.likeCount += 1;
      await post.save();
      return res.json({ liked: true, likeCount: post.likeCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's liked posts
const getUserLikes = async (req, res) => {
  try {
    const likes = await Like.find({ 
      user: req.user._id, 
      targetType: 'post' 
    }).select('targetId');
    const likedPostIds = likes.map(like => like.targetId);
    res.json(likedPostIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { toggleLike, getUserLikes };
