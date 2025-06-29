import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface MatchStatusProps {
  status: string;
}

const MatchStatus = ({ status }: MatchStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'paused': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'finished': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4 animate-pulse" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'finished': return <Square className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex justify-center">
      <Badge className={`${getStatusColor(status)} text-white px-8 py-3 text-base font-semibold rounded-2xl shadow-lg border-0`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </div>
      </Badge>
    </div>
  );
};

export default MatchStatus;