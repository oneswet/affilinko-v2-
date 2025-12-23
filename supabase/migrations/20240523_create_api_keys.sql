
-- API Keys Table for Agent/Platform Access
create table public.api_keys (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  key_prefix text not null, -- Store first few chars for display (e.g. sk_live_123...)
  key_hash text not null, -- Store hashed key for verification
  permissions jsonb not null default '["read"]'::jsonb, -- e.g. ["read", "write", "admin"]
  last_used_at timestamp with time zone,
  is_active boolean default true,
  constraint api_keys_pkey primary key (id)
);

-- RLS Policies for API Keys
alter table public.api_keys enable row level security;

create policy "Admins can view all api keys" on public.api_keys
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can insert api keys" on public.api_keys
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update api keys" on public.api_keys
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete api keys" on public.api_keys
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
