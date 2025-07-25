-- Phase 1: Critical Database Security Fixes

-- 1. Fix RLS policies for admin_invitations table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to create invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to delete invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to update invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to view invitations" ON public.admin_invitations;

-- Create secure admin-only policies for admin_invitations
CREATE POLICY "Verified admins can create invitations" 
ON public.admin_invitations 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'researcher') 
      AND is_verified_admin = true
  )
);

CREATE POLICY "Verified admins can view invitations" 
ON public.admin_invitations 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'researcher') 
      AND is_verified_admin = true
  )
);

CREATE POLICY "Verified admins can update invitations" 
ON public.admin_invitations 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'researcher') 
      AND is_verified_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'researcher') 
      AND is_verified_admin = true
  )
);

CREATE POLICY "Verified admins can delete invitations" 
ON public.admin_invitations 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'researcher') 
      AND is_verified_admin = true
  )
);

-- 2. Fix profiles table RLS policies to prevent role escalation
-- Add policy to prevent users from updating sensitive fields
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile basic info" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from changing their role or admin status
  role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
  is_verified_admin = (SELECT is_verified_admin FROM public.profiles WHERE id = auth.uid())
);

-- 3. Fix database function security - update search_path
CREATE OR REPLACE FUNCTION public.validate_admin_signup(p_email text, p_invitation_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  invitation_valid BOOLEAN := FALSE;
BEGIN
  -- Check if invitation exists and is valid
  SELECT EXISTS(
    SELECT 1 FROM public.admin_invitations 
    WHERE email = p_email 
      AND invitation_token = p_invitation_token
      AND expires_at > NOW()
      AND is_used = FALSE
  ) INTO invitation_valid;
  
  -- Mark invitation as used if valid
  IF invitation_valid THEN
    UPDATE public.admin_invitations 
    SET is_used = TRUE, used_at = NOW()
    WHERE email = p_email AND invitation_token = p_invitation_token;
  END IF;
  
  RETURN invitation_valid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id AND role IN ('admin', 'researcher'));
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  DELETE FROM public.survey_sessions 
  WHERE expires_at < NOW() AND is_completed = FALSE;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_email(email_address text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT email_address ILIKE '%@psychology.research' 
    OR email_address ILIKE '%@admin.research'
    OR email_address IN ('admin@lovable.dev', 'research@admin.com');
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role := 'participant';
  is_verified BOOLEAN := FALSE;
BEGIN
  -- Check if this is an admin email
  IF public.is_admin_email(new.email) THEN
    user_role := 'admin';
    is_verified := TRUE;
  END IF;
  
  INSERT INTO public.profiles (id, email, role, first_name, last_name, is_verified_admin)
  VALUES (
    new.id,
    new.email,
    user_role,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    is_verified
  );
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action_type text, p_max_attempts integer DEFAULT 5, p_window_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_attempts INTEGER := 0;
  window_start TIMESTAMP WITH TIME ZONE := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  is_blocked BOOLEAN := FALSE;
BEGIN
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM public.rate_limits 
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Get or create rate limit record
  INSERT INTO public.rate_limits (identifier, action_type, attempt_count, first_attempt_at, last_attempt_at)
  VALUES (p_identifier, p_action_type, 1, NOW(), NOW())
  ON CONFLICT (identifier, action_type) 
  DO UPDATE SET 
    attempt_count = CASE 
      WHEN public.rate_limits.first_attempt_at < window_start THEN 1
      ELSE public.rate_limits.attempt_count + 1
    END,
    first_attempt_at = CASE 
      WHEN public.rate_limits.first_attempt_at < window_start THEN NOW()
      ELSE public.rate_limits.first_attempt_at
    END,
    last_attempt_at = NOW(),
    blocked_until = CASE 
      WHEN (CASE 
        WHEN public.rate_limits.first_attempt_at < window_start THEN 1
        ELSE public.rate_limits.attempt_count + 1
      END) > p_max_attempts THEN NOW() + INTERVAL '1 hour'
      ELSE NULL
    END
  RETURNING attempt_count INTO current_attempts;
  
  RETURN current_attempts <= p_max_attempts;
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_survey_response(p_survey_id text, p_responses jsonb, p_completion_time interval DEFAULT NULL::interval, p_ip_hash text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  response_id UUID;
BEGIN
  -- Insert the survey response
  INSERT INTO public.survey_responses (
    survey_id,
    participant_id,
    responses,
    completion_time,
    ip_hash,
    user_agent
  )
  VALUES (
    p_survey_id,
    auth.uid(),
    p_responses,
    p_completion_time,
    p_ip_hash,
    current_setting('request.headers', true)::json->>'user-agent'
  )
  RETURNING id INTO response_id;

  RETURN response_id;
END;
$function$;