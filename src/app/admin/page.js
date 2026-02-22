"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Heart, Wind, Droplets, Thermometer, Sunrise, Sunset, CloudFog, MapPin, ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Image from 'next/image';
import { motion } from 'framer-motion';
import WeatherMap from '@/components/WeatherMap';
import DigitalClock from '@/components/DigitalClock';
import FavoriteCard from '@/components/FavoriteCard';
import { useSearchParams } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import AnimatedBackground from '@/components/AnimatedBackground';

const DEFAULT_CITY = "Colombo";

const HIGHLIGHT_IMAGES = {
    sunrise: "https://images.unsplash.com/photo-1716746020631-cabac4f0cb10?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=600&auto=format&fit=crop&q=600",
    visibility: "https://images.unsplash.com/photo-1721350663799-a1a00e14df6d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&auto=format&fit=crop&q=600",
    clouds: "https://images.unsplash.com/photo-1603437873662-dc1f44901825?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&auto=format&fit=crop&q=60",
    clothing: "https://images.unsplash.com/photo-1619032468883-89a84f565cba?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=600&auto=format&fit=crop&q=60",
    main: "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=2604&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
};

const getWeatherEmoji = (condition) => {
  if (!condition) return "☁️";
  const main = condition.toLowerCase();
  if (main.includes('clear')) return "☀️";
  if (main.includes('clouds')) return "☁️";
  if (main.includes('rain')) return "🌧️";
  if (main.includes('drizzle')) return "🌦️";
  if (main.includes('thunderstorm')) return "⛈️";
  if (main.includes('snow')) return "❄️";
  if (main.includes('mist') || main.includes('fog')) return "🌫️";
  return "🌤️";
};

const CustomXAxisTick = ({ x, y, payload, data, unit }) => {
  const item = data && data[payload.index];
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
        {payload.value}
      </text>
      <text x={0} y={-25} textAnchor="middle" fontSize={16}>
        {getWeatherEmoji(item?.condition)}
      </text>
      <text x={0} y={-10} textAnchor="middle" fill="#1F2937" fontSize={12} fontWeight="bold">
        {item?.displayTemp}°
      </text>
    </g>
  );
};

function HomeContent() {
  const { user, setUser, unit } = useGlobalContext();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('temp');
  
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if(scrollContainer.current) {
        const { current } = scrollContainer;
        const scrollAmount = 300;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  const getClothingAdvice = (data) => {
    if (!data || !data.weather || !data.weather[0]) return "Enjoy your day!";
    
    const condition = data.weather[0].main.toLowerCase();
    const temp = data.main.temp;

    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
      return "Don't forget your umbrella ☔";
    }
    if (condition.includes('snow')) {
      return "Wear warm clothes ❄️";
    }
    if (condition.includes('clear') || condition.includes('sun')) {
       if (temp > 25) return "Wear sunglasses 🕶️";
       return "It's a beautiful day ☀️";
    }
    if (temp < 15) {
      return "It's chilly, wear a jacket 🧥";
    }
    if (temp > 30) {
      return "Stay hydrated 💧";
    }
    if (condition.includes('clouds')) {
      return "Good weather for a walk ☁️";
    }
    
    return "Have a nice day! 😊";
  };

  const getTemp = (celsius) => {
    if (unit === 'F') return Math.round(celsius * 9 / 5 + 32);
    return Math.round(celsius);
  };

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    try {
        const weatherRes = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
        setWeather(weatherRes.data);
        setCity(weatherRes.data.name); 

        const forecastRes = await axios.get(`/api/forecast?lat=${lat}&lon=${lon}`);
        const graphData = forecastRes.data.list.slice(0, 10).map(item => ({
        dt: item.dt,
        rain: item.rain,
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        pop: item.pop,
        condition: item.weather[0]?.main
        }));
        setForecast(graphData);
    } catch (error) {
        toast.error("Failed to fetch location data");
    } finally {
        setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async (cityName) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(`/api/weather?city=${cityName}`);
      setWeather(weatherRes.data);
      setCity(weatherRes.data.name);

      const forecastRes = await axios.get(`/api/forecast?city=${cityName}`);
      const graphData = forecastRes.data.list.slice(0, 10).map(item => ({
        dt: item.dt,
        rain: item.rain,
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        pop: item.pop,
        condition: item.weather[0]?.main
      }));
      setForecast(graphData);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Could not fetch weather data.");
    }
    setLoading(false);
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get('/api/favorites');
      setFavorites(res.data);
    } catch (error) {
       // Silent error for favorites
    }
  }, []);

  // Handle Search Params from Global Header
  useEffect(() => {
    const cityParam = searchParams.get('city');
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    if (latParam && lonParam) {
        fetchByCoords(latParam, lonParam);
    } else if (cityParam) {
        fetchData(cityParam);
    } else {
        // Initial Load
        fetchData(DEFAULT_CITY);
    }
  }, [searchParams, fetchByCoords, fetchData]);

  useEffect(() => {
    if(user) {
        fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const removeFavorite = async (cityName) => {
    try {
        await axios.delete(`/api/favorites?name=${cityName}`);
        toast.success("Removed from Favorites");
        fetchFavorites();
    } catch (error) {
        toast.error("Failed to remove favorite");
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
        toast.error("Please login to save favorites");
        return;
    }
    if (!weather) return;
    
    try {
      const isFavorite = favorites.find(f => f.name === weather.name);
      if (isFavorite) {
        await axios.delete(`/api/favorites?name=${weather.name}`);
        toast.success("Removed from Favorites!");
      } else {
        await axios.post('/api/favorites', { name: weather.name });
        toast.success("Saved to Favorites!");
      }
      fetchFavorites();
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading && !weather) return (
     <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
     </div>
  );

  const isCurrentFavorite = favorites.some(f => f.name === weather?.name);
  
  const chartData = forecast.map(item => ({
    ...item, 
    displayTemp: getTemp(item.temp), 
    rainChance: (item.pop || 0) * 100 
  }));

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-10 relative">
      <AnimatedBackground />
      
      {/* Header moved to Layout/GlobalHeader */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {favorites.length > 0 && (
           <div className="mb-6 relative group">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                 <Heart className="text-rose-500 fill-rose-500" size={20} /> My Locations
              </h3>
              
              <div className="relative">
                  <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white hidden md:group-hover:block -ml-5 backdrop-blur-sm text-slate-600 hover:text-blue-600 transition"
                  >
                      <ChevronLeft size={24} />
                  </button>

                  <div 
                     ref={scrollContainer}
                     className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-1 scrollbar-hide scroll-smooth"
                  >
                     {favorites.map((fav, i) => (
                        <FavoriteCard 
                            key={i} 
                            city={fav.name} 
                            onClick={(name) => fetchData(name)} 
                            onRemove={removeFavorite} 
                        />
                     ))}
                  </div>

                  <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white hidden md:group-hover:block -mr-5 backdrop-blur-sm text-slate-600 hover:text-blue-600 transition"
                  >
                      <ChevronRight size={24} />
                  </button>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* BIG WEATHER CARD */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 h-full bg-blue-600 rounded-3xl p-6 md:p-8 text-white relative shadow-xl overflow-hidden group"
            >
               <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-700">
                  <Image 
                    src={HIGHLIGHT_IMAGES.main}
                    alt="weather background"
                    fill
                    className="object-cover"
                  />
               </div>
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/80 z-0"></div>

               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                     <Sun size={200} />
                  </motion.div>
               </div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                       {weather?.name}, {weather?.sys?.country}
                       <button onClick={toggleFavorite} className="hover:scale-110 transition"><Heart className={isCurrentFavorite ? "fill-red-500 text-red-500" : "text-white/50 hover:text-white"} /></button>
                    </h2>
                    <p className="text-blue-100 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
                  <DigitalClock />
               </div>
               
               <div className="mt-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <motion.div 
                     initial={{ scale: 0, rotate: -20, opacity: 0 }}
                     animate={{ scale: 1, rotate: 0, opacity: 1 }}
                     transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                     className="flex items-center justify-center drop-shadow-2xl"
                  >
                      <Image 
                         src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@4x.png`} 
                         width={120} 
                         height={120} 
                         alt={weather?.weather[0]?.description} 
                      />
                  </motion.div>
                  <div>
                    <h1 className="text-7xl md:text-8xl font-bold tracking-tighter">{weather?.main ? getTemp(weather.main.temp) : "--"}°</h1>
                    <p className="text-2xl font-medium capitalize text-blue-100 mt-2">{weather?.weather[0]?.description}</p>
                    <p className="text-blue-200">Feels like {weather?.main ? getTemp(weather.main.feels_like) : "--"}°</p>
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-3 gap-4 text-sm font-medium text-blue-100 relative z-10">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-center">
                     <motion.div animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Wind size={20} /> 
                     </motion.div>
                     <span>{weather?.wind?.speed} km/h</span>
                     <span className="text-[10px] opacity-70">Wind</span>
                  </div>
                  <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-center">
                     <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3 }}>
                         <Droplets size={20} /> 
                     </motion.div>
                     <span>{weather?.main?.humidity}%</span>
                     <span className="text-[10px] opacity-70">Humidity</span>
                  </div>
                   <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-center">
                     <Thermometer size={20} /> 
                     <span>{weather?.main?.pressure} hPa</span>
                     <span className="text-[10px] opacity-70">Pressure</span>
                  </div>
               </div>
            </motion.div>

            {/* HIGHLIGHTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.2 }}
                   whileHover={{ scale: 1.02 }}
                   className="h-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden group"
                >
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                      <Image 
                        src={HIGHLIGHT_IMAGES.sunrise} 
                        alt="sunrise background" 
                        fill 
                        className="object-cover" 
                      />
                   </div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="flex justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Sunrise & Sunset</span>
                        <motion.div  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                            <Sunrise size={18} className="text-orange-500" />
                        </motion.div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-bold">{weather?.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}</span>
                            <span className="text-xs text-slate-400">AM</span>
                        </div>
                        <div className="w-full h-[1px] bg-slate-100 my-1"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-bold">{weather?.sys?.sunset ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}</span>
                            <span className="text-xs text-slate-400">PM</span>
                        </div>
                     </div>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.3 }}
                   whileHover={{ scale: 1.02 }}
                   className="h-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden group"
                >
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                      <Image 
                        src={HIGHLIGHT_IMAGES.visibility} 
                        alt="visibility background" 
                        fill 
                        className="object-cover" 
                      />
                   </div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="flex justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Visibility</span>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <div className="text-purple-500">👁️</div>
                        </motion.div>
                     </div>
                     <span className="text-3xl font-bold text-slate-800">{weather?.visibility / 1000} <span className="text-sm font-normal text-slate-400">km</span></span>
                     <span className="text-xs text-slate-500 mt-2">{weather?.visibility > 5000 ? "Clear view" : "Haze likely"}</span>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.4 }}
                   whileHover={{ scale: 1.02 }}
                   className="h-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden group"
                >
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                      <Image 
                        src={HIGHLIGHT_IMAGES.clouds} 
                        alt="clouds background" 
                        fill 
                        className="object-cover" 
                      />
                   </div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="flex justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Clouds</span>
                        <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                             <CloudFog size={18} className="text-gray-400" />
                        </motion.div>
                     </div>
                     <span className="text-3xl font-bold text-slate-800">{weather?.clouds?.all}%</span>
                     <div className="w-full bg-slate-100 rounded-full h-2 mt-2 max-w-[100px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${weather?.clouds?.all}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gray-400 h-full rounded-full" 
                        />
                     </div>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.5 }}
                   whileHover={{ scale: 1.02 }}
                   className="h-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden group"
                >
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                      <Image 
                        src={HIGHLIGHT_IMAGES.clothing} 
                        alt="clothing background" 
                        fill 
                        className="object-cover" 
                      />
                   </div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="flex justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Clothing</span>
                        <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                            <div className="text-pink-500">👕</div>
                        </motion.div>
                     </div>
                     <span className="text-sm font-medium text-slate-600 leading-tight">{getClothingAdvice(weather)}</span>
                   </div>
                </motion.div>
            </div>
        </div>
        
        {/* BOTTOM SECTION: CHART & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* CHART */}
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.6 }}
             className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6"
           >
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Thermometer className="text-blue-500" size={20}/> Forecast Overview
                 </h3>
                 <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
                     <button 
                        onClick={() => setChartType('temp')}
                        className={`px-3 py-1.5 rounded-md transition ${chartType === 'temp' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Temp
                     </button>
                     <button 
                         onClick={() => setChartType('rain')}
                        className={`px-3 py-1.5 rounded-md transition ${chartType === 'rain' ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        Rain
                     </button>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={chartData} 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartType === 'temp' ? "#3B82F6" : "#10B981"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartType === 'temp' ? "#3B82F6" : "#10B981"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                       dataKey="time" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={() => <></>}
                       interval={0}
                    />
                     {/* Custom X Axis implementation with icons inside the graph area */}
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                       type="monotone" 
                       dataKey={chartType === 'temp' ? "temp" : "rainChance"} 
                       stroke={chartType === 'temp' ? "#3B82F6" : "#10B981"} 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorTemp)" 
                       animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between px-2 mt-4 overflow-x-auto">
                 {chartData.map((d, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        className="flex flex-col items-center gap-1 text-xs font-medium text-slate-500"
                    >
                        <span>{d.time}</span>
                         <motion.span 
                            animate={{ y: [0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                            className="text-xl leading-none"
                        >{getWeatherEmoji(d.condition)}</motion.span>
                         <span className="font-bold text-slate-800">{d.displayTemp}°</span>
                    </motion.div>
                 ))}
              </div>
           </motion.div>

           {/* MAP */}
            <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.8 }}
                 whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                 className="h-[400px] lg:h-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative"
            >
                 <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-1">
                    <MapPin size={12} /> Live Map
                 </div>
                {weather?.coord && (
                    <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} />
                )}
            </motion.div>
        </div>

      </main>
    </div>
  );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <HomeContent />
        </Suspense>
    )
}