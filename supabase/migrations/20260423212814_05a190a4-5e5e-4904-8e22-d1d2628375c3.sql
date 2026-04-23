DO $$
DECLARE
  new_user_id uuid;
  existing_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_id FROM auth.users WHERE email = 'lerum20260424@gunnilse.local';

  IF existing_id IS NULL THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'lerum20260424@gunnilse.local',
      crypt('vikommeralltidförberedda', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'lerum20260424@gunnilse.local', 'email_verified', true),
      'email',
      new_user_id::text,
      now(),
      now(),
      now()
    );

    -- handle_new_user trigger should create profile, but ensure approved
    INSERT INTO public.profiles (id, email, approved)
    VALUES (new_user_id, 'lerum20260424@gunnilse.local', true)
    ON CONFLICT (id) DO UPDATE SET approved = true;
  ELSE
    -- Make sure existing one is approved
    UPDATE public.profiles SET approved = true WHERE id = existing_id;
  END IF;
END $$;