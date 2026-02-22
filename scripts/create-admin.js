/**
 * Create Admin Account
 * 
 * This script creates the admin account with full administrative privileges.
 * Run this script with: node scripts/create-demo-admin.js
 * 
 * Admin credentials:
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

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin1234';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      
      // Update to admin role and reset password if not already
      if (existingAdmin.role !== 'admin' || process.argv[2] === '--force') {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingAdmin.role = 'admin';
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role and reset password');
      }
      
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      gender: 'other',
      isBanned: false,
      preferences: {
        unit: 'C'
      },
      savedCities: []
    });

    console.log('✅ Successfully created admin account!\n');
    console.log('📋 Admin Credentials:');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 You can now log in with these credentials!');
    console.log('🔗 Admin Panel: http://localhost:3000/admin\n');
    console.log('✅ This is a production-ready admin account with full privileges.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

createDemoAdmin();
