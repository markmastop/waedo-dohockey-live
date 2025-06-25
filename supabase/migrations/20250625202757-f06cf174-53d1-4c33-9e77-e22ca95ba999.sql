
-- Create a table for live match data
CREATE TABLE public.matches_live (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_key TEXT NOT NULL UNIQUE,
  match_id UUID REFERENCES public.matches(id),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER NOT NULL DEFAULT 0,
  away_score INTEGER NOT NULL DEFAULT 0,
  current_quarter INTEGER NOT NULL DEFAULT 1,
  match_time INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started',
  last_event TEXT,
  last_event_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for security
ALTER TABLE public.matches_live ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (parents can follow without authentication)
CREATE POLICY "Anyone can view live matches" 
  ON public.matches_live 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert/update (coaches/admins only)
CREATE POLICY "Authenticated users can manage live matches" 
  ON public.matches_live 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_matches_live_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_matches_live_updated_at_trigger
  BEFORE UPDATE ON public.matches_live
  FOR EACH ROW
  EXECUTE FUNCTION update_matches_live_updated_at();

-- Enable realtime for live updates
ALTER TABLE public.matches_live REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches_live;
