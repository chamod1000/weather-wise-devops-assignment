import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  ip: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
