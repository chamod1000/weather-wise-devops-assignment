export default function WeatherSkeleton() {
  return (
    <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div className="h-8 w-48 bg-white/10 rounded-md animate-shimmer"></div>
        <div className="h-10 w-10 bg-white/10 rounded-lg animate-shimmer"></div>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="h-32 w-32 bg-white/10 rounded-full animate-shimmer mb-4"></div>
        <div className="h-6 w-24 bg-white/10 rounded-md animate-shimmer"></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-white/10 rounded-2xl animate-shimmer"></div>
        <div className="h-24 bg-white/10 rounded-2xl animate-shimmer"></div>
        <div className="h-24 bg-white/10 rounded-2xl animate-shimmer"></div>
      </div>
    </div>
  );
}