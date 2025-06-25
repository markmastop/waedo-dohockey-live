
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings, Plus, Play, Pause, Square, Trophy, Timer, Users } from 'lucide-react';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4 text-green-600" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'finished': return <Square className="w-4 h-4 text-gray-600" />;
      default: return <Timer className="w-4 h-4 text-blue-600" />;
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
              Match Admin
            </h1>
          </div>
          <p className="text-gray-600">Manage live field hockey matches</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Trophy className="w-5 h-5" />
              Live Match Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create Test Match Button */}
            <Button 
              onClick={createTestMatch} 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Test Match
            </Button>
            
            {/* Match Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Match:</label>
              <Select onValueChange={(value) => {
                const match = matches.find(m => m.id === value);
                setSelectedMatch(match || null);
              }}>
                <SelectTrigger className="border-2 focus:border-blue-400">
                  <SelectValue placeholder="Choose a match to manage" />
                </SelectTrigger>
                <SelectContent>
                  {matches.map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(match.status)}
                        <span className="font-mono font-semibold">{match.match_key}</span>
                        <span>-</span>
                        <span>{match.home_team} vs {match.away_team}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Match Controls */}
            {selectedMatch && (
              <div className="space-y-6 border-t-2 border-gray-100 pt-6">
                {/* Score Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Home Score:</label>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <Input
                        type="number"
                        value={selectedMatch.home_score}
                        onChange={(e) => updateMatchData({ home_score: parseInt(e.target.value) || 0 })}
                        className="border-2 focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Away Score:</label>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <Input
                        type="number"
                        value={selectedMatch.away_score}
                        onChange={(e) => updateMatchData({ away_score: parseInt(e.target.value) || 0 })}
                        className="border-2 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Game Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Quarter:</label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <Input
                        type="number"
                        min="1"
                        max="4"
                        value={selectedMatch.current_quarter}
                        onChange={(e) => updateMatchData({ current_quarter: parseInt(e.target.value) || 1 })}
                        className="border-2 focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Time (seconds):</label>
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-orange-600" />
                      <Input
                        type="number"
                        value={selectedMatch.match_time}
                        onChange={(e) => updateMatchData({ match_time: parseInt(e.target.value) || 0 })}
                        className="border-2 focus:border-orange-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Control */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Match Status:</label>
                  <Select onValueChange={(value) => updateMatchData({ status: value })}>
                    <SelectTrigger className="border-2 focus:border-gray-400">
                      <SelectValue placeholder={selectedMatch.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-blue-600" />
                          Not Started
                        </div>
                      </SelectItem>
                      <SelectItem value="live">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-green-600" />
                          Live
                        </div>
                      </SelectItem>
                      <SelectItem value="paused">
                        <div className="flex items-center gap-2">
                          <Pause className="w-4 h-4 text-yellow-600" />
                          Paused
                        </div>
                      </SelectItem>
                      <SelectItem value="finished">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4 text-gray-600" />
                          Finished
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Management */}
                <div className="space-y-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <label className="block text-sm font-semibold text-orange-800">Add Match Event:</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Goal by Player X, Penalty corner, etc."
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      className="border-2 border-orange-200 focus:border-orange-400"
                    />
                    <Button 
                      onClick={addEvent} 
                      disabled={loading || !newEvent.trim()}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Match Info Display */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <strong className="text-slate-700">Match Key:</strong> 
                    <span className="font-mono bg-white px-2 py-1 rounded border">{selectedMatch.match_key}</span>
                  </div>
                  {selectedMatch.last_event && (
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>Last Event:</strong> {selectedMatch.last_event}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveMatchAdmin;
