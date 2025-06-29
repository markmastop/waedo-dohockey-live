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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white text-center">
          Enter Match Key
        </h3>
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Enter match key (e.g., ABC123)"
            value={matchKey}
            onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
            className="w-full text-center text-xl font-mono border-2 border-gray-300 focus:border-blue-500 py-4 rounded-2xl bg-gray-50 focus:bg-white transition-all duration-300"
            maxLength={10}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
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
          <div className="mt-6 p-6 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchKeyInput;