"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FloatingNav = () => {
  const pathname = usePathname();
  
  const items = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-slate-100 rounded-full p-1.5 flex items-center mx-4">
      <div className="flex gap-1 relative">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FloatingNav;