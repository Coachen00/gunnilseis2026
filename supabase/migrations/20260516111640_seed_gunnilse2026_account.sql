-- Seedar det delade Gunnilse-tränarkontot.
--
-- Email:    gunnilse2026@gunnilse.se   (case-insensitive lookup)
-- Lösenord: spelet2026                  (rotera vid behov efter delning)
--
-- Idempotent: kan köras flera gånger. Skapar usern om den inte finns,
-- uppdaterar password + email_confirmed_at om den finns.
--
-- Sätter:
--   - profiles.approved = true   (RLS för media_library/principle_media/m.fl. kräver detta)
--   - user_roles.role  = 'admin' (kan hantera mediabibliotek + godkänna andra tränare)

do $$
declare
  target_email text := 'gunnilse2026@gunnilse.se';
  target_pass  text := 'spelet2026';
  uid uuid;
begin
  -- 1. Hitta eller skapa user i auth.users
  select id into uid from auth.users where lower(email) = lower(target_email);

  if uid is null then
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      uid, 'authenticated', 'authenticated', lower(target_email),
      crypt(target_pass, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', lower(target_email), 'email_verified', true),
      'email', uid::text,
      now(), now(), now()
    );
  else
    update auth.users
       set encrypted_password = crypt(target_pass, gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           updated_at = now()
     where id = uid;
  end if;

  -- 2. Säkerställ profiles-rad med approved=true
  insert into public.profiles (id, email, approved)
       values (uid, lower(target_email), true)
  on conflict (id) do update set approved = true, email = excluded.email;

  -- 3. Ge admin-roll (om du inte vill det — ta bort detta block)
  insert into public.user_roles (user_id, role)
       values (uid, 'admin'::public.app_role)
  on conflict (user_id, role) do nothing;
end $$;
