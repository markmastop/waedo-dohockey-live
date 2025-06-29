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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 p-4">
      <div className="max-w-6xl mx-auto">
        <LiveMatchHeader />

        {showMatchKeyInput ? (
          <div className="max-w-lg mx-auto">
            <MatchKeyInput
              matchKey={matchKey}
              setMatchKey={setMatchKey}
              onSubmit={fetchMatchData}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          matchData && (
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  {matchData.club_logo_url && (
                    <img
                      src={matchData.club_logo_url}
                      alt="Club Logo"
                      className="w-8 h-8 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="font-mono text-gray-700 font-medium">Match Key: {matchData.match_key}</span>
                </div>
                <button
                  className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
                  onClick={() => setShowMatchKeyInput(true)}
                >
                  Change
                </button>
              </div>
            </div>
          )
        )}

        {matchData && (
          <div className="space-y-6 animate-fade-in">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Scoreboard - Takes up most space */}
              <div className="lg:col-span-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <MatchStatus status={matchData.status} />
                  </div>
                  
                  <LiveScoreboard
                    homeTeam={matchData.home_team}
                    awayTeam={matchData.away_team}
                    homeScore={matchData.home_score}
                    awayScore={matchData.away_score}
                    currentQuarter={matchData.current_quarter}
                    matchTime={matchData.match_time}
                  />
                </div>
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Latest Event */}
                {latestEventDescription && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200/50 shadow-lg p-6">
                    <LastEvent
                      event={latestEventDescription}
                      eventTime={matchData.last_event_time}
                    />
                  </div>
                )}

                {/* Share Button */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200/50 shadow-lg p-6">
                  <ShareButton matchKey={matchData.match_key} />
                </div>

              </div>
            </div>

            {/* Instructions Card - Full Width */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/50 shadow-lg p-8">
              <InstructionsCard />
            </div>

          </div>
        )}

        {/* Instructions when no match is loaded */}
        {!matchData && showMatchKeyInput && (
          <div className="max-w-lg mx-auto mt-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/50 shadow-lg p-8">
              <InstructionsCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch;