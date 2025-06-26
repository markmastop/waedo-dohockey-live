
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const InstructionsCard = () => {
  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardContent className="p-8">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-gray-700" />
          </div>
          How to follow a match:
        </h3>
        <div className="space-y-4">
          {[
            { step: 1, text: "Get the match key from your coach", icon: "🏑" },
            { step: 2, text: "Enter it above and tap 'Follow Match'", icon: "⌨️" },
            { step: 3, text: "Watch live updates automatically appear", icon: "⚡" },
            { step: 4, text: "Share the link with other parents!", icon: "📱" }
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-semibold">{item.text}</p>
              </div>
              <div className="text-2xl">{item.icon}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
