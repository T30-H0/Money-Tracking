-- Fixed taxonomy IDs are shared with the client. Preserve all existing categories and transactions.
insert into public.categories (id, name, icon, color, type) values
  ('00000000-0000-4000-8000-000000000017', 'Electricity', 'receipt-text', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000018', 'Water', 'receipt-text', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000019', 'Internet', 'receipt-text', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000020', 'Phone charges', 'receipt-text', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000021', 'Gas', 'receipt-text', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000022', 'Parking', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000023', 'Cosmetics', 'shopping-bag', 'pink', 'expense'),
  ('00000000-0000-4000-8000-000000000024', 'Clothing', 'shopping-bag', 'violet', 'expense'),
  ('00000000-0000-4000-8000-000000000025', 'Vehicle repairs', 'car', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000026', 'Vehicle maintenance', 'car', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000027', 'Fuel', 'car', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000028', 'Tolls', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000029', 'Medicine', 'heart-pulse', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000030', 'Medical visits', 'heart-pulse', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000031', 'Dental care', 'heart-pulse', 'teal', 'expense'),
  ('00000000-0000-4000-8000-000000000032', 'AI', 'briefcase-business', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000033', 'Courses', 'briefcase-business', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000034', 'Books', 'briefcase-business', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000035', 'Other bills', 'receipt-text', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000036', 'Other shopping', 'shopping-bag', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000037', 'Other health expenses', 'heart-pulse', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000038', 'Vehicles', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000039', 'Finance', 'wallet-cards', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000040', 'Education', 'briefcase-business', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000041', 'Income', 'wallet-cards', 'emerald', 'income')
on conflict (id) do nothing;

-- Fail atomically if a fixed ID is already used for a different category.
do $$
begin
  if exists (
    select 1 from (values
  ('00000000-0000-4000-8000-000000000017', 'Electricity', 'receipt-text', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000018', 'Water', 'receipt-text', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000019', 'Internet', 'receipt-text', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000020', 'Phone charges', 'receipt-text', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000021', 'Gas', 'receipt-text', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000022', 'Parking', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000023', 'Cosmetics', 'shopping-bag', 'pink', 'expense'),
  ('00000000-0000-4000-8000-000000000024', 'Clothing', 'shopping-bag', 'violet', 'expense'),
  ('00000000-0000-4000-8000-000000000025', 'Vehicle repairs', 'car', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000026', 'Vehicle maintenance', 'car', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000027', 'Fuel', 'car', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000028', 'Tolls', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000029', 'Medicine', 'heart-pulse', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000030', 'Medical visits', 'heart-pulse', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000031', 'Dental care', 'heart-pulse', 'teal', 'expense'),
  ('00000000-0000-4000-8000-000000000032', 'AI', 'briefcase-business', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000033', 'Courses', 'briefcase-business', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000034', 'Books', 'briefcase-business', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000035', 'Other bills', 'receipt-text', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000036', 'Other shopping', 'shopping-bag', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000037', 'Other health expenses', 'heart-pulse', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000038', 'Vehicles', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000039', 'Finance', 'wallet-cards', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000040', 'Education', 'briefcase-business', 'indigo', 'expense'),
  ('00000000-0000-4000-8000-000000000041', 'Income', 'wallet-cards', 'emerald', 'income')
    ) as expected(id, name, icon, color, type)
    left join public.categories actual on actual.id = expected.id::uuid
    where actual.id is null or actual.name <> expected.name or actual.type <> expected.type
  ) then
    raise exception 'Category ID conflicts with the fixed taxonomy';
  end if;
end $$;
