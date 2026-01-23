import Link from 'next/link';
import { CloudSun, List } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <CloudSun className="text-blue-400" />
          <span>Weather<span className="text-blue-400">Wise</span></span>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full">
            <CloudSun size={18} /> Current
          </Link>
          <Link href="/forecast" className="text-gray-300 hover:text-white transition flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full">
            <List size={18} /> 5-Day Forecast
          </Link>
        </div>
      </div>
    </nav>
  );
}