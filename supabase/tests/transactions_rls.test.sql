begin;

select plan(12);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'other@example.com');

insert into public.transactions (id, user_id, type, amount, category_id, date, note)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'expense', 100000, '00000000-0000-4000-8000-000000000001', '2026-10-01', 'owner seed'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'expense', 200000, '00000000-0000-4000-8000-000000000001', '2026-10-01', 'other seed');

set local role anon;

select throws_ok($$select * from public.transactions$$, '42501', null, 'anonymous users cannot read transactions');
select throws_ok(
  $$insert into public.transactions (user_id, type, amount, category_id, date)
    values ('11111111-1111-1111-1111-111111111111', 'expense', 1, '00000000-0000-4000-8000-000000000001', '2026-10-01')$$,
  '42501', null, 'anonymous users cannot create transactions'
);
select throws_ok($$update public.transactions set note = 'anon'$$, '42501', null, 'anonymous users cannot update transactions');
select throws_ok($$delete from public.transactions$$, '42501', null, 'anonymous users cannot delete transactions');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$select note from public.transactions order by note$$,
  array['owner seed'],
  'users read only their own transactions'
);

select results_eq(
  $$insert into public.transactions (user_id, type, amount, category_id, date, note)
    values ('11111111-1111-1111-1111-111111111111', 'income', 500000, '00000000-0000-4000-8000-000000000008', '2026-10-01', 'owner insert')
    returning note$$,
  array['owner insert'],
  'users can create their own transactions'
);

select throws_ok(
  $$insert into public.transactions (user_id, type, amount, category_id, date)
    values ('22222222-2222-2222-2222-222222222222', 'expense', 1, '00000000-0000-4000-8000-000000000001', '2026-10-01')$$,
  '42501', null, 'users cannot create transactions for another user'
);

select results_eq(
  $$update public.transactions set note = 'owner updated'
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    returning note$$,
  array['owner updated'],
  'users can update their own transactions'
);

select is_empty(
  $$update public.transactions set note = 'forged'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    returning id$$,
  'users cannot update another user transaction'
);

select is_empty(
  $$delete from public.transactions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    returning id$$,
  'users cannot delete another user transaction'
);

select results_eq(
  $$delete from public.transactions
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    returning note$$,
  array['owner updated'],
  'users can delete their own transactions'
);

select throws_ok(
  $$insert into public.transactions (user_id, type, amount, category_id, date)
    values ('11111111-1111-1111-1111-111111111111', 'expense', 0, '00000000-0000-4000-8000-000000000001', '2026-10-01')$$,
  '23514', null, 'zero amounts are rejected'
);

select * from finish();
rollback;
