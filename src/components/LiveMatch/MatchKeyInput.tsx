
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Target, Play, Trophy, Sparkles } from 'lucide-react';

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
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg animate-scale-in hover:shadow-3xl transition-all duration-500">
      <CardHeader className="pb-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-3 text-green-800 justify-center">
          <Target className="w-6 h-6 animate-pulse" />
          Enter Match Key
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Enter match key (e.g., ABC123)"
              value={matchKey}
              onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
              className="text-center text-xl font-mono border-2 border-green-200 focus:border-green-400 transition-all duration-300 py-4 bg-gradient-to-r from-white to-green-50 group-hover:shadow-lg"
              maxLength={10}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 py-4 text-lg font-bold relative overflow-hidden group"
            disabled={loading || !matchKey.trim()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading Match...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Follow Match
                <Trophy className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl animate-fade-in shadow-lg">
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
