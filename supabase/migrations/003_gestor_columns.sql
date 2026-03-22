-- Migration 003: Add columns needed for Gestor dashboard + admin read policies

-- sat_target_score on profiles (default 1300 — standard SAT target)
alter table profiles add column if not exists sat_target_score integer default 1300;

-- Rename user_colleges.college_name to name (if it was created with college_name)
-- This handles both possible naming conventions safely
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'user_colleges' and column_name = 'college_name'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'user_colleges' and column_name = 'name'
  ) then
    alter table user_colleges rename column college_name to name;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'user_colleges' and column_name = 'name'
  ) then
    alter table user_colleges add column name text not null default '';
  end if;
end $$;

-- Allow admins (@hopon.academy) to read all profiles
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using (
  auth.uid() = id
  or exists (
    select 1 from profiles p2
    where p2.id = auth.uid()
      and p2.email like '%@hopon.academy'
  )
);

-- Allow admins to read all lesson progress
drop policy if exists "Admins can view all lesson progress" on user_lesson_progress;
create policy "Admins can view all lesson progress" on user_lesson_progress for select using (
  auth.uid() = user_id
  or exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.email like '%@hopon.academy'
  )
);

-- Allow admins to read all AI sessions
drop policy if exists "Admins can view all AI sessions" on ai_chat_sessions;
create policy "Admins can view all AI sessions" on ai_chat_sessions for select using (
  auth.uid() = user_id
  or exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.email like '%@hopon.academy'
  )
);

-- Allow admins to read all SAT results
drop policy if exists "Admins can view all SAT results" on sat_practice_results;
create policy "Admins can view all SAT results" on sat_practice_results for select using (
  auth.uid() = user_id
  or exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.email like '%@hopon.academy'
  )
);

-- Allow admins to read all college lists
drop policy if exists "Admins can view all colleges" on user_colleges;
create policy "Admins can view all colleges" on user_colleges for select using (
  auth.uid() = user_id
  or exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.email like '%@hopon.academy'
  )
);
