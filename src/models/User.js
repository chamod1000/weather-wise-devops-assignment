import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  preferences: {
    unit: {
      type: String,
      default: 'C',
    }
  },
  profilePicture: {
    type: String,
    default: ''
  },
  savedCities: [{
    name: String,
    country: String,
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
