/**
 * List all users in the database
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-dashboard';

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

async function listUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find().select('name email role');
    
    console.log(`Found ${users.length} user(s):\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

listUsers();
