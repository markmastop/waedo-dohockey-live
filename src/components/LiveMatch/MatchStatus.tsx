
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface MatchStatusProps {
  status: string;
}

const MatchStatus = ({ status }: MatchStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-blue-500';
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
      <Badge className={`${getStatusColor(status)} text-white px-6 py-2 text-sm font-medium`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </div>
      </Badge>
    </div>
  );
};

export default MatchStatus;
