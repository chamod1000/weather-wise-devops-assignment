export default function WeatherMap({ lat, lon }) {
  if (!lat || !lon) return null;

  return (
    <div className="bg-white p-6 rounded-[30px] shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <span>Live Weather Map</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Rain & Clouds</span>
      </h3>
      <div className="w-full h-[400px] rounded-2xl overflow-hidden relative z-0 border border-gray-100">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`} 
          frameBorder="0"
          className="w-full h-full"
          title="Weather Map"
        ></iframe> 
      </div>
    </div>
  );
}
