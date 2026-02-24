INSERT INTO public.profiles (id, email, approved)
VALUES ('8fdfb096-eb4e-4ab4-8177-3b0850ac7ad3', 'leojsjoqvist@gmail.com', true)
ON CONFLICT (id) DO UPDATE SET approved = true, email = 'leojsjoqvist@gmail.com';