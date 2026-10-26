-- Entertainment already exists; preserve its ID and all existing transactions.
insert into public.categories (id, name, icon, color, type) values
  ('00000000-0000-4000-8000-000000000011', 'Family', 'users', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000012', 'Pet', 'paw-print', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000013', 'Rental', 'house', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000014', 'Bank', 'landmark', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000015', 'Insurance', 'shield-check', 'teal', 'expense')
on conflict (id) do nothing;
