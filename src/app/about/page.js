"use client";
import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">About WeatherWise</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 mb-6">
                WeatherWise is a state-of-the-art weather dashboard designed to provide you with the most accurate, real-time weather data in a beautiful and intuitive interface.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h3>
              <p className="text-slate-600 mb-6">
                To simplify how people interact with weather data, making it accessible, understandable, and actionable for everyone, from daily commuters to outdoor enthusiasts.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 text-slate-600">
                <li className="flex items-center gap-2">✓ Real-time Global Weather</li>
                <li className="flex items-center gap-2">✓ 5-Day Detailed Forecasts</li>
                <li className="flex items-center gap-2">✓ Interactive Weather Maps</li>
                <li className="flex items-center gap-2">✓ Personalized Favorites</li>
              </ul>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
               <p>© 2026 WeatherWise Inc.</p>
               <p>Designed with ❤️ for better days.</p>
            </div>
        </div>
      </main>
    </div>
  );
}