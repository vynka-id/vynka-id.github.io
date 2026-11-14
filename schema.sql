-- Jalankan di Supabase → SQL Editor
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text,
  bio text,
  theme text default 'hijau',
  created_at timestamptz default now()
);
create table links (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position int not null default 0,
  clicks int not null default 0
);
alter table profiles enable row level security;
alter table links enable row level security;

create policy "baca profil" on profiles for select using (true);
create policy "baca link" on links for select using (true);
create policy "kelola profil" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "kelola link" on links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Hitung klik dari pengunjung anonim (hanya menambah 1)
create function increment_click(link_id bigint) returns void
language sql security definer set search_path = public as
$$ update links set clicks = clicks + 1 where id = link_id $$;
grant execute on function increment_click(bigint) to anon, authenticated;
