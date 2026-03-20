-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- PROFILES
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  bio text,
  plan text default 'free' check (plan in ('free', 'monthly', 'semester', 'annual')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- AI ASSISTANTS
-- ==========================================
create table public.ai_assistants (
  id text primary key,
  name text not null,
  description text,
  specialty text,
  color text,
  emoji text,
  is_active boolean default true
);

insert into public.ai_assistants values
  ('brighta', 'Brighta', 'Especialista em estratégias de estudo e planejamento acadêmico', 'Estratégia', '#0057B8', '⭐', true),
  ('gritty', 'Gritty', 'Focado em persistência e superação de desafios nos estudos', 'Motivação', '#F78490', '💪', true),
  ('smartle', 'Smartle', 'Especialista em matemática e raciocínio lógico', 'Matemática', '#FFCB22', '🧮', true),
  ('wan', 'Wan', 'Focado em inglês e preparação para o SAT verbal', 'Inglês', '#37B0DD', '📚', true);

-- ==========================================
-- COURSES
-- ==========================================
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type text not null check (type in ('aula', 'math', 'video', 'trilha')),
  duration_minutes integer default 0,
  thumbnail_url text,
  video_url text,
  content jsonb,
  "order" integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.courses enable row level security;
create policy "Anyone can view active courses" on public.courses for select using (is_active = true);

-- ==========================================
-- USER PROGRESS
-- ==========================================
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  completed boolean default false,
  progress_percent integer default 0 check (progress_percent between 0 and 100),
  last_accessed_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

alter table public.user_progress enable row level security;
create policy "Users can manage their own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- ==========================================
-- APPOINTMENTS
-- ==========================================
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  assistant_id text references public.ai_assistants on delete set null,
  scheduled_at timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz default now()
);

alter table public.appointments enable row level security;
create policy "Users can manage their own appointments"
  on public.appointments for all
  using (auth.uid() = user_id);

-- ==========================================
-- DIAGNOSTIC RESULTS
-- ==========================================
create table public.diagnostic_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  step integer not null check (step between 1 and 9),
  answers jsonb default '{}',
  score integer,
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.diagnostic_results enable row level security;
create policy "Users can manage their own diagnostics"
  on public.diagnostic_results for all
  using (auth.uid() = user_id);

-- ==========================================
-- PAYMENTS / SUBSCRIPTIONS
-- ==========================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  plan text not null check (plan in ('monthly', 'semester', 'annual')),
  status text default 'active' check (status in ('active', 'cancelled', 'expired')),
  starts_at timestamptz default now(),
  ends_at timestamptz,
  amount_cents integer not null,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ==========================================
-- USER STATS (denormalized for perf)
-- ==========================================
create table public.user_stats (
  user_id uuid references public.profiles on delete cascade primary key,
  aulas_concluidas integer default 0,
  horas_de_estudo integer default 0,
  ultimo_sat_score integer,
  streak_days integer default 0,
  updated_at timestamptz default now()
);

alter table public.user_stats enable row level security;
create policy "Users can view their own stats"
  on public.user_stats for all
  using (auth.uid() = user_id);

-- Auto-create stats on profile creation
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();
