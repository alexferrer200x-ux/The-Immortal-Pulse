const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  category: {
    type: String,
    enum: ['bug', 'report', 'inquiry', 'feedback'],
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isReplied: {
    type: Boolean,
    default: false
  },
  repliedAt: Date,
  replyMessage: String
}, {
  timestamps: true
});

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ isRead: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);