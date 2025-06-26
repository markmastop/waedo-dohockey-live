
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
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardContent className="p-6">
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full border border-gray-300 hover:bg-gray-100 py-3 text-lg font-semibold"
        >
          <Share2 className="w-5 h-5 mr-3" />
          📱 Share Match Link
          <Sparkles className="w-5 h-5 ml-3 text-gray-500" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShareButton;
