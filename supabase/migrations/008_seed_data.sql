-- ============================================================
-- 008: Seed data for demo (run after migrations)
-- Note: This seeds the charge_clubs table so the map works
-- with real DB data. Charger seeds require real user IDs.
-- ============================================================

-- Seed charge clubs (matches frontend dummy data IDs)
insert into public.charge_clubs (name, neighborhood, city, accepting_members, total_members, total_capacity_kw, total_watts_received, map_x, map_y, apartment_partner) values
  ('City Juice',            'SoMa',                'San Francisco',  true,  84,  420, '1.2M',  52, 62, false),
  ('Urban Feed',            'Mission District',     'San Francisco',  true,  112, 580, '2.1M',  49, 68, true),
  ('The Hotties',           'Castro',               'San Francisco',  false, 67,  310, '890K',  44, 66, false),
  ('The Power Brokers',     'Financial District',   'San Francisco',  true,  156, 890, '3.4M',  55, 55, true),
  ('AC/DC',                 'Haight-Ashbury',       'San Francisco',  true,  43,  210, '540K',  38, 60, false),
  ('Fog Chargers',          'Sunset District',      'San Francisco',  false, 91,  440, '1.5M',  22, 65, false),
  ('Watt''s Up Berkeley',   'Downtown Berkeley',    'Berkeley',       true,  78,  390, '1.1M',  65, 25, true),
  ('Ohm My Oakland',        'Lake Merritt',         'Oakland',        true,  104, 520, '1.8M',  72, 38, false),
  ('Marin Volts',           'Sausalito',            'Sausalito',      true,  36,  180, '420K',  35, 35, false),
  ('Plug & Play',           'Daly City',            'Daly City',      false, 58,  280, '760K',  32, 78, false),
  ('The Voltage',           'North Beach',          'San Francisco',  true,  72,  350, '980K',  50, 48, false),
  ('Current Affairs',       'Richmond District',    'San Francisco',  true,  49,  240, '620K',  25, 50, false),
  ('Short Circuit',         'San Rafael',           'San Rafael',     true,  31,  155, '340K',  30, 18, false);
