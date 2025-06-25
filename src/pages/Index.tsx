
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Play, Users, Trophy, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322c55e" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with animation */}
        <div className="text-center animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏑</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
            Field Hockey Live
          </h1>
          <p className="text-green-600 text-lg font-medium">Follow your team's matches in real-time</p>
        </div>
        
        {/* Main card with enhanced styling */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-green-800 text-xl flex items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              Welcome Parents!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-center leading-relaxed">
              Stay connected with your child's field hockey matches. Get live scores, 
              match updates, and never miss a moment of the action.
            </p>
            
            {/* Enhanced button */}
            <Link to="/live-match" className="block">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                📱 Follow Live Match
              </Button>
            </Link>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Live Scores</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Real-time</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Share</p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">🔑 Get your match key from your coach to start following the game</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
