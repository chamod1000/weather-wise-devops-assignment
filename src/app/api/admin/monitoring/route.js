import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get API call statistics from activity logs
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    const totalApiCalls = await ActivityLog.countDocuments({ createdAt: { $gte: today } });
    
    // Simulated endpoint statistics (in real app, track these)
    const endpointStats = [
      { endpoint: '/api/weather', calls: 145 },
      { endpoint: '/api/forecast', calls: 98 },
      { endpoint: '/api/search', calls: 67 },
      { endpoint: '/api/favorites', calls: 52 },
      { endpoint: '/api/user', calls: 41 },
      { endpoint: '/api/auth/*', calls: 33 },
    ];

    return NextResponse.json({
      totalApiCalls,
      avgResponseTime: 0.8,
      errorRate: 0.2,
      endpointStats,
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
