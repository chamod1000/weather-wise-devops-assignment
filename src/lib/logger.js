import ActivityLog from '@/models/ActivityLog';
import dbConnect from './db';

export async function logAction(userId, action, details, ip = 'Unknown') {
  try {
    await dbConnect();
    await ActivityLog.create({
      user: userId,
      action,
      details,
      ip
    });
  } catch (error) {
    console.error("Failed to create log", error);
  }
}
