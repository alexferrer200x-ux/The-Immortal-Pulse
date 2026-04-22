const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { protect } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test route - ENHANCED
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Upload route is working!',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryConfig: {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    }
  });
});

// Profile storage
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'immortal-pulse/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }]
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

// ✅ PROFILE UPLOAD - FIXED
router.post('/profile', protect, profileUpload.single('image'), (req, res) => {
  try {
    console.log('📤 Profile upload for user:', req.user?.id || req.user?._id);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    console.log('✅ Uploaded to:', req.file.path);
    res.json({ 
      success: true,
      url: req.file.path 
    });
  } catch (error) {
    console.error('💥 Profile upload failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Post images upload
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'immortal-pulse/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const postUpload = multer({
  storage: postStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/posts', protect, postUpload.array('images', 5), (req, res) => {
  try {
    const files = req.files;
    if (!files?.length) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const urls = files.map(file => file.path);
    console.log('✅ Post images:', urls.length, 'files');
    res.json({ urls });
  } catch (error) {
    console.error('💥 Post upload failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;