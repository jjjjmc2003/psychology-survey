-- Update the submit_survey_response function to remove ip_hash parameter
CREATE OR REPLACE FUNCTION public.submit_survey_response(
  p_survey_id text, 
  p_responses jsonb, 
  p_completion_time interval DEFAULT NULL::interval, 
  p_ip_hash text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  response_id UUID;
BEGIN
  -- Insert the survey response without ip_hash and user_agent columns
  INSERT INTO public.survey_responses (
    survey_id,
    participant_id,
    responses,
    completion_time,
    metadata
  )
  VALUES (
    p_survey_id,
    auth.uid(),
    p_responses,
    p_completion_time,
    jsonb_build_object(
      'user_agent', current_setting('request.headers', true)::json->>'user-agent',
      'ip_hash', p_ip_hash,
      'timestamp', NOW()
    )
  )
  RETURNING id INTO response_id;

  RETURN response_id;
END;
$$;