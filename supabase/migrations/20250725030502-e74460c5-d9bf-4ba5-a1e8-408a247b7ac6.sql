-- Drop the audit_logs table and related function
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP FUNCTION IF EXISTS public.log_admin_action(text, text, text, jsonb) CASCADE;