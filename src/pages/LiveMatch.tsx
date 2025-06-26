
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LiveMatchHeader from '@/components/LiveMatch/LiveMatchHeader';
import MatchKeyInput from '@/components/LiveMatch/MatchKeyInput';
import MatchStatus from '@/components/LiveMatch/MatchStatus';
import LiveScoreboard from '@/components/LiveMatch/LiveScoreboard';
import LastEvent from '@/components/LiveMatch/LastEvent';
import ShareButton from '@/components/LiveMatch/ShareButton';
import InstructionsCard from '@/components/LiveMatch/InstructionsCard';

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
      <div className="absolute inset-0 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-green-100/20 to-emerald-100/20"></div>
      </div>
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-l from-teal-100/10 to-green-100/10"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-32 right-16 w-4 h-4 bg-emerald-300 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-24 left-12 w-5 h-5 bg-teal-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-lg mx-auto space-y-8 relative z-10">
        <LiveMatchHeader />

        <MatchKeyInput
          matchKey={matchKey}
          setMatchKey={setMatchKey}
          onSubmit={fetchMatchData}
          loading={loading}
          error={error}
        />

        {matchData && (
          <div className="space-y-8 animate-fade-in">
            <MatchStatus status={matchData.status} />

            <LiveScoreboard
              homeTeam={matchData.home_team}
              awayTeam={matchData.away_team}
              homeScore={matchData.home_score}
              awayScore={matchData.away_score}
              currentQuarter={matchData.current_quarter}
              matchTime={matchData.match_time}
            />

            {matchData.last_event && (
              <LastEvent
                event={matchData.last_event}
                eventTime={matchData.last_event_time}
              />
            )}

            <ShareButton matchKey={matchData.match_key} />
          </div>
        )}

        <InstructionsCard />
      </div>
    </div>
  );
};

export default LiveMatch;
