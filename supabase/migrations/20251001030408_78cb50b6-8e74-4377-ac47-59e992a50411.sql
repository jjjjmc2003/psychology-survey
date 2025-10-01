-- Fix the anonymous survey submission policy
-- The issue is that the current policy is RESTRICTIVE instead of PERMISSIVE
-- Drop the existing restrictive policy and create a proper permissive one

DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.survey_responses;

-- Create a permissive policy that allows anonymous users to insert survey responses
CREATE POLICY "Allow anonymous survey submissions"
ON public.survey_responses
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (participant_id IS NULL);

-- Also ensure authenticated users can submit their own surveys
CREATE POLICY "Allow authenticated users to submit surveys" 
ON public.survey_responses
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (participant_id = auth.uid() OR participant_id IS NULL);