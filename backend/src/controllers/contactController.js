const ContactMessage = require('../models/ContactMessage');

// @desc    Send contact message
// @route   POST /api/contact
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !category || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      category,
      subject,
      message
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendContactMessage };