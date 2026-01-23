"use client";
import React from 'react';
import { CloudRain, Map as MapIcon, Settings, List, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MenuPage() {
  const menuItems = [
    { 
      title: "Detailed Forecast", 
      icon: <List size={32} className="text-blue-500" />, 
      path: "/forecast",
      desc: "View 5-day weather predictions",
      color: "bg-blue-50"
    },
    { 
      title: "Interactive Map", 
      icon: <MapIcon size={32} className="text-green-500" />, 
      path: "/?map=true", 
      desc: "Explore weather patterns globally",
      color: "bg-green-50"
    },
    { 
      title: "Saved Locations", 
      icon: <MapPin size={32} className="text-rose-500" />, 
      path: "/?favorites=true", 
      desc: "Manage your favorite cities",
      color: "bg-rose-50"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 pl-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Explore Features</h2>
            <p className="text-slate-500">Discover everything WeatherWise has to offer.</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
           {menuItems.map((item, i) => (
             <motion.div
               key={i} 
               variants={itemAnim}
               whileHover={{ scale: 1.02, rotateY: 5 }}
               className="perspective-1000"
             >
                 <Link href={item.path} className="block bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 p-16 rounded-full ${item.color} opacity-0 group-hover:opacity-50 blur-3xl transition-opacity duration-500 -mr-10 -mt-10`}></div>
                    
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        whileHover={{ rotate: 0, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`${item.color} p-5 rounded-2xl w-fit mb-6 shadow-inner relative z-10`}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                 </Link>
             </motion.div>
           ))}
        </motion.div>
      </main>
    </div>
  );
}