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
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardContent className="p-8">
        {/* Score Section - Aligned at top */}
        <div className="grid grid-cols-3 items-start gap-8 mb-8">
          {/* Home Team */}
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 mb-4">
              {homeScore}
            </div>
            <div className="text-lg font-bold text-gray-700 break-words px-2">
              {homeTeam}
            </div>
          </div>

          {/* VS Separator */}
          <div className="text-center">
            <div className="text-gray-400 text-2xl font-bold">VS</div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 mb-4">
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
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Match Time</p>
              <p className="text-xl font-bold text-gray-800">{formatTime(matchTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
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