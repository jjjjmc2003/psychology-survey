
-- Enable Row Level Security on the rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the system to manage rate limits
-- This policy allows all operations for the service role and authenticated users
CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (true);
