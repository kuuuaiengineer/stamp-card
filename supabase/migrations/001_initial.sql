-- Users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  browser_token uuid unique not null default gen_random_uuid(),
  created_at timestamptz default now()
);

-- Current stamp count per user
create table public.stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade unique not null,
  count int not null default 0,
  updated_at timestamptz default now()
);

-- One row per visit/stamp grant
create table public.stamp_histories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  granted_at timestamptz default now()
);

create index stamp_histories_user_granted on public.stamp_histories(user_id, granted_at);

-- Rewards configuration
create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  required_stamp_count int not null,
  is_active boolean default true
);

-- Reward redemption history
create table public.reward_histories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  reward_id uuid references public.rewards(id) on delete cascade not null,
  used_at timestamptz default now()
);

-- Disable RLS (service role used for all writes from server actions)
alter table public.users enable row level security;
alter table public.stamps enable row level security;
alter table public.stamp_histories enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_histories enable row level security;

-- Allow anon to read active rewards and own stamp data via browser_token
-- (All mutations go through service_role server actions)
create policy "anon read rewards" on public.rewards
  for select using (is_active = true);

-- Service role bypasses RLS automatically
