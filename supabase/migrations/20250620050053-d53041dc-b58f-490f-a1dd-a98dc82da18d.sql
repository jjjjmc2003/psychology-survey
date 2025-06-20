
-- First, drop any existing conflicting RLS policies
DROP POLICY IF EXISTS "Participants can insert own responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Participants can view own responses" ON public.survey_responses;

-- Ensure our anonymous submission policy exists and is correct
DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.survey_responses;
CREATE POLICY "Allow anonymous survey submissions" 
  ON public.survey_responses 
  FOR INSERT 
  WITH CHECK (participant_id IS NULL);

-- Also allow anonymous users to potentially read their own responses if needed
CREATE POLICY "Allow anonymous response access" 
  ON public.survey_responses 
  FOR SELECT 
  USING (participant_id IS NULL OR auth.uid() = participant_id);
