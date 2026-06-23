-- Run this in the Supabase SQL editor

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','processing','pending_approval','approved','printing','shipped')),
  tier text not null
    check (tier in ('keepsake','portrait','statement')),
  price_cents integer not null,
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  original_image_url text not null,
  enhanced_image_url text,
  stripe_session_id text,
  prodigi_order_id text,
  tracking_url text,
  revision_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Storage buckets (run these separately or via the Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('originals', 'originals', false);
-- insert into storage.buckets (id, name, public) values ('enhanced', 'enhanced', true);
