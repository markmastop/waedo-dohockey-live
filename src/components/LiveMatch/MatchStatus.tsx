
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, Zap } from 'lucide-react';

interface MatchStatusProps {
  status: string;
}

const MatchStatus = ({ status }: MatchStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse';
      case 'paused': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'finished': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
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
      <Badge className={`${getStatusColor(status)} text-white px-8 py-4 text-lg font-bold shadow-2xl`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('_', ' ')}</span>
          {status === 'live' && <Zap className="w-4 h-4 animate-pulse" />}
        </div>
      </Badge>
    </div>
  );
};

export default MatchStatus;
