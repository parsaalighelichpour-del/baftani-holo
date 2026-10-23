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


-- Shared product reviews and ratings (applied to the live project)
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  customer_name text not null default 'مهمان',
  review_text text,
  rating integer,
  created_at timestamptz not null default now(),
  constraint product_reviews_rating_range check (rating is null or rating between 1 and 5),
  constraint product_reviews_content_present check (
    (review_text is not null and length(trim(review_text)) between 1 and 1000)
    or rating is not null
  ),
  constraint product_reviews_name_length check (length(trim(customer_name)) between 1 and 80)
);
alter table public.product_reviews enable row level security;
grant select, insert on public.product_reviews to anon, authenticated;
drop policy if exists "Public can read product reviews" on public.product_reviews;
create policy "Public can read product reviews"
on public.product_reviews for select to anon, authenticated using (true);
drop policy if exists "Public can submit product reviews" on public.product_reviews;
create policy "Public can submit product reviews"
on public.product_reviews for insert to anon, authenticated
with check (
  length(trim(customer_name)) between 1 and 80
  and (rating is null or rating between 1 and 5)
  and (
    (review_text is not null and length(trim(review_text)) between 1 and 1000)
    or rating is not null
  )
  and exists (select 1 from public.products p where p.id = product_id and p.active = true)
);
