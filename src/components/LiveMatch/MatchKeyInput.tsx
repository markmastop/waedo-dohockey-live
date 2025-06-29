import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface MatchKeyInputProps {
  matchKey: string;
  setMatchKey: (key: string) => void;
  onSubmit: (key: string) => void;
  loading: boolean;
  error: string | null;
}

const MatchKeyInput = ({ matchKey, setMatchKey, onSubmit, loading, error }: MatchKeyInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(matchKey);
  };

  return (
    <Card className="shadow-md border border-gray-200 bg-white">
      <CardHeader className="pb-3 border-b border-gray-200">
        <CardTitle className="text-base font-semibold text-gray-900 text-center">
          Enter Match Key
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter match key (e.g., ABC123)"
            value={matchKey}
            onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
            className="w-full text-center text-lg font-mono border border-gray-300 focus:border-gray-500 py-2"
            maxLength={10}
          />
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 text-base font-semibold"
            disabled={loading || !matchKey.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading Match...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Follow Match
              </div>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">!</span>
              </div>
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchKeyInput;