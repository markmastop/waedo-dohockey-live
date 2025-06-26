
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Users } from 'lucide-react';

interface LiveScoreboardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  currentQuarter: number;
  matchTime: number;
}

const LiveScoreboard = ({ 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore, 
  currentQuarter, 
  matchTime 
}: LiveScoreboardProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-3xl border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 backdrop-blur-lg animate-scale-in hover:shadow-4xl transition-all duration-500">
      <CardContent className="p-10">
        <div className="grid grid-cols-3 items-center gap-8">
          {/* Home Team */}
          <div className="text-center group">
            <div className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse hover:scale-110 transition-transform duration-300">
              {homeScore}
            </div>
            <div className="text-lg font-bold text-gray-700 break-words px-2">
              {homeTeam}
            </div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
          </div>

          {/* VS Separator */}
          <div className="text-center">
            <div className="relative">
              <div className="text-gray-400 text-2xl font-bold animate-pulse">VS</div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-green-300 rounded-full animate-spin opacity-30"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-emerald-300 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center group">
            <div className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse hover:scale-110 transition-transform duration-300">
              {awayScore}
            </div>
            <div className="text-lg font-bold text-gray-700 break-words px-2">
              {awayTeam}
            </div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
          </div>
        </div>

        <Separator className="my-8 bg-gradient-to-r from-transparent via-green-300 to-transparent h-0.5" />

        {/* Match Info */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Match Time</p>
              <p className="text-xl font-bold text-gray-800">{formatTime(matchTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Quarter</p>
              <p className="text-xl font-bold text-gray-800">{currentQuarter}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScoreboard;
