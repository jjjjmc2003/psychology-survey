-- Remove the overly permissive policy that allows public reading of survey responses
DROP POLICY IF EXISTS "Allow anonymous response access" ON public.survey_responses;

-- The remaining policies ensure:
-- 1. Anonymous users can still INSERT responses (via "Allow anonymous survey submissions" policy)
-- 2. Only verified admins/researchers can view responses (via "Verified admins can view all responses" policy)
-- 3. Only verified admins/researchers can update/delete responses

-- This protects sensitive research participant data while maintaining anonymous survey functionality