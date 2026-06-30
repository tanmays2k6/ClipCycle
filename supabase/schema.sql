-- =============================================================================
-- ClipCycle — Supabase Database Schema
-- Relational schema with UUIDs and Row Level Security
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────

create type idea_status   as enum ('pending', 'draft', 'analyzed', 'generated', 'ready', 'published', 'used', 'archived');
create type idea_source   as enum ('text', 'link', 'screenshot', 'voice', 'instagram-save', 'bookmark');
create type idea_platform as enum ('instagram', 'youtube', 'linkedin', 'twitter', 'blog');
create type content_type  as enum ('caption', 'script', 'post', 'thread', 'outline', 'article');
create type activity_type as enum (
  'idea_created',
  'idea_updated',
  'idea_deleted',
  'idea_status_changed',
  'content_generated',
  'ai_analysis_completed',
  'user_signed_in',
  'user_signed_out'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Users
-- Synced from Supabase Auth via trigger. Single source for app-level profile.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  full_name     text,
  avatar_url    text,
  bio           text,
  plan          text not null default 'free' check (plan in ('free', 'pro', 'team')),
  onboarded     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.users is 'App-level user profiles, linked 1:1 with auth.users.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Ideas
-- The core table. Each idea belongs to a user and tracks source, status,
-- target platforms, and AI-generated tags/suggestions.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.ideas (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  title           text not null,
  description     text,
  source          idea_source not null default 'text',
  source_label    text,
  source_url      text,
  status          idea_status not null default 'pending',
  platforms       idea_platform[] not null default '{}',
  tags            text[] not null default '{}',
  ai_suggestion   text,
  is_favorite     boolean not null default false,
  published_at    timestamptz,
  published_platform text,
  published_url   text,
  scheduled_at    timestamptz,
  last_generated_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.ideas is 'Content ideas captured by users from various sources.';

create index idx_ideas_user_id    on public.ideas(user_id);
create index idx_ideas_status     on public.ideas(status);
create index idx_ideas_created_at on public.ideas(created_at desc);
create index idx_ideas_tags       on public.ideas using gin(tags);
create index idx_ideas_platforms  on public.ideas using gin(platforms);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Generated Content
-- AI-generated publish-ready content for a specific idea + platform.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.generated_content (
  id              uuid primary key default gen_random_uuid(),
  idea_id         uuid not null references public.ideas(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  platform        idea_platform not null,
  content_type    content_type not null,
  title           text,
  body            text not null,
  model_used      text,
  prompt_tokens   integer,
  output_tokens   integer,
  is_saved        boolean not null default false,
  created_at      timestamptz not null default now()
);

comment on table public.generated_content is 'AI-generated platform-specific content derived from user ideas.';

create index idx_generated_content_idea_id on public.generated_content(idea_id);
create index idx_generated_content_user_id on public.generated_content(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. AI Analysis
-- AI-generated analysis of an idea (trend score, quality, recommendations).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.ai_analysis (
  id                  uuid primary key default gen_random_uuid(),
  idea_id             uuid not null references public.ideas(id) on delete cascade,
  user_id             uuid not null references public.users(id) on delete cascade,
  trend_score         smallint check (trend_score between 0 and 100),
  virality_score      smallint check (virality_score between 0 and 100),
  suggested_platforms idea_platform[] not null default '{}',
  suggested_tags      text[] not null default '{}',
  summary             text,
  strengths           text[],
  improvements        text[],
  best_post_time      text,
  model_used          text,
  created_at          timestamptz not null default now()
);

comment on table public.ai_analysis is 'AI-powered analysis with scoring, tag suggestions, and content recommendations.';

create index idx_ai_analysis_idea_id on public.ai_analysis(idea_id);
create index idx_ai_analysis_user_id on public.ai_analysis(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Activity Logs
-- Immutable audit trail of all meaningful user actions.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.activity_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  activity_type activity_type not null,
  idea_id       uuid references public.ideas(id) on delete set null,
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

comment on table public.activity_logs is 'Immutable audit trail of user actions across the platform.';

create index idx_activity_logs_user_id    on public.activity_logs(user_id);
create index idx_activity_logs_type       on public.activity_logs(activity_type);
create index idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-update `updated_at` trigger
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_ideas_updated_at
  before update on public.ideas
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-create user profile on signup trigger
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- ── Users ────────────────────────────────────────────────────────────────────

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Ideas ────────────────────────────────────────────────────────────────────

alter table public.ideas enable row level security;

create policy "Users can read own ideas"
  on public.ideas for select
  using (auth.uid() = user_id);

create policy "Users can insert own ideas"
  on public.ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ideas"
  on public.ideas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own ideas"
  on public.ideas for delete
  using (auth.uid() = user_id);

-- ── Generated Content ────────────────────────────────────────────────────────

alter table public.generated_content enable row level security;

create policy "Users can read own generated content"
  on public.generated_content for select
  using (auth.uid() = user_id);

create policy "Users can insert own generated content"
  on public.generated_content for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own generated content"
  on public.generated_content for delete
  using (auth.uid() = user_id);

-- ── AI Analysis ──────────────────────────────────────────────────────────────

alter table public.ai_analysis enable row level security;

create policy "Users can read own AI analysis"
  on public.ai_analysis for select
  using (auth.uid() = user_id);

create policy "Users can insert own AI analysis"
  on public.ai_analysis for insert
  with check (auth.uid() = user_id);

-- ── Activity Logs ────────────────────────────────────────────────────────────

alter table public.activity_logs enable row level security;

create policy "Users can read own activity logs"
  on public.activity_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own activity logs"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Scheduled Posts (Calendar)
-- Scheduled events linking to ideas for content calendar.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.scheduled_posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  idea_id       uuid not null references public.ideas(id) on delete cascade,
  platform      idea_platform not null,
  publish_date  date not null,
  publish_time  time,
  priority      text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status        text not null default 'scheduled' check (status in ('scheduled', 'published', 'missed', 'draft')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.scheduled_posts is 'Scheduled content linking ideas to specific publish dates and platforms.';

create index idx_scheduled_posts_user_id on public.scheduled_posts(user_id);
create index idx_scheduled_posts_date on public.scheduled_posts(publish_date);

create trigger set_scheduled_posts_updated_at
  before update on public.scheduled_posts
  for each row execute function public.handle_updated_at();

alter table public.scheduled_posts enable row level security;

create policy "Users can read own scheduled posts"
  on public.scheduled_posts for select
  using (auth.uid() = user_id);

create policy "Users can insert own scheduled posts"
  on public.scheduled_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scheduled posts"
  on public.scheduled_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own scheduled posts"
  on public.scheduled_posts for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Analytics Cache
-- Daily snapshot of user metrics for analytics dashboard.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.analytics_cache (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  date                date not null,
  ideas_saved         integer not null default 0,
  ideas_published     integer not null default 0,
  ai_generated        integer not null default 0,
  completion_rate     numeric(5,2) not null default 0,
  productivity_score  integer not null default 0,
  metadata            jsonb not null default '{}',
  created_at          timestamptz not null default now(),
  unique(user_id, date)
);

comment on table public.analytics_cache is 'Daily snapshots of user analytics and metrics.';

create index idx_analytics_cache_user_date on public.analytics_cache(user_id, date);

alter table public.analytics_cache enable row level security;

create policy "Users can read own analytics cache"
  on public.analytics_cache for select
  using (auth.uid() = user_id);

create policy "Users can insert own analytics cache"
  on public.analytics_cache for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analytics cache"
  on public.analytics_cache for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. User Profiles (Extended)
-- ─────────────────────────────────────────────────────────────────────────────

create table public.user_profiles (
  user_id           uuid primary key references public.users(id) on delete cascade,
  username          text unique,
  creator_category  text,
  college           text,
  website           text,
  twitter           text,
  linkedin          text,
  instagram         text,
  youtube           text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
create policy "Users can read own profile settings" on public.user_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile settings" on public.user_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile settings" on public.user_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Appearance Settings
-- ─────────────────────────────────────────────────────────────────────────────

create table public.appearance_settings (
  user_id        uuid primary key references public.users(id) on delete cascade,
  theme          text not null default 'system' check (theme in ('light', 'dark', 'system')),
  compact_mode   boolean not null default false,
  accent_color   text not null default 'violet',
  reduce_motion  boolean not null default false,
  updated_at     timestamptz not null default now()
);

alter table public.appearance_settings enable row level security;
create policy "Users can manage own appearance settings" on public.appearance_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. Notification Settings
-- ─────────────────────────────────────────────────────────────────────────────

create table public.notification_settings (
  user_id                uuid primary key references public.users(id) on delete cascade,
  email_notifications    boolean not null default true,
  push_notifications     boolean not null default false,
  ai_suggestions         boolean not null default true,
  weekly_digest          boolean not null default true,
  product_updates        boolean not null default true,
  security_alerts        boolean not null default true,
  desktop_notifications  boolean not null default false,
  updated_at             timestamptz not null default now()
);

alter table public.notification_settings enable row level security;
create policy "Users can manage own notification settings" on public.notification_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. AI Preferences
-- ─────────────────────────────────────────────────────────────────────────────

create table public.ai_preferences (
  user_id               uuid primary key references public.users(id) on delete cascade,
  model                 text not null default 'auto',
  content_tone          text not null default 'professional',
  content_length        text not null default 'medium',
  default_platform      idea_platform not null default 'linkedin',
  auto_save_ai_output   boolean not null default true,
  updated_at            timestamptz not null default now()
);

alter table public.ai_preferences enable row level security;
create policy "Users can manage own ai preferences" on public.ai_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. Privacy Settings
-- ─────────────────────────────────────────────────────────────────────────────

create table public.privacy_settings (
  user_id                   uuid primary key references public.users(id) on delete cascade,
  two_factor_auth           boolean not null default false,
  data_usage_ai_training    boolean not null default false,
  updated_at                timestamptz not null default now()
);

alter table public.privacy_settings enable row level security;
create policy "Users can manage own privacy settings" on public.privacy_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. User Integrations
-- ─────────────────────────────────────────────────────────────────────────────

create table public.user_integrations (
  user_id   uuid primary key references public.users(id) on delete cascade,
  google    boolean not null default false,
  notion    boolean not null default false,
  slack     boolean not null default false,
  discord   boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_integrations enable row level security;
create policy "Users can manage own integrations" on public.user_integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
