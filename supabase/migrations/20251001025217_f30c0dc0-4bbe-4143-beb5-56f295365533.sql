-- Add explicit restrictive policy to block all anonymous access to profiles table
-- This ensures that no anonymous user can read, insert, update, or delete profile data

CREATE POLICY "Block all anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Verify RLS is enabled (should already be enabled, but ensuring it)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Update table comment to reflect the security measure
COMMENT ON TABLE public.profiles IS 'User profiles containing PII. RLS enabled with explicit anonymous access blocking to prevent email harvesting attacks. Only authenticated users can access profile data.';