/**
 * Reset Admin Password
 * 
 * This script resets the password for the admin account.
 * Run with: node scripts/reset-admin-password.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

async function resetAdminPassword() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const adminEmail = 'admin@gmail.com';
    const newPassword = 'admin1234';

    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('❌ Admin account not found. Run: npm run admin:create');
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    admin.password = hashedPassword;
    admin.role = 'admin'; // Ensure role is set
    await admin.save();

    console.log('✅ Admin password has been reset successfully!\n');
    console.log('📋 Admin Credentials:');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 You can now log in with these credentials!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

resetAdminPassword();
