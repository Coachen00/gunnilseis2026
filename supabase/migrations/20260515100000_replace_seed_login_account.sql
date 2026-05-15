-- Replace the old temporary Lerum login with the shared Gunnilse 2026 login.
-- Supabase sends password reset emails to the auth user's email by default.
-- Leo is stored as recovery_contact for admin reference/custom reset flows.

do $$
declare
  account_id uuid;
  old_account_id uuid;
begin
  select id into old_account_id
  from auth.users
  where email = 'lerum20260424@gunnilse.local';

  if old_account_id is not null then
    delete from auth.identities
    where user_id = old_account_id
       or identity_data ->> 'email' = 'lerum20260424@gunnilse.local';

    delete from public.user_roles
    where user_id = old_account_id;

    delete from public.profiles
    where id = old_account_id;
  end if;

  delete from auth.users
  where email = 'lerum20260424@gunnilse.local';

  select id into account_id
  from auth.users
  where email = 'gunnilse2026@gunnilse.se';

  if account_id is null then
    account_id := gen_random_uuid();

    insert into auth.users (
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
    ) values (
      '00000000-0000-0000-0000-000000000000',
      account_id,
      'authenticated',
      'authenticated',
      'gunnilse2026@gunnilse.se',
      crypt('spelet2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"recovery_contact":"leojsjoqvist@gmail.com"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

  else
    update auth.users
    set
      encrypted_password = crypt('spelet2026', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"recovery_contact":"leojsjoqvist@gmail.com"}'::jsonb,
      updated_at = now()
    where id = account_id;

  end if;

  delete from auth.identities
  where user_id = account_id
    and provider = 'email';

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    account_id,
    jsonb_build_object('sub', account_id::text, 'email', 'gunnilse2026@gunnilse.se', 'email_verified', true),
    'email',
    account_id::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, email, approved)
  values (account_id, 'gunnilse2026@gunnilse.se', true)
  on conflict (id) do update
  set email = excluded.email,
      approved = true;
end $$;
