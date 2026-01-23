"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function FavoriteCard({ city, onClick, onRemove }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
             try {
                const res = await axios.get(`/api/weather?city=${city}`);
                setWeather(res.data);
             } catch(e) {
                setError(true);
             } finally {
                setLoading(false);
             }
        };
        fetchWeather();
    }, [city]);

    const HIGHLIGHT_IMAGES = {
        sunrise: "https://your-new-image-url.com/sunrise.jpghttps://unsplash.com/photos/a-view-of-a-mountain-range-at-sunset-9fxH5EoDYMo",
        visibility: "https://your-new-image-url.com/visibility.jpg",
        clouds: "https://your-new-image-url.com/clouds.jpg",
        clothing: "https://your-new-image-url.com/clothing.jpg"
    };

    if (loading) return (
        <div className="animate-pulse bg-slate-200 h-24 rounded-2xl w-full min-w-[200px] shrink-0"></div>
    );

    if (error || !weather) return null;

    return (
        <div 
            onClick={() => onClick(weather.name)}
            className="group relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between min-w-[200px] shrink-0 hover:border-blue-200"
        >
             <button 
                onClick={(e) => { e.stopPropagation(); onRemove(weather.name); }}
                className="absolute -top-2 -right-2 bg-white text-rose-500 border border-rose-100 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10 hover:bg-rose-50"
                title="Remove from favorites"
             >
                <X size={14} />
             </button>

             <div className="flex flex-col">
                 <h4 className="font-bold text-slate-700 truncate max-w-[100px]" title={weather.name}>{weather.name}</h4>
                 <p className="text-xs text-slate-400 font-medium">{weather.weather[0].main}</p>
             </div>
             
             <div className="flex flex-col items-end">
                 <span className="text-2xl font-bold text-slate-800">
                    {Math.round(weather.main.temp)}°
                 </span>
                 <Image 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
                    alt="icon" 
                    width={40}
                    height={40}
                    className="w-10 h-10 -mt-2 -mr-2"
                 />
             </div>
        </div>
    );
}
