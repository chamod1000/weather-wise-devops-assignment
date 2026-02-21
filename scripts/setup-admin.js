/**
 * Admin Setup Script
 * 
 * This script helps you promote a user to admin role.
 * Run this script with: node scripts/setup-admin.js [email]
 * 
 * Example: node scripts/setup-admin.js admin@example.com
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-wise';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  gender: String,
  isBanned: Boolean,
  lastLogin: Date,
  preferences: Object,
  profilePicture: String,
  savedCities: Array,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function setupAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = process.argv[2];

    if (!email) {
      console.log('📋 Available users:');
      const users = await User.find().select('name email role');
      
      if (users.length === 0) {
        console.log('❌ No users found. Please register a user first.');
        process.exit(1);
      }

      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
      
      console.log('\n💡 Usage: node scripts/setup-admin.js [email]');
      console.log('Example: node scripts/setup-admin.js admin@example.com');
      process.exit(0);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User with email "${email}" not found.`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  User "${user.name}" (${user.email}) is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted "${user.name}" (${user.email}) to admin!`);
    console.log('\n🎉 You can now log in as admin and access /admin routes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

setupAdmin();
