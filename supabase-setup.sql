-- Baftani Holo: Supabase database setup
-- Run this file in Supabase Dashboard > SQL Editor.
-- Public visitors can read active products and submit orders.
-- Product changes and order reading are intentionally restricted until a real
-- Supabase Auth admin login is implemented; do NOT open public write access.

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  price numeric(12,0) not null default 0 check (price >= 0),
  category text not null default '',
  badge text not null default '',
  description text not null default '',
  emoji text not null default '🧶',
  images jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  date text not null default '',
  name text not null,
  phone text not null,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,0) not null default 0 check (total >= 0),
  discount integer not null default 0 check (discount between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
on public.products for select to anon, authenticated
using (active = true);

drop policy if exists "Anyone can submit an order" on public.orders;
create policy "Anyone can submit an order"
on public.orders for insert to anon, authenticated
with check (true);

-- No public product INSERT/UPDATE/DELETE policy and no public order SELECT policy.
-- Admin authentication and ownership checks must be added before enabling
-- cross-device management of products/orders.
