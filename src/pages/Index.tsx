
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Play, Users, Trophy, Zap, Sparkles, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background patterns */}
      <div className="absolute inset-0 opacity-30 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-orange-100/20 to-red-100/20"></div>
      </div>
      <div className="absolute inset-0 animate-fade-in">
        <div className="w-full h-full bg-gradient-to-l from-amber-100/10 to-orange-100/10"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-red-300 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-amber-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Flat header with clean logo */}
        <div className="text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              {/* Clean logo without box */}
              <div className="w-64 h-64 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                <img 
                  src="/lovable-uploads/0eca3ff3-5e4a-4be9-881d-e839832a5b13.png" 
                  alt="We Do Hockey Logo" 
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-md flex items-center justify-center animate-bounce">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-md flex items-center justify-center animate-pulse">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-amber-600 bg-clip-text text-transparent mb-4 animate-gradient-x">
            Field Hockey Live
          </h1>
          <p className="text-orange-600 text-xl font-semibold mb-2">Follow your team's matches in real-time</p>
          <div className="flex justify-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">Premium live tracking experience</span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
        </div>
        
        {/* Flatter main card */}
        <Card className="border border-orange-200 bg-white/95 backdrop-blur-sm animate-scale-in hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-6 bg-gradient-to-r from-orange-50 via-red-50 to-amber-50 rounded-t-md">
            <CardTitle className="text-center text-orange-800 text-2xl flex items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-300">
              <Users className="w-7 h-7 animate-pulse" />
              Welcome Parents!
              <Trophy className="w-6 h-6 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                Stay connected with your child's field hockey matches. Get live scores, 
                match updates, and never miss a moment of the action.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Live Updates</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Real-time Scores</span>
                </div>
              </div>
            </div>
            
            {/* Flatter CTA button */}
            <Link to="/live-match" className="block">
              <Button className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 hover:from-orange-700 hover:via-red-700 hover:to-amber-700 text-white py-6 text-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Play className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform duration-300" />
                🏑 Follow Live Match
                <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
              </Button>
            </Link>
            
            {/* Flatter feature highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-200 rounded-md flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-shadow duration-300">
                  <Trophy className="w-7 h-7 text-orange-600 group-hover:animate-bounce" />
                </div>
                <p className="text-sm text-gray-700 font-bold">Live Scores</p>
                <p className="text-xs text-gray-500 mt-1">Real-time updates</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-amber-200 rounded-md flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-shadow duration-300">
                  <Zap className="w-7 h-7 text-red-600 group-hover:animate-pulse" />
                </div>
                <p className="text-sm text-gray-700 font-bold">Lightning Fast</p>
                <p className="text-xs text-gray-500 mt-1">Instant notifications</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-200 rounded-md flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-shadow duration-300">
                  <Users className="w-7 h-7 text-amber-600 group-hover:animate-bounce" />
                </div>
                <p className="text-sm text-gray-700 font-bold">Share & Connect</p>
                <p className="text-xs text-gray-500 mt-1">With other parents</p>
              </div>
            </div>
            
            {/* Flatter info box */}
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-md border border-amber-200">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">🔑</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Quick Start Guide</h3>
              </div>
              <p className="text-gray-700 text-center font-semibold leading-relaxed">
                Get your unique match key from your coach to start following the game in real-time!
              </p>
              <div className="mt-4 flex justify-center">
                <div className="px-4 py-2 bg-white rounded-md border border-amber-300">
                  <span className="text-sm text-gray-600 font-mono">Example: ABC123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
