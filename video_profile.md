# Analisis APMNU (apmnu.org) dan Paket Produksi Video Profil Remotion 16:9

APMNU adalah **Asosiasi Profesor Muslimat Nahdlatul Ulama**. Organisasi ini masih sangat muda: kepengurusannya dikukuhkan pada Februari 2026. Meski begitu, kegiatannya sudah cukup terdokumentasi untuk dijadikan video profil berdurasi sekitar 4 menit 45 detik. Materinya mencakup Rakornas dan pengukuhan di Surabaya, Seminar Nasional dan peluncuran tiga produk keilmuan pada Muktamar ke-35 NU di Jombang, serta misi akademik ke Mesir pada Oktober 2026. Satu kekurangan perlu diatasi sebelum produksi. Halaman visi-misi, struktur pengurus, dan kontak di apmnu.org tidak dapat saya akses secara verbatim, jadi naskah di bawah memakai rumusan arah organisasi yang dikutip media resmi Muslimat NU. Teks visi-misi resmi wajib diminta langsung kepada sekretariat APMNU.

## TL;DR
- **Profil:** APMNU adalah wadah guru besar perempuan berlatar NU di bawah keluarga besar Muslimat NU, dipimpin Prof. Dr. Amany Lubis. Gagasannya lahir di Mukernas Muslimat NU Samarinda, dan pengurusnya dikukuhkan Khofifah Indar Parawansa pada Februari 2026 di Surabaya. Direktori situsnya mencatat 197 profesor dari 82 program studi.
- **Kegiatan utama yang layak divisualkan:** Rakornas dan pengukuhan (Feb 2026); dua rekor MURI bersama Muslimat NU (11 Apr 2026); Seminar Nasional, Bahtsul Masail, serta peluncuran buku, website, dan jurnal di Jombang (27–28 Agu 2026); dan misi Mesir ke KBRI Kairo, PCI Muslimat NU Mesir, dan Suez Canal University (15–18 Okt 2026). Semuanya punya foto atau poster di apmnu.org.
- **Produksi:** gunakan Remotion 1920×1080 30 fps dengan data `scenes.json` sebagai satu sumber kebenaran. TTS Bahasa Indonesia dibuat per kalimat (Azure `id-ID-GadisNeural`/`ArdiNeural` atau ElevenLabs Multilingual v2 dengan timestamps). Durasi dihitung otomatis lewat `calculateMetadata`, dan caption Inggris dipetakan ke batas kalimat audio dalam format `Caption` dari `@remotion/captions`. Paket enam prompt agent di bawah siap disalin ke Claude Code yang sudah dipasangi Remotion Agent Skills.

---

## BAGIAN 1 — Profil Organisasi

### 1.1 Identitas inti

| Aspek | Temuan | Status verifikasi |
|---|---|---|
| Nama lengkap | Asosiasi Profesor Muslimat Nahdlatul Ulama (APMNU) | Terverifikasi (beranda apmnu.org) |
| Afiliasi | Bagian dari keluarga besar Muslimat NU, badan otonom perempuan Nahdlatul Ulama | Terverifikasi (sambutan Ketua Pembina di beranda) |
| Deskripsi resmi | "wadah intelektual dan profesional yang menghimpun para guru besar perempuan berlatar belakang Nahdlatul Ulama… mendarmabaktikan kepakaran dan keilmuan demi kemajuan agama, nusa, dan bangsa dalam bingkai Islam Ahlussunnah wal Jama'ah an-Nahdliyah" | Terverifikasi (beranda) |
| Peran | Riset, advokasi kebijakan, pengabdian masyarakat, penguatan peran perempuan di ruang publik | Terverifikasi (beranda) |
| Asal-usul | Gagasan muncul di Mukernas Muslimat NU di Samarinda, diprakarsai Khofifah Indar Parawansa | Terverifikasi (muslimatnu.or.id, 8 Feb 2026); tanggal Mukernas tidak ditemukan |
| Pembentukan/pengukuhan | PP Muslimat NU membentuk APMNU bersama Kementerian PPPA. Pengurus dikukuhkan oleh Ketua Umum Dewan Pembina PP Muslimat NU pada Jumat, 6 Februari 2026, di Surabaya | Terverifikasi (RRI); **lokasi berbeda antar-sumber**, lihat Caveats |
| Dasar hukum | PD/PRT (Peraturan Dasar/Peraturan Rumah Tangga) dibahas saat Rakornas Feb 2026 | Akta pendirian/SK Kemenkumham **tidak ditemukan** |
| Visi, misi, tujuan | Teks verbatim **tidak dapat diakses**. Rumusan arah yang dikutip muslimatnu.or.id: "wadah pengembangan keilmuan berbasis nilai Ahlus Sunnah wal Jamaah, dengan orientasi pada pendidikan, riset, pemberdayaan masyarakat, serta jejaring nasional dan internasional", plus pengembangan wakaf produktif | Sebagian |
| Slogan | "APMNU untuk Muslimat NU yang berilmu, berdaya, dan terus memberi manfaat bagi umat, bangsa, dan peradaban" | Dikutip media (memox.co.id); konfirmasi ke APMNU |
| Syarat keanggotaan | Terbuka bagi guru besar perempuan NU; "Pendaftaran cukup dengan SK Guru Besar" | Terverifikasi (beranda) |
| Alamat | Jl. Pengadegan Timur Raya No. 2, Jakarta | Terverifikasi (footer apmnu.org) |
| Kanal resmi | Instagram, X, dan TikTok @apmnu_official; Facebook "Apmnu Nahdlatul Ulama"; jurnal di journal.apmnu.org | Terverifikasi (footer) |
| Email/telepon | **Tidak ditemukan** (halaman /kontak tidak terakses) | — |

### 1.2 Kepemimpinan dan tokoh kunci

| Tokoh | Peran | Sumber |
|---|---|---|
| Dr. (H.C.) Dra. Hj. Khofifah Indar Parawansa, M.Si. | Ketua (Umum) Dewan Pembina PP Muslimat NU sekaligus Gubernur Jawa Timur; penggagas APMNU dan pengukuh pengurusnya | Beranda apmnu.org, Antara, RRI |
| Prof. Dr. Hj. Amany Burhanuddin Umar Lubis, Lc., M.A. | Ketua Umum APMNU; guru besar Fakultas Syariah dan Hukum, dilantik sebagai Rektor UIN Syarif Hidayatullah Jakarta pada Senin, 7 Januari 2019 (periode 2019–2023), dan disebut "rektor perempuan pertama UIN Jakarta" (Satuharapan.com) | Beranda, mediapetisi.net, muslimatnu.or.id, Satuharapan.com |
| Dra. Hj. Arifah (Arifatul) Choiri Fauzi, M.Si. | Ketua Umum PP Muslimat NU sekaligus Menteri PPPA; hadir di Rakornas dan menerima buku APMNU | Sambutan Ketua APMNU, Antara |
| Prof. Imas Maesaroh, M.Lib., Ph.D. | Ketua delegasi APMNU ke Suez Canal University (18 Okt 2026) | Beranda apmnu.org |
| Prof. Sururin | Dilaporkan sebagai Sekretaris APMNU | jatimsatunews.com; **perlu konfirmasi** |
| Prof. Dr. Mufidah, M.Ag. (UIN Malang) | Pengurus APMNU periode 2026–2031 | jatimsatunews.com |

Skala pengurus: "lebih dari 60 pengurus aktif terlibat dalam struktur organisasi" (muslimatnu.or.id, Feb 2026). Perwakilan sudah ada "di hampir seluruh provinsi" (NU Online Jatim, Agu 2026). Bendahara, wakil ketua, dan bagan lengkap **tidak terverifikasi**. Situs memiliki halaman /about/organization, tetapi tidak dapat saya buka.

### 1.3 Jangkauan dan angka keanggotaan (perhatikan evolusinya)

| Waktu | Angka | Sumber |
|---|---|---|
| Feb 2026 | 156 profesor terdata melalui formulir daring | muslimatnu.or.id, RRI |
| 28 Agu 2026 | 210 profesor perempuan; 82 profesor hadir di seminar Jombang | NU Online Jatim |
| Nov 2026 (live) | Direktori: **197 profesor**, 23 berita, 11 Khazanah Ilmu, **82 program studi** | Beranda apmnu.org |
| Disiplin | Forum ilmiah mencakup 113 cabang disiplin ilmu | NU Online Jatim (berdasarkan keterangan APMNU) |

Tafsiran: angka 210 tampaknya hasil pendataan internal, sedangkan 197 adalah jumlah profil yang sudah masuk direktori daring. Untuk video, pakai angka yang bisa dicek publik (197/82) atau narasikan "hampir dua ratus". Minta APMNU mengonfirmasi angka final sebelum render.

### 1.4 Identitas visual

- Logo resmi: `https://apmnu.org/logo-apmnu.jpeg`, sudah terkonfirmasi di header dan footer situs.
- Warna dan tipografi resmi **tidak terdokumentasi** di sumber yang saya akses. Saya tidak melihat panduan merek.
- Rekomendasi: ekstrak palet langsung dari file logo (lihat Agent 1). Sementara itu, gunakan palet hijau khas NU/Muslimat NU sebagai placeholder. Lihat 4.4.

---

## BAGIAN 2 — Timeline Kegiatan (kronologis)

| # | Tanggal | Kegiatan | Lokasi | Ringkasan, mitra, dan angka |
|---|---|---|---|---|
| 0 | Tidak diketahui | Mukernas Muslimat NU, tempat gagasan APMNU lahir | Samarinda | Diprakarsai Khofifah Indar Parawansa |
| 1 | 6 Feb 2026 (Jumat), dibuka 20.00 WIB | Rakornas APMNU dan pengukuhan pengurus | Surabaya (BPSDM Jatim menurut Antara/petik.co; Islamic Center menurut RRI) | Dibuka dan dikukuhkan Khofifah, dihadiri Menteri PPPA Arifatul Choiri Fauzi. Membahas PD/PRT; 156 profesor terdata, lebih dari 60 pengurus aktif |
| 2 | 11 Apr 2026 | Dua rekor MURI pada HUT ke-80 Muslimat NU | UTC Convention Hotel, Semarang | Kategori (1) ormas perempuan dengan profesor perempuan terbanyak, (2) forum nasional dengan profesor perempuan lintas disiplin terbanyak. Diserahkan Direktur MURI Semarang Ari Indriani kepada Khofifah |
| 3 | Apr–Mei 2026 | Opini Hardiknas tentang APMNU | Media (beritabuana.co, duta.co) | Menyebut rencana Sekolah Tinggi PAUD Muslimat NU (bilingual, inklusif). **Masih rencana** |
| 4 | 23 Jul 2026 | Publikasi sambutan Ketua APMNU (Jejak Intelektual) | apmnu.org | Konten "Pemikiran Prof. Dr. Amany Lubis" |
| 5 | 27–28 Agu 2026 | Seminar Nasional "Mewujudkan Generasi Cerdas Digital dan Lingkungan Nir Kekerasan Seksual" dan Bahtsul Masail Muslimat NU | SMKN 1 Jombang (rangkaian Muktamar ke-35 NU, 27–31 Agu) | Tema positive parenting, AI yang bijak, dan pencegahan kekerasan di lembaga pendidikan. 82 profesor hadir dari Sumatera hingga NTB. Narasumber antara lain Kepala LLDIKTI VII Jatim Prof. Dyah Sawitri |
| 6 | 28 Agu 2026 | Peluncuran tiga produk keilmuan: buku "Muslimat NU Menjawab Perubahan Zaman", website APMNU, dan *Journal of Muslimat and Society* | Jombang | Jurnal ber-*double-blind peer review*, terbit Februari dan Agustus, naskah dalam Bahasa Indonesia atau Inggris |
| 7 | 13–22 Okt 2026 | Program Benchmarking Akademik Mesir dan Arab Saudi | Mesir dan Arab Saudi | Berdasarkan poster agenda; detail Arab Saudi **tidak ditemukan** |
| 8 | 15 Okt 2026 | Kunjungan ke KBRI Kairo | Kairo, Mesir | Dipimpin Prof. Amany Lubis; memperkuat jejaring akademik Indonesia–Mesir |
| 9 | 18 Okt 2026 | Menghadiri pelantikan PCI Muslimat NU Mesir | Hall Idarat al-Wafidin, Al-Azhar, Kairo | Dipimpin Prof. Amany Lubis |
| 10 | 18 Okt 2026 | Kunjungan akademik ke Suez Canal University | Ismailiyah, Mesir | Dipimpin Prof. Imas Maesaroh; diterima Rektor Prof. Nasser Saeed Mandour. Muslimatnu.or.id juga memberitakan penjajakan dengan Liga Universitas Islam se-Dunia |
| 11 | **6–8 Nov 2026 (akan datang)** | The 1st International Women's Conference and Fatimah Al-Fihriyah Awards | Belum diketahui | Masih **agenda mendatang** per 2 Nov 2026; jangan dinarasikan sebagai sudah terjadi |

---

## BAGIAN 3 — Daftar Aset Dokumentasi

Semua URL berikut muncul langsung di halaman yang saya akses. Unduh ke `public/assets/` dan cek resolusi masing-masing, karena sebagian berasal dari WhatsApp dan beresolusi rendah.

| ID aset | URL langsung | Halaman asal | Keterangan dan tanggal | Cocok untuk adegan |
|---|---|---|---|---|
| `logo` | https://apmnu.org/logo-apmnu.jpeg | apmnu.org | Logo resmi | 1, 2, 9 |
| `pengukuhan` | https://cdn.apmnu.site/galeri/pengukuhan-2.jpeg | apmnu.org (og:image) | Foto pengukuhan pengurus, kemungkinan Feb 2026 | 1, 3 |
| `khofifah` | https://apmnu.org/sambutan-khofifah.png | apmnu.org | Potret Ketua Pembina | 3, 5 |
| `amany` | https://cdn.apmnu.site/galeri/sambutan-prof-amany-2.jpeg | apmnu.org | Potret Ketua Umum | 5 |
| `rakornas-mnu` | https://muslimatnu.or.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-07-at-11.57.36.jpeg | muslimatnu.or.id (8 Feb 2026) | Rakornas APMNU, 1280×960 | 3, 4 |
| `poster-seminar` | https://s3.apmnu.org/apmnu-storage/agenda/1787582021768-Screenshot%202026-08-24%20at%2021.31.14.png | apmnu.org (agenda) | Poster Seminar Nasional, Agu 2026 | 6 |
| `launch-website` | https://s3.apmnu.org/apmnu-storage/agenda/1787745208258-WhatsApp%20Image%202026-08-23%20at%207.01.13%20PM.jpeg | apmnu.org (agenda) | Launching Website, 28 Agu 2026 | 6 |
| `launch-buku` | https://s3.apmnu.org/apmnu-storage/agenda/1787745266506-WhatsApp%20Image%202026-08-23%20at%207.00.48%20PM.jpeg | apmnu.org (agenda) | Launching buku, 28 Agu 2026 | 6 |
| `launch-jurnal` | https://s3.apmnu.org/apmnu-storage/agenda/1787745321127-WhatsApp%20Image%202026-08-25%20at%2010.38.51%20AM.jpeg | apmnu.org (agenda) | Launching jurnal, 28 Agu 2026 | 6 |
| `seminar-foto` | https://mediapetisi.net/wp-content/uploads/2026/08/IMG-20260828-WA0031.jpg | mediapetisi.net | "Ketua APMNU bersama peserta seminar", 28 Agu 2026 | 6 (dengan izin media) |
| `presscon` | https://storage.nu.or.id/storage/post/16_9/mid/whatsapp-image-2026-08-28-at-151056_1787913724.webp | NU Online Jatim | Konferensi pers peluncuran tiga produk (Foto: NOJ/RS) | 6 (dengan izin) |
| `jurnal-logo` | https://journal.apmnu.org/public/journals/1/pageHeaderLogoImage_en.png | journal.apmnu.org | Logo jurnal | 6 |
| `jurnal-cover` | https://journal.apmnu.org/public/journals/1/cover_issue_1_en.jpg | journal.apmnu.org | Sampul Vol. 1 No. 1 | 6 |
| `poster-benchmark` | https://s3.apmnu.org/apmnu-storage/agenda/1791036389773-Poster%20Benchmarking%20Akademik%20Mesir%20dan%20Arab%20Saudi.png | apmnu.org (agenda) | Poster Benchmarking, 13–22 Okt 2026 | 7 |
| `kbri-kairo` | https://s3.apmnu.org/apmnu-storage/post/image/fa9f870b-3ec8-4a99-901b-2c1a7ca81920/cover-fa9f870b-3ec8-4a99-901b-2c1a7ca81920.jpg?v=1792941053439 | apmnu.org (liputan) | Kunjungan KBRI Kairo, 15 Okt 2026 | 7 |
| `pci-mesir` | https://s3.apmnu.org/apmnu-storage/post/image/221a99e2-d157-45fe-927d-1e9f1cc5c7bf/cover-221a99e2-d157-45fe-927d-1e9f1cc5c7bf.jpg?v=1792939958770 | apmnu.org (liputan) | Pelantikan PCI Muslimat NU Mesir, 18 Okt 2026 | 7 |
| `suez` | https://s3.apmnu.org/apmnu-storage/post/image/8793cdab-bf0d-4ba4-be1b-8a84801caf3e/cover-8793cdab-bf0d-4ba4-be1b-8a84801caf3e.jpg?v=1792938699240 | apmnu.org (liputan) | Suez Canal University, 18 Okt 2026 | 7, 8 |
| `poster-iwc` | https://s3.apmnu.org/apmnu-storage/agenda/1793349937314-WhatsApp%20Image%202026-10-30%20at%2010.18.35%20AM.jpeg | apmnu.org (agenda) | Poster International Women's Conference, 6–8 Nov 2026 (akan datang) | 9 (sebagai "agenda mendatang") |

Halaman artikel yang perlu dibuka untuk mencari foto tambahan:
- `apmnu.org/liputan/apmnu-kunjungi-kbri-kairo-perkuat-koordinasi-dan-jejaring-akademik-indonesia-mesir-fa9f870b`
- `…/apmnu-hadiri-pelantikan-pengurus-cabang-istimewa-pci-muslimat-nu-mesir-221a99e2`
- `…/apmnu-jajaki-kerja-sama-akademik-dengan-suez-canal-university-mesir-8793cdab`

Jangan pakai foto ANTARA (`cdn.antaranews.com/...716054.jpg`). Situs ANTARA secara eksplisit melarang pengambilan konten tanpa izin tertulis.

---

## BAGIAN 4 — Konsep, Storyboard, Naskah ID, dan Caption EN

### 4.1 Konsep
"**Ilmu yang Dibumikan**" diambil dari pesan Khofifah: "Ilmu yang tinggi akan semakin bermakna ketika dibumikan dengan ketulusan, kesederhanaan, dan semangat khidmah." Gaya visualnya editorial-akademik: foto dokumentasi dengan Ken Burns, tipografi kinetik, counter angka, peta Indonesia–Mesir, dan garis waktu. Nadanya hangat dan bermartabat, bukan iklan.

### 4.2 Perhitungan durasi
- Spesifikasi: 1920×1080, 30 fps, target **4:45 = 285 detik = 8.550 frame**, dengan batas keras 5:00 (9.000 frame).
- Naskah: sekitar **490 kata** Bahasa Indonesia.
- Patokan 130–150 kpm berlaku untuk bahasa Inggris. Kata bahasa Indonesia rata-rata lebih panjang, dan suara TTS Indonesia terukur lebih lambat: Azure `id-ID-GadisNeural` sekitar 111 kpm dan `id-ID-ArdiNeural` sekitar 124 kpm. Pada 117–124 kpm, 490 kata menjadi kira-kira 3:57–4:11 ujaran. Ditambah jeda musik dan transisi sekitar 35–45 detik, totalnya sekitar 4:35–4:50.
- Kalau memakai pengisi suara manusia pada 130 kpm, ujaran menjadi sekitar 3:46. Perpanjang jeda visual (b-roll) di adegan 6–7 dan durasi tetap di bawah 5 menit.
- Durasi final **jangan dikunci manual**. `calculateMetadata` membaca durasi audio sungguhan per adegan (lihat Bagian 5).

### 4.3 Storyboard per adegan

**Adegan 1 — Hook | 0:00–0:18 (18 dtk / 540 frame)**
- Visual: layar hitam, lalu partikel cahaya hijau-emas. Kutipan muncul dengan kinetic typography kata per kata dan atribusi kecil "— Khofifah Indar Parawansa". Kemudian `pengukuhan` muncul dengan Ken Burns lambat (zoom 1,0→1,08), dan logo APMNU di-*reveal* dengan mask lingkaran (`iris()`).
- Narasi ID: "Ilmu yang tinggi akan semakin bermakna ketika dibumikan. Dari ruang kuliah, laboratorium, hingga ruang publik, para guru besar perempuan Nahdlatul Ulama kini melangkah bersama dalam satu barisan—untuk agama, untuk nusa, dan untuk bangsa."
- Caption EN:
  - 0:01.0–0:04.5 "Knowledge gains meaning when it is grounded."
  - 0:05.0–0:09.0 "From lecture halls and laboratories to the public sphere,"
  - 0:09.0–0:13.5 "the women professors of Nahdlatul Ulama now walk together—"
  - 0:13.5–0:17.5 "for faith, for homeland, and for the nation."
- Musik/SFX: pad ambient dan piano lembut; *whoosh* halus saat logo muncul.

**Adegan 2 — Siapa APMNU | 0:18–0:50 (32 dtk / 960 frame)**
- Visual: judul "Asosiasi Profesor Muslimat Nahdlatul Ulama" diketik, lalu akronim APMNU terbentuk dari huruf awal. Grid ikon disiplin ilmu (agama, hukum, ekonomi, kesehatan, sains) muncul dengan *staggered spring*. Latar: foto `rakornas-mnu` di-*blur*.
- Narasi ID: "Inilah Asosiasi Profesor Muslimat Nahdlatul Ulama, atau APMNU. Sebuah wadah intelektual dan profesional yang menghimpun para guru besar perempuan berlatar belakang Nahdlatul Ulama, dari beragam disiplin ilmu—agama, sosial, hukum, ekonomi, kesehatan, hingga sains dan teknologi. Sebagai bagian dari keluarga besar Muslimat NU, APMNU berkomitmen mendarmabaktikan kepakaran demi kemajuan agama, nusa, dan bangsa, dalam bingkai Islam Ahlussunnah wal Jama'ah an-Nahdliyah."
- Caption EN:
  - 0:18.5–0:22.5 "This is the Association of Muslimat NU Professors — APMNU."
  - 0:22.5–0:28.0 "An intellectual and professional home for women professors from the Nahdlatul Ulama community,"
  - 0:28.0–0:33.5 "spanning religion, social sciences, law, economics, health, science and technology."
  - 0:33.5–0:38.5 "As part of the Muslimat NU family,"
  - 0:38.5–0:44.0 "APMNU dedicates its expertise to faith, homeland, and nation,"
  - 0:44.0–0:49.5 "within the framework of Ahlussunnah wal Jama'ah an-Nahdliyah."
- Musik: ritme mulai masuk dengan perkusi ringan.

**Adegan 3 — Sejarah | 0:50–1:26 (36 dtk / 1.080 frame)**
- Visual: animasi garis waktu horizontal dengan tiga titik: "Mukernas Muslimat NU — Samarinda" → "Rakornas & Pengukuhan — Surabaya, Feb 2026" → "PD/PRT". Pin peta bergerak dari Samarinda ke Surabaya. Foto `khofifah` (lower-third nama dan jabatan), lalu `pengukuhan` dan `rakornas-mnu` bergantian dengan `slide()`.
- Narasi ID: "Gagasan APMNU lahir dari Musyawarah Kerja Nasional Muslimat NU di Samarinda, ketika Ibu Khofifah Indar Parawansa mencermati besarnya potensi profesor perempuan di lingkungan Muslimat NU. Gagasan itu segera diwujudkan. Pada Februari 2026 di Surabaya, Rapat Koordinasi Nasional APMNU digelar: Peraturan Dasar dan Peraturan Rumah Tangga dibahas, dan kepengurusan dikukuhkan langsung oleh Ketua Umum Dewan Pembina Muslimat NU, disaksikan Menteri Pemberdayaan Perempuan dan Perlindungan Anak."
- Caption EN:
  - 0:50.5–0:56.0 "The idea for APMNU was born at the Muslimat NU National Working Meeting in Samarinda,"
  - 0:56.0–1:01.5 "when Khofifah Indar Parawansa saw the great potential of Muslimat NU's women professors."
  - 1:01.5–1:04.0 "The idea quickly took shape."
  - 1:04.0–1:10.0 "In February 2026, APMNU held its National Coordination Meeting in Surabaya,"
  - 1:10.0–1:14.5 "discussing its statutes and bylaws."
  - 1:14.5–1:20.5 "Its board was inaugurated by the Chair of Muslimat NU's Advisory Board,"
  - 1:20.5–1:25.5 "witnessed by the Minister of Women's Empowerment and Child Protection."
- SFX: *tick* lembut di setiap titik garis waktu.

**Adegan 4 — Arah dan Nilai | 1:26–1:54 (28 dtk / 840 frame)**
- Visual: empat pilar teks naik dengan spring: Pendidikan · Riset · Advokasi Kebijakan · Pemberdayaan Masyarakat. Lingkaran jejaring nasional–internasional berdenyut, lalu ikon "Wakaf Produktif". Latar gradasi hijau tua.
- Narasi ID: "APMNU meneguhkan diri sebagai wadah pengembangan keilmuan berbasis nilai Ahlussunnah wal Jamaah. Arahnya jelas: pendidikan, riset, advokasi kebijakan, dan pemberdayaan masyarakat, diperkuat jejaring nasional dan internasional. Ke depan, kelembagaan ditopang wakaf produktif, agar setiap gagasan tidak berhenti di menara gading, tetapi tumbuh menjadi kemaslahatan yang nyata."
- Caption EN:
  - 1:26.5–1:32.0 "APMNU stands as a home for scholarship rooted in Ahlussunnah wal Jamaah values."
  - 1:32.0–1:38.5 "Its direction is clear: education, research, policy advocacy, and community empowerment,"
  - 1:38.5–1:42.0 "backed by national and international networks."
  - 1:42.0–1:47.0 "Going forward, productive waqf will sustain the institution,"
  - 1:47.0–1:53.5 "so ideas don't stay in the ivory tower but grow into real public good."
- **Catatan:** setelah APMNU memberikan teks visi-misi resmi, ganti pilar dengan teks tersebut.

**Adegan 5 — Kepemimpinan | 1:54–2:22 (28 dtk / 840 frame)**
- Visual: kartu potret `amany` dengan bingkai emas dan lower-third "Prof. Dr. Hj. Amany Lubis, Lc., M.A. — Ketua Umum APMNU". Counter "60+ pengurus aktif". Peta Indonesia dengan titik provinsi menyala bertahap. Penutup: kartu `khofifah` "Ketua Dewan Pembina Muslimat NU".
- Narasi ID: "Organisasi ini dipimpin oleh Prof. Dr. Amany Lubis, guru besar UIN Syarif Hidayatullah Jakarta, yang pernah tercatat sebagai rektor perempuan pertama di kampus tersebut. Bersama lebih dari enam puluh pengurus aktif, dan perwakilan di hampir seluruh provinsi, APMNU bergerak di bawah pembinaan Ibu Khofifah Indar Parawansa, Ketua Dewan Pembina Muslimat NU."
- Caption EN:
  - 1:54.5–2:00.5 "APMNU is led by Prof. Dr. Amany Lubis of UIN Syarif Hidayatullah Jakarta,"
  - 2:00.5–2:05.5 "the first woman to serve as its rector."
  - 2:05.5–2:12.0 "With over sixty active board members and representatives in nearly every province,"
  - 2:12.0–2:21.5 "APMNU works under the guidance of Khofifah Indar Parawansa, Chair of Muslimat NU's Advisory Board."
- **Verifikasi:** status Prof. Amany sebagai guru besar aktif UIN Jakarta per 2026 perlu dikonfirmasi.

**Adegan 6 — Jombang: Seminar dan Tiga Karya | 2:22–3:12 (50 dtk / 1.500 frame)**
- Visual:
  - Judul bab "Muktamar ke-35 NU · Jombang · Agustus 2026".
  - `poster-seminar` di-*zoom* ke judul tema, lalu `seminar-foto` dan `presscon` dengan Ken Burns.
  - Counter "82 profesor hadir", dengan peta asal Sumatera–Kalimantan–Sulawesi–Jawa–NTB.
  - Tiga kartu produk *flip in* berurutan: buku (`launch-buku`), website (`launch-website` dan mock-up layar apmnu.org), jurnal (`jurnal-cover`, `jurnal-logo`).
- Narasi ID: "Agustus 2026, Muktamar ke-35 Nahdlatul Ulama di Jombang menjadi panggung penting bagi APMNU. Di SMK Negeri 1 Jombang, APMNU menggelar Seminar Nasional dan Bahtsul Masail bertema 'Mewujudkan Generasi Cerdas Digital dan Lingkungan Nir Kekerasan Seksual'. Delapan puluh dua profesor dari Sumatera, Kalimantan, Sulawesi, Jawa, hingga Nusa Tenggara Barat hadir, membahas pengasuhan positif, pemanfaatan kecerdasan buatan secara bijak, dan pencegahan kekerasan di lembaga pendidikan. Pada momentum yang sama, APMNU meluncurkan tiga karya: buku 'Muslimat NU Menjawab Perubahan Zaman', website resmi APMNU, dan Journal of Muslimat and Society."
- Caption EN:
  - 2:22.5–2:28.5 "August 2026: the 35th Nahdlatul Ulama Congress in Jombang became a key stage for APMNU."
  - 2:28.5–2:33.5 "At SMK Negeri 1 Jombang, APMNU held a National Seminar and Bahtsul Masail"
  - 2:33.5–2:39.5 "on 'Building a Digitally Smart Generation and Environments Free from Sexual Violence.'"
  - 2:39.5–2:46.0 "Eighty-two professors from Sumatra, Kalimantan, Sulawesi, Java and West Nusa Tenggara attended,"
  - 2:46.0–2:53.5 "discussing positive parenting, wise use of AI, and preventing violence in schools."
  - 2:53.5–2:58.0 "At the same moment, APMNU launched three works:"
  - 2:58.0–3:03.5 "the book 'Muslimat NU Responds to a Changing Era,'"
  - 3:03.5–3:11.5 "APMNU's official website, and the Journal of Muslimat and Society."
- Musik: build-up; SFX *page flip* untuk kartu buku, *click* untuk website.

**Adegan 7 — Kiprah Internasional: Mesir | 3:12–3:50 (38 dtk / 1.140 frame)**
- Visual: animasi peta dengan garis busur Jakarta → Kairo → Ismailiyah; `poster-benchmark` sebagai pembuka; `kbri-kairo`, `pci-mesir`, dan `suez` dengan Ken Burns dan label lokasi plus tanggal (15 Okt, 18 Okt, 18 Okt).
- Narasi ID: "Kiprah APMNU juga melintasi batas negara. Melalui Program Benchmarking Akademik pada Oktober 2026, delegasi APMNU bertolak ke Mesir. Di Kairo, delegasi bersilaturahmi ke Kedutaan Besar Republik Indonesia untuk memperkuat jejaring akademik Indonesia–Mesir, lalu menghadiri pelantikan Pengurus Cabang Istimewa Muslimat NU Mesir di Al-Azhar. Di Ismailiyah, delegasi diterima langsung oleh Rektor Suez Canal University untuk menjajaki kerja sama akademik."
- Caption EN:
  - 3:12.5–3:16.0 "APMNU's work also crosses borders."
  - 3:16.0–3:21.5 "Through an Academic Benchmarking Program in October 2026, a delegation travelled to Egypt."
  - 3:21.5–3:29.0 "In Cairo, they visited the Indonesian Embassy to strengthen Indonesia–Egypt academic ties,"
  - 3:29.0–3:36.0 "and attended the inauguration of Muslimat NU's Special Branch in Egypt at Al-Azhar."
  - 3:36.0–3:43.0 "In Ismailia, the delegation was received by the President of Suez Canal University"
  - 3:43.0–3:49.5 "to explore academic cooperation."
- Musik: motif bernuansa Timur Tengah yang halus (oud), tetap dalam tema utama.

**Adegan 8 — Capaian | 3:50–4:18 (28 dtk / 840 frame)**
- Visual: tiga counter besar dengan `interpolate` dan easing: **197** profesor · **82** program studi · **2** rekor MURI. Ikon piagam MURI berupa grafis, bukan logo MURI, kecuali ada izin. Latar mosaik semua foto dokumentasi.
- Narasi ID: "Jejaring ini terus tumbuh. Hampir dua ratus profesor kini tercatat dalam direktori APMNU, mewakili delapan puluh dua program studi. Bersama Muslimat NU, para profesor ini juga mengukir dua rekor MURI: organisasi perempuan dengan profesor perempuan terbanyak, dan forum nasional dengan profesor perempuan lintas disiplin terbanyak."
- Caption EN:
  - 3:50.5–3:53.0 "This network keeps growing."
  - 3:53.0–3:59.5 "Nearly two hundred professors are now listed in APMNU's directory, across eighty-two study programs."
  - 3:59.5–4:05.0 "Together with Muslimat NU, they set two Indonesian MURI records:"
  - 4:05.0–4:10.5 "the women's organization with the most women professors,"
  - 4:10.5–4:17.5 "and the national forum with the most women professors across disciplines."

**Adegan 9 — Penutup dan Ajakan | 4:18–4:45 (27 dtk / 810 frame)**
- Visual: slogan dengan kinetic typography; logo besar; kartu CTA "apmnu.org · @apmnu_official (IG/X/TikTok)", alamat Jl. Pengadegan Timur Raya No. 2, Jakarta. Opsional: teaser kecil `poster-iwc` berlabel "Agenda Mendatang: 6–8 Nov 2026" (hapus jika video dirilis setelah acara). Fade to black.
- Narasi ID: "APMNU: untuk Muslimat NU yang berilmu, berdaya, dan terus memberi manfaat bagi umat, bangsa, dan peradaban. Bagi guru besar perempuan Nahdliyin, pintu khidmah selalu terbuka. Bergabunglah melalui apmnu.org, dan ikuti kami di apmnu underscore official."
- Caption EN:
  - 4:18.5–4:26.0 "APMNU: for a Muslimat NU that is knowledgeable, empowered, and of service"
  - 4:26.0–4:30.0 "to the community, the nation, and civilization."
  - 4:30.0–4:35.0 "For women professors of the Nahdliyin community, the door to service is open."
  - 4:35.0–4:42.0 "Join us at apmnu.org and follow @apmnu_official."
- Musik: resolusi akor mayor, lalu fade out pada 4:43–4:45.

### 4.4 Palet warna dan font (rekomendasi)

| Token | Hex (placeholder) | Fungsi |
|---|---|---|
| `primary` | #0B6B3A | Hijau NU: latar bab, bar caption |
| `primaryDark` | #06371F | Gradasi dan latar teks |
| `accent` | #C9A227 | Emas: garis, counter, bingkai potret |
| `ink` | #FFFFFF / #F5F1E6 | Teks di atas hijau |
| `muted` | #1E1E1E (opacity 70%) | Kotak caption |

- Ganti placeholder dengan warna hasil ekstraksi dari `logo-apmnu.jpeg` (Agent 1).
- Font: **Plus Jakarta Sans** untuk judul dan isi. Menurut repositori GitHub Tokotype, font ini dirancang Gumpita Rahayu dari Tokotype, awalnya dipesan 6616 Studio untuk identitas "+Jakarta City of Collaboration" Pemprov DKI Jakarta (2020), berlisensi SIL Open Font License, dan tersedia di `@remotion/google-fonts`. Aksennya **Amiri** untuk istilah Arab/kutipan. Font resmi situs tidak terverifikasi.
- Caption EN: Inter atau Plus Jakarta Sans 44–48 px, maksimal 2 baris, sekitar 42 karakter per baris, kotak semi-transparan di sepertiga bawah (safe area 5%).

---

## BAGIAN 5 — Paket Prompt Agent untuk Remotion

### 5.1 Fondasi teknis (praktik Remotion terbaru)
- **Agent Skills resmi:** `npx skills add remotion-dev/skills`, atau `npx remotion skills add` dari dalam proyek. Skill ini berisi praktik terbaik untuk agen seperti Claude Code, Codex, dan Cursor. Tersedia juga plugin Claude Code: `claude plugin marketplace add remotion-dev/claude-code-plugin` lalu `claude plugin install remotion@remotion`.
- **Caption:** `@remotion/captions` menyediakan tipe `Caption` (`text`, `startMs`, `endMs`, `timestampMs`, `confidence`), `parseSrt()`, `serializeSrt()`, dan `createTikTokStyleCaptions()`. Untuk caption bergaya film per kalimat, tampilkan langsung per `Caption` tanpa pengelompokan TikTok.
- **Transkripsi lokal:** `@remotion/install-whisper-cpp` (`installWhisperCpp`, `downloadWhisperModel`, `transcribe` dengan `tokenLevelTimestamps: true`, `toCaptions`). Untuk audio Indonesia, pakai model **multibahasa** (`medium`/`large-v3`), bukan `medium.en`.
- **Transisi:** `<TransitionSeries>` dari `@remotion/transitions` (`fade`, `slide`, `wipe`, `iris`, dll.). Transisi membuat adegan **tumpang tindih**: total = jumlah durasi − durasi transisi.
- **Durasi dinamis:** `calculateMetadata` pada `<Composition>`. Dokumentasi resmi Remotion menyatakan `getAudioDurationInSeconds()` "has been deprecated. Use getMediaMetadata() instead, which is faster and supports more formats." Versi docs yang lebih lama dan JSDoc kodenya menunjuk `parseMedia()` sebagai pengganti.
- **TTS Bahasa Indonesia:**
  - **Azure:** `id-ID-GadisNeural` (perempuan), `id-ID-ArdiNeural` (laki-laki); event *WordBoundary* memberi timestamp kata.
  - **ElevenLabs:** endpoint `/v1/text-to-speech/{voice_id}/with-timestamps` memberi timestamp per karakter. Menurut dokumentasi model ElevenLabs, model `eleven_multilingual_v2` mendukung 29 bahasa termasuk Bahasa Indonesia, dengan batas 10.000 karakter per permintaan. Tersedia juga Forced Alignment API.
  - **Google Cloud TTS:** mendukung `id-ID`; cek daftar voice terbaru di konsol.
- **Strategi sinkronisasi yang saya rekomendasikan:** buat TTS **per kalimat** dan ukur durasi setiap file, sehingga timing caption EN deterministik. Caption EN adalah terjemahan, jadi timestamp kata Indonesia tidak bisa dipetakan 1:1 ke kata Inggris. Petakan per kalimat. Whisper atau timestamps TTS dipakai untuk memverifikasi dan menyetel batas kalimat.

### 5.2 Struktur folder dan konvensi

```
apmnu-profile/
├─ public/
│  ├─ assets/            # foto & logo (nama = ID aset, mis. kbri-kairo.jpg)
│  ├─ audio/vo/          # s01_l01.mp3 … (per kalimat), music/bed.mp3, sfx/*.mp3
│  └─ captions/          # captions.en.json (Caption[]), captions.en.srt
├─ data/
│  ├─ scenes.json        # SATU sumber kebenaran
│  ├─ assets.json        # manifest aset + sumber + izin
│  └─ brand.json         # palet & font
├─ scripts/
│  ├─ fetch-assets.ts  tts.ts  build-captions.ts  qa.ts
├─ src/
│  ├─ Root.tsx  Video.tsx  theme.ts
│  ├─ components/ KenBurns.tsx  KineticTitle.tsx  Counter.tsx  LowerThird.tsx
│  │              MapArc.tsx  Timeline.tsx  CaptionTrack.tsx
│  └─ scenes/ S01Hook.tsx … S09Closing.tsx
└─ out/
```
Konvensi: ID adegan `s01`–`s09`; ID baris `s01_l01`; semua waktu dalam ms di JSON; frame = `Math.round(ms/1000*30)`.

### 5.3 Contoh `data/scenes.json` (potongan)

```json
{
  "fps": 30, "width": 1920, "height": 1080, "maxDurationSec": 300,
  "transitionFrames": 15,
  "scenes": [
    {
      "id": "s07", "title": "Kiprah Internasional",
      "component": "S07Egypt",
      "assets": ["poster-benchmark", "kbri-kairo", "pci-mesir", "suez"],
      "animation": ["map-arc:jakarta>cairo>ismailia", "kenburns", "lower-third"],
      "music": "bed", "sfx": ["whoosh"],
      "lines": [
        {"id": "s07_l01",
         "id_text": "Kiprah APMNU juga melintasi batas negara.",
         "en": ["APMNU's work also crosses borders."],
         "audio": "audio/vo/s07_l01.mp3", "durationMs": null}
      ],
      "padStartMs": 400, "padEndMs": 600
    }
  ]
}
```

### 5.4 Contoh kode inti

`src/Root.tsx`
```tsx
import {Composition, staticFile, CalculateMetadataFunction} from 'remotion';
import {Video, VideoProps} from './Video';
import scenesData from '../data/scenes.json';

const FPS = 30;
const calc: CalculateMetadataFunction<VideoProps> = async ({props}) => {
  const t = props.data.transitionFrames;
  const sceneFrames = props.data.scenes.map((s) => {
    const ms = s.padStartMs + s.padEndMs +
      s.lines.reduce((a, l) => a + (l.durationMs ?? 0), 0);
    return Math.ceil((ms / 1000) * FPS) + t; // kompensasi overlap transisi
  });
  const total = sceneFrames.reduce((a, b) => a + b, 0) - t * (sceneFrames.length - 1);
  if (total > props.data.maxDurationSec * FPS) throw new Error(`Durasi ${total / FPS}s > 5 menit`);
  return {durationInFrames: total, props: {...props, sceneFrames}};
};

export const RemotionRoot = () => (
  <Composition id="ApmnuProfile" component={Video}
    width={1920} height={1080} fps={FPS} durationInFrames={8550}
    defaultProps={{data: scenesData as VideoProps['data'], sceneFrames: []}}
    calculateMetadata={calc} />
);
```
Catatan: `durationMs` diisi oleh `scripts/tts.ts` setelah audio dibuat.

`src/Video.tsx`
```tsx
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {Audio} from '@remotion/media'; // atau Audio/Html5Audio dari 'remotion' sesuai versi
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {CaptionTrack} from './components/CaptionTrack';
import * as Scenes from './scenes';

export const Video: React.FC<VideoProps> = ({data, sceneFrames}) => {
  const t = data.transitionFrames;
  return (
    <AbsoluteFill style={{backgroundColor: '#06371F'}}>
      <TransitionSeries>
        {data.scenes.map((s, i) => {
          const C = (Scenes as any)[s.component];
          return [
            <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames[i]}>
              <C scene={s} />
            </TransitionSeries.Sequence>,
            i < data.scenes.length - 1 ? (
              <TransitionSeries.Transition key={s.id + '-t'}
                presentation={fade()} timing={linearTiming({durationInFrames: t})} />
            ) : null,
          ];
        })}
      </TransitionSeries>
      ‹Audio src={staticFile('audio/music/bed.mp3')} volume={0.12} />
      <CaptionTrack src={staticFile('captions/captions.en.json')} />
    </AbsoluteFill>
  );
};
```
Voice-over dipasang di dalam tiap komponen adegan: `<Sequence from={offsetLine}>` dengan `‹Audio src={staticFile(l.audio)} />`, supaya audio ikut offset adegan.

`src/components/KenBurns.tsx`
```tsx
import {Img, interpolate, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
export const KenBurns = ({src, from = 1, to = 1.08}: {src: string; from?: number; to?: number}) => {
  const f = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  const s = interpolate(f, [0, durationInFrames], [from, to], {extrapolateRight: 'clamp'});
  return ‹Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} />;
};
```

`src/components/CaptionTrack.tsx` (caption per kalimat, tipe `Caption`)
```tsx
import {useEffect, useState} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, useDelayRender} from 'remotion';
import type {Caption} from '@remotion/captions';
export const CaptionTrack = ({src}: {src: string}) => {
  const [caps, setCaps] = useState<Caption[] | null>(null);
  const {delayRender, continueRender} = useDelayRender();
  const [h] = useState(() => delayRender());
  useEffect(() => { fetch(src).then((r) => r.json()).then((c) => { setCaps(c); continueRender(h); }); }, [src]);
  const ms = (useCurrentFrame() / useVideoConfig().fps) * 1000;
  const cur = caps?.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cur) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70}}>
      <div style={{maxWidth: 1500, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 46,
        lineHeight: 1.25, padding: '10px 24px', borderRadius: 10, textAlign: 'center'}}>{cur.text}</div>
    </AbsoluteFill>
  );
};
```

`Counter` cukup memakai `Math.round(interpolate(frame,[0,45],[0,197],{extrapolateRight:'clamp', easing: Easing.out(Easing.cubic)}))`, dan `spring({frame, fps, config:{damping:200}})` untuk pop-in.

**Instalasi dan render**
```bash
npx create-video@latest apmnu-profile   # pilih template Blank + TypeScript, setujui Agent Skills
cd apmnu-profile
npx remotion add @remotion/transitions @remotion/captions @remotion/media @remotion/google-fonts @remotion/install-whisper-cpp
npx skills add remotion-dev/skills
npx remotion studio                      # preview
npx remotion render ApmnuProfile out/apmnu-profile.mp4 --codec=h264 --crf=18
# opsional subtitle terpisah: public/captions/captions.en.srt (via serializeSrt)
```

### 5.5 Paket prompt agent (salin-tempel)

Jalankan berurutan di Claude Code dari root proyek. Agent 0 adalah *orchestrator*. Agent 1–6 bisa dijalankan sebagai subagent.

---

**AGENT 0 — ORCHESTRATOR**
```
PERAN: Produser teknis video profil APMNU (Asosiasi Profesor Muslimat Nahdlatul Ulama).
TUJUAN: Video 1920x1080, 30fps, durasi 4:30–4:50 (maks 5:00), narasi Bahasa Indonesia, caption Bahasa Inggris tertanam (burn-in) + file .srt terpisah.
SUMBER KEBENARAN: data/scenes.json. Semua agent membaca/menulis file ini; jangan menyimpan fakta di tempat lain.
ALUR: Agent1 Aset → Agent2 Naskah → Agent3 TTS → Agent4 Caption EN → Agent5 Komposisi Remotion → Agent6 QA/Render.
ATURAN: Gunakan skill "remotion-best-practices" (remotion-dev/skills). Jangan mengarang fakta organisasi; fakta di luar laporan riset harus diberi flag "VERIFY". Setiap agent menulis log ke logs/<agent>.md.
SELESAI BILA: out/apmnu-profile.mp4 dan public/captions/captions.en.srt ada, QA report lulus semua cek.
```

**AGENT 1 — PENGUMPUL ASET & BRAND**
```
PERAN: Asset librarian.
INPUT: Daftar URL aset di laporan riset (logo, pengukuhan, khofifah, amany, rakornas-mnu, poster-seminar, launch-website, launch-buku, launch-jurnal, jurnal-cover, jurnal-logo, poster-benchmark, kbri-kairo, pci-mesir, suez, poster-iwc; opsional dengan izin: seminar-foto, presscon).
TUGAS:
1. Tulis scripts/fetch-assets.ts: unduh tiap URL ke public/assets/<id>.<ext>, decode %20, simpan header, tolak file <20KB.
2. Catat ke data/assets.json: {id, url, sourcePage, caption, date, width, height, license:"izin APMNU diperlukan"|"izin media diperlukan", sceneIds[]}.
3. Tandai aset <1280px lebar sebagai "lowres" → hanya dipakai dalam bingkai/kolase, bukan full-screen.
4. Ekstrak 5 warna dominan dari logo-apmnu.jpeg (pakai sharp + quantize) → data/brand.json {primary, primaryDark, accent, ink, muted}; jika gagal, pakai placeholder #0B6B3A/#06371F/#C9A227/#F5F1E6/#1E1E1E.
5. JANGAN unduh foto dari antaranews.com.
OUTPUT: public/assets/*, data/assets.json, data/brand.json, logs/agent1.md (daftar aset gagal/lowres).
SELESAI BILA: semua aset wajib (logo, kbri-kairo, pci-mesir, suez, launch-*) terunduh atau tercatat gagal dengan alasan.
```

**AGENT 2 — PENULIS NASKAH**
```
PERAN: Penulis naskah dokumenter institusional Bahasa Indonesia.
INPUT: Storyboard 9 adegan (laporan riset Bagian 4), data/assets.json.
TUGAS:
1. Isi data/scenes.json: per adegan → id, title, component (S01Hook…S09Closing), assets, animation, music, sfx, lines[] (id, id_text satu kalimat per baris, en[] kosong dulu), padStartMs, padEndMs.
2. Pecah narasi per kalimat (maks ~25 kata/kalimat) agar TTS & caption presisi.
3. Total kata 470–520. Hitung kata per adegan; tulis ringkasan ke logs/agent2.md.
4. Tulis angka sebagai kata untuk TTS ("delapan puluh dua"), tetapi simpan field displayNumber untuk grafis (82).
5. Fakta wajib-verifikasi diberi "verify": true (visi-misi, angka 197/210, status Prof. Amany, nama sekretaris).
6. Adegan 9: agenda 6–8 Nov 2026 hanya sebagai "agenda mendatang"; hapus jika tanggal render > 8 Nov 2026.
SELESAI BILA: scenes.json valid (cek dengan zod schema di scripts/schema.ts) dan total kata dalam rentang.
```

**AGENT 3 — VOICE-OVER (TTS) BAHASA INDONESIA**
```
PERAN: Audio engineer TTS.
INPUT: data/scenes.json (lines[].id_text).
OPSI MESIN (pilih via ENV TTS_ENGINE):
 a) azure: voice id-ID-GadisNeural (default, hangat) atau id-ID-ArdiNeural; SSML <prosody rate="-5%">, <break time="300ms"/> antar klausa; aktifkan WordBoundary untuk timestamp kata.
 b) elevenlabs: endpoint /v1/text-to-speech/{voice_id}/with-timestamps, model eleven_multilingual_v2; simpan alignment karakter; gunakan previous_text/next_text untuk kontinuitas intonasi.
 c) google: languageCode id-ID, pilih voice id-ID terbaru yang tersedia.
TUGAS:
1. scripts/tts.ts: buat satu file per baris → public/audio/vo/<lineId>.mp3 (44.1kHz, mono, -16 LUFS).
2. Ukur durasi tiap file (mediabunny/parseMedia atau ffprobe) → tulis lines[].durationMs; simpan timestamps kata ke data/vo-timestamps/<lineId>.json.
3. Lexicon pelafalan: "APMNU" = "A-Pe-Em-En-U", "Ahlussunnah wal Jama'ah", "Nahdliyin", "Bahtsul Masail", "Ismailiyah", "Al-Azhar", "@apmnu_official" = "apmnu underscore official".
4. Jika total durasi VO + pad + transisi > 290 detik: laporkan adegan terpanjang dan usulkan pemangkasan ke Agent 2 (jangan mempercepat rate > +8%).
SELESAI BILA: semua line punya audio & durationMs; logs/agent3.md berisi total durasi dan kpm aktual.
```

**AGENT 4 — CAPTION BAHASA INGGRIS**
```
PERAN: Subtitler/penerjemah ID→EN.
INPUT: data/scenes.json (id_text, durationMs), data/vo-timestamps/*.
TUGAS:
1. Terjemahkan tiap kalimat ke Inggris natural (bukan literal), istilah: Muslimat NU, Nahdlatul Ulama, Bahtsul Masail (biarkan), MURI = "Indonesian MURI records".
2. Pecah tiap terjemahan jadi baris caption ≤ 42 karakter/baris, ≤ 2 baris per tampilan, durasi tampil 1.2–6 dtk, kecepatan ≤ 17 karakter/detik.
3. Timing: offset kalimat = awal adegan + padStartMs + kumulatif durasi baris sebelumnya (dikurangi overlap transisi sesuai Root.tsx). Jika satu kalimat ID dipecah >1 caption EN, bagi waktu proporsional terhadap jumlah karakter, lalu snap ke batas kata ID terdekat dari vo-timestamps.
4. (Verifikasi opsional) Jalankan Whisper via @remotion/install-whisper-cpp, model "medium" multibahasa, language "id", tokenLevelTimestamps:true, pada VO gabungan 16kHz WAV → bandingkan batas kalimat; selisih >250ms → koreksi.
5. Output: public/captions/captions.en.json sebagai Caption[] ({text,startMs,endMs,timestampMs,confidence:null}); public/captions/captions.en.srt via serializeSrt() dari @remotion/captions.
SELESAI BILA: tidak ada caption tumpang tindih, tidak ada celah >1.5 dtk saat narasi berjalan, semua baris lolos batas karakter.
```

**AGENT 5 — PEMBANGUN KOMPOSISI REMOTION**
```
PERAN: Remotion engineer (React + TypeScript). Gunakan skill remotion-best-practices.
INPUT: data/scenes.json, data/brand.json, data/assets.json, public/*.
TUGAS:
1. Root.tsx: <Composition id="ApmnuProfile" width=1920 height=1080 fps=30> dengan calculateMetadata yang menghitung durasi dari durationMs + pad + kompensasi transisi; throw error jika > 9000 frame.
2. Video.tsx: <TransitionSeries> 9 adegan; fade() default, slide() di adegan 3, iris() untuk reveal logo; music bed volume 0.12 dengan ducking (volume callback turun ke 0.08 saat VO).
3. Komponen: KenBurns (<Img> + interpolate scale/translate), KineticTitle (spring per kata, stagger 3 frame), Counter (interpolate + Easing.out), LowerThird, Timeline (garis tumbuh + titik spring), MapArc (SVG path dengan stroke-dashoffset untuk Jakarta→Kairo→Ismailiyah; peta Indonesia sebagai SVG sederhana), CaptionTrack (baca captions.en.json).
4. Semua aset via staticFile(); semua animasi berbasis useCurrentFrame() — DILARANG CSS transition/setTimeout.
5. Font via @remotion/google-fonts (PlusJakartaSans, Amiri); warna dari brand.json.
6. Safe area 5%; caption tidak menutupi lower-third (naikkan lower-third saat caption aktif).
7. VO per baris dipasang dengan <Sequence from> di dalam adegan.
SELESAI BILA: `npx remotion studio` berjalan tanpa error/warning TypeScript; preview tiap adegan sesuai storyboard.
```

**AGENT 6 — QA & RENDER**
```
PERAN: QA engineer video.
TUGAS:
1. `npx tsc --noEmit` dan lint lulus.
2. Render still per adegan: `npx remotion still ApmnuProfile out/qa/sXX.png --frame=<tengah adegan>`; periksa visual: teks terbaca, tidak terpotong, aset tidak pecah (lowres tidak full-screen).
3. Render final: `npx remotion render ApmnuProfile out/apmnu-profile.mp4 --codec=h264 --crf=18 --audio-bitrate=192k`.
4. Cek dengan ffprobe: 1920x1080, 30fps, durasi ≤ 300 dtk, audio ada; loudness -16 LUFS ±1 (ffmpeg loudnorm print).
5. Cek caption: sampling 20 titik waktu, pastikan caption EN sesuai kalimat VO yang sedang diucapkan (±300ms).
6. Cek fakta: semua item "verify": true sudah dikonfirmasi atau ditandai di logs/qa.md sebagai BLOKER rilis.
7. Cek izin: setiap aset di assets.json berstatus izin "granted" sebelum publikasi publik.
OUTPUT: out/apmnu-profile.mp4, public/captions/captions.en.srt, logs/qa.md (checklist lulus/gagal).
SELESAI BILA: semua cek lulus atau bloker terdokumentasi dengan tindakan perbaikan.
```

### 5.6 Izin penggunaan foto dan logo
- **Logo dan foto apmnu.org** adalah milik APMNU ("© 2026 Asosiasi Profesor Muslimat NU. Seluruh hak cipta dilindungi"). Minta izin tertulis ke sekretariat APMNU melalui kanal resmi @apmnu_official atau alamat Jakarta, sekaligus minta file logo vektor dan foto resolusi asli.
- **Foto media** (NU Online Jatim/NOJ, mediapetisi.net) perlu izin redaksi dan kredit foto di layar ("Foto: NOJ/RS").
- **ANTARA** melarang pengambilan konten tanpa izin tertulis, jadi jangan dipakai.
- **Potret tokoh** (Khofifah, Menteri PPPA, Prof. Amany) sebaiknya disetujui pihak terkait atau APMNU, karena mereka pejabat publik dan video ini institusional.
- **Logo MURI dan Suez Canal University:** jangan ditampilkan tanpa izin; cukup teks.
- **Musik dan SFX:** pakai lisensi bebas royalti untuk penggunaan komersial/organisasi, dan simpan bukti lisensi di `licenses/`.

---

## Caveats
- **Akses situs terbatas:** saya hanya dapat membaca beranda apmnu.org. Halaman /about/profile, /about/organization, /liputan, /agenda, dan /kontak tidak bisa diakses, sehingga visi-misi verbatim, bagan pengurus lengkap, email, dan telepon belum ada. Ini bloker sebelum rilis.
- **Konflik data:**
  - Lokasi Rakornas: BPSDM Jatim (Antara, petik.co) versus Islamic Center Surabaya (RRI). Tanggalnya 6 Feb 2026 (RRI), sementara rilis pemprov bertanggal 9 Feb.
  - Seminar Jombang tertulis 27 Agu di sebagian sumber dan 28 Agu di sumber lain.
  - Jumlah profesor: 156 → 197 → 210.
  - Rekor MURI diserahkan kepada Muslimat NU melalui Khofifah, sedangkan NU Online menyebutnya penghargaan APMNU. Naskah memakai rumusan aman "bersama Muslimat NU".
- **Belum tersedia:** tanggal Mukernas Samarinda, dasar hukum formal (akta/SK), detail kegiatan di Arab Saudi, dan identitas visual resmi (hex/font).
- **Remotion berkembang cepat:** API audio (`<Audio>` vs `@remotion/media`) dan fungsi durasi berubah antarversi. Agent 5 harus mengikuti Agent Skills terbaru, bukan cuplikan kode ini secara buta.