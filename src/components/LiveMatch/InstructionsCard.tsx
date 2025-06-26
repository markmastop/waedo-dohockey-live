
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const InstructionsCard = () => {
  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 animate-fade-in hover:shadow-3xl transition-all duration-500">
      <CardContent className="p-8">
        <h3 className="font-bold text-blue-800 mb-6 flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
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
            <div key={index} className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-all duration-300 group">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-blue-700 font-semibold">{item.text}</p>
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
