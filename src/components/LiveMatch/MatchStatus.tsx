import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface MatchStatusProps {
  status: string;
}

const MatchStatus = ({ status }: MatchStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100';
      case 'paused': return 'border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100';
      case 'finished': return 'border-gray-500 text-gray-700 bg-gray-50 hover:bg-gray-100';
      default: return 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return '🔴 Live';
      case 'paused': return '⏸️ Paused';
      case 'finished': return '🏁 Finished';
      case 'not_started': return '⏰ Not Started';
      default: return `📊 ${status.replace('_', ' ')}`;
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardContent className="p-4">
        <Button
          variant="outline"
          className={`w-full py-2 text-base font-semibold ${getStatusColor(status)}`}
          disabled
        >
          
          <span className="capitalize ml-2">{getStatusText(status)}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchStatus;