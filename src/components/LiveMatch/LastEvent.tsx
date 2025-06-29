import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface LastEventProps {
  event: string;
  eventTime: string | null;
}

const LastEvent = ({ event, eventTime }: LastEventProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-blue-800">Latest Event</h3>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50">
        <p className="text-lg text-gray-800 font-semibold mb-3">
          {event}
        </p>
        {eventTime && (
          <p className="text-sm text-blue-600 font-medium">
            {new Date(eventTime).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default LastEvent;