
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface LastEventProps {
  event: string;
  eventTime: string | null;
}

const LastEvent = ({ event, eventTime }: LastEventProps) => {
  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 animate-fade-in hover:shadow-3xl transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-orange-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          Latest Event
          <div className="ml-auto text-xs bg-orange-200 px-3 py-1 rounded-full">NEW</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-orange-200">
          <p className="text-lg text-orange-800 font-bold mb-3">
            {event}
          </p>
          {eventTime && (
            <p className="text-sm text-orange-600 font-medium">
              {new Date(eventTime).toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastEvent;
