-- Use an existing database icon for compatibility with older deployed clients.
-- Current clients map this category ID to the gift icon.
insert into public.categories (id, name, icon, color, type) values
  ('00000000-0000-4000-8000-000000000016', 'Gifts & Donation', 'heart-pulse', 'pink', 'expense')
on conflict (id) do nothing;
