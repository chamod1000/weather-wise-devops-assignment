"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, MapPin, Activity, UserCheck, Ban, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { checkAdminAccess } from '@/lib/adminAuth';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user, loadingUser } = useGlobalContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      if (!checkAdminAccess(user)) {
        return;
      }
    }
  }, [user, loadingUser]);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (e) {
            window.location.href = '/';
        }
    };
    
    if (!loadingUser && user?.role === 'admin') {
      fetchStats();
    }
  }, [user, loadingUser]);

  if (loadingUser || loading) return <div className="p-8">Loading stats...</div>;

  return (
    <div className="p-8 bg-[#F6F6F8] min-h-screen">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-500 mb-8">Monitor your application's performance and user activity</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        +{stats.newUsersLast7Days} this week
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{stats.totalUsers}</h3>
                <p className="text-slate-500 text-sm mt-1">Total Users</p>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                    <span>{stats.adminUsers} admins</span>
                    <span>{stats.bannedUsers} banned</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <UserCheck size={24} />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Last 7 days
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{stats.activeUsersLast7Days}</h3>
                <p className="text-slate-500 text-sm mt-1">Active Users</p>
                <div className="text-xs text-slate-400 mt-3">
                    {stats.activeUsersLast30Days} active last 30 days
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <MapPin size={24} />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {stats.avgFavoritesPerUser} avg
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{stats.totalFavorites}</h3>
                <p className="text-slate-500 text-sm mt-1">Saved Cities</p>
                <div className="text-xs text-slate-400 mt-3">
                    Across all users
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <MessageSquare size={24} />
                    </div>
                    {stats.unreadMessages > 0 && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            {stats.unreadMessages} new
                        </span>
                    )}
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{stats.totalMessages}</h3>
                <p className="text-slate-500 text-sm mt-1">Contact Messages</p>
                <div className="text-xs text-slate-400 mt-3">
                    {stats.unreadMessages} unread
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-blue-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-800">User Growth (Last 30 Days)</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={stats.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(date) => new Date(date).getDate()} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} name="New Users" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-green-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-800">Most Popular Cities</h3>
                </div>
                {stats.topCities.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={stats.topCities}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="Users" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-slate-400">
                        No city data available
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
                <Activity className="text-purple-600" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">{stats.totalLogs}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Activity Logs</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">{stats.logsLast7Days}</div>
                    <div className="text-xs text-slate-500 mt-1">Actions (7 days)</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">{stats.newUsersLast30Days}</div>
                    <div className="text-xs text-slate-500 mt-1">New Users (30 days)</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">Online</div>
                    <div className="text-xs text-slate-500 mt-1">System Status</div>
                </div>
            </div>
        </div>
    </div>
  );
}