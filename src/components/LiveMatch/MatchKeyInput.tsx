
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
      <CardHeader className="pb-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 text-center">
          Enter Match Key
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Enter match key (e.g., ABC123)"
            value={matchKey}
            onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
            className="w-full text-center text-xl font-mono border border-gray-300 focus:border-gray-500 py-3"
            maxLength={10}
          />
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold"
            disabled={loading || !matchKey.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading Match...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                Follow Match
              </div>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchKeyInput;
