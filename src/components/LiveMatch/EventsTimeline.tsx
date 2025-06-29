import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  action: string;
  description: string;
  match_time: number;
  quarter: number;
  timestamp: string;
  metadata?: any;
}

interface EventsTimelineProps {
  events: Event[];
  onClose: () => void;
}

const EventsTimeline = ({ events, onClose }: EventsTimelineProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardHeader className="pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-700" />
            Match Events ({events.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No events yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedEvents.map((event, index) => (
              <div
                key={event.id || index}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">
                      Q{event.quarter}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Match: {formatTime(event.match_time)}</span>
                    <span>•</span>
                    <span>Time: {formatTimestamp(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsTimeline;