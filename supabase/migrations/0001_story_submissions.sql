-- story_submissions: public submissions for "Share your story" (marketing site)
-- RLS: no public anon INSERT; use service role from server / edge only.

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  email text not null,
  city text not null,
  state text not null,

  about text not null check (about in ('self', 'other')),

  bio text not null,
  jokuh_usage text not null,
  impact text not null,
  uniqueness text not null,

  product_slugs jsonb not null default '[]'::jsonb,
  links text,
  consent boolean not null default false,
  source text not null default 'web-stories'
);

comment on table public.story_submissions is 'Jokuh marketing story lead form; write via service role only.';

alter table public.story_submissions enable row level security;
-- no policies for anon/authenticated users — only service role bypasses RLS

create index if not exists story_submissions_created_at_idx on public.story_submissions (created_at desc);
create index if not exists story_submissions_email_idx on public.story_submissions (email);
