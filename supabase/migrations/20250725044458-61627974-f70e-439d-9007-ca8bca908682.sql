-- Remove ip_hash and user_agent columns from survey_responses table
ALTER TABLE public.survey_responses 
DROP COLUMN IF EXISTS ip_hash,
DROP COLUMN IF EXISTS user_agent;