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
      <CardContent className="p-4">
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full border border-gray-300 hover:bg-gray-100 py-2 text-base font-semibold"
        >
          <Share2 className="w-4 h-4 mr-2" />
          📱 Share Match Link
          <Sparkles className="w-4 h-4 ml-2 text-gray-500" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShareButton;