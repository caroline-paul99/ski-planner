-- Resorts table for the ski planner.
-- Run this once in the Supabase SQL editor.
-- Drive times are approximate, from Williamsburg, Brooklyn.

create table resorts (
  id serial primary key,
  name text not null,
  state text not null,
  drive_hours numeric not null,
  lat numeric not null,
  lon numeric not null,
  vertical_ft int,
  trails int,
  ikon_access text check (ikon_access in ('unlimited', 'limited'))
);

-- Row level security: block everything by default, then allow public reads only.
alter table resorts enable row level security;

create policy "Public read access"
  on resorts for select
  using (true);

insert into resorts (name, state, drive_hours, lat, lon, vertical_ft, trails, ikon_access) values
  ('Windham Mountain',    'NY', 2.75, 42.2985, -74.2560, 1600,  54, 'limited'),
  ('Stratton',            'VT', 4.0,  43.1134, -72.9081, 2003,  99, 'unlimited'),
  ('Killington',          'VT', 4.75, 43.6262, -72.7968, 3050, 155, 'unlimited'),
  ('Pico',                'VT', 4.75, 43.6616, -72.8424, 1967,  58, 'unlimited'),
  ('Sugarbush',           'VT', 5.5,  44.1359, -72.8944, 2600, 111, 'unlimited'),
  ('Loon Mountain',       'NH', 5.5,  44.0364, -71.6214, 2100,  61, 'unlimited'),
  ('Sunday River',        'ME', 6.5,  44.4734, -70.8564, 2340, 135, 'unlimited'),
  ('Tremblant',           'QC', 7.5,  46.2094, -74.5854, 2116, 102, 'unlimited'),
  ('Sugarloaf',           'ME', 8.0,  45.0314, -70.3131, 2820, 162, 'unlimited'),
  ('Snowshoe',            'WV', 8.5,  38.4097, -79.9939, 1500,  61, 'unlimited');
