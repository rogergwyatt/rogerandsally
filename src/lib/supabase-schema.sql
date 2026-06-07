-- Run this in the Supabase SQL editor to set up the e-commerce tables

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_payment_intent_id text unique not null,
  email text not null,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb not null default '{}',
  status text not null default 'pending',
  tracking_number text,
  carrier text,
  label_url text,
  refunds jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cart_sessions (
  session_id text primary key,
  email text,
  cart_data jsonb not null default '{}',
  recovered boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index to find unrecovered carts older than 24 hours for abandoned-cart emails
create index if not exists idx_cart_sessions_abandoned
  on cart_sessions (updated_at)
  where recovered = false and email is not null;

create table if not exists custom_orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  description text not null,
  wood_preference text,
  dimensions text,
  budget text,
  timeline text,
  reference_images jsonb default '[]',
  status text not null default 'new',  -- new | quoted | accepted | declined

  quote_amount numeric(10,2),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  phone text,
  events jsonb not null default '[]',  -- CustomerEvent[]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customers_email on customers (email);

create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,               -- e.g. SAVE10
  description text,                        -- internal note
  type text not null default 'percent',    -- percent | fixed
  value numeric(10,2) not null,            -- 10 = 10% off, or $10 off
  min_order numeric(10,2) default 0,       -- minimum order subtotal to apply
  max_uses int,                            -- null = unlimited
  uses int not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Product drops: a limited batch released together as a sales tool.
create table if not exists drops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'draft',   -- draft | live | ended
  release_at timestamptz,                  -- null or past = visible now; future = scheduled
  created_at timestamptz not null default now()
);

create table if not exists drop_items (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references drops(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  price numeric(10,2) not null,
  quantity int not null default 1,         -- batch size (1 = one-of-a-kind)
  sold int not null default 0,
  allow_engraving boolean not null default true,
  weight_lbs numeric(6,2) default 3,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_drop_items_drop on drop_items (drop_id);
