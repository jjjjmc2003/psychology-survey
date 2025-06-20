
-- Drop existing conflicting policies on admin_invitations
DROP POLICY IF EXISTS "Admins can manage invitations" ON public.admin_invitations;

-- Create more specific policies for admin_invitations table
-- Allow authenticated users to insert invitations (for admin creation)
CREATE POLICY "Allow authenticated users to create invitations" ON public.admin_invitations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to select invitations (for viewing)
CREATE POLICY "Allow authenticated users to view invitations" ON public.admin_invitations
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update invitations (for revoking)
CREATE POLICY "Allow authenticated users to update invitations" ON public.admin_invitations
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete invitations if needed
CREATE POLICY "Allow authenticated users to delete invitations" ON public.admin_invitations
  FOR DELETE TO authenticated
  USING (true);
