const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');

// @desc    Get all posts (paginated)
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'latest';
    const skip = (page - 1) * limit;
    
    let sortOption = {};
    switch (sort) {
      case 'latest':
        sortOption = { createdAt: -1 };
        break;
      case 'mostLiked':
        sortOption = { likeCount: -1, createdAt: -1 };
        break;
      case 'mostCommented':
        sortOption = { commentCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const query = { isPublished: true, isDeleted: false };
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('author', 'username ign rank avatarUrl profilePicture isOnline')
        .lean(),
      Post.countDocuments(query)
    ]);
    
    if (req.user) {
      const postIds = posts.map(p => p._id);
      const userLikes = await Like.find({
        user: req.user._id,
        targetType: 'post',
        targetId: { $in: postIds }
      });
      
      const likedMap = new Map(userLikes.map(l => [l.targetId.toString(), true]));
      posts.forEach(post => {
        post.userLiked = likedMap.has(post._id.toString());
      });
    } else {
      posts.forEach(post => {
        post.userLiked = false;
      });
    }
    
    res.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false })
      .populate('author', 'username ign rank avatarUrl profilePicture isOnline');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (req.user) {
      const like = await Like.findOne({
        user: req.user._id,
        targetType: 'post',
        targetId: post._id
      });
      post._doc.userLiked = !!like;
    } else {
      post._doc.userLiked = false;
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, rank, images, category } = req.body;
    
    const post = await Post.create({
      author: req.user._id,
      title: title || '',
      content,
      rank: rank || req.user.rank,
      images: images || [],
      category: category || 'regular'
    });
    
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: 1 } });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }
    
    const { title, content, rank, images, category } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (rank !== undefined) post.rank = rank;
    if (images !== undefined) post.images = images;
    if (category !== undefined) post.category = category;
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    post.isDeleted = true;
    await post.save();
    
    await User.findByIdAndUpdate(post.author, { $inc: { postCount: -1 } });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { author: req.params.userId, isPublished: true, isDeleted: false };
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username ign rank avatarUrl profilePicture isOnline'),
      Post.countDocuments(query)
    ]);
    
    res.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
};
