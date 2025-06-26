
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, Users, Play, Pause, Square, Share2, Sparkles, Trophy, Zap, Star } from 'lucide-react';
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
      case 'live': return 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse';
      case 'paused': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'finished': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4 animate-pulse" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'finished': return <Square className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
      {/* Enhanced animated background patterns */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2322c55e\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M20 20c0 11.046-8.954 20-20 20v20h40V20H20z\"/%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2322c55e\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-32 right-16 w-4 h-4 bg-emerald-300 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-24 left-12 w-5 h-5 bg-teal-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-lg mx-auto space-y-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center py-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <span className="text-3xl animate-pulse">🏑</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient-x">
                Live Match
              </h1>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-green-600 font-semibold">Real-time Updates</span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </div>
          <p className="text-green-600 font-semibold text-lg">Follow your team&apos;s game in real-time</p>
        </div>

        {/* Premium Match Key Input */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg animate-scale-in hover:shadow-3xl transition-all duration-500">
          <CardHeader className="pb-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-3 text-green-800 justify-center">
              <Target className="w-6 h-6 animate-pulse" />
              Enter Match Key
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleKeySubmit} className="space-y-6">
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

        {/* Premium Live Match Data */}
        {matchData && (
          <div className="space-y-8 animate-fade-in">
            {/* Enhanced Status Badge */}
            <div className="flex justify-center">
              <Badge className={`${getStatusColor(matchData.status)} text-white px-8 py-4 text-lg font-bold shadow-2xl`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(matchData.status)}
                  <span className="capitalize">{matchData.status.replace('_', ' ')}</span>
                  {matchData.status === 'live' && <Zap className="w-4 h-4 animate-pulse" />}
                </div>
              </Badge>
            </div>

            {/* Premium Scoreboard */}
            <Card className="shadow-3xl border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 backdrop-blur-lg animate-scale-in hover:shadow-4xl transition-all duration-500">
              <CardContent className="p-10">
                <div className="grid grid-cols-3 items-center gap-8">
                  {/* Home Team */}
                  <div className="text-center group">
                    <div className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse hover:scale-110 transition-transform duration-300">
                      {matchData.home_score}
                    </div>
                    <div className="text-lg font-bold text-gray-700 break-words px-2">
                      {matchData.home_team}
                    </div>
                    <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
                  </div>

                  {/* VS Separator with premium styling */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="text-gray-400 text-2xl font-bold animate-pulse">VS</div>
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-green-300 rounded-full animate-spin opacity-30"></div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-emerald-300 rounded-full animate-ping opacity-20"></div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center group">
                    <div className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse hover:scale-110 transition-transform duration-300">
                      {matchData.away_score}
                    </div>
                    <div className="text-lg font-bold text-gray-700 break-words px-2">
                      {matchData.away_team}
                    </div>
                    <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
                  </div>
                </div>

                <Separator className="my-8 bg-gradient-to-r from-transparent via-green-300 to-transparent h-0.5" />

                {/* Enhanced Match Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Match Time</p>
                      <p className="text-xl font-bold text-gray-800">{formatTime(matchData.match_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Current Quarter</p>
                      <p className="text-xl font-bold text-gray-800">{matchData.current_quarter}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Last Event */}
            {matchData.last_event && (
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 animate-fade-in hover:shadow-3xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-orange-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    Latest Event
                    <div className="ml-auto text-xs bg-orange-200 px-3 py-1 rounded-full">NEW</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-orange-200">
                    <p className="text-lg text-orange-800 font-bold mb-3">
                      {matchData.last_event}
                    </p>
                    {matchData.last_event_time && (
                      <p className="text-sm text-orange-600 font-medium">
                        {new Date(matchData.last_event_time).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Share Button */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-6">
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/live-match?key=${matchData.match_key}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Match link copied to clipboard!');
                  }}
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
          </div>
        )}

        {/* Premium Instructions */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 animate-fade-in hover:shadow-3xl transition-all duration-500">
          <CardContent className="p-8">
            <h3 className="font-bold text-blue-800 mb-6 flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              How to follow a match:
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, text: "Get the match key from your coach", icon: "🏑" },
                { step: 2, text: "Enter it above and tap 'Follow Match'", icon: "⌨️" },
                { step: 3, text: "Watch live updates automatically appear", icon: "⚡" },
                { step: 4, text: "Share the link with other parents!", icon: "📱" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-700 font-semibold">{item.text}</p>
                  </div>
                  <div className="text-2xl">{item.icon}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMatch;
