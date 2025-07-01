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
import EventsTimeline from '@/components/LiveMatch/EventsTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  club_logo_url: string | null;
}

const LiveMatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchKey, setMatchKey] = useState(searchParams.get('key') || '');
  const [matchData, setMatchData] = useState<LiveMatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatchKeyInput, setShowMatchKeyInput] = useState(true);
  const [showEventsTimeline, setShowEventsTimeline] = useState(false);
  const [events, setEvents] = useState<Array<any>>([]);

  const getLatestEventDescription = (matchData: LiveMatchData) => {
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
      
      // Fetch match data
      const { data: matchData, error: matchError } = await supabase
        .from('matches_live')
        .select('*')
        .eq('match_key', key.trim().toUpperCase())
        .maybeSingle();

      console.log('Match data:', { matchData, matchError });

      if (matchError) {
        console.error('Match data error:', matchError);
        setError('Failed to load match data. Please try again.');
        setMatchData(null);
        return;
      }

      if (!matchData) {
        setError('Match not found. Please check your match key.');
        setMatchData(null);
        return;
      }

      setMatchData(matchData);
      setSearchParams({ key: key.trim().toUpperCase() });
      setShowMatchKeyInput(false);

      // Fetch events for the match
      const { data: eventsData, error: eventsError } = await supabase
        .from('matches_live_events')
        .select('*')
        .eq('match_id', matchData.id)
        .order('created_at', { ascending: false });

      if (eventsError) {
        console.error('Events error:', eventsError);
        toast.error('Failed to load match events');
      } else {
        setEvents(eventsData || []);
      }
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
        async (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newMatchData = payload.new as LiveMatchData;
            setMatchData(newMatchData);
            
            // Fetch latest events
            try {
              const { data: eventsData, error: eventsError } = await supabase
                .from('matches_live_events')
                .select('*')
                .eq('match_id', newMatchData.id)
                .order('created_at', { ascending: false });

              if (eventsError) {
                console.error('Events error:', eventsError);
                toast.error('Failed to load match events');
              } else {
                setEvents(eventsData || []);
              }
            } catch (err) {
              console.error('Error fetching events:', err);
              toast.error('Failed to load match events');
            }

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
    <div>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <LiveMatchHeader />

          {showMatchKeyInput ? (
            <div className="mx-2">
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
              <div className="mx-2">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3 shadow-md">
                  <div className="flex items-center gap-2">
                    {matchData.club_logo_url && (
                      <img
                        src={matchData.club_logo_url}
                        alt="Club Logo"
                        className="w-6 h-6 object-contain rounded"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="font-mono text-sm text-gray-700">Match Key: {matchData.match_key}</span>
                  </div>
                  <button
                    className="text-xs text-gray-600 underline"
                    onClick={() => setShowMatchKeyInput(true)}
                  >
                    Change
                  </button>
                </div>
              </div>
            )
          )}

          {matchData && (
            <div className="space-y-4 animate-fade-in mx-2">
              <MatchStatus status={matchData.status} />

              <LiveScoreboard
                homeTeam={matchData.home_team}
                awayTeam={matchData.away_team}
                homeScore={matchData.home_score}
                awayScore={matchData.away_score}
                currentQuarter={matchData.current_quarter}
                matchTime={matchData.match_time}
              />

              {matchData?.last_event && (
                <LastEvent
                  event={getLatestEventDescription(matchData)}
                  eventTime={matchData.last_event_time}
                />
              )}

              <ShareButton matchKey={matchData.match_key} />

              {/* Events Timeline Button */}
              {events.length > 0 && !showEventsTimeline && (
                <Card className="shadow-md border border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowEventsTimeline(true)}
                      className="w-full border border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 py-2 text-base font-semibold"
                    >
                      📋 View All Events ({events.length})
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Events Timeline */}
              {showEventsTimeline && (
                <EventsTimeline 
                  events={events}
                  onClose={() => setShowEventsTimeline(false)}
                />
              )}
            </div>
          )}

          <div className="mx-2">
            <InstructionsCard />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">
        v1.0.0
      </div>
    </div>
  );
};

export default LiveMatch;;