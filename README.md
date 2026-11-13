# RPG Edukatif SMP ABBS Surakarta

Game web 3D bergaya blocky untuk siswa SMP: kustomisasi karakter, jelajahi sekolah, belajar dari guru, dan main sambil belajar.

## Fitur
- **Kustomisasi karakter**: putra/putri, jilbab syari untuk putri, 3 gaya rambut putra, kacamata, badan, 6 tema seragam (disimpan otomatis).
- **5 kelas + guru**: Matematika, IPA, B. Indonesia, B. Inggris, PAI — materi + kuis tiap kelas.
- **Kantin**: latihan aritmetika sosial (beli jajanan, total = harga x jumlah, saldo).
- **Lapangan olahraga**: sepak bola, voli, basket, bulu tangis + mini-game lempar basket & penalti.
- **Perpustakaan & Lab IPA**: membaca buku dan eksperimen asam-basa-indikator.
- **Mushola**: aktivitas tap urutan wudhu yang benar.
- **Kebun sekolah**: siram tanaman.
- **Bersih-bersih**: 12 sampah tersebar untuk dikumpulkan.
- **Quest antar-barang**: 3 rantai tugas dari kantin dan guru.
- **Progres tersimpan** di localStorage + sinkronisasi cloud via Supabase (per perangkat).

## Teknologi
Vanilla JS + Three.js (blocky chibi) + anime.js. Tanpa bundler — jalankan server statis apa pun:

```bash
npm start      # python3 http.server 8080
```

Buka `http://127.0.0.1:8080` (atau URL GitHub Pages) di browser HP/desktop.

## Tes

```bash
npm test       # smoke test kombinasi karakter + data sekolah/aktivitas
```
