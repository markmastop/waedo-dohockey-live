import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, Users, Play, Pause, Square, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface LiveMatchData {
  id: string;
  match_key: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  current_quarter: number;
  match_time: number;
  status: string;
  last_event: string | null;
  last_event_time: string | null;
}

const LiveMatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchKey, setMatchKey] = useState(searchParams.get('key') || '');
  const [matchData, setMatchData] = useState<LiveMatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'paused': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'finished': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'finished': return <Square className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const fetchMatchData = async (key: string) => {
    if (!key.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching match data for key:', key);
      
      const { data, error } = await supabase
        .from('matches_live')
        .select('*')
        .eq('match_key', key.trim().toUpperCase())
        .maybeSingle();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to load match data. Please try again.');
        setMatchData(null);
        return;
      }

      if (!data) {
        setError('Match not found. Please check your match key.');
        setMatchData(null);
        return;
      }

      setMatchData(data);
      setSearchParams({ key: key.trim().toUpperCase() });
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An unexpected error occurred.');
      setMatchData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMatchData(matchKey);
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!matchData) return;

    console.log('Setting up real-time subscription for:', matchData.match_key);

    const channel = supabase
      .channel('live-match-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches_live',
          filter: `match_key=eq.${matchData.match_key}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setMatchData(payload.new as LiveMatchData);
            if (payload.new.last_event) {
              toast.success(`⚽ ${payload.new.last_event}`);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [matchData?.match_key]);

  // Auto-load match if key is in URL
  useEffect(() => {
    const urlKey = searchParams.get('key');
    if (urlKey && urlKey !== matchKey) {
      setMatchKey(urlKey);
      fetchMatchData(urlKey);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%2322c55e" fill-opacity="0.02"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center py-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏑</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Live Match
            </h1>
          </div>
          <p className="text-green-600 font-medium">Follow your team's game in real-time</p>
        </div>

        {/* Enhanced Match Key Input */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <Target className="w-5 h-5" />
              Enter Match Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter match key (e.g., ABC123)"
                  value={matchKey}
                  onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono border-2 focus:border-green-400 transition-colors"
                  maxLength={10}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={loading || !matchKey.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  'Follow Match'
                )}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Live Match Data */}
        {matchData && (
          <div className="space-y-6 animate-fade-in">
            {/* Animated Status Badge */}
            <div className="flex justify-center">
              <Badge className={`${getStatusColor(matchData.status)} text-white px-6 py-3 text-sm font-semibold shadow-lg animate-pulse`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(matchData.status)}
                  <span className="capitalize">{matchData.status.replace('_', ' ')}</span>
                </div>
              </Badge>
            </div>

            {/* Enhanced Scoreboard */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 items-center gap-6">
                  {/* Home Team */}
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 animate-bounce">
                      {matchData.home_score}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 break-words">
                      {matchData.home_team}
                    </div>
                  </div>

                  {/* VS Separator with animation */}
                  <div className="text-center">
                    <div className="text-gray-400 text-lg font-bold animate-pulse">VS</div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 animate-bounce">
                      {matchData.away_score}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 break-words">
                      {matchData.away_team}
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-gradient-to-r from-transparent via-green-200 to-transparent" />

                {/* Enhanced Match Info */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Time: {formatTime(matchData.match_time)}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Quarter: {matchData.current_quarter}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Last Event */}
            {matchData.last_event && (
              <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-amber-50 animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Latest Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-orange-700 font-medium mb-2">
                    {matchData.last_event}
                  </p>
                  {matchData.last_event_time && (
                    <p className="text-xs text-orange-600">
                      {new Date(matchData.last_event_time).toLocaleTimeString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Enhanced Share Button */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/live-match?key=${matchData.match_key}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Match link copied to clipboard!');
                  }}
                  variant="outline"
                  className="w-full border-2 border-green-200 hover:bg-green-50 transition-all duration-300 group"
                >
                  <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  📱 Share Match Link
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Instructions */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              How to follow a match:
            </h3>
            <ol className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Get the match key from your coach
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Enter it above and tap "Follow Match"
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                Watch live updates automatically appear
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                Share the link with other parents!
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMatch;
