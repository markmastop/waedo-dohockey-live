import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

const InstructionsCard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
          <Target className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-2xl font-bold text-amber-800">How to follow a match</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { step: 1, text: "Get the match key from your coach", color: "blue" },
          { step: 2, text: "Enter it above and tap 'Follow Match'", color: "green" },
          { step: 3, text: "Watch live updates automatically appear", color: "purple" },
          { step: 4, text: "Share the link with others!", color: "pink" }
        ].map((item, index) => (
          <div key={index} className={`flex items-center gap-4 p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-2xl border border-${item.color}-200/50 hover:shadow-lg transition-all duration-300`}>
            <div className={`flex-shrink-0 w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center text-${item.color}-700 font-bold text-lg`}>
              {item.step}
            </div>
            <div className="flex-1">
              <p className={`text-${item.color}-800 font-semibold`}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsCard;