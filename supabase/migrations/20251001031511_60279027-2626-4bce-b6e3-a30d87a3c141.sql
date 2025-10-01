-- Update the is_admin_email function to include marthamjm11@gmail.com
CREATE OR REPLACE FUNCTION public.is_admin_email(email_address text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT email_address ILIKE '%@psychology.research' 
    OR email_address ILIKE '%@admin.research'
    OR email_address IN ('admin@lovable.dev', 'research@admin.com', 'marthamjm11@gmail.com');
$function$;

-- Update the existing user profile to grant admin privileges
UPDATE public.profiles
SET 
  role = 'admin',
  is_verified_admin = true,
  updated_at = NOW()
WHERE email = 'marthamjm11@gmail.com';