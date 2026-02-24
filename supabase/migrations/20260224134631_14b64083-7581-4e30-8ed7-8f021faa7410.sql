
-- Profiles table with approval flag
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admin (Leo) can read all profiles
CREATE POLICY "Admin can read all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leojsjoqvist@gmail.com'
  );

-- Admin can update all profiles (approve users)
CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leojsjoqvist@gmail.com'
  );

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, approved)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'leojsjoqvist@gmail.com' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
