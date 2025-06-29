import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  matchKey: string;
}

const ShareButton = ({ matchKey }: ShareButtonProps) => {
  const handleShare = () => {
    const url = `${window.location.origin}/live-match?key=${matchKey}`;
    navigator.clipboard.writeText(url);
    toast.success('Match link copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
          <Share2 className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800">Share Match</h3>
      </div>
      
      <Button
        onClick={handleShare}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
      >
        <Share2 className="w-5 h-5 mr-3" />
        📱 Share Match Link
        <Sparkles className="w-5 h-5 ml-3" />
      </Button>
    </div>
  );
};

export default ShareButton;