
-- Remove the hardcoded admin password vulnerability by implementing proper admin management
-- Create admin invitations table for secure admin onboarding
CREATE TABLE public.admin_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  invitation_token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable RLS on admin invitations
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Create policy for admin invitations (only admins can manage invitations)
CREATE POLICY "Admins can manage invitations" ON public.admin_invitations
  FOR ALL USING (public.is_admin(auth.uid()));

-- Add column to profiles to track admin verification status
ALTER TABLE public.profiles ADD COLUMN is_verified_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create function to verify admin email domains
CREATE OR REPLACE FUNCTION public.is_admin_email(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT email_address ILIKE '%@psychology.research' 
    OR email_address ILIKE '%@admin.research'
    OR email_address IN ('admin@lovable.dev', 'research@admin.com');
$$;

-- Create function to handle admin signup with invitation
CREATE OR REPLACE FUNCTION public.validate_admin_signup(
  p_email TEXT,
  p_invitation_token UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_valid BOOLEAN := FALSE;
BEGIN
  -- Check if invitation exists and is valid
  SELECT EXISTS(
    SELECT 1 FROM admin_invitations 
    WHERE email = p_email 
      AND invitation_token = p_invitation_token
      AND expires_at > NOW()
      AND is_used = FALSE
  ) INTO invitation_valid;
  
  -- Mark invitation as used if valid
  IF invitation_valid THEN
    UPDATE admin_invitations 
    SET is_used = TRUE, used_at = NOW()
    WHERE email = p_email AND invitation_token = p_invitation_token;
  END IF;
  
  RETURN invitation_valid;
END;
$$;

-- Update the handle_new_user function to properly set admin roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role := 'participant';
  is_verified BOOLEAN := FALSE;
BEGIN
  -- Check if this is an admin email
  IF public.is_admin_email(new.email) THEN
    user_role := 'admin';
    is_verified := TRUE;
  END IF;
  
  INSERT INTO profiles (id, email, role, first_name, last_name, is_verified_admin)
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
$$;

-- Strengthen RLS policies for survey responses
DROP POLICY IF EXISTS "Admins can view all responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Admins can update responses" ON public.survey_responses;

CREATE POLICY "Verified admins can view all responses" ON public.survey_responses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
        AND role IN ('admin', 'researcher') 
        AND is_verified_admin = TRUE
    )
  );

CREATE POLICY "Verified admins can delete responses" ON public.survey_responses
  FOR DELETE USING (
    EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
        AND role IN ('admin', 'researcher') 
        AND is_verified_admin = TRUE
    )
  );

-- Add audit logging for admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  )
  VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- Create rate limiting table for server-side implementation
CREATE TABLE public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  action_type TEXT NOT NULL, -- 'survey_submit', 'login_attempt', etc.
  attempt_count INTEGER DEFAULT 1 NOT NULL,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  blocked_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(identifier, action_type)
);

-- Create function for server-side rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts INTEGER := 0;
  window_start TIMESTAMP WITH TIME ZONE := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  is_blocked BOOLEAN := FALSE;
BEGIN
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM rate_limits 
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Get or create rate limit record
  INSERT INTO rate_limits (identifier, action_type, attempt_count, first_attempt_at, last_attempt_at)
  VALUES (p_identifier, p_action_type, 1, NOW(), NOW())
  ON CONFLICT (identifier, action_type) 
  DO UPDATE SET 
    attempt_count = CASE 
      WHEN rate_limits.first_attempt_at < window_start THEN 1
      ELSE rate_limits.attempt_count + 1
    END,
    first_attempt_at = CASE 
      WHEN rate_limits.first_attempt_at < window_start THEN NOW()
      ELSE rate_limits.first_attempt_at
    END,
    last_attempt_at = NOW(),
    blocked_until = CASE 
      WHEN (CASE 
        WHEN rate_limits.first_attempt_at < window_start THEN 1
        ELSE rate_limits.attempt_count + 1
      END) > p_max_attempts THEN NOW() + INTERVAL '1 hour'
      ELSE NULL
    END
  RETURNING attempt_count INTO current_attempts;
  
  RETURN current_attempts <= p_max_attempts;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX idx_rate_limits_blocked_until ON public.rate_limits(blocked_until);
CREATE INDEX idx_admin_invitations_token ON public.admin_invitations(invitation_token);
CREATE INDEX idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX idx_profiles_verified_admin ON public.profiles(is_verified_admin);
