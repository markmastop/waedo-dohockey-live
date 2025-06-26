
import { Target, Sparkles, Star, Zap } from 'lucide-react';

const LiveMatchHeader = () => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative group">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
            <span className="text-3xl animate-pulse">🏑</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient-x">
            Live Match
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-green-600 font-semibold">Real-time Updates</span>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      </div>
      <p className="text-green-600 font-semibold text-lg">Follow your team&apos;s game in real-time</p>
    </div>
  );
};

export default LiveMatchHeader;
