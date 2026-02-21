import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import ContactMessage from '@/models/ContactMessage';
import ActivityLog from '@/models/ActivityLog';
import FeaturedCity from '@/models/FeaturedCity';
import Notification from '@/models/Notification';
import SystemSetting from '@/models/SystemSetting';
import jwt from 'jsonwebtoken';
import { logAction } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create backup of all collections
    const users = await User.find().select('-password').lean();
    const messages = await ContactMessage.find().lean();
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(1000).lean();
    const cities = await FeaturedCity.find().lean();
    const notifications = await Notification.find().lean();
    const settings = await SystemSetting.find().lean();

    const backup = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      collections: {
        users: { count: users.length, data: users },
        messages: { count: messages.length, data: messages },
        activityLogs: { count: logs.length, data: logs },
        featuredCities: { count: cities.length, data: cities },
        notifications: { count: notifications.length, data: notifications },
        settings: { count: settings.length, data: settings },
      }
    };

    await logAction(admin._id, 'ADMIN_ACTION', 'Created database backup');

    return NextResponse.json(backup);
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
