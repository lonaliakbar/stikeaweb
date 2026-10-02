# Situs STIKES Medika Seramoe Barat

Situs statis untuk GitHub Pages. Semua isi ada di `data/site.json` dan diubah lewat panel admin di `/admin/`.

## Halaman

| URL | Isi |
|---|---|
| `/` | Beranda (ringkasan semua bagian) |
| `/tentang/` `/prodi/` `/alumni/` `/galeri/` `/kontak/` | Halaman masing-masing |
| `/berita/` | Daftar berita; `/berita/?p=<id>` = detail satu berita |
| `/daftar/` | Info pendaftaran, gelombang, syarat, alur, formulir cepat |
| `/admin/` | Panel admin (tidak diindeks mesin pencari) |

## Pasang di GitHub Pages

1. Buat repo di GitHub, lalu unggah **seluruh isi folder ini** (termasuk `.nojekyll`).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Tunggu ±1 menit, situs aktif di `https://<user>.github.io/<repo>/`.

## Masuk admin

1. Buka `https://<user>.github.io/<repo>/admin/`.
2. Buat token: GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   - Repository access: *Only select repositories* → repo situs ini
   - Permissions: **Contents → Read and write**
3. Tempel token di halaman login (repo terisi otomatis), lalu **Masuk**.
4. Ubah isi di tiap bagian, klik **Simpan perubahan** (atau Ctrl+S). Tiap simpan = 1 commit; situs ikut terbarui dalam ±1 menit.

Foto yang diunggah lewat admin masuk ke `assets/uploads/` dan diperkecil otomatis (maks. 1600 px) bila lebih dari ±1,2 MB.

## Catatan keamanan

- Token hanya disimpan di browser Anda dan hanya dikirim ke `api.github.com`. Tanpa token, halaman admin tidak bisa mengubah apa pun.
- Pakai token fine-grained yang dibatasi ke satu repo, beri masa berlaku, dan jangan centang “Ingat token” di komputer umum.
- Repo publik berarti isi `data/site.json` bisa dibaca siapa pun (memang untuk ditampilkan); jangan menyimpan data pribadi di sana.

## Mencoba di komputer sendiri

```
python3 -m http.server 8000
```
lalu buka `http://localhost:8000/`. (Membuka file langsung lewat `file://` tidak bisa karena konten dimuat dari JSON.) Admin hanya bisa menyimpan ke repo GitHub, bukan ke folder lokal.
