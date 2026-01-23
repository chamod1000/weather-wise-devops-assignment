'use client';
import { CloudSun, Sun, Cloud, CloudRain } from 'lucide-react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#5C9CE5] flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <div className="absolute top-0 right-0 animate-bounce delay-75">
          <Sun size={48} className="text-yellow-300 animate-spin-slow" />
        </div>
        <div className="absolute bottom-4 left-4 animate-bounce">
          <Cloud size={64} className="text-white fill-white/80" />
        </div>
        <div className="absolute top-8 left-0 animate-bounce delay-150">
           <CloudRain size={40} className="text-blue-200 fill-blue-200/50" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-white tracking-widest animate-pulse">
        WEATHER<span className="text-yellow-300">WISE</span>
      </h2>
      <div className="mt-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-white animate-bounce delay-0"></div>
        <div className="w-3 h-3 rounded-full bg-white animate-bounce delay-150"></div>
        <div className="w-3 h-3 rounded-full bg-white animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
