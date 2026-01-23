"use client";
import React from 'react';
import { LayoutDashboard, Settings, Users, Shield, ArrowRight, BarChart, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function SiteMenuPage() {
  const adminOptions = [
    {
       title: "Admin Dashboard",
       desc: "Overview of system stats and users",
       icon: <LayoutDashboard size={24} className="text-white" />,
       color: "bg-blue-600",
       path: "/admin"
    },
    {
       title: "User Management",
       desc: "Manage registered users and roles",
       icon: <Users size={24} className="text-white" />,
       color: "bg-purple-600",
       path: "/admin/users"
    },
    {
       title: "Messages",
       desc: "View contact form inquiries",
       icon: <MessageSquare size={24} className="text-white" />,
       color: "bg-pink-500",
       path: "/admin/messages"
    },
    {
       title: "System Logs",
       desc: "View system activity and errors",
       icon: <Shield size={24} className="text-white" />,
       color: "bg-slate-700",
       path: "/admin/logs"
    },
    {
       title: "System Settings",
       desc: "Configure global application settings",
       icon: <Settings size={24} className="text-white" />,
       color: "bg-orange-500",
       path: "/admin/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Menu</h1>
           <p className="text-slate-500">Access administrative tools and settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
           {adminOptions.map((opt, i) => (
             <Link key={i} href={opt.path} className="group flex items-start gap-5 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-blue-100 relative overflow-hidden">
                <div className={`${opt.color} p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {opt.icon}
                </div>
                <div className="flex-1 relative z-10">
                   <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                     {opt.title} 
                     <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500"/>
                   </h3>
                   <p className="text-slate-500 text-sm leading-relaxed">{opt.desc}</p>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                    {opt.icon}
                </div>
             </Link>
           ))}
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4 max-w-4xl">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
               <BarChart size={24} />
            </div>
            <div>
               <h4 className="font-bold text-blue-900">Looking for analytics?</h4>
               <p className="text-blue-700 text-sm">Check the Admin Dashboard for detailed system reports.</p>
            </div>
        </div>
      </main>
    </div>
  );
}