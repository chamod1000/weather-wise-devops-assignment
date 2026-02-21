/**
 * Create Demo Admin Account
 * 
 * This script creates a default admin account for demonstration/testing purposes.
 * Run this script with: node scripts/create-demo-admin.js
 * 
 * Default credentials:
 * Email: admin@gmail.com
 * Password: admin1234
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

async function createDemoAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const demoEmail = 'admin@gmail.com';
    const demoPassword = 'admin1234';
    const demoName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: demoEmail });

    if (existingAdmin) {
      console.log('⚠️  Demo admin account already exists!');
      console.log(`📧 Email: ${demoEmail}`);
      console.log(`🔑 Password: ${demoPassword}`);
      
      // Update to admin role and reset password if not already
      if (existingAdmin.role !== 'admin' || process.argv[2] === '--force') {
        const hashedPassword = await bcrypt.hash(demoPassword, 10);
        existingAdmin.role = 'admin';
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role and reset password');
      }
      
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    // Create new admin user
    const adminUser = await User.create({
      name: demoName,
      email: demoEmail,
      password: hashedPassword,
      role: 'admin',
      gender: 'other',
      isBanned: false,
      preferences: {
        unit: 'C'
      },
      savedCities: []
    });

    console.log('✅ Successfully created demo admin account!\n');
    console.log('📋 Demo Admin Credentials:');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email:    ${demoEmail}`);
    console.log(`🔑 Password: ${demoPassword}`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 You can now log in with these credentials!');
    console.log('🔗 Admin Panel: http://localhost:3000/admin\n');
    console.log('⚠️  IMPORTANT: Change these credentials in production!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

createDemoAdmin();
