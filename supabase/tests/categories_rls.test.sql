begin;

select plan(5);

set local role anon;
select throws_ok(
  $$select * from public.categories$$,
  '42501',
  null,
  'anonymous users cannot read categories'
);

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select results_eq(
  $$select count(*)::bigint from public.categories$$,
  array[10::bigint],
  'authenticated users can read all fixed categories'
);

select throws_ok(
  $$insert into public.categories (id, name, icon, color, type)
    values ('99999999-9999-4999-8999-999999999999', 'Test', 'circle-ellipsis', 'slate', 'expense')$$,
  '42501',
  null,
  'authenticated users cannot create categories'
);

select throws_ok(
  $$update public.categories set name = 'Changed' where name = 'Food'$$,
  '42501',
  null,
  'authenticated users cannot update categories'
);

select throws_ok(
  $$delete from public.categories where name = 'Food'$$,
  '42501',
  null,
  'authenticated users cannot delete categories'
);

select * from finish();
rollback;
