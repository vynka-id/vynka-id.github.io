# Vynka (Supabase + GitHub Pages, user site)

Struktur URL:
- `https://vynka-id.github.io/`           landing + daftar/masuk  (index.html)
- `https://vynka-id.github.io/dashboard/` dashboard akun          (dashboard/index.html)
- `https://vynka-id.github.io/namaakun`   halaman publik          (404.html membaca path)

Setup:
1. Repo harus bernama `vynka-id.github.io` (Settings → General → Repository name).
2. Supabase → SQL Editor: jalankan `schema.sql` (sudah) lalu `tambahan.sql`.
3. Isi `config.js` (Project URL + anon key).
4. Supabase → Authentication → URL Configuration: Site URL = `https://vynka-id.github.io`,
   Redirect URLs tambah `https://vynka-id.github.io/**`.
5. GitHub → Settings → Pages: Deploy from a branch → main / root.
6. Secrets Actions: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (untuk keepalive).
