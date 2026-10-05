create table public.categories (
  id uuid primary key,
  name text not null,
  icon text not null,
  color text not null,
  type text not null check (type in ('income', 'expense')),
  constraint categories_name_type_key unique (name, type),
  constraint categories_id_type_key unique (id, type)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount bigint not null check (amount > 0),
  category_id uuid not null,
  date date not null,
  note text not null default '' check (char_length(note) <= 160),
  created_at timestamptz not null default now(),
  constraint transactions_category_type_fkey
    foreign key (category_id, type)
    references public.categories (id, type)
    on update cascade
    on delete restrict
);

create index transactions_user_date_created_idx
  on public.transactions (user_id, date desc, created_at desc);

create index transactions_category_id_idx
  on public.transactions (category_id);

insert into public.categories (id, name, icon, color, type) values
  ('00000000-0000-4000-8000-000000000001', 'Food', 'utensils', 'amber', 'expense'),
  ('00000000-0000-4000-8000-000000000002', 'Bills', 'receipt-text', 'blue', 'expense'),
  ('00000000-0000-4000-8000-000000000003', 'Transport', 'car', 'cyan', 'expense'),
  ('00000000-0000-4000-8000-000000000004', 'Shopping', 'shopping-bag', 'violet', 'expense'),
  ('00000000-0000-4000-8000-000000000005', 'Health', 'heart-pulse', 'rose', 'expense'),
  ('00000000-0000-4000-8000-000000000006', 'Entertainment', 'party-popper', 'pink', 'expense'),
  ('00000000-0000-4000-8000-000000000007', 'Other', 'circle-ellipsis', 'slate', 'expense'),
  ('00000000-0000-4000-8000-000000000008', 'Salary', 'wallet-cards', 'emerald', 'income'),
  ('00000000-0000-4000-8000-000000000009', 'Freelance', 'briefcase-business', 'indigo', 'income'),
  ('00000000-0000-4000-8000-000000000010', 'Other Income', 'badge-dollar-sign', 'teal', 'income');

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

revoke all on table public.categories from anon, authenticated;
revoke all on table public.transactions from anon, authenticated;

grant select on table public.categories to authenticated;
grant select, insert, update, delete on table public.transactions to authenticated;

create policy "Authenticated users can read categories"
  on public.categories
  for select
  to authenticated
  using (true);

create policy "Users can read their own transactions"
  on public.transactions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own transactions"
  on public.transactions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own transactions"
  on public.transactions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own transactions"
  on public.transactions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
