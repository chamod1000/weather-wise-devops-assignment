"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Home, Activity, Settings, MessageSquare, MapPin, Bell, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (e) {}
  };

  return (
    <div className="flex h-screen bg-[#F6F6F8]">
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-blue-500">Admin</span>Panel
            </h1>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <Users size={20} /> Users
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <MessageSquare size={20} /> Messages
            </Link>
            <Link href="/admin/locations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <MapPin size={20} /> Locations
            </Link>
            <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <Bell size={20} /> Notifications
            </Link>
            <Link href="/admin/monitoring" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <BarChart3 size={20} /> Monitoring
            </Link>
             <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <Activity size={20} /> Activity Logs
            </Link>
             <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition">
                <Settings size={20} /> Settings
            </Link>
             <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition mt-4 text-blue-300">
                <Home size={20} /> Back to Site
            </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 w-full transition">
                <LogOut size={20} /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
          {children}
      </main>
    </div>
  );
}
