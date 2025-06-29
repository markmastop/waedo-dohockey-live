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
    <div className="space-y-8">
      {/* Score Section */}
      <div className="grid grid-cols-3 items-center gap-8">
        {/* Home Team */}
        <div className="text-center">
          <div className="text-7xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            {homeScore}
          </div>
          <div className="text-lg font-bold text-gray-700 break-words px-2">
            {homeTeam}
          </div>
        </div>

        {/* VS Separator */}
        <div className="text-center">
          <div className="text-gray-400 text-3xl font-bold">VS</div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <div className="text-7xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            {awayScore}
          </div>
          <div className="text-lg font-bold text-gray-700 break-words px-2">
            {awayTeam}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Match Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Match Time</p>
            <p className="text-2xl font-bold text-blue-800">{formatTime(matchTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium">Current Quarter</p>
            <p className="text-2xl font-bold text-purple-800">{currentQuarter}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreboard;