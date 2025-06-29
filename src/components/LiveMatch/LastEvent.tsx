
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface LastEventProps {
  event: string;
  eventTime: string | null;
}

const LastEvent = ({ event, eventTime }: LastEventProps) => {
  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-gray-700" />
          Latest Event
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-lg text-gray-800 font-bold mb-3">
            {event}
          </p>
          {eventTime && (
            <p className="text-sm text-gray-600 font-medium">
              {new Date(eventTime).toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastEvent;
