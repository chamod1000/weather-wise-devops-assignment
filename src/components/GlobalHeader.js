"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Sun, Search, LocateFixed, Zap } from 'lucide-react';
import FloatingNav from './FloatingNav';
import { AuthModal, ProfileModal } from './AuthComponents';
import { useGlobalContext } from '@/context/GlobalContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function GlobalHeader() {
  const { user, setUser, unit, setUnit, announcement } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();
  
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const isTyping = useRef(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length > 2) {
        try {
          const res = await axios.get(`/api/search?q=${city}`);
          const unique = res.data.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.country === v.country)) === i);
          setSuggestions(unique);
          setShowSuggestions(true);
        } catch (error) {
           // Silent
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    if (!isTyping.current) return;
    const timeoutId = setTimeout(() => fetchSuggestions(), 500);
    return () => clearTimeout(timeoutId);
  }, [city]);

  // Hide on Admin pages
  if (pathname && pathname.startsWith('/admin')) return null;

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    isTyping.current = false;
    router.push(`/?city=${suggestion.name}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(city.trim()) {
        router.push(`/?city=${city}`);
        setShowSuggestions(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      toast.loading("Locating...");
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        toast.dismiss();
        router.push(`/?lat=${latitude}&lon=${longitude}`);
      }, (error) => {
         toast.dismiss();
         toast.error("Unable to retrieve location.");
      });
    } else {
      toast.error("Geolocation is not supported.");
    }
  };

  return (
    <>
      {announcement && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 px-4 shadow-md font-bold flex items-center justify-center gap-2">
           <Zap size={18} /> {announcement}
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
           {/* Logo */}
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
             <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Sun size={24} />
             </div>
             <h1 className="text-xl font-bold text-slate-800 hidden md:block">WeatherWise</h1>
           </div>

           {/* Navigation Menu */}
            <div className="hidden lg:block">
              <FloatingNav />
            </div>

           {/* Search */}
           <form onSubmit={handleSearch} className="flex-1 max-w-sm w-full relative group">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   value={city}
                   onChange={(e) => { setCity(e.target.value); isTyping.current = true; }}
                   placeholder="Search city..." 
                   className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 />
                 {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                        {suggestions.map((s, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSelectSuggestion(s)}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-sm border-b border-slate-50 last:border-b-0"
                          >
                            <span>{s.name}</span>
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">{s.country}</span>
                          </div>
                        ))}
                      </div>
                 )}
               </div>
           </form>

           {/* Controls */}
           <div className="flex items-center gap-3">
             <button onClick={handleLocateMe} className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 rounded-full hover:bg-blue-50 transition-colors" title="Locate Me">
               <LocateFixed size={20} />
             </button>
             <div className="bg-slate-100 rounded-lg p-1 flex items-center text-sm font-bold">
               <button onClick={() => setUnit('C')} className={`px-3 py-1 rounded transition-colors ${unit === 'C' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>°C</button>
               <button onClick={() => setUnit('F')} className={`px-3 py-1 rounded transition-colors ${unit === 'F' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>°F</button>
             </div>
             <div 
                  onClick={() => user ? setShowProfile(true) : setShowAuth(true)} 
                  className="w-9 h-9 bg-slate-200 rounded-full overflow-hidden cursor-pointer hover:ring-2 ring-blue-400 transition relative"
             >
                   {user ? (
                       user.profilePicture ? (
                           <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                       ) : (
                           <div className="w-full h-full flex items-center justify-center text-sm bg-blue-100 font-bold text-blue-600">
                               {user.name.charAt(0)}
                           </div>
                       )
                   ) : (
                      <div className="w-full h-full flex items-center justify-center"><div className="w-2 h-2 bg-slate-400 rounded-full"></div></div>
                   )}
             </div>
           </div>
        </div>
      </header>

      {/* Auth Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={(u) => { setUser(u); setShowAuth(false); }} />}
      {showProfile && <ProfileModal 
        user={user} 
        onClose={() => setShowProfile(false)} 
        onLogout={async () => {
            try {
                await axios.post('/api/auth/logout');
                setUser(null);
                setShowProfile(false);
                toast.success("Logged out");
            } catch (error) {
                console.error(error);
            }
        }} 
      />}
    </>
  );
}