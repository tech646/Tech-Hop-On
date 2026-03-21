-- Extended schema: lessons, lesson progress, SAT results, AI chat sessions,
-- math appointments, diagnostic results (new), and user colleges

-- lessons
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  section text not null, -- 'critical_reading' | 'grammar' | 'vocabulary' | 'math'
  order_index integer not null,
  video_url text,
  duration_minutes integer default 0,
  thumbnail_url text,
  created_at timestamptz default now()
);
alter table lessons enable row level security;
create policy "Anyone authenticated can view lessons" on lessons for select using (auth.role() = 'authenticated');

-- user_lesson_progress
create table if not exists user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  watched_seconds integer default 0,
  created_at timestamptz default now(),
  unique(user_id, lesson_id)
);
alter table user_lesson_progress enable row level security;
create policy "Users can manage own progress" on user_lesson_progress for all using (auth.uid() = user_id);

-- ai_chat_sessions
create table if not exists ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  assistant_id text not null check (assistant_id in ('brighta','gritty','smartle','wan')),
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table ai_chat_sessions enable row level security;
create policy "Users can manage own sessions" on ai_chat_sessions for all using (auth.uid() = user_id);

-- sat_practice_results
create table if not exists sat_practice_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  practice_type text default 'full',
  created_at timestamptz default now()
);
alter table sat_practice_results enable row level security;
create policy "Users can manage own SAT results" on sat_practice_results for all using (auth.uid() = user_id);

-- math_appointments
create table if not exists math_appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  teacher_name text,
  notes text,
  created_at timestamptz default now()
);
alter table math_appointments enable row level security;
create policy "Users can manage own appointments" on math_appointments for all using (auth.uid() = user_id);
-- admin can see all appointments
create policy "Admins can view all appointments" on math_appointments for select using (
  exists (select 1 from profiles where id = auth.uid() and email like '%@hopon.academy')
);

-- Add extended columns to profiles if not present
alter table profiles add column if not exists city text;
alter table profiles add column if not exists country text default 'Brazil';
alter table profiles add column if not exists school text;
alter table profiles add column if not exists current_grade text;

-- user_colleges
create table if not exists user_colleges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  college_name text not null,
  category text not null check (category in ('dream','target','safety')),
  created_at timestamptz default now()
);
alter table user_colleges enable row level security;
create policy "Users can manage own colleges" on user_colleges for all using (auth.uid() = user_id);

-- diagnostic_results (replace old table with new unique-per-user version)
create table if not exists diagnostic_results_v2 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz default now(),
  unique(user_id)
);
alter table diagnostic_results_v2 enable row level security;
create policy "Users can manage own diagnostic" on diagnostic_results_v2 for all using (auth.uid() = user_id);
