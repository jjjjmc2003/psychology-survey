-- Allow anonymous users to select their just-inserted survey response
-- This is needed because the insert query uses .select('id').single()
CREATE POLICY "Allow anonymous users to select their own submissions"
ON public.survey_responses
AS PERMISSIVE
FOR SELECT
TO anon
USING (participant_id IS NULL AND created_at > (NOW() - INTERVAL '5 minutes'));