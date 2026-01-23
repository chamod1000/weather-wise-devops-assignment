'use client';
import { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(() => {
    // Avoid synchronous state update warning
    const timerId = setTimeout(() => {
        setMounted(true);
        setTime(new Date());
    }, 0);

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
        clearTimeout(timerId);
        clearInterval(timer);
    };
  }, []);

  if (!mounted || !time) return null;

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const [timePart, ampm] = timeString.split(' ');

  return (
    <div className="flex flex-col items-center justify-center py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white transform hover:scale-105 transition-all duration-300">
      <div className="text-4xl font-black tracking-wider flex items-baseline gap-2 drop-shadow-md font-mono">
        {timePart}
        <span className="text-base font-medium opacity-80">{ampm}</span>
      </div>
      <div className="text-xs font-medium tracking-widest uppercase opacity-70 mt-1">
        Local Time
      </div>
    </div>
  );
}
