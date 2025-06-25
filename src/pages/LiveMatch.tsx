
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, Users, Play, Pause, Square } from 'lucide-react';
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
      case 'live': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-blue-500';
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-green-800 mb-2">🏑 Live Match</h1>
          <p className="text-green-600 text-sm">Follow your team's game in real-time</p>
        </div>

        {/* Match Key Input */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Enter Match Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleKeySubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Enter match key (e.g., ABC123)"
                value={matchKey}
                onChange={(e) => setMatchKey(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono"
                maxLength={10}
              />
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || !matchKey.trim()}
              >
                {loading ? 'Loading...' : 'Follow Match'}
              </Button>
            </form>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Match Data */}
        {matchData && (
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge className={`${getStatusColor(matchData.status)} text-white px-4 py-2 text-sm font-semibold`}>
                {getStatusIcon(matchData.status)}
                <span className="ml-2 capitalize">{matchData.status.replace('_', ' ')}</span>
              </Badge>
            </div>

            {/* Scoreboard */}
            <Card className="shadow-lg border-2 border-green-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Home Team */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">
                      {matchData.home_score}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 break-words">
                      {matchData.home_team}
                    </div>
                  </div>

                  {/* VS Separator */}
                  <div className="text-center">
                    <div className="text-gray-400 text-sm font-medium">VS</div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">
                      {matchData.away_score}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 break-words">
                      {matchData.away_team}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Match Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Time: {formatTime(matchData.match_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Quarter: {matchData.current_quarter}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Event */}
            {matchData.last_event && (
              <Card className="shadow-md border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-800">Latest Event</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-orange-700 font-medium">
                    {matchData.last_event}
                  </p>
                  {matchData.last_event_time && (
                    <p className="text-xs text-orange-600 mt-1">
                      {new Date(matchData.last_event_time).toLocaleTimeString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Share Button */}
            <Card className="shadow-md">
              <CardContent className="p-4">
                <Button
                  onClick={() => {
                    const url = `${window.location.origin}/live-match?key=${matchData.match_key}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Match link copied to clipboard!');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  📱 Share Match Link
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="shadow-md bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">How to follow a match:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Get the match key from your coach</li>
              <li>2. Enter it above and tap "Follow Match"</li>
              <li>3. Watch live updates automatically appear</li>
              <li>4. Share the link with other parents!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMatch;
