-- =====================================================================
-- Pocketwise Expense Tracker — Supabase schema
-- Run this once in the Supabase SQL editor for your project.
-- =====================================================================

-- 1. Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- 2. Table
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  category    text not null check (
    category in (
      'Food', 'Travel', 'Shopping', 'Bills',
      'Entertainment', 'Health', 'Education', 'Other'
    )
  ),
  date        date not null,
  created_at  timestamptz not null default now()
);

-- 3. Helpful indexes
create index if not exists expenses_user_id_idx on public.expenses (user_id);
create index if not exists expenses_user_date_idx on public.expenses (user_id, date desc);

-- 4. Row Level Security
alter table public.expenses enable row level security;

-- Drop old policies first so this script is safe to re-run
drop policy if exists "Users can view their own expenses" on public.expenses;
drop policy if exists "Users can insert their own expenses" on public.expenses;
drop policy if exists "Users can update their own expenses" on public.expenses;
drop policy if exists "Users can delete their own expenses" on public.expenses;

-- 5. Policies — every action is scoped to auth.uid()
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- =====================================================================
-- Done. Your `expenses` table now only ever exposes each signed-in
-- user's own rows, enforced at the database level regardless of what
-- the client sends.
-- =====================================================================
