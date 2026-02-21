import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import ContactMessage from '@/models/ContactMessage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Basic stats
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    
    // User activity
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const activeUsersLast7Days = await User.countDocuments({ lastLogin: { $gte: last7Days } });
    const activeUsersLast30Days = await User.countDocuments({ lastLogin: { $gte: last30Days } });
    const newUsersLast7Days = await User.countDocuments({ createdAt: { $gte: last7Days } });
    const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: last30Days } });
    
    // Saved cities
    const users = await User.find({}, 'savedCities');
    const totalFavorites = users.reduce((acc, u) => acc + (u.savedCities?.length || 0), 0);
    const avgFavoritesPerUser = totalUsers > 0 ? (totalFavorites / totalUsers).toFixed(2) : 0;
    
    // Messages
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ status: { $ne: 'resolved' } });
    
    // Activity logs
    const totalLogs = await ActivityLog.countDocuments();
    const logsLast7Days = await ActivityLog.countDocuments({ createdAt: { $gte: last7Days } });
    
    // User growth over last 30 days
    const userGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const count = await User.countDocuments({ 
        createdAt: { $gte: date, $lt: nextDate } 
      });
      userGrowth.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    // Most popular saved cities
    const cityStats = {};
    users.forEach(u => {
      u.savedCities?.forEach(city => {
        const cityName = city.name || city;
        cityStats[cityName] = (cityStats[cityName] || 0) + 1;
      });
    });
    
    const topCities = Object.entries(cityStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      totalUsers,
      adminUsers,
      bannedUsers,
      activeUsersLast7Days,
      activeUsersLast30Days,
      newUsersLast7Days,
      newUsersLast30Days,
      totalFavorites,
      avgFavoritesPerUser,
      totalMessages,
      unreadMessages,
      totalLogs,
      logsLast7Days,
      userGrowth,
      topCities,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}