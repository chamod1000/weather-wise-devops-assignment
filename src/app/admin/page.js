"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, MapPin, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalFavorites: 0 });
  const [loading, setLoading] = useState(true);

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
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading stats...</div>;

  return (
    <div className="p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">Total Users</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats.totalUsers}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <MapPin size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">Total Saved Cities</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stats.totalFavorites}</h3>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">System Status</p>
                    <h3 className="text-lg font-bold text-green-500">Online</h3>
                </div>
            </div>
        </div>
    </div>
  );
}
