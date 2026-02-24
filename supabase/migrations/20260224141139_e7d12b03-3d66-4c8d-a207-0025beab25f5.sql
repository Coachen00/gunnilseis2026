-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Admin can read all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leojsjoqvist@gmail.com'
  );

CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leojsjoqvist@gmail.com'
  );

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);