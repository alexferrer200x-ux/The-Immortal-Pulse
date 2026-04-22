require('dotenv').config();

console.log('🔍 LOADING .env...');
console.log('CLOUDINARY_CLOUD_NAME:', !!process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
console.log('JWT_SECRET:', !!process.env.JWT_SECRET ? '✅' : '❌');
console.log('MONGODB_URI:', !!process.env.MONGODB_URI ? '✅' : '❌');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Import routes
const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/post');
const commentRoutes = require('./src/routes/comments');
const userRoutes = require('./src/routes/user');
const adminRoutes = require('./src/routes/admin');
const contactRoutes = require('./src/routes/contact');
const likeRoutes = require('./src/routes/likes');
const uploadRoutes = require('./src/routes/upload');

console.log('✅ All routes loaded');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS configuration - Allow Netlify frontend
const allowedOrigins = process.env.CORS_ORIGIN 
  ? [process.env.CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:5001']
  : ['http://localhost:5173', 'http://localhost:5001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api', limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Middleware loaded');
console.log('CORS allowed origins:', allowedOrigins);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🔥 The Immortal Pulse API',
    version: '1.0.0',
    status: 'Running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/upload', uploadRoutes);

console.log('✅ Routes registered');

// NON-BLOCKING MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('✅ MongoDB Connected to immortal_pulse_db'))
.catch(err => {
  console.error('⚠️  MongoDB failed:', err.message);
  console.log('🚀 Server continues without MongoDB');
});

// 404 Handler
app.use((req, res) => {
  console.log('404:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error' });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running → http://localhost:${PORT}`);
  console.log(`📱 Test → http://localhost:${PORT}/api/upload/test`);
  console.log(`📁 Uploads → http://localhost:${PORT}/uploads`);
});// v2 deployment
