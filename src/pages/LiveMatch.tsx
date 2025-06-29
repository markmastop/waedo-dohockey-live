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
  events: any[] | null;
  club_logo_url: string | null;
}

const LiveMatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchKey, setMatchKey] = useState(searchParams.get('key') || '');
  const [matchData, setMatchData] = useState<LiveMatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatchKeyInput, setShowMatchKeyInput] = useState(true);

  const getLatestEventDescription = (matchData: LiveMatchData) => {
    // First try to get from events array (newest format)
    if (matchData.events && Array.isArray(matchData.events) && matchData.events.length > 0) {
      const latestEvent = matchData.events[matchData.events.length - 1];
      if (latestEvent && typeof latestEvent === 'object' && latestEvent.description) {
        return latestEvent.description;
      }
    }
    
    // Fallback to last_event field
    if (matchData.last_event) {
      try {
        // Try to parse as JSON first
        const eventObj = JSON.parse(matchData.last_event);
        if (eventObj.description) {
          return eventObj.description;
        }
      } catch {
        // If not JSON, return as is
        return matchData.last_event;
      }
    }
    
    return null;
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
            const newMatchData = payload.new as LiveMatchData;
            setMatchData(newMatchData);
            
            // Show toast with event description
            const eventDescription = getLatestEventDescription(newMatchData);
            if (eventDescription) {
              toast.success(`⚽ ${eventDescription}`);
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

  const latestEventDescription = matchData ? getLatestEventDescription(matchData) : null;

  return (
    <div className="min-h-screen bg-white p-1">
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
              <div className="flex items-center gap-3">
                {matchData.club_logo_url && (
                  <img
                    src={matchData.club_logo_url}
                    alt="Club Logo"
                    className="w-8 h-8 object-contain rounded"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span className="font-mono text-gray-700">Match Key: {matchData.match_key}</span>
              </div>
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

            {latestEventDescription && (
              <LastEvent
                event={latestEventDescription}
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