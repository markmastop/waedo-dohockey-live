
import { Target, Sparkles, Star, Zap } from 'lucide-react';

const LiveMatchHeader = () => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative group">
          <div className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <img 
              src="/lovable-uploads/0eca3ff3-5e4a-4be9-881d-e839832a5b13.png" 
              alt="We Do Hockey Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-md flex items-center justify-center animate-bounce">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-amber-600 bg-clip-text text-transparent animate-gradient-x">
            Live Match
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-orange-600 font-semibold">Real-time Updates</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>
      <p className="text-orange-600 font-semibold text-lg">Follow your team's game in real-time</p>
    </div>
  );
};

export default LiveMatchHeader;
