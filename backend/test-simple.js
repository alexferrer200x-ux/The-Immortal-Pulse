const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI);

// Set a timeout
const timeout = setTimeout(() => {
  console.error('❌ Connection timeout after 10 seconds');
  process.exit(1);
}, 10000);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
})
.then(() => {
  clearTimeout(timeout);
  console.log('✅ Connected!');
  process.exit(0);
})
.catch(err => {
  clearTimeout(timeout);
  console.error('❌ Error:', err.message);
  process.exit(1);
});
