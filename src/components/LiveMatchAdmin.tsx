
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const LiveMatchAdmin = () => {
  const [matches, setMatches] = useState<LiveMatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatchData | null>(null);
  const [newEvent, setNewEvent] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches_live')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load matches');
      return;
    }

    setMatches(data || []);
  };

  const updateMatchData = async (updates: Partial<LiveMatchData>) => {
    if (!selectedMatch) return;

    setLoading(true);
    const { error } = await supabase
      .from('matches_live')
      .update(updates)
      .eq('id', selectedMatch.id);

    if (error) {
      toast.error('Failed to update match');
    } else {
      toast.success('Match updated successfully');
      setSelectedMatch({ ...selectedMatch, ...updates });
      fetchMatches();
    }
    setLoading(false);
  };

  const addEvent = async () => {
    if (!newEvent.trim() || !selectedMatch) return;

    await updateMatchData({
      last_event: newEvent,
      last_event_time: new Date().toISOString()
    });
    setNewEvent('');
  };

  const createTestMatch = async () => {
    const matchKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error } = await supabase
      .from('matches_live')
      .insert({
        match_key: matchKey,
        home_team: 'Home Team',
        away_team: 'Away Team',
        home_score: 0,
        away_score: 0,
        current_quarter: 1,
        match_time: 0,
        status: 'not_started'
      });

    if (error) {
      toast.error('Failed to create test match');
    } else {
      toast.success(`Test match created with key: ${matchKey}`);
      fetchMatches();
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Match Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={createTestMatch} className="w-full">
            Create Test Match
          </Button>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Match:</label>
            <Select onValueChange={(value) => {
              const match = matches.find(m => m.id === value);
              setSelectedMatch(match || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a match" />
              </SelectTrigger>
              <SelectContent>
                {matches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.match_key} - {match.home_team} vs {match.away_team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMatch && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Home Score:</label>
                  <Input
                    type="number"
                    value={selectedMatch.home_score}
                    onChange={(e) => updateMatchData({ home_score: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Away Score:</label>
                  <Input
                    type="number"
                    value={selectedMatch.away_score}
                    onChange={(e) => updateMatchData({ away_score: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quarter:</label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={selectedMatch.current_quarter}
                    onChange={(e) => updateMatchData({ current_quarter: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time (seconds):</label>
                  <Input
                    type="number"
                    value={selectedMatch.match_time}
                    onChange={(e) => updateMatchData({ match_time: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status:</label>
                <Select onValueChange={(value) => updateMatchData({ status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedMatch.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Add Event:</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Goal by Player X, Penalty corner, etc."
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                  />
                  <Button onClick={addEvent} disabled={loading}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Match Key:</strong> {selectedMatch.match_key}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveMatchAdmin;
