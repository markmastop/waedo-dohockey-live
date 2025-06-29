import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface LastEventProps {
  event: string;
  eventTime: string | null;
}

const LastEvent = ({ event, eventTime }: LastEventProps) => {
  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gray-700" />
          Latest Event
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-base text-gray-800 font-bold mb-2">
            {event}
          </p>
          {eventTime && (
            <p className="text-xs text-gray-600 font-medium">
              {new Date(eventTime).toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastEvent;