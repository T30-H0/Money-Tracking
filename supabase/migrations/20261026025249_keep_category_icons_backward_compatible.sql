-- Older deployed clients must be able to render every database icon.
-- New clients map these fixed category IDs to their dedicated icons.
update public.categories as category
set icon = compatibility.icon
from (values
  ('00000000-0000-4000-8000-000000000011'::uuid, 'heart-pulse'),
  ('00000000-0000-4000-8000-000000000012'::uuid, 'party-popper'),
  ('00000000-0000-4000-8000-000000000013'::uuid, 'receipt-text'),
  ('00000000-0000-4000-8000-000000000014'::uuid, 'wallet-cards'),
  ('00000000-0000-4000-8000-000000000015'::uuid, 'heart-pulse')
) as compatibility(id, icon)
where category.id = compatibility.id;
