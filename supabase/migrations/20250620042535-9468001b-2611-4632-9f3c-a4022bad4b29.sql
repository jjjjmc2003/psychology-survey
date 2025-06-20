
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'researcher', 'participant');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role app_role DEFAULT 'participant' NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create survey_responses table with encryption support
CREATE TABLE public.survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id TEXT NOT NULL,
  participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_hash TEXT, -- Hashed IP for rate limiting
  user_agent TEXT,
  completion_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on survey_responses
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create survey_sessions table for tracking
CREATE TABLE public.survey_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_question INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL
);

-- Enable RLS on survey_sessions
ALTER TABLE public.survey_sessions ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table for security tracking
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_id AND role IN ('admin', 'researcher'));
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for survey_responses
CREATE POLICY "Participants can insert own responses" ON public.survey_responses
  FOR INSERT WITH CHECK (auth.uid() = participant_id);

CREATE POLICY "Participants can view own responses" ON public.survey_responses
  FOR SELECT USING (auth.uid() = participant_id);

CREATE POLICY "Admins can view all responses" ON public.survey_responses
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update responses" ON public.survey_responses
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for survey_sessions
CREATE POLICY "Participants can manage own sessions" ON public.survey_sessions
  FOR ALL USING (auth.uid() = participant_id);

CREATE POLICY "Admins can view all sessions" ON public.survey_sessions
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Create trigger function for automatic profile creation with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, role, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email LIKE '%@psychology.research' THEN 'admin'::app_role
      ELSE 'participant'::app_role
    END,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to clean up expired sessions with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM survey_sessions 
  WHERE expires_at < NOW() AND is_completed = FALSE;
$$;

-- Create function for secure survey response insertion with proper search_path
CREATE OR REPLACE FUNCTION public.submit_survey_response(
  p_survey_id TEXT,
  p_responses JSONB,
  p_completion_time INTERVAL DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_id UUID;
BEGIN
  -- Insert the survey response
  INSERT INTO survey_responses (
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

  -- Log the submission
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  )
  VALUES (
    auth.uid(),
    'survey_completed',
    'survey_response',
    response_id::text,
    jsonb_build_object('survey_id', p_survey_id, 'response_count', jsonb_array_length(p_responses))
  );

  RETURN response_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_survey_responses_participant_id ON public.survey_responses(participant_id);
CREATE INDEX idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX idx_survey_responses_created_at ON public.survey_responses(created_at);
CREATE INDEX idx_survey_sessions_participant_id ON public.survey_sessions(participant_id);
CREATE INDEX idx_survey_sessions_expires_at ON public.survey_sessions(expires_at);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.survey_responses TO authenticated;
GRANT ALL ON public.survey_sessions TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
