const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');

const samplePosts = [
  {
    title: 'Welcome to The Immortal Pulse!',
    content: 'This is our community for MLBB players. Share your strategies, highlights, and connect with fellow gamers!',
    rank: 'Mythical Glory'
  },
  {
    title: 'Best Assassin Build for 2024',
    content: 'After reaching Mythical Immortal last season, I want to share my favorite assassin build. Let me know your thoughts!',
    rank: 'Mythical Immortal'
  },
  {
    title: 'Looking for squad members',
    content: 'Epic rank player looking for serious teammates. I mainly play Gold Lane and Jungle. Add me in game!',
    rank: 'Epic'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('📦 Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@theimmortalpulse.com',
      password: hashedPassword,
      role: 'admin',
      ign: 'ImmortalAdmin',
      rank: 'Mythical Immortal',
      rankPoints: 1500,
      bio: 'Community Administrator'
    });
    console.log('👑 Admin user created');
    console.log('   Email: admin@theimmortalpulse.com');
    console.log('   Password: Admin123!');

    // Create regular users
    const users = await User.create([
      {
        username: 'mlbb_pro',
        email: 'pro@example.com',
        password: await bcrypt.hash('Player123!', 10),
        ign: 'MLBB_ProPlayer',
        rank: 'Mythic',
        rankPoints: 800,
        bio: 'Competitive player since 2019'
      },
      {
        username: 'tank_main',
        email: 'tank@example.com',
        password: await bcrypt.hash('Player123!', 10),
        ign: 'TankGod',
        rank: 'Legend',
        rankPoints: 650,
        bio: 'Tank main, love playing Franco and Tigreal'
      },
      {
        username: 'mage_lover',
        email: 'mage@example.com',
        password: await bcrypt.hash('Player123!', 10),
        ign: 'MageMaster',
        rank: 'Epic',
        rankPoints: 450,
        bio: 'Eudora and Kagura main'
      }
    ]);
    console.log(`👥 Created ${users.length} regular users`);

    // Create sample posts
    for (let i = 0; i < samplePosts.length; i++) {
      const post = await Post.create({
        author: i === 0 ? admin._id : users[i % users.length]._id,
        title: samplePosts[i].title,
        content: samplePosts[i].content,
        rank: samplePosts[i].rank,
        isPublished: true
      });
      
      // Add comments to first post
      if (i === 0) {
        await Comment.create([
          {
            post: post._id,
            author: users[0]._id,
            content: 'Great to be here! Looking forward to learning from everyone.'
          },
          {
            post: post._id,
            author: users[1]._id,
            content: 'This community looks awesome! Let\'s grind together!'
          }
        ]);
      }
    }
    console.log('📝 Created sample posts and comments');

    console.log('\n✅ Database seeding completed!');
    console.log('\n📋 Test Login Credentials:');
    console.log('   Admin: admin@theimmortalpulse.com / Admin123!');
    console.log('   User 1: pro@example.com / Player123!');
    console.log('   User 2: tank@example.com / Player123!');
    console.log('   User 3: mage@example.com / Player123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();