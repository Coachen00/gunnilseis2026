-- Ensure the shared Gunnilse login exists on the live Supabase project.
-- The frontend accepts Gunnilse@gunnilse.se case-insensitively and keeps the
-- previous gunnilse2026@gunnilse.se account as a temporary fallback.

do $$
declare
  account_id uuid;
  legacy_account_id uuid;
  target_email text := 'gunnilse@gunnilse.se';
  legacy_email text := 'gunnilse2026@gunnilse.se';
begin
  select id into account_id
  from auth.users
  where lower(email) = target_email
  limit 1;

  select id into legacy_account_id
  from auth.users
  where lower(email) = legacy_email
  limit 1;

  if account_id is null and legacy_account_id is not null then
    account_id := legacy_account_id;

    update auth.users
    set
      email = target_email,
      encrypted_password = crypt('spelet2026', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"recovery_contact":"leojsjoqvist@gmail.com"}'::jsonb,
      confirmation_token = '',
      email_change = '',
      email_change_token_new = '',
      recovery_token = '',
      updated_at = now()
    where id = account_id;
  elsif account_id is null then
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
      target_email,
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
      confirmation_token = '',
      email_change = '',
      email_change_token_new = '',
      recovery_token = '',
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
    jsonb_build_object('sub', account_id::text, 'email', target_email, 'email_verified', true),
    'email',
    account_id::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, email, approved)
  values (account_id, target_email, true)
  on conflict (id) do update
  set email = excluded.email,
      approved = true;

  if legacy_account_id is not null and legacy_account_id <> account_id then
    update auth.users
    set
      encrypted_password = crypt('spelet2026', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"recovery_contact":"leojsjoqvist@gmail.com"}'::jsonb,
      updated_at = now()
    where id = legacy_account_id;

    insert into public.profiles (id, email, approved)
    values (legacy_account_id, legacy_email, true)
    on conflict (id) do update
    set email = excluded.email,
        approved = true;
  end if;
end $$;
