import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const InstructionsCard = () => {
  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-gray-700" />
          </div>
          How to follow a match:
        </h3>
        <div className="space-y-3">
          {[
            { step: 1, text: "Get the match key from your coach" },
            { step: 2, text: "Enter it above and tap 'Follow Match'" },
            { step: 3, text: "Watch live updates automatically appear" },
            { step: 4, text: "Share the link with others!" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-semibold text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;