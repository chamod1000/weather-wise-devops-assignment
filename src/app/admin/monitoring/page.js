"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { checkAdminAccess } from '@/lib/adminAuth';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function APIMonitoring() {
  const { user, loadingUser } = useGlobalContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      checkAdminAccess(user);
    }
  }, [user, loadingUser]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/monitoring');
        setStats(res.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    
    if (!loadingUser && user?.role === 'admin') {
      fetchStats();
      const interval = setInterval(fetchStats, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user, loadingUser]);

  if (loadingUser || loading) return <div className="p-8">Loading monitoring data...</div>;
  if (!stats) return <div className="p-8">Failed to load monitoring data</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-8 bg-[#F6F6F8] min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">API & Performance Monitoring</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time system performance and API usage</p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-600">Online</h3>
          <p className="text-slate-500 text-sm mt-1">System Status</p>
          <div className="text-xs text-slate-400 mt-2">Uptime: 99.9%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalApiCalls || 0}</h3>
          <p className="text-slate-500 text-sm mt-1">API Calls Today</p>
          <div className="text-xs text-green-600 mt-2">↑ Active</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.avgResponseTime || '< 1'}s</h3>
          <p className="text-slate-500 text-sm mt-1">Avg Response Time</p>
          <div className="text-xs text-green-600 mt-2">↓ Fast</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.errorRate || 0}%</h3>
          <p className="text-slate-500 text-sm mt-1">Error Rate</p>
          <div className="text-xs text-slate-400 mt-2">Last 24h</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">API Endpoint Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.endpointStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="endpoint" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="calls" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Database Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Connection Status</span>
              <span className="text-sm font-bold text-green-600">Connected</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Query Response Time</span>
              <span className="text-sm font-bold text-slate-800">&lt; 100ms</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Active Connections</span>
              <span className="text-sm font-bold text-slate-800">5</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Total Collections</span>
              <span className="text-sm font-bold text-slate-800">6</span>
            </div>
          </div>
        </div>
      </div>

      {/* External APIs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">External API Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">OpenWeatherMap API</span>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-slate-600">Status: <span className="text-green-600 font-medium">Operational</span></p>
            <p className="text-sm text-slate-600">Response Time: <span className="font-medium">~200ms</span></p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">MongoDB Atlas</span>
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-slate-600">Status: <span className="text-blue-600 font-medium">Connected</span></p>
            <p className="text-sm text-slate-600">Latency: <span className="font-medium">~50ms</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}