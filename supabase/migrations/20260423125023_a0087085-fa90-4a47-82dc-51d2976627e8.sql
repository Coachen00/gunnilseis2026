-- Defense-in-depth: explicit RESTRICTIVE policy ensuring only admins can write to user_roles
DROP POLICY IF EXISTS "Only admins can write roles" ON public.user_roles;
CREATE POLICY "Only admins can write roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR ALL
  TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger-level guard: block any role mutation unless caller is an admin.
-- Allows the initial seed (when no admin exists yet) and bypasses for service_role contexts
-- where auth.uid() is null AND the operation is a system bootstrap.
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  admin_count int;
BEGIN
  -- Allow bootstrapping the very first admin when none exists yet
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count = 0 THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Require the caller to be an admin for any role mutation
  IF caller IS NULL OR NOT public.has_role(caller, 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only admins can modify role assignments';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_self_escalation_trigger ON public.user_roles;
CREATE TRIGGER prevent_role_self_escalation_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_escalation();