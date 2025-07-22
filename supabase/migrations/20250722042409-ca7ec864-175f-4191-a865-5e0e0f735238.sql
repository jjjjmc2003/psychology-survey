-- Create consent records table
CREATE TABLE public.consent_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_signature TEXT NOT NULL,
  consent_given_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert consent records (for anonymous participants)
CREATE POLICY "Allow anonymous consent submissions" 
ON public.consent_records 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view consent records
CREATE POLICY "Admins can view consent records" 
ON public.consent_records 
FOR SELECT 
USING (is_admin(auth.uid()));