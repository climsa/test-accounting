# ERP Akuntansi Mock (Next.js)

Mock-up ERP akuntansi berdasarkan matrix menu pada gambar. Versi ini disesuaikan untuk bisnis dermatologi/kulit/kecantikan: ada modul Clinic Services, Doctors & Therapists, Treatments & Pricing, Rooms & Devices, dan Skincare Products. Menyediakan halaman, tabel data dummy, dan form statis untuk tiap fungsi.

## Menjalankan Lokal

1. Masuk folder proyek:
   - `cd next-erp`
2. Install dependencies:
   - `npm install`  (atau `yarn`/`pnpm i`)
3. Jalankan dev server:
   - `npm run dev`
4. Buka: `http://localhost:3000`

## Struktur

- `src/app` — App Router Next.js
  - `/` — Dasbor dengan KPI & navigasi cepat
  - `/(routes)/[...slug]` — Halaman dinamis berdasarkan konfigurasi menu
- `src/components` — Sidebar, DataTable, ModuleForm
- `src/data/menu.tsx` — Definisi menu + dummy table + schema form
- `src/app/globals.css` — Gaya tema gelap sederhana (tanpa Tailwind)

## Catatan

- Semua data adalah dummy, form dalam keadaan disabled (mock). Tidak ada backend/persistensi.
- Struktur menu mencakup: General Ledger, Sales (AR), Purchases (AP), Banking & Cash, Petty Cash, Inventory Hooks, Tax & Compliance, Dimensions & Analytics, Masters & Settings.
- Anda dapat menambah/ubah kolom tabel atau field form di `src/data/menu.tsx`.

## Kustomisasi Cepat

- Tambah modul baru: tambahkan item pada `groups` di `src/data/menu.tsx`.
- Kolom tabel: edit `table.headers` dan `table.rows`.
- Field form: edit `form.schema` (mendukung `text`, `number`, `date`, `select`, `textarea`).
