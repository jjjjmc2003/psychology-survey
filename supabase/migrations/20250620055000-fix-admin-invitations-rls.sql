
-- Fix RLS policies for admin_invitations table to allow proper invitation creation

-- First, drop all existing policies on admin_invitations
DROP POLICY IF EXISTS "Allow authenticated users to create invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to view invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to update invitations" ON public.admin_invitations;
DROP POLICY IF EXISTS "Allow authenticated users to delete invitations" ON public.admin_invitations;

-- Create more permissive policies for admin invitation management
-- Allow admins to create invitations
CREATE POLICY "Admins can create invitations" ON public.admin_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_verified_admin = true
    )
  );

-- Allow admins to view all invitations
CREATE POLICY "Admins can view invitations" ON public.admin_invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_verified_admin = true
    )
  );

-- Allow admins to update invitations (for marking as used)
CREATE POLICY "Admins can update invitations" ON public.admin_invitations
  FOR UPDATE TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_verified_admin = true
    )
  )
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_verified_admin = true
    )
  );

-- Allow system/service role to access invitations for validation during signup
CREATE POLICY "Service role can access invitations" ON public.admin_invitations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable RLS on admin_invitations if not already enabled
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
