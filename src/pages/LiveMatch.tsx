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
  const [showMatchKeyInput, setShowMatchKeyInput] = useState(true);

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
      setShowMatchKeyInput(false);
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <LiveMatchHeader />

        {showMatchKeyInput ? (
          <MatchKeyInput
            matchKey={matchKey}
            setMatchKey={setMatchKey}
            onSubmit={fetchMatchData}
            loading={loading}
            error={error}
          />
        ) : (
          matchData && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-4 shadow-md">
              <span className="font-mono text-gray-700">Match Key: {matchData.match_key}</span>
              <button
                className="text-sm text-gray-600 underline"
                onClick={() => setShowMatchKeyInput(true)}
              >
                Change
              </button>
            </div>
          )
        )}

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
