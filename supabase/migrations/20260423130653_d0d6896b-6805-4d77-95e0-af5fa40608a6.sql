-- Matches table
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent text NOT NULL,
  match_date timestamptz,
  home_away text CHECK (home_away IN ('home','away')),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','played')),
  our_score int,
  their_score int,
  competition text,
  venue text,
  external_id text UNIQUE,
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','scraped')),
  manual_override boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_matches_status_date ON public.matches(status, match_date DESC);

-- Match sections (free text per phase/area)
CREATE TABLE public.match_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  field_key text NOT NULL,
  content text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, section_key, field_key)
);

CREATE INDEX idx_match_sections_match ON public.match_sections(match_id);

-- Media items (image OR video, url OR uploaded file)
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  slot_key text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  source_kind text NOT NULL DEFAULT 'url' CHECK (source_kind IN ('url','upload')),
  url text,
  storage_path text,
  caption text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, slot_key)
);

CREATE INDEX idx_media_items_match ON public.media_items(match_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_match_sections_updated BEFORE UPDATE ON public.match_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_media_items_updated BEFORE UPDATE ON public.media_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Helper: is the user approved?
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND approved = true);
$$;

-- RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved users read matches" ON public.matches FOR SELECT TO authenticated
  USING (public.is_approved_user());
CREATE POLICY "Approved users write matches" ON public.matches FOR ALL TO authenticated
  USING (public.is_approved_user()) WITH CHECK (public.is_approved_user());

CREATE POLICY "Approved users read sections" ON public.match_sections FOR SELECT TO authenticated
  USING (public.is_approved_user());
CREATE POLICY "Approved users write sections" ON public.match_sections FOR ALL TO authenticated
  USING (public.is_approved_user()) WITH CHECK (public.is_approved_user());

CREATE POLICY "Approved users read media" ON public.media_items FOR SELECT TO authenticated
  USING (public.is_approved_user());
CREATE POLICY "Approved users write media" ON public.media_items FOR ALL TO authenticated
  USING (public.is_approved_user()) WITH CHECK (public.is_approved_user());

-- Storage bucket for uploaded match media
INSERT INTO storage.buckets (id, name, public)
VALUES ('match-media', 'match-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read match-media" ON storage.objects FOR SELECT
  USING (bucket_id = 'match-media');
CREATE POLICY "Approved users upload match-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'match-media' AND public.is_approved_user());
CREATE POLICY "Approved users update match-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'match-media' AND public.is_approved_user());
CREATE POLICY "Approved users delete match-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'match-media' AND public.is_approved_user());

-- Seed current and previous match per user request
INSERT INTO public.matches (opponent, match_date, home_away, status, competition, venue, source, manual_override)
VALUES ('Velebit', '2026-05-02 13:00:00+02', 'home', 'upcoming', 'Hemma · 13:00', 'Gunnilseplan', 'manual', true),
       ('Partille', NULL, NULL, 'played', NULL, NULL, 'manual', true);
