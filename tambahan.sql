-- Jalankan SEKALI di Supabase → SQL Editor (setelah schema.sql)
-- Mencegah username bentrok dengan alamat halaman bawaan.
alter table profiles add constraint username_reserved check (username not in (
  'dashboard','login','register','daftar','masuk','admin','api','assets','static','config',
  'style','vynka','index','404','www','app','settings','about','help','support','privacy','terms'
));
