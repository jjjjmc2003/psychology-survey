-- Drop existing policies to recreate them with explicit authentication checks
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile basic info" ON public.profiles;

-- Recreate policies with explicit TO authenticated clause to prevent public access
-- This makes it crystal clear that only authenticated users can access profile data

-- Policy 1: Authenticated users can view their own profile only
CREATE POLICY "Authenticated users can view own profile" 
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Authenticated admins can view all profiles
CREATE POLICY "Authenticated admins can view all profiles" 
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Policy 3: Authenticated users can update their own profile (but not role/verification status)
CREATE POLICY "Authenticated users can update own profile" 
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  (auth.uid() = id) AND 
  (role = (SELECT role FROM profiles WHERE id = auth.uid())) AND 
  (is_verified_admin = (SELECT is_verified_admin FROM profiles WHERE id = auth.uid()))
);

-- Add explicit comment documenting security intent
COMMENT ON TABLE public.profiles IS 'User profiles containing PII. All policies explicitly require authentication to prevent public access and protect against email harvesting attacks.';