"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import axios from "axios";
import { MapPin, Calendar, ArrowLeft, Wind, Droplets } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ForecastContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "Colombo";
  const [city, setCity] = useState(initialCity);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get('/api/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error("Error fetching favorites", error);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchFavorites(), 0);
    return () => clearTimeout(t);
  }, [fetchFavorites]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`/api/forecast?city=${city}`);
        const dailyData = response.data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
        setForecast(dailyData);
        setCity(response.data.city.name);
      } catch (err) {
        console.error("Error", err);
      }
      setLoading(false);
    };
    fetchForecast();
  }, [city]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-blue-500 font-bold">Loading Forecast...</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-4">
        
        <div className="bg-[#5C9CE5] p-8 lg:p-10 text-white flex flex-col justify-between relative lg:col-span-1">
          
          <div>
            <Link href="/">
              <div className="bg-white/20 w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-white/30 transition mb-8">
                <ArrowLeft size={24} />
              </div>
            </Link>
            
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <MapPin size={18} />
              <span className="text-lg uppercase tracking-wider">Forecast</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">{city}</h2>
            <p className="text-blue-100 opacity-80">Next 5 Days Outlook</p>

            {favorites.length > 0 && (
              <div className="mt-8 z-10">
                <p className="text-sm text-blue-100 mb-2 font-bold opacity-80">SAVED LOCATIONS</p>
                <div className="flex flex-wrap gap-2 text-white">
                  {favorites.map((fav) => (
                    <button 
                      key={fav._id}
                      onClick={() => setCity(fav.name)}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition flex items-center gap-2 cursor-pointer"
                    >
                      {fav.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 pointer-events-none">
             <div className="absolute bottom-0 left-4 w-12 h-32 bg-black/20"></div>
             <div className="absolute bottom-0 right-10 w-20 h-24 bg-black/20"></div>
             <div className="absolute bottom-0 left-1/2 w-24 h-56 bg-black/20"></div>
          </div>
        </div>

        <div className="bg-[#F6F6F8] p-8 lg:p-12 lg:col-span-3">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">5-Day Forecast</h2>
            <div className="text-gray-400 text-sm">Upcoming Weather</div>
          </div>

          <div className="flex flex-col gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-white p-6 rounded-[24px] shadow-sm grid grid-cols-1 md:grid-cols-12 items-center gap-4 hover:shadow-md transition duration-300 border border-transparent hover:border-blue-100">
                
                <div className="flex items-center gap-4 md:col-span-4 justify-start">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-500 shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    <p className="text-xs text-gray-400">{new Date(day.dt * 1000).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center md:col-span-3 py-2 md:py-0">
                  <span className="text-4xl font-bold text-gray-800">{Math.round(day.main.temp)}°</span>
                  <p className="text-sm text-gray-400 capitalize">{day.weather[0].description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end md:col-span-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2 bg-[#F6F6F8] px-4 py-2 rounded-xl whitespace-nowrap">
                    <Wind size={16} className="text-[#5C9CE5]" />
                    <span>{day.wind.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F6F6F8] px-4 py-2 rounded-xl whitespace-nowrap">
                    <Droplets size={16} className="text-[#5C9CE5]" />
                    <span>{day.main.humidity}%</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Forecast() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-blue-500 font-bold">Loading Forecast...</div>}>
      <ForecastContent />
    </Suspense>
  );
}