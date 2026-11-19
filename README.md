# RPG Edukatif SMP ABBS Surakarta

Game web 3D bergaya blocky untuk siswa SMP: kustomisasi karakter, jelajahi sekolah, belajar dari guru, dan main sambil belajar.

- **Main sekarang**: https://fariqsalafy.github.io/sekolah-rpg-edukatif/
- **Repo**: https://github.com/fariqsalafy/sekolah-rpg-edukatif (branch `main`, GitHub Pages dari root)

## Lanjut kerja di device lain

```bash
git clone https://github.com/fariqsalafy/sekolah-rpg-edukatif.git
cd sekolah-rpg-edukatif
npm start        # = python3 -m http.server 8080
```

Buka `http://127.0.0.1:8080` di browser. Kode ES modules — wajib lewat server (buka file langsung tidak akan jalan).

Cek sebelum push:

```bash
node --check js/game.js   # validasi sintaks
npm test                  # smoke test data (karakter, kelas, quest, aktivitas)
```

Deploy otomatis: setiap push ke `main`, GitHub Pages membangun ulang (~1 menit). Verifikasi dengan `curl -s -o /dev/null -w "%{http_code}" https://fariqsalafy.github.io/sekolah-rpg-edukatif/`. Kalau file JS lama masih ke-cache di PWA, naikkan versi cache `rpg-abbs-v2` di `sw.js`.

## Struktur file

| File | Isi |
|---|---|
| `index.html` | Layar login NIS + kustomisasi karakter + canvas game, importmap three, anime.js, manifest |
| `js/main.js` | Bootstrap: login/`session`, `initCloud(user.id)`, load state, mulai game, registrasi service worker |
| `js/auth.js` | Login siswa: NIS → email (RPC `get_email_by_nis`) → Supabase Auth, lalu baca nama/kelas dari `profiles` |
| `js/options.js` + `js/character.js` | Pilihan kombinasi karakter (putra/putri, jilbab, rambut, seragam) + pembangunan karakter blocky |
| `js/schoolData.js` | Data 5 kelas: id, guru, warna, materi, 3 soal kuis, posisi |
| `js/game.js` | Inti game (~2100 baris): dunia 3D, semua dialog/aktivitas, tick loop, HUD, minimap, camera |
| `js/cloud.js` | Sinkronisasi Supabase (detail di bawah) |
| `css/style.css` | UI: dialog, HUD, joystick, widget, minimap, konfeti, safe-area |
| `sw.js`, `manifest.json`, `icon.svg` | PWA |
| `tests/smoke.mjs` | Validasi data tanpa browser |
| `vendor/` | three.module.min.js + anime.min.js (tanpa bundler/CDN) |

## Fitur

- **Login siswa**: NIS + kata sandi akun LMS Al Abidin (sama dengan forum ABBS). Setelah profil karakter tersimpan, login berikutnya langsung masuk ke game tanpa kustomisasi ulang. Tombol **Keluar** ada di HUD.
- **Kustomisasi karakter**: putra/putri, jilbab syari untuk putri (tanpa poni, rok panjang), 3 gaya rambut putra, kacamata, badan, 6 tema seragam (disimpan otomatis).
- **5 kelas + guru**: Matematika, IPA, B. Indonesia, B. Inggris, PAI — materi tampil di papan tulis 3D, kuis 3 soal per kelas, tips guru berputar kalau pelajaran diulang.
- **Kantin**: aritmetika sosial (total = harga × jumlah, saldo) + mini-game **Latihan Hitung Cepat** (soal acak +/−/×, streak, bonus XP terbatas per sesi).
- **Lapangan olahraga**: sepak bola, voli, basket, bulu tangkis + mini-game lempar basket & penalti (bar tenaga osilasi, bola parabola), **giring bola ke gawang** (bola didorong kaki), **passing voli 5x** dan **smash bulu tangkis 3x**.
- **Perpustakaan & Lab IPA**: quest ambil buku + **Misi Buku Hilang** (5 buku berserakan di halaman & sekitar sekolah); eksperimen cairan A/B/C + indikator, **rangkaian listrik**, dan **magnet**.
- **Peta terbuka**: lapangan olahraga diperbesar (pagar digeser keluar) + **Taman Sekolah** baru di barat: jalan setapak, kolam, bunga, bangku, dan gazebo. Halaman luas dengan pepohonan & batu pemandang, bebas dijelajahi tanpa batas tembok.
- **Siang/malam real-time**: warna langit, posisi matahari/bulan 3D, dan intensitas cahaya mengikuti jam perangkat; jam tampil di HUD.
- **Mushola**: tap urutan wudhu yang benar (5 langkah).
- **Kebun sekolah**: siram 3 bedengan dengan mendekatinya.
- **Bersih-bersih & bintang**: 12 sampah + 6 bintang tersebar.
- **5 quest antar-barang**: q1 kantin→mtk, q2 mtk→ipa, q3 ipa→perpus→bing, q4 pai→mushola, q5 bindo→kantin. Pengantaran bisa ke ruangan atau zona.
- **Sistem XP & rank**: Pemula → Siswa Rajin → Bintang Kelas → Juara Sekolah; konfeti saat 100% selesai.
- **Immersif**: intro kamera sinematik 3 detik, NPC menoleh saat didekati, name tag di atas kepala, minimap dengan target tugas berkedip, cincin interaksi berdenyut, efek suara WebAudio + getar (bisa dimatikan).
- **HUD**: kelas/aktivitas/tugas, chip XP (tap → daftar tujuan + tombol reset 2-tap), joystick + tombol zoom (kamera 3.0–34), tombol suara, jam, **tombol aksi** yang muncul saat mendekati objek/NPC/ruangan (tidak ada pop-up otomatis; bisa juga tombol E/Spasi).
- **PWA**: installable, service worker (vendor cache-first, sisanya network-first).

## Penyimpanan & sinkron cloud

localStorage (sumber kebenaran):

- `sekolahRpg.sesi` — data siswa yang login (`{ id, nis, nama, kelas }`)
- `sekolahRpg.karakter.v1` — pilihan karakter
- `sekolahRpg.progres.v1` — `{ xp, done{}, notified, uang, rank, trash[], kebun[], lab{}, quests{}, stars[], playMs, carry }`
- `sekolahRpg.lastUser` — id siswa pemilik data lokal; ganti siswa = data lokal dibersihkan (data tetap aman di cloud)
- `sekolahRpg.sfx` — status suara

Cloud (Supabase project `djybwvdjipxftxmtqjbt`, tabel **`app_settings`** — tabel publik yang sudah ada, anon key full CRUD, aman karena aplikasi lain hanya membaca key `wa_template_%`):

- Key per siswa: `rpg_save_<user id>`, value JSON string. Satu akun = satu simpanan, bisa dilanjutkan dari perangkat mana pun.
- `js/cloud.js` membungkus `localStorage.setItem`: push debounce 1,5 detik (+ keepalive saat pagehide), upsert `on_conflict=key`; pull saat login kalau data lokal kosong; timeout fetch 4–5 detik; localStorage tetap sumber kebenaran.

## Konvensi kode

- **Tanpa komentar** di source.
- Vanilla JS ES modules, Three.js dari vendor lokal (importmap `"three"`), anime.js global (`const A = window.anime`).
- Karakter blocky flat-face ala Roblox; putri jilbab syari + rok panjang; putra hanya 3 gaya rambut.
- Semua posisi penting diekspor dari `js/game.js` untuk smoke test: `QUESTS, LIB, WUDHU_STEPS, TRASH_POS, STAR_POS, GARDEN_BEDS, LAB_LIQUIDS, HUNT_POS`.

## Roadmap ide berikutnya

- Mode guru: tautan pantau progres kelas (bisa pakai tabel `app_settings` juga).
- Rapor mini: rekap nilai kuis per mata pelajaran.
- Materi & soal bisa dipermudah diedit via `js/schoolData.js`.
- Efek siang/malam atau suasana hari besar sekolah.
