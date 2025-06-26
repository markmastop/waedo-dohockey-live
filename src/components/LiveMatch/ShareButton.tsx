
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
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg hover:shadow-3xl transition-all duration-500">
      <CardContent className="p-6">
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full border-2 border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-500 group py-4 text-lg font-semibold relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Share2 className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform duration-300" />
          📱 Share Match Link
          <Sparkles className="w-5 h-5 ml-3 text-yellow-500" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShareButton;
