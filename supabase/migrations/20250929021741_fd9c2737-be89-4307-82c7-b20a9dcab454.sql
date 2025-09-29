-- Fix security issue: Replace overly permissive rate_limits policy with proper access control
-- Remove the current public policy
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

-- Create restricted policies for rate_limits table
-- Only allow the check_rate_limit function to access the table (via SECURITY DEFINER)
-- and verified admins to view/manage rate limit data for administrative purposes

-- Allow the system (via security definer functions) to manage rate limits
CREATE POLICY "System functions can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (
  -- Only allow access from security definer functions or verified admins
  current_setting('role') = 'service_role' OR
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'researcher') 
    AND is_verified_admin = true
  ))
);

-- Add a more specific policy for verified admins to view rate limit data for monitoring
CREATE POLICY "Verified admins can view rate limits for monitoring" 
ON public.rate_limits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'researcher') 
    AND is_verified_admin = true
  )
);