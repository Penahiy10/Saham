/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  BookMarked, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Star, 
  Search, 
  Award, 
  Activity, 
  Calculator, 
  HelpCircle, 
  RefreshCw, 
  Play, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Compass,
  FileText,
  BadgeAlert,
  Dribbble,
  BrainCircuit,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// DATA STRUCTURE FOR PATHS & DETAILED MATERIALS
// ==========================================
interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
}

interface Path {
  id: 'pemula' | 'menengah' | 'lanjutan';
  title: string;
  badge: string;
  themeColor: string;
  gradient: string;
  icon: any;
  topics: Topic[];
}

const LEARNING_PATHS: Path[] = [
  {
    id: 'pemula',
    title: 'Jalur 1 - Pemula (Sekilas Dasar Saham)',
    badge: 'PEMULA (BASIC)',
    themeColor: 'emerald',
    gradient: 'from-emerald-550/15 to-transparent',
    icon: Compass,
    topics: [
      {
        id: 'pemula-1',
        title: 'Apa itu Saham?',
        description: 'Pahami hakikat bukti kepemilikan perseroan terbatas serta rujukan aset riil.',
        content: `Saham adalah lembar bukti kepemilikan nilai atas bagian modal sebuah perusahaan atau perseroan terbatas (PT). Saat Anda membeli saham sebuah emiten (misalnya BBCA atau TLKM), Anda secara hukum menjadi pemilik sebagian kecil dari aset fisik, merek dagang, dan arus laba bersih masa depan perusahaan tersebut.

Keuntungan pemegang saham berasal dari dua sumber utama:
1. Capital Gain: Selisih laba dari kenaikan harga saham di bursa efek.
2. Dividen: Pembagian sebagian laba bersih operasional tahunan perusahaan.`,
        readTime: '3 mnt baca'
      },
      {
        id: 'pemula-2',
        title: 'Cara Kerja Bursa Efek',
        description: 'Kenali sistem pelelangan terkomputerisasi BEI yang mempertemukan order bids.',
        content: `Bursa Efek Indonesia (BEI) adalah regulator berlisensi negara tempat bertemunya supply (penjual) dan demand (pembeli) saham emiten. Melalui perantara Perusahaan Sekuritas (Broker), order Anda dimasukkan ke dalam mesin pencocokan otomatis yang disebut JATS (Jakarta Automated Trading System).

JATS bekerja berdasarkan asas prioritas harga (Price Priority) dan prioritas waktu (Time Priority). Transaksi berlangsung aman karena diawasi harian oleh OJK (Otoritas Jasa Keuangan).`,
        readTime: '4 mnt baca'
      },
      {
        id: 'pemula-3',
        title: 'Cara Membaca Harga Saham',
        description: 'Mengerti dasar quotes penawaran, bid rate, dan ask volume.',
        content: `Harga penutupan hari kemarin menjadi acuan dasar pembukaan pasar pagi ini. Untuk bertransaksi, Anda harus melihat papan antrean penutupan:
1. Bid: Kolom antrean beli. Semakin Anda berani menawar harga tinggi, antrean Anda diprioritaskan di paling atas.
2. Ask (Offer): Kolom antrean jual. Semakin Anda mematok harga rendah, antrean Anda diprioritaskan untuk terserap pertama.
3. Haka (Hajar Kanan): Membeli langsung di harga Ask terendah agar order instan terlaksana.
4. Haki (Hajar Kiri): Menjual langsung di harga Bid tertinggi agar barang langsung laku terjual.`,
        readTime: '3 mnt baca'
      },
      {
        id: 'pemula-4',
        title: 'Cara Membuka Rekening Sekuritas',
        description: 'Prosedur pembukaan rekening efek & pengisian dana RDN tanpa ribet.',
        content: `Untuk membeli saham, Anda wajib memiliki akun RDN (Rekening Dana Nasabah) di salah satu sekuritas resmi yang terdaftar KSEI dan OJK. Langkah pembuatan kini sepenuhnya digital:
1. Pilih sekuritas dengan biaya broker bersaing (biasanya beli 0.15%, jual 0.25%).
2. Siapkan dokumen penting: Swafoto bersama KTP, NPWP mandiri (bila ada), dan nomor rekening bank asal.
3. Tunggu verifikasi SID (Single Investor Identification) sekitar 1x24 jam.
4. RDN siap digunakan setelah Anda mentransfer deposit modal awal minimal mulai Rp10.050.500.`,
        readTime: '4 mnt baca'
      },
      {
        id: 'pemula-5',
        title: 'Strategi Investasi Jangka Panjang (DCA)',
        description: 'Metodologi disiplin menabung saham Blue Chip secara berkala.',
        content: `Bagi pemula, Dollar Cost Averaging (DCA) adalah strategi tersukses untuk meredam kecemasan fluktuasi harian. Anda menginvestasikan sejumlah uang nominal tetap secara rutin (misalnya Rp1.000.000 setiap tanggal gajian) ke sebuah saham berkinerja unggul (Blue Chip).

Dengan DCA, Anda otomatis mendapatkan lebih banyak unit saham saat harga turun, dan lebih sedikit unit saat harga meninggi. Kunci utama keberhasilan DCA adalah disiplin, kesabaran melompati siklus pasar, serta pemilihan bisnis emiten yang stabil bertumbuh minimal selama 10 tahun ke depan.`,
        readTime: '4 mnt baca'
      }
    ]
  },
  {
    id: 'menengah',
    title: 'Jalur 2 - Menengah (Analisa Fundamental)',
    badge: 'MENENGAH (INTERMEDIATE)',
    themeColor: 'blue',
    gradient: 'from-blue-550/15 to-transparent',
    icon: Award,
    topics: [
      {
        id: 'menengah-1',
        title: 'Analisa Fundamental Dasar',
        description: 'Konsep dasar menakar nilai perusahaan melalui kesehatan bisnis riil.',
        content: `Analisa fundamental mengajarkan kita untuk berpikir layaknya pemilik konglomerasi bisnis sejati, bukan penjudi. Kita fokus menyelidiki 'Economic Moat' atau daya saing unik perusahaan yang membendung mereka dari serbuan kompetitor, seperti merek kuat, hak paten monopoli, atau efisiensi biaya luar biasa.

Dua pendekatan analisis fundamental:
1. Top-Down: Mengevaluasi kesehatan makro global, pertumbuhan ekonomi domestik, prospek sektoral, baru memilih perusahaan jawara.
2. Bottom-Up: Mengabaikan keadaan makro sementara untuk fokus memburu saham individual yang sangat murah namun berkinerja kilau.`,
        readTime: '5 mnt baca'
      },
      {
        id: 'menengah-2',
        title: 'Membaca Laporan Keuangan',
        description: 'Menganalisis lembar neraca saldo, laba-rugi operasional, dan kas mengalir.',
        content: `Setiap emiten wajib mempublikasikan laporan keuangan kuartalan di portal BEI. Tiga bab wajib diperiksa:
1. Neraca (Balance Sheet): Menguraikan Aset (apa yang kita miliki), Liabilitas (utang kita), dan Ekuitas (modal milik investor). Rumusnya: Aset = Utang + Modal.
2. Laporan Laba Rugi (Income Statement): Mengukur omzet penjualan, biaya operasional, beban bunga bank, pajak, hingga sisa laba bersih bersih.
3. Laporan Arus Kas (Cash Flow): Melacak aktivitas aliran uang tunai riil dari kegiatan operasional, investasi beli aset baru, dan pendanaan dividen/utang. Arus kas operasi yang positif jauh lebih jujur dibanding laba di atas kertas.`,
        readTime: '5 mnt baca'
      },
      {
        id: 'menengah-3',
        title: 'Rasio-rasio Penting (PER, PBV, ROE, DER)',
        description: 'Membandingkan nilai intrinsik kelayakan saham emiten setara sektor.',
        content: `Untuk menilai murah atau mahalnya harga saham emiten, gunakan formula rasio instan berikut:
1. Price to Earnings Ratio (PER): Membagi harga saham terhadap laba bersih per lembar (EPS). PER di bawah 10x umumnya dianggap murah di industri tertentu.
2. Price to Book Value (PBV): Membagi harga saham terhadap nilai ekuitas per lembar. PBV < 1x memberitahu harga pasar lebih rendah dibanding buku aset riil.
3. Return on Equity (ROE): Menakar seberapa efektif emiten mencetak laba bersih dari ekuitas saham pemodal. ROE > 15% mencerminkan manajemen yang sangat cerdas.
4. Debt to Equity Ratio (DER): Rasio utang terhadap modal. Disarankan DER di bawah 1x (100%) untuk mencegah risiko gagal bayar kredit bank.`,
        readTime: '5 mnt baca'
      },
      {
        id: 'menengah-4',
        title: 'Diversifikasi Portofolio Sektoral',
        description: 'Metode membagi keranjang alokasi dana secara proporsional.',
        content: `Diversifikasi mencegah bencana kehancuran total porto jika terjadi hal darurat pada satu industri. Jangan pernah menaruh seluruh modal di satu sektor komoditas fluktuatif saja.

Disarankan membagi dana ke minimal 3 - 5 industri yang berlainan karakter korelasinya:
1. Saham Defensif (Consumer Goods): Stabil menghasilkan kas walau krisis.
2. Saham Siklikal (Energi/Batubara): Sangat menguntungkan saat siklus harga komoditas booming dunia.
3. Saham Pertumbuhan (Perbankan/Fintech): Terbawa pertumbuhan produktivitas kredit di masa ekspansi wilayah.`,
        readTime: '4 mnt baca'
      }
    ]
  },
  {
    id: 'lanjutan',
    title: 'Jalur 3 - Lanjutan (Analisa Teknikal & Psikologi)',
    badge: 'LANJUTAN (ADVANCED)',
    themeColor: 'purple',
    gradient: 'from-purple-550/15 to-transparent',
    icon: Sparkles,
    topics: [
      {
        id: 'lanjutan-1',
        title: 'Pengantar Analisa Teknikal',
        description: 'Menganalisis pola pergerakan harga historis dan volume likuiditas di market.',
        content: `Analisa teknikal bekerja berlandaskan prinsip bahwa 'Market Discount Everything' — yaitu semua sentimen berita, fundamental, dan rahasia manajemen dianggap sudah tercermin telanjang pada grafik harga historis.

Analisis ini fokus memetakan tiga kondisi tren dasar harga pasar:
1. Uptrend: Pola kenaikan membentuk puncak yang lebih tinggi (higher high) dan lembah yang lebih tinggi (higher low).
2. Downtrend: Pola penurunan membentuk puncak/lembah yang lebih rendah berurutan.
3. Sideways: Harga tertahan lurus dalam koridor rentang resistance & support mendatar.`,
        readTime: '5 mnt baca'
      },
      {
        id: 'lanjutan-2',
        title: 'Cara Membaca Candlestick',
        description: 'Menangkap aksi psikologi perang pembeli-penjual lewat jarum sumbu.',
        content: `Setiap satu buah lilin (Candle) menyimpan 4 data penting: Open (pembukaan), Close (penutupan), High (tertinggi), dan Low (terendah).
- Candle Hijau (Bullish): Harga ditutup lebih memuncak dibanding pembukaannya.
- Candle Merah (Bearish): Harga ditutup merosot dibanding pembukaanya.
1. Jarum ekor bawah yang panjang menandakan penolakan harga turun (buying pressure kuat).
2. Ekor atas yang menjulang menandakan aksi ambil untung meluap (selling pressure besar).
3. Doji: Ukuran badan sangat tipis menandakan keraguan pasar yang berisiko pembalikan arah radikal.`,
        readTime: '4 mnt baca'
      },
      {
        id: 'lanjutan-3',
        title: 'Indikator RSI, MACD & Bollinger Bands',
        description: 'Mekanika kalkulasi osilator dan batasan volatilitas standar deviasi.',
        content: `Indikator membantu trader mengambil keputusan buy/sell secara kuantitatif serta menghindari emosional subyektif:
1. Relative Strength Index (RSI): Mengukur kejenuhan pasar dari skala 0-100. Angka di atas 70 mengindikasikan jenuh beli (Overbought, siap-siap koreksi), sedangkan di bawah 30 mengindikasikan jenuh jual (Oversold, peluang serok murah).
2. MACD (Moving Average Convergence Divergence): Mengukur akselerasi momentum tren. Jika garis biru memotong garis oranye ke atas (Golden Cross), itu adalah sinyal beli kuat.
3. Bollinger Bands: Menghitung deviasi standar simpangan atas dan bawah pergerakan rata-rata. Harga yang menyentuh batas bawah pita berpeluang terpental naik kembali.`,
        readTime: '5 mnt baca'
      },
      {
        id: 'lanjutan-4',
        title: 'Manajemen Risiko & Psikologi Trading',
        description: 'Menjaga kelangsungan hidup modal jangka panjang (Money Management).',
        content: `Trader sukses berbeda dari penjudi murni karena mereka menguasai 'Position Sizing' dan 'Risk-to-Reward Ratio'. Mereka selalu menetapkan rencana ketat sebelum mengeklik order beli.

Rantai disiplin wajib trading:
1. Batasi kerugian maksimal tiap kali trade (Stop Loss) di kisaran 2% - 5%.
2. Pastikan target laba (Take Profit) bernilai minimal 2 kali porsi risiko (Ratio 1:2).
3. Buang bias mental FOMO (ikut arus massa krn takut tertinggal) dan Greed (lupa merealisasikan modal karena terlalu bernafsu). Modal bertahan jauh lebih baik dibanding mengejar kaya instan dalam semalam.`,
        readTime: '5 mnt baca'
      }
    ]
  }
];

// ==========================================
// GLOSSARY DATA LIST (32 stocks terms)
// ==========================================
interface DictionaryTerm {
  term: string;
  definition: string;
  category: 'Fundamental' | 'Teknikal' | 'Aksi Korporasi' | 'Regulasi';
}

const GLOSSARY_DB: DictionaryTerm[] = [
  { term: 'ARA (Auto Rejection Atas)', definition: 'Batas maksimum kenaikan harian harga saham yang dizinkan regulator BEI guna meredam spekulasi buta.', category: 'Regulasi' },
  { term: 'ARB (Auto Rejection Bawah)', definition: 'Batas maksimum penurunan harian harga saham yang ditetapkan bursa agar mencegah panik jual tidak beralasan.', category: 'Regulasi' },
  { term: 'AGMS (RUPST)', definition: 'Rapat Umum Pemegang Saham Tahunan, pertemuan rutin emiten untuk melaporkan kepatuhan operasional, laba, dan pembagian dividen resmi.', category: 'Aksi Korporasi' },
  { term: 'Ask (Offer)', definition: 'Harga antrean penawaran bagi pihak yang memegang kepemilikan saham dan hendak melego/menjual asetnya.', category: 'Regulasi' },
  { term: 'Bearish', definition: 'Suatu kondisi di mana indeks pasar keseluruhan atau saham tertentu mengalami penurunan berturut-turut.', category: 'Teknikal' },
  { term: 'Bid', definition: 'Harga antrean penawaran beli bagi calon investor yang sedang antre mematok kesepakatan harga transaksi terbaiknya.', category: 'Regulasi' },
  { term: 'Blue Chip', definition: 'Saham lapis satu dengan kapitalisasi pasar super jumbo (>Rp100 Triliun), manajemen kredibel, bisnis stabil bertahan krisis, serta rutin dividen.', category: 'Fundamental' },
  { term: 'Book Value', definition: 'Nilai buku perseroan, dihitung dari total nominal aset neto rill dikurangi seluruh liabilitas utang bank.', category: 'Fundamental' },
  { term: 'Bullish', definition: 'Kondisi optimisme pasar di mana transaksi menguat pesat dan harga instrumen terus mendaki ke level tertinggi baru.', category: 'Teknikal' },
  { term: 'Capital Gain', definition: 'Keuntungan bersih material yang didapat dari selisih positif antara harga beli lama dengan harga jual terkini.', category: 'Fundamental' },
  { term: 'Capital Loss', definition: 'Kerugian finansial akibat terpaksa menjual instrumen saham di bawah harga beli awal akibat sentimen tertekan.', category: 'Fundamental' },
  { term: 'Corporate Action', definition: 'Aksi strategis korporat emiten yang secara langsung memengaruhi rasio jumlah kepemilikan saham para investor (misal: Right issues, Stock splits).', category: 'Aksi Korporasi' },
  { term: 'Cum Date (Cumulative)', definition: 'Hari penentuan terakhir bagi pemegang saham untuk diklasifikasikan berhak penuh atas kupon pembagian dividen tunai.', category: 'Aksi Korporasi' },
  { term: 'Dividend Payout Ratio (DPR)', definition: 'Persentase rasio dari total laba bersih emiten dalam setahun penuh yang dialokasikan tunai kepada investor.', category: 'Aksi Korporasi' },
  { term: 'Dividend Yield', definition: 'Perbandingan imbal balik dividen tunai per lembar terhadap total harga lembar saham tersebut saat dibeli di pasar bursa.', category: 'Fundamental' },
  { term: 'EPS (Earnings Per Share)', definition: 'Laba bersih per lembar saham, menunjukkan porsi pembagian keuntungan produktifitas bisnis riil kepada tiap lembar modal.', category: 'Fundamental' },
  { term: 'Ex Date (Expiry)', definition: 'Hari setelah Cum Date di mana transaksi jual beli saham baru tidak lagi mendapatkan hak dividen di periode tersebut.', category: 'Aksi Korporasi' },
  { term: 'GTV (Gross Transaction Vale)', definition: 'Total nilai transaksi kumulatif kotor yang melewati sirkulasi sistem operasional platform bisnis digital kuartal bersangkutan.', category: 'Fundamental' },
  { term: 'IHSG (JCI)', definition: 'Indeks Harga Saham Gabungan, rata-rata indeks pelacak bobot kapital seluruh rekam saham terdaftar di Indonesia.', category: 'Regulasi' },
  { term: 'IPO (Initial Public Offering)', definition: 'Aksi pencatatan perdana saham perusahaan non-publik menuju pasar terbuka agar publik bebas memperdagangkan modalnya.', category: 'Aksi Korporasi' },
  { term: 'Kustodian', definition: 'Lembaga terdaftar resmi penyimpan aman seluruh transaksi sekuritas kolektif dari manipulasi oknum (e.g. KSEI).', category: 'Regulasi' },
  { term: 'Limit Order', definition: 'Instruksi bertransaksi otomatis di porsi harga yang telah ditentukan secara spesifik oleh nasabah broker bersangkutan.', category: 'Regulasi' },
  { term: 'Liquidation', definition: 'Proses pemecahan perusahaan bangkrut di mana aset tersisa dijual murah demi melunasi utang kreditor utama pertama kali.', category: 'Fundamental' },
  { term: 'Market Capitalization', definition: 'Bobot total nilai kapitalisasi harga emiten, dicari dengan rumus: harga saham per lembar dikalikan jumlah unit beredar.', category: 'Fundamental' },
  { term: 'NPL (Non-Performing Loan)', definition: 'Rasio kesehatan perbankan menakar persentase total kredit yang tersendat macet oleh debitur pinjaman.', category: 'Fundamental' },
  { term: 'OD (Overdraft)', definition: 'Pembiayaan pinjaman margin sekuritas melampaui saku modal investor semula, berisiko denda penalti tinggi.', category: 'Regulasi' },
  { term: 'PER (Price to Earnings)', definition: 'Formulasi valuasi kelayakan harga, membagi harga saham di pasar dengan total laba per lembar EPS.', category: 'Fundamental' },
  { term: 'PBV (Price to Book Value)', definition: 'Formulasi valuasi membagi harga pasar saham saat ini dengan nilai buku ekuitas neto riil per saham.', category: 'Fundamental' },
  { term: 'ROE (Return on Equity)', definition: 'Imbal daya pembalikan laba terhadap modal ekuitas, mengukur kepiawaian dewan direksi memutar modal pemegang saham.', category: 'Fundamental' },
  { term: 'Securities Broker', definition: 'Perusahaan keanggotaan bursa yang menjembatani transaksi pesanan retail menuju gerbang sistem pelelangan BEI.', category: 'Regulasi' },
  { term: 'Stock Split', definition: 'Aksi emiten membagi nilai nominal sahamnya (misal pecah 1:5) agar harga per lembar turun dan transaksi bertambah likuid ramai.', category: 'Aksi Korporasi' },
  { term: 'Underwriter', definition: 'Penjamin emisi efek berkredensial yang menanggung penyerapan porsi penjualan saham perdana sewaktu masa IPO perusahaan.', category: 'Aksi Korporasi' }
];

// ==========================================
// QUIZ DATA STRUCTURE (10 questions per Level)
// ==========================================
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

const QUIZ_PEMULA: QuizQuestion[] = [
  {
    id: 'pq-1',
    question: 'Apa yang dimaksud dengan kepemilikan selembar saham?',
    options: [
      'Bukti kepemilikan modal fisik & hak atas profit masa depan sebuah perseroan terbatas.',
      'Sertifikat pinjaman modal berbunga wajib bulanan.',
      'Aset virtual tanpa jaminan hukum bursa efek.',
      'Surat izin untuk bekerja langsung di kantor emiten.'
    ],
    correctAnswerIdx: 0,
    explanation: 'Saham mewakili kepemilikan ekuitas nyata di dalam perseroan terbatas, memberikan hak atas aset bersih dan pembagian dividen.'
  },
  {
    id: 'pq-2',
    question: 'Melalui institusi manakah investor individu membeli saham terdaftar OJK?',
    options: [
      'Bank Rakyat Indonesia langsung.',
      'Pegadaian dan koperasi pasar.',
      'Perusahaan Sekuritas (Broker) berlisensi resmi.',
      'Kementerian Badan Usaha Milik Negara.'
    ],
    correctAnswerIdx: 2,
    explanation: 'Investor retail menyalurkan order transaksinya lewat Perusahaan Sekuritas yang terintegrasi dangan sistem bursa efek.'
  },
  {
    id: 'pq-3',
    question: 'Bila Anda membeli langsung saham di antrean harga "Ask/Offer" terendah yang sedang aktif, disebut strategi tindakan apa?',
    options: [
      'Haki (Hajar Kiri)',
      'Haka (Hajar Kanan)',
      'Dollar Cost Averaging',
      'Cut Loss Terpimpin'
    ],
    correctAnswerIdx: 1,
    explanation: 'Haka atau "Hajar Kanan" berarti seketika membeli di baris penawaran jual (Ask) agar pesanan instan tereksekusi tanpa antre.'
  },
  {
    id: 'pq-4',
    question: 'Apa nama hasil pembagian laba bersih perusahaan kepada para pemegang sahamnya?',
    options: [
      'Kupon Obligasi',
      'Capital Gain',
      'Kurs Kompensasi',
      'Dividen'
    ],
    correctAnswerIdx: 3,
    explanation: 'Dividen adalah bagian keuntungan operasional korporasi yang didistribusikan tunai per lembar kepada pemegang saham terdaftar.'
  },
  {
    id: 'pq-5',
    question: 'Bagaimana metode Dollar Cost Averaging (DCA) menguntungkan investor?',
    options: [
      'Investasi sekaligus seluruh saku modal di harga paling puncak.',
      'Membeli saham berjangka hanya di malam hari setelah bursa tutup.',
      'Secara rutin berkala menyetor nominal rupiah yang tetap konstan tanpa memedulikan fluktuasi harian.',
      'Pinjam dana margin tinggi dari broker sekuritas.'
    ],
    correctAnswerIdx: 2,
    explanation: 'DCA meredam rata-rata biaya investasi dengan disiplin menabung saham secara berkala di berbagai kondisi pasar.'
  },
  {
    id: 'pq-6',
    question: 'Nama akun khusus perbankan yang dipakai menampung dana dingin transaksi jual-beli saham Anda disebut...',
    options: [
      'RDN (Rekening Dana Nasabah)',
      'Rekening Deposito Berjangka',
      'E-Wallet Multi-Platform',
      'Giro Giro Kartu Kredit'
    ],
    correctAnswerIdx: 0,
    explanation: 'RDN dikelola oleh bank yang bekerja sama dengan sekuritas nasabah demi mengamankan kepemilikan modal kas riil Anda.'
  },
  {
    id: 'pq-7',
    question: 'Apakah yang didefinisikan oleh ticker kode emiten "BBCA"?',
    options: [
      'Badan Bisnis Cipta Agro Tbk',
      'Bursa Bersama Carbon Asosiasi',
      'PT Bank Central Asia Tbk',
      'Bumi Barito Coal Asahan Tbk'
    ],
    correctAnswerIdx: 2,
    explanation: 'Setiap emiten terdaftar di BEI diwakili oleh 4 kode huruf kapital unik. BBCA merepresentasikan Bank Central Asia.'
  },
  {
    id: 'pq-8',
    question: 'Kondisi pasar di mana rata-rata indeks bursa melonjak naik optimis berhari-hari lazim dinamai...',
    options: [
      'Bearish',
      'Sideways',
      'Deltarisk',
      'Bullish'
    ],
    correctAnswerIdx: 3,
    explanation: 'Bullish melambangkan tren mendongkrak ke puncak, diambil dari analogi banteng yang menanduk korbannya ke langit.'
  },
  {
    id: 'pq-9',
    question: 'Apa yang dimaksud dengan "Cum Date" dividen?',
    options: [
      'Hari penentuan terdekat di mana pembeli baru TIDAK LAGI berhak atas dividen tunai.',
      'Hari terakhir pendaftaran kepemilikan saham agar terdaftar sebagai penerima kupon dividen tunai.',
      'Hari di mana emiten mentransfer tunai uang kas ke Rekening Dana Nasabah.',
      'Hari penutupan rilis laporan keuangan tahunan.'
    ],
    correctAnswerIdx: 1,
    explanation: 'Cum Date adalah cumulative date, hari penentuan final di mana nama Anda harus tercatat memegang saham agar sah mengklaim dividen.'
  },
  {
    id: 'pq-10',
    question: 'Apakah fungsi utama pengawas OJK (Otoritas Jasa Keuangan) di pasar bursa?',
    options: [
      'Menentukan jaminan harga saham pasti selalu naik tiap hari.',
      'Mengatur agar investor pemula dilarang rugi sewaktu trading.',
      'Membayar ganti rugi seluruh porsi capital loss nasabah.',
      'Mengawasi serta memastikan transaksi di bursa berjalan adil, tertib, transparan, sesuai koridor hukum.'
    ],
    correctAnswerIdx: 3,
    explanation: 'OJK bertindak sebagai regulator independen pelindung industri finansial keuangan dari fraud dan tindak pidana korporasi.'
  }
];

const QUIZ_MENENGAH: QuizQuestion[] = [
  {
    id: 'mq-1',
    question: 'Rasio manakah yang menguji kelayakan harga saham dibanding laba per lembar EPS perusahaan?',
    options: [
      'PER (Price to Earnings Ratio)',
      'PBV (Price to Book Value)',
      'ROE (Return on Equity)',
      'DER (Debt to Equity Ratio)'
    ],
    correctAnswerIdx: 0,
    explanation: 'PER menakar seberapa kali lipat harga saham saat ini dihargai terhadap laba bersih per lembar yang mampu dicetak emiten.'
  },
  {
    id: 'mq-2',
    question: 'Rasio Return on Equity (ROE) menguji kepiawaian manajemen dalam mengelola...',
    options: [
      'Hutang bank jangka pendek.',
      'Uang kas bersih dari dewan komisaris.',
      'Modal ekuitas milik pemegang saham perseroan.',
      'Total aset tanah fisik pabrik.'
    ],
    correctAnswerIdx: 2,
    explanation: 'ROE mencerminkan tingkat efisiensi pemanfaatan modal inti (ekuitas) dalam mencetak laba berjalan korporat.'
  },
  {
    id: 'mq-3',
    question: 'Analisa yang berfokus meneliti neraca keuangan, margin laba emiten, prospek industri riil disebut...',
    options: [
      'Analisa Teknikal Klasik',
      'Analisa Fundamental',
      'Bandermologi Kuantitatif',
      'Teknosiklikal Moving Average'
    ],
    correctAnswerIdx: 1,
    explanation: 'Analisa Fundamental menyelidiki kondisi kesehatan internal finansial bisnis dan model usaha emiten secara objektif.'
  },
  {
    id: 'mq-4',
    question: 'Dalam laporan neraca keuangan (Balance Sheet), apa persamaan formula akuntansi dasarnya?',
    options: [
      'Aset = Hutang + Ekuitas (Modal)',
      'Ekuitas = Aset + Liabilitas',
      'Laba Bersih = Omzet + Pajak',
      'Modal = Kas Operasional - Dividen Berjalan'
    ],
    correctAnswerIdx: 0,
    explanation: 'Setiap aset riil beroperasi ditopang oleh dua sumber pendanaan: pinjaman utang (liabilitas) dan modal sendiri (ekuitas).'
  },
  {
    id: 'mq-5',
    question: 'Apakah tujuan utama menerapkan diversifikasi lintas sektor industri dalam portofolio?',
    options: [
      'Membayar pajak transaksi bursa menjadi lebih murah.',
      'Mendapatkan diskon biaya trading dari sekuritas perantara.',
      'Memantau agar seluruh emiten memiliki nama ticker berawalan huruf sama.',
      'Meredam risiko kerugian ekstrem jika salah satu industri terpuruk krisis.'
    ],
    correctAnswerIdx: 3,
    explanation: 'Diversifikasi menyebarkan risiko agar anjloknya satu sektor tertentu tidak langsung merusak keseleruhan nilai portofolio Anda.'
  },
  {
    id: 'mq-6',
    question: 'Secara teori dasar, rasio PBV di bawah level 1.0x menandakan bahwa saham tersebut...',
    options: [
      'Dihargai lebih murah dibanding nilai ekuitas buku aslinya.',
      'Kemungkinan besar akan segera dilarang ditransaksikan bursa.',
      'Memilik jumlah utang yang sangat berbahaya bagi likuiditas.',
      'Saham bertumbuh super cepat dalam kategori teknologi tinggi.'
    ],
    correctAnswerIdx: 0,
    explanation: 'PBV di bawah satu berarti harga pasar saham tersebut lebih rendah dibanding nilai ekuitas bersih perusahaan di laporan keuangan.'
  },
  {
    id: 'mq-7',
    question: 'Aksi korporasi mecah nilai nominal saham emiten agar harga per unit turun ramah ritel diistilahkan...',
    options: [
      'Rights Issue',
      'Private Placement',
      'Stock Split',
      'Delisting Sukarela'
    ],
    correctAnswerIdx: 2,
    explanation: 'Stock Split memecah satu saham menjadi beberapa unit baru tanpa memengaruhi proporsi total nilai ekuitas perseroan.'
  },
  {
    id: 'mq-8',
    question: 'Bagaimanakah mendapati nilai Dividend Yield sebuah saham?',
    options: [
      'Membagi nilai dividen per lembar dengan laba bersih kotor.',
      'Membagi nilai total dividen setahun dengan harga saham terkini di bursa.',
      'Mengalikan laba emiten dengan rasio PBV.',
      'Menakar sisa utang jangka pendek terhadap kepemilikan direksi.'
    ],
    correctAnswerIdx: 1,
    explanation: 'Dividend Yield menakar persentase imbal hasil kas riil tahunan yang didapat investor dibanding ongkos harga belinya.'
  },
  {
    id: 'mq-9',
    question: 'Manakah sirkulasi kas dalam Laporan Arus Kas (Cash Flow) yang mencerminkan kematangan ekspansi pabrik baru?',
    options: [
      'Arus Kas Aktivitas Pendanaan (Financing Flow)',
      'Arus Kas Aktivitas Operasional',
      'Arus Kas Aktivitas Investasi (Investing Flow)',
      'Arus Kas Amortisasi Non-Kas'
    ],
    correctAnswerIdx: 2,
    explanation: 'Arus Kas Aktivitas Investasi merekam sirkulasi perolehan kapital belanja modal (capex) untuk membeli aset produktif jangka panjang.'
  },
  {
    id: 'mq-10',
    question: 'Apakah makna dari Dividend Payout Ratio (DPR) sebesar 40%?',
    options: [
      'Emiten menderita kerugian kas sebesar 40% dari ekuitas saham.',
      'Setengah dari modal setoran awal dipaksakan hangus pajak bursa.',
      'Sebanyak 40% dari sisa laba bersih di tahun bersangkutan dibagikan tunai kepada investor.',
      'Suku bunga pinjaman bank direvisi merosot 40%.'
    ],
    correctAnswerIdx: 2,
    explanation: 'DPR merepresentasikan fraksi laba bersih emiten yang didistribusikan tunai, sementara sisa 60% disimpan sebagai laba ditahan.'
  }
];

const QUIZ_LANJUTAN: QuizQuestion[] = [
  {
    id: 'lq-1',
    question: 'Bila nilai indikator RSI (Relative Strength Index) menembus batas atas skala 75, ini menunjukkan kondisi...',
    options: [
      'Oversold (Jenuh Jual), peluang beli diskon.',
      'Divergence Bullish, indikator badai volatilitas.',
      'Overbought (Jenuh Beli), waspada rawan jenuh aksi untung.',
      'Sideways netral tanpa gairah transaksi.'
    ],
    correctAnswerIdx: 2,
    explanation: 'Skala RSI >70 mendeteksi jenuh beli di mana harga bergerak terlalu ekstrem naik sehingga rawan aksi profit taking.'
  },
  {
    id: 'lq-2',
    question: 'Pola candletick berbadan tipis dengan jarum shadow atas & bawah sangat panjang simetris disebut...',
    options: [
      'Marubozu Bullish',
      'Doji',
      'Hammer (Palu Reversal)',
      'Shooting Star'
    ],
    correctAnswerIdx: 1,
    explanation: 'Doji mencerminkan ketidakpastian hebat atau keseimbangan sempurna antara pembeli dan penjual, sering mengawali transisi tren.'
  },
  {
    id: 'lq-3',
    question: 'Berapakah batas alokasi porsi dana maksimal logis per emiten dalam kaidah Money Management?',
    options: [
      'Maksimum 100% langsung (All-In satu saham).',
      'Disarankan hanya 10% - 20% modal agar teredam eksposur kegagalan bisnis satu industri.',
      'Maksimum Rp50.000 saja per rekening investasi.',
      'Bebas tergantung rekomendasi influencer media sosial.'
    ],
    correctAnswerIdx: 1,
    explanation: 'Money management melarang All_in agar modal trading terus bertahan walau didera kerugian berturut-turut.'
  },
  {
    id: 'lq-4',
    question: 'Garis poros bagian tengah indikator teknikal Bollinger Bands dibentuk oleh perhitungan...',
    options: [
      'Nilai tertinggi dikurangi terendah.',
      'Volume tertimbang rata-rata (VWAP).',
      'Simple Moving Average (SMA) periode standar 20 hari.',
      'Eksponensial Moving Average trend 200 hari.'
    ],
    correctAnswerIdx: 2,
    explanation: 'Bollinger Bands memakai SMA 20 sebagai poros utama dibatasi oleh pita atas dan bawah senilai 2 kali deviasi standar (standard deviations).'
  },
  {
    id: 'lq-5',
    question: 'Konsep sinyal perpotongan "Golden Cross" pada MACD diartikan sebagai kesempatan...',
    options: [
      'Menjual seluruh unit karena rawan bangkrut mendadak.',
      'Peluang akumulasi beli karena sinyal akselerasi tren berubah optimis (Uptrend).',
      'Bursa akan menutup perdagangan sementara waktu.',
      'Emiten menderita denda OJK dari keterlambatan administrasi.'
    ],
    correctAnswerIdx: 1,
    explanation: 'MACD Golden Cross terjadi saat garis MACD memotong ke atas garis sinyal (Signal Line), menandakan lahirnya momentum bullish baru.'
  },
  {
    id: 'lq-6',
    question: 'Trader profesional membatasi level kerugian cepat demi melindungi psikologis dan sisa kas dinilai tindakan...',
    options: [
      'Greed Bias',
      'Dollar Cost Averaging',
      'Haka Massal',
      'Stop Loss (Cut Loss)'
    ],
    correctAnswerIdx: 3,
    explanation: 'Stop Loss membatasi porsi kerugian sedari dini sebelum modal tersedot jatuh terlalu dalam pada saham berkinerja buruk.'
  },
  {
    id: 'lq-7',
    question: 'Istilah akumulasi saham dalam bursa efek berpadanan dengan...',
    options: [
      'Broker besar/Institusi perlahan mengumpulkan lembar saham beredar dari ritel di harga murah berkala.',
      'Menjual cepat seluruh saham karena panik luar negeri.',
      'Aksi emiten membagikan deviden saham gratis cuma-cuma.',
      'Sanksi suspensi harian akibat manipulasi harga.'
    ],
    correctAnswerIdx: 0,
    explanation: 'Akumulasi adalah fase pengumpulan modal kelayakan oleh pilar pilar investor raksasa (Smart money) di area lembah harga yang murah.'
  },
  {
    id: 'lq-8',
    question: 'Formasi kandil "Hammer" yang terbentuk sempurna setelah koreksi kejatuhan panjang mengindikasikan...',
    options: [
      'Market akan melanjutkan tren longsor tanpa rem.',
      'Potensi pembalikan arah kembali bersinar optimis (Bullish Reversal).',
      'Saham tersebut akan segera keluar dari keanggotaan indeks bursa.',
      'Dividen emiten bernilai nol rupiah.'
    ],
    correctAnswerIdx: 1,
    explanation: 'Hammer berwujud ekor bawah masif di area support menunjuki kekuatan tolak beli yang dominan mengalahkan tekanan jual.'
  },
  {
    id: 'lq-9',
    question: 'Rights Issue bermakna emiten menambahkan porsi saham beredar baru demi mencari pendanaan segar, hak pemegang saham lama disebut...',
    options: [
      'Warrent Sertifikat Bebas Pajak',
      'HMETD (Hak Memesan Efek Terlebih Dahulu)',
      'Dividen Saham Berbonus Ekstra',
      'Kupon Saham Publikasi Terbuka'
    ],
    correctAnswerIdx: 1,
    explanation: 'HMETD menjamin agar porsi saham kepemilikan Anda tidak terdilusi menurun dengan memberi hak menebus saham baru pertama kali.'
  },
  {
    id: 'lq-10',
    question: 'Kepanjangan dari bias kecemasan FOMO di industri retail merujuk kepada...',
    options: [
      'Fear of Missing Out, takut dicap tertinggal arus kekayaan cepat orang lain.',
      'Focus of Market Optimization, fokus alokasi laba bersih.',
      'Financial Order Market Operator, operator pelelangan saham.',
      'Free Option Multiplier Optimization.'
    ],
    correctAnswerIdx: 0,
    explanation: 'FOMO merusak kestabilan emosi psikologi karena memicu hasrat membeli tanpa rasio riset matang di puncak gelembung harga saham.'
  }
];

export default function EdukasiWidget() {
  const [activeSegment, setActiveSegment] = useState<'paths' | 'calculator' | 'glossary' | 'quiz'>('paths');
  
  // Progress tracker state
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  
  // 1. Learning path states
  const [activePathId, setActivePathId] = useState<'pemula' | 'menengah' | 'lanjutan'>('pemula');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // 2. Calculator state indicators
  const [modalAwal, setModalAwal] = useState<number>(10000000); // Rp10.000.000 base
  const [tambahanBulanan, setTambahanBulanan] = useState<number>(1000000); // Rp1.000.000 monthly
  const [estimasiYield, setEstimasiYield] = useState<number>(12); // 12% CAGR
  const [durasiTahun, setDurasiTahun] = useState<number>(10); // 10 years

  // 3. Glossary search state query
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('Semua');

  // 4. Quiz state play panel
  const [quizLevel, setQuizLevel] = useState<'pemula' | 'menengah' | 'lanjutan'>('pemula');
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userSelectedAnsIdx, setUserSelectedAnsIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [answeredHistory, setAnsweredHistory] = useState<{questionIdx: number, selected: number, isCorrect: boolean}[]>([]);

  // Load and sync completed path modules
  useEffect(() => {
    try {
      const persistedProgress = window.localStorage.getItem('sahampintar_completed_lessons');
      if (persistedProgress) {
        setCompletedTopicIds(JSON.parse(persistedProgress));
      }
    } catch (e) {
      console.warn('Gagal memuat progress pembelajaran lokal', e);
    }
  }, []);

  const handleToggleCompleteLesson = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let next: string[];
    if (completedTopicIds.includes(topicId)) {
      next = completedTopicIds.filter(id => id !== topicId);
    } else {
      next = [...completedTopicIds, topicId];
    }
    setCompletedTopicIds(next);
    try {
      window.localStorage.setItem('sahampintar_completed_lessons', JSON.stringify(next));
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations: Total modules = 13 (5 pemula + 4 menengah + 4 lanjutan)
  const totalModulesCount = 13;
  const completedCount = completedTopicIds.length;
  const progressPercent = Math.round((completedCount / totalModulesCount) * 100);

  // Active path selection node
  const activePath = useMemo(() => {
    return LEARNING_PATHS.find(p => p.id === activePathId) || LEARNING_PATHS[0];
  }, [activePathId]);

  // Dictionary computation filtration
  const filteredGlossary = useMemo(() => {
    return GLOSSARY_DB.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                            item.definition.toLowerCase().includes(glossarySearch.toLowerCase());
      const matchesCategory = glossaryCategory === 'Semua' || item.category === glossaryCategory;
      return matchesSearch && matchesCategory;
    });
  }, [glossarySearch, glossaryCategory]);

  // Quiz active question set selection
  const quizQuestions = useMemo(() => {
    if (quizLevel === 'pemula') return QUIZ_PEMULA;
    if (quizLevel === 'menengah') return QUIZ_MENENGAH;
    return QUIZ_LANJUTAN;
  }, [quizLevel]);

  // Compound growth computation path
  const compoundCalculation = useMemo(() => {
    let balance = modalAwal;
    let totalContribution = modalAwal;
    const monthlyRate = (estimasiYield / 100) / 12;
    const yearlyPoints: { year: number, totalContribution: number, finalValue: number, compoundGains: number }[] = [
      { year: 0, totalContribution: modalAwal, finalValue: modalAwal, compoundGains: 0 }
    ];

    for (let y = 1; y <= durasiTahun; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + tambahanBulanan;
        totalContribution += tambahanBulanan;
      }
      yearlyPoints.push({
        year: y,
        totalContribution: Math.round(totalContribution),
        finalValue: Math.round(balance),
        compoundGains: Math.max(0, Math.round(balance - totalContribution))
      });
    }

    return {
      points: yearlyPoints,
      totalInvestment: totalContribution,
      finalValue: Math.round(balance),
      totalEarnings: Math.max(0, Math.round(balance - totalContribution))
    };
  }, [modalAwal, tambahanBulanan, estimasiYield, durasiTahun]);

  // Format currency util
  const rupiahFormatter = (val: number) => {
    return 'Rp' + val.toLocaleString('id-ID');
  };

  // Interactive Quiz controllers actions
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setUserSelectedAnsIdx(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setAnsweredHistory([]);
  };

  const handleSelectQuizAns = (selectedIdx: number) => {
    if (userSelectedAnsIdx !== null) return; // cannot answer double times
    setUserSelectedAnsIdx(selectedIdx);
    
    // Check correctness
    const correctIdx = quizQuestions[currentQuestionIdx].correctAnswerIdx;
    const isCorrect = selectedIdx === correctIdx;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
    }

    setAnsweredHistory(prev => [
      ...prev,
      {
        questionIdx: currentQuestionIdx,
        selected: selectedIdx,
        isCorrect
      }
    ]);
  };

  const handleNextQuizQuestion = () => {
    setUserSelectedAnsIdx(null);
    if (currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div id="education-comprehensive-suite" className="space-y-6 text-left">
      
      {/* 1. HERO SECTION WITH ACCLAIMED DESIGN & DYNAMIC PROGRESS */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 filter blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/5 filter blur-3xl rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 items-center">
          
          {/* Main Title & Statement */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-emerald-500/10 text-saham-green rounded-xl">
                <BookOpen className="w-5.5 h-5.5" />
              </span>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-gray-900 dark:text-white leading-none">Belajar Saham dari Nol, Gratis</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Universitas Finansial SahamPintar</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-xl">
              Kurikulum berseri terstruktur buatan analis berpengalaman. Kuasai mekanika investasi, selidiki isi laporan keuangan emiten BEI, taksir rasio fundamental hingga lancar menganalisa grafik teknikal candlestick dari kenyamanan telapak tangan Anda.
            </p>

            {/* Quick stats indicators */}
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">
                <BrainCircuit className="w-3.5 h-3.5" />
                Ditinjau Praktisi Pasar
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Interaktif 100% Bebas Biaya
              </span>
            </div>
          </div>

          {/* DYNAMIC PROGRESS ACCUMULATION CONTAINER */}
          <div className="lg:col-span-1 p-5 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-850 rounded-2xl relative text-center">
            <h4 className="text-[11px] font-extrabold text-gray-450 dark:text-gray-400 uppercase tracking-widest leading-none mb-4 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-505 text-emerald-500" />
              Indikator Progress Belajar
            </h4>
            
            {/* Semicircular progress arc or full percentage layout */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <span className="text-4xl font-black text-emerald-500">{completedCount}</span>
                <span className="text-gray-400 text-sm font-bold">/ {totalModulesCount}</span>
                <span className="text-gray-405 font-bold text-xs ml-1.5 uppercase">Materi Selesai</span>
              </div>

              {/* Progress bar scale */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-450 font-bold uppercase mt-1">
                <span>Persentase: {progressPercent}%</span>
                <span>{progressPercent === 100 ? 'LULUS UTAMA!' : 'Maju Terus'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SEGMENT NAVIGATION BAR SECTORS */}
      <div className="flex bg-white dark:bg-[#1E1E1E] p-1.5 border border-gray-250 dark:border-gray-800 rounded-2xl select-none justify-between items-center gap-1 sm:gap-2 text-xs font-black">
        <button
          onClick={() => setActiveSegment('paths')}
          className={`flex-1 py-3 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'paths' 
              ? 'bg-[#1565C0] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Jalur Kurikulum</span>
        </button>
        <button
          onClick={() => setActiveSegment('calculator')}
          className={`flex-1 py-3 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'calculator' 
              ? 'bg-[#1565C0] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="hidden sm:inline">Kalkulator Investasi</span>
        </button>
        <button
          onClick={() => setActiveSegment('glossary')}
          className={`flex-1 py-3 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'glossary' 
              ? 'bg-[#1565C0] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Glosarium Saham (A-Z)</span>
        </button>
        <button
          onClick={() => {
            setActiveSegment('quiz');
            // reset quiz panel when switching
            setQuizStarted(false);
          }}
          className={`flex-1 py-3 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'quiz' 
              ? 'bg-[#1565C0] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span className="hidden sm:inline">Uji Kuis Saham</span>
        </button>
      </div>

      {/* =======================================================
          SEGMENT 1: LEARNING CURRICULUM PATHS WITH MULTIPLE EXPANDABLES
          ======================================================= */}
      {activeSegment === 'paths' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Path Column Links: Quick switcher list (Vertical) */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4">PULSA JALUR KURIKULUM:</span>
              
              <div className="space-y-2">
                {LEARNING_PATHS.map((pathItem) => {
                  const isActive = activePathId === pathItem.id;
                  const IconComp = pathItem.icon;
                  
                  // Compute completed modules for this specific path item category
                  const itemIds = pathItem.topics.map(t => t.id);
                  const itemsCompletedInThisCategory = completedTopicIds.filter(id => itemIds.includes(id)).length;

                  return (
                    <button
                      key={pathItem.id}
                      onClick={() => {
                        setActivePathId(pathItem.id);
                        setExpandedTopicId(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-[#1565C0]/10 border-[#1565C0] text-[#1565C0]' 
                          : 'border-gray-200 dark:border-gray-800 bg-transparent text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-xl ${isActive ? 'bg-[#1565C0]/15' : 'bg-gray-100 dark:bg-gray-900'}`}>
                          <IconComp className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="font-display font-black text-xs text-gray-900 dark:text-white leading-none mb-1 text-left">
                            {pathItem.id === 'pemula' ? 'Pemula (Basic)' : pathItem.id === 'menengah' ? 'Menengah' : 'Lanjutan (Expert)'}
                          </h4>
                          <span className="text-[9px] text-gray-400 font-bold block">
                            Tuntas: {itemsCompletedInThisCategory} dari {pathItem.topics.length} materi
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-405" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Coaching Tips widget under switcher */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-5 rounded-3xl space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saham-green text-emerald-500 animate-bounce" />
                <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Meta Panduan SahamPintar</h4>
              </div>
              <p className="text-[11px] text-gray-650 dark:text-gray-350 leading-relaxed font-bold">
                Tandai materi yang selesai Anda baca dengan mengeklik tombol <span className="text-emerald-500">✔ Selesai Dibaca</span> di bagian paling bawah ulasan modul pembelajaran untuk mengepul status saku level Anda!
              </p>
            </div>
          </div>

          {/* Core materials details feed list (Right 2 cols) */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Header detail */}
            <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-850">
              <span className="font-semibold uppercase tracking-wider">{activePath.badge}</span>
              <p className="font-semibold font-mono">Total {activePath.topics.length} Materi Pembahasan</p>
            </div>

            <div className="space-y-4">
              {activePath.topics.map((topic, tIdx) => {
                const isExpanded = expandedTopicId === topic.id;
                const isLessonComplete = completedTopicIds.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className={`bg-white dark:bg-[#1E1E1E] border hover:border-gray-300 dark:hover:border-gray-700/60 transition rounded-3xl p-5 shadow-sm text-left cursor-pointer overflow-hidden relative ${
                      isExpanded 
                        ? 'border-[#1565C0] shadow-md' 
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    
                    {/* Top sub-info header metrics */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider text-left">
                        <span className="p-1 font-mono px-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
                          Modul {tIdx + 1}
                        </span>
                        <span>•</span>
                        <span>{topic.readTime}</span>
                      </div>

                      {/* Completion status checkbox bubble */}
                      <button 
                        onClick={(e) => handleToggleCompleteLesson(topic.id, e)}
                        className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition ${
                          isLessonComplete 
                            ? 'bg-emerald-500/10 text-saham-green border-emerald-500/30' 
                            : 'bg-gray-50 dark:bg-gray-950 text-gray-400 border-gray-205 dark:border-gray-850 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {isLessonComplete && <Check className="w-3 h-3" />}
                          {isLessonComplete ? 'SELESAI' : 'TANDAI SELESAI'}
                        </span>
                      </button>
                    </div>

                    {/* Topic Name */}
                    <h4 className="font-display font-black text-sm text-gray-950 dark:text-white leading-tight">
                      {topic.title}
                    </h4>

                    {/* Short one-liner intro preview */}
                    {!isExpanded && (
                      <p className="text-xs text-gray-450 dark:text-gray-400 mt-2 font-semibold">
                        {topic.description}
                      </p>
                    )}

                    {/* Highly Expanded details content view */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-850 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold transition"
                        onClick={(e) => e.stopPropagation()} // halt bubbling toggle clicks inside block
                      >
                        <p className="whitespace-pre-line bg-gray-50 dark:bg-gray-950 p-4.5 border border-gray-150 dark:border-gray-850/60 rounded-2xl shadow-inner text-gray-800 dark:text-gray-300 font-bold leading-relaxed">
                          {topic.content}
                        </p>

                        {/* Interactive toggle bookmark option within opened block */}
                        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-semibold">Tandai telah membaca materi modul ini:</span>
                          
                          <button
                            onClick={(e) => handleToggleCompleteLesson(topic.id, e)}
                            className={`px-3 py-1.5 text-xs font-black rounded-xl transition border flex items-center gap-1.5 ${
                              isLessonComplete 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-[#1565C0] border-[#1565C0] text-white hover:bg-[#1565C0]/90'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            <span>{isLessonComplete ? 'Selesai Dibaca (Batalkan)' : 'Tandai Selesai Dibaca'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Switch helper instructions caption */}
                    {!isExpanded && (
                      <span className="text-[10px] text-[#1565C0] font-black uppercase tracking-wider block mt-3 select-none flex items-center gap-1">
                        Ketuk ulasan untuk membaca panduan lengap <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* =======================================================
          SEGMENT 2: CALKULATOR COMPOUND INTEREST RECURRING
          ======================================================= */}
      {activeSegment === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Controls settings parameters inputs panel (Left 1 col) */}
          <div className="lg:col-span-1 bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-850/60">
              <Calculator className="w-4 h-4 text-[#1565C0]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Parameter Simulasi Bunga Berbunga</h3>
            </div>

            {/* Input 1: Modal Awal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                Modal Awal Investasi (Rp):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 text-xs font-bold text-gray-400 flex items-center pointer-events-none">Rp</span>
                <input
                  type="number"
                  value={modalAwal}
                  onChange={(e) => setModalAwal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 text-xs font-bold font-mono text-gray-900 dark:text-white rounded-xl focus:border-[#1565C0] outline-none transition"
                />
              </div>
              <p className="text-[10px] text-gray-400 italic">Ex: Modal dingin awal penempatan tabungan SID</p>
            </div>

            {/* Input 2: Tambahan Bulanan */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                Alokasi Top-up / Bulan (Rp):
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 text-xs font-bold text-gray-400 flex items-center pointer-events-none">Rp</span>
                <input
                  type="number"
                  value={tambahanBulanan}
                  onChange={(e) => setTambahanBulanan(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 text-xs font-bold font-mono text-gray-900 dark:text-white rounded-xl focus:border-[#1565C0] outline-none transition"
                />
              </div>
              <p className="text-[10px] text-gray-400 italic">Disiplin DCA berkala menyisihkan gaji bulanan</p>
            </div>

            {/* Input 3: Estimasi yield */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-gray-400">Estimasi Return (% per Tahun):</span>
                <strong className="text-[#1565C0] font-mono">{estimasiYield}% CAGR</strong>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="1"
                value={estimasiYield}
                onChange={(e) => setEstimasiYield(parseInt(e.target.value))}
                className="w-full accent-[#1565C0] bg-gray-200 dark:bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-450 font-semibold uppercase">
                <span>Reksadana (5%)</span>
                <span>IHSG BEI (12%)</span>
                <span>Agresif (20%+)</span>
              </div>
            </div>

            {/* Input 4: Durasi tahun */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-gray-400">Horison Waktu (Durasi):</span>
                <strong className="text-[#1565C0] font-mono">{durasiTahun} Tahun</strong>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={durasiTahun}
                onChange={(e) => setDurasiTahun(parseInt(e.target.value))}
                className="w-full accent-[#1565C0] bg-gray-200 dark:bg-gray-850 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-450 font-semibold uppercase">
                <span>1 Thn</span>
                <span>15 Thn</span>
                <span>30 Thn</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-850/60 flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-semibold">Perhitungan: Bulanan (Compounded)</span>
              <button 
                onClick={() => {
                  setModalAwal(10000000);
                  setTambahanBulanan(1000000);
                  setEstimasiYield(12);
                  setDurasiTahun(10);
                }}
                className="text-rose-500 hover:underline font-bold"
              >
                Set Default
              </button>
            </div>

          </div>

          {/* Outputs visualization & dynamic Year analysis matrix (Right 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bento results display card indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl text-left">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Modal Disetor</span>
                <p className="text-base font-mono font-black text-gray-900 dark:text-white mt-1">
                  {rupiahFormatter(compoundCalculation.totalInvestment)}
                </p>
                <span className="text-[9px] text-gray-400 block mt-1 font-semibold">Akumulasi saku setoran dingin</span>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-left">
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Hasil Bunga Berbunga</span>
                <p className="text-base font-mono font-black text-emerald-500 mt-1">
                  {rupiahFormatter(compoundCalculation.totalEarnings)}
                </p>
                <span className="text-[9px] text-emerald-600/70 dark:text-emerald-400/60 block mt-1 font-semibold">Net profit deviasi bunga</span>
              </div>

              <div className="p-4 bg-[#1565C0]/10 border border-[#1565C0]/20 rounded-3xl text-left">
                <span className="text-[9px] text-[#1565C0] dark:text-blue-400 font-bold uppercase tracking-wider block">Proyeksi Akhir Aset</span>
                <p className="text-base font-mono font-black text-[#1565C0] dark:text-blue-400 mt-1">
                  {rupiahFormatter(compoundCalculation.finalValue)}
                </p>
                <span className="text-[9px] text-[#1565C0]/70 dark:text-blue-400/60 block mt-1 font-semibold">Total dana pensiun terakumulasi</span>
              </div>

            </div>

            {/* SVG Visual compared Growth area line chart */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4">Grafik Pertumbuhan Portofolio (Tahun ke Tahun)</span>

              <div className="w-full aspect-[2.4/1] bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-850 rounded-2xl relative p-4 flex items-end justify-between overflow-hidden">
                
                {/* Simulated vertical coordinates markers lines */}
                <div className="absolute left-[30px] right-[30px] top-[20%] border-t border-gray-150 dark:border-gray-850/40 border-dashed pointer-events-none" />
                <div className="absolute left-[30px] right-[30px] top-[50%] border-t border-gray-150 dark:border-gray-850/40 border-dashed pointer-events-none" />
                <div className="absolute left-[30px] right-[30px] top-[80%] border-t border-gray-150 dark:border-gray-850/40 border-dashed pointer-events-none" />

                {/* SVG Polyline calculations */}
                <svg className="absolute inset-0 w-full h-full p-4.5 box-border" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Find max value in points */}
                  {(() => {
                    const maxVal = compoundCalculation.finalValue || 1;
                    const pointsCount = compoundCalculation.points.length;
                    
                    // Construct string coords for contribution line
                    const contribCoords = compoundCalculation.points.map((pt, idx) => {
                      const x = (idx / (pointsCount - 1)) * 100;
                      const y = 100 - (pt.totalContribution / maxVal) * 100;
                      return `${x},${y}`;
                    }).join(' ');

                    // Construct string coords for accumulated growth wealth line
                    const wealthCoords = compoundCalculation.points.map((pt, idx) => {
                      const x = (idx / (pointsCount - 1)) * 100;
                      const y = 100 - (pt.finalValue / maxVal) * 100;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <defs>
                          <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1565C0" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#1565C0" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Fills areas */}
                        <path d={`M 0,100 L ${wealthCoords} L 100,100 Z`} fill="url(#wealthGrad)" />
                        <path d={`M 0,100 L ${contribCoords} L 100,100 Z`} fill="url(#contribGrad)" />

                        {/* Contribution line in gray */}
                        <polyline points={contribCoords} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
                        
                        {/* Wealth compound line overlay in thick blue */}
                        <polyline points={wealthCoords} fill="none" stroke="#1565C0" strokeWidth="3" />
                      </>
                    );
                  })()}
                </svg>

                {/* Left vertical stats coordinates annotation tag */}
                <div className="absolute top-2 right-4 bg-white/70 dark:bg-gray-950/70 px-2 py-1 rounded-lg text-[9px] text-gray-400 font-mono font-bold space-y-0.5 border border-gray-200 dark:border-gray-850">
                  <p className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#1565C0]" /> Total Nilai Aset</p>
                  <p className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-gray-400 stroke-dasharray-[3,3]" /> Modal Kumulatif</p>
                </div>

                {/* Display dots markers for Years */}
                <div className="w-full flex justify-between relative z-10 text-[9px] text-gray-400 font-mono font-bold transform translate-y-3.5 px-1.5">
                  <span>Mulai</span>
                  <span>Th {Math.round(durasiTahun / 2)}</span>
                  <span>Th {durasiTahun}</span>
                </div>

              </div>
            </div>

            {/* Tabular year breakdown sheet */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm overflow-x-auto text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-3">Tabel Breakdown Realisasi Keuangan Tahunan</span>

              <table className="w-full text-xs text-left border-collapse font-bold">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 text-[10px] font-mono border-b border-gray-150 dark:border-gray-850">
                    <th className="p-2.5">Waktu</th>
                    <th className="p-2.5">Modal Setor</th>
                    <th className="p-2.5">Profit Bunga</th>
                    <th className="p-2.5 text-right">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-850/60 text-gray-800 dark:text-gray-300">
                  {compoundCalculation.points.filter((pt, i) => i === 0 || i === 1 || i === Math.round(durasiTahun/2) || i === durasiTahun).map((pt, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 font-mono">
                      <td className="p-2.5 text-gray-950 dark:text-white font-sans font-black">Tahun ke-{pt.year}</td>
                      <td className="p-2.5">{rupiahFormatter(pt.totalContribution)}</td>
                      <td className="p-2.5 text-emerald-500">+{rupiahFormatter(pt.compoundGains)}</td>
                      <td className="p-2.5 text-right text-[#1565C0] dark:text-blue-400">{rupiahFormatter(pt.finalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* =======================================================
          SEGMENT 3: GLOSARIUM ISTILAH SAHAM BEI A-Z WITH SEARCH
          ======================================================= */}
      {activeSegment === 'glossary' && (
        <div className="space-y-6">
          
          {/* Filters and search box control panel */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            
            {/* Input search box */}
            <div className="md:col-span-2 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari istilah penting bursa (ex: ARA, Blue Chip, PER)..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 placeholder-gray-450 text-xs font-bold font-sans text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:border-[#1565C0] outline-none transition"
              />
            </div>

            {/* Droplist Category */}
            <div className="md:col-span-1 flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase block flex-shrink-0">Kategori</span>
              <select
                value={glossaryCategory}
                onChange={(e) => setGlossaryCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 text-xs font-bold text-gray-900 dark:text-white rounded-xl px-3 py-2.5 cursor-pointer focus:border-[#1565C0] outline-none"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Fundamental">Fundamental Emiten</option>
                <option value="Teknikal">Teknikal Grafik</option>
                <option value="Aksi Korporasi">Aksi Korporasi</option>
                <option value="Regulasi">Konsep Regulasi BEI</option>
              </select>
            </div>

          </div>

          {/* Glosarium Lists View Sheet */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-855 text-xs text-gray-400 font-semibold">
              <p>Menampilkan <strong className="text-gray-900 dark:text-white font-mono">{filteredGlossary.length}</strong> istilah terdefinisi otomatis</p>
              <span className="text-[10px] uppercase">Glosarium Saham Pintar A-Z</span>
            </div>

            {filteredGlossary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {filteredGlossary.map((g, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-800 rounded-2xl flex flex-col justify-between transition group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="font-sans font-black text-xs text-gray-950 dark:text-white transition group-hover:text-[#1565C0]">
                          {g.term}
                        </h4>
                        <span className="text-[8px] font-extrabold uppercase bg-[#1565C0]/10 text-[#1565C0] border border-[#1565C0]/20 px-1.5 py-0.2 rounded">
                          {g.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-450 dark:text-gray-400 font-semibold leading-relaxed">
                        {g.definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 space-y-2">
                <BadgeAlert className="w-8 h-8 text-gray-300 dark:text-gray-800 mx-auto" />
                <p className="text-xs font-semibold">Tidak ditemukan istilah saham bursa efek yang cocok.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =======================================================
          SEGMENT 4: INTERACTIVE 10-QUESTION IQ STOCK QUIZ
          ======================================================= */}
      {activeSegment === 'quiz' && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm text-left">
          
          {/* Main Entry selection screen if quiz not yet started */}
          {!quizStarted ? (
            <div className="max-w-xl mx-auto text-center p-6 space-y-6">
              <div className="w-16 h-16 bg-[#1565C0]/10 text-[#1565C0] rounded-2xl flex items-center justify-center mx-auto border border-[#1565C0]/20">
                <BrainCircuit className="w-8 h-8 text-[#1565C0] animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-base sm:text-lg text-gray-900 dark:text-white">Uji Skor IQ Saham & Kuis Pintar</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Tantang pemahaman finansial Anda lewat 10 butir ujian interaktif terlokalisasi BEI. Dapatkan ulasan materi komprehensif di akhir penginputan.
                </p>
              </div>

              {/* Quiz level select options */}
              <div className="grid grid-cols-3 gap-2 w-full font-bold">
                {(['pemula', 'menengah', 'lanjutan'] as const).map(lvl => {
                  const isActive = quizLevel === lvl;
                  let activeTheme = '';
                  if (lvl === 'pemula') activeTheme = 'bg-emerald-500 text-white';
                  if (lvl === 'menengah') activeTheme = 'bg-blue-600 text-white';
                  if (lvl === 'lanjutan') activeTheme = 'bg-purple-600 text-white';

                  return (
                    <button
                      key={lvl}
                      onClick={() => setQuizLevel(lvl)}
                      className={`py-2 px-3.5 text-[11px] rounded-xl border text-center transition cursor-pointer font-bold ${
                        isActive 
                          ? activeTheme
                          : 'border-gray-200 dark:border-gray-805 text-gray-400 bg-transparent hover:border-gray-300'
                      }`}
                    >
                      {lvl === 'pemula' ? 'Basic (Pemula)' : lvl === 'menengah' ? 'Inter-level' : 'Lanjutan (Expert)'}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1565C0] hover:bg-[#1565C0]/90 text-white text-xs font-black rounded-xl transition shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Mulai Kuis Cerdas Sekarang
                </button>
              </div>
            </div>
          ) : (
            // Quiz gameplay container
            <div className="space-y-6">
              
              {/* Header stats status question index */}
              {!quizCompleted ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-850/60 text-xs text-gray-400 font-semibold">
                    <span className="uppercase font-bold text-[#1565C0]">Uji Level: {quizLevel}</span>
                    <span className="font-mono">Soal nomor <strong>{currentQuestionIdx + 1}</strong> dari <strong>{quizQuestions.length}</strong></span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#1565C0] rounded-full transition-all"
                      style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-4 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PERTANYAAN:</span>
                    <h4 className="font-sans font-black text-xs sm:text-sm text-gray-950 dark:text-white leading-relaxed">
                      {quizQuestions[currentQuestionIdx].question}
                    </h4>
                  </div>

                  {/* Options items */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                      const isChosen = userSelectedAnsIdx === oIdx;
                      const isCorrectAnswer = oIdx === quizQuestions[currentQuestionIdx].correctAnswerIdx;
                      const isAnswerRevealed = userSelectedAnsIdx !== null;

                      let btnStyle = 'border-gray-200 dark:border-gray-805 hover:border-gray-300 dark:hover:border-gray-700 bg-transparent';
                      
                      if (isAnswerRevealed) {
                        if (isCorrectAnswer) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-500';
                        } else if (isChosen) {
                          btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-500';
                        } else {
                          btnStyle = 'border-gray-200 dark:border-gray-850 opacity-40';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizAns(oIdx)}
                          className={`w-full p-4.5 rounded-2xl border text-left text-xs font-semibold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isAnswerRevealed && isCorrectAnswer && <Check className="w-4 h-4 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer feedback annotation */}
                  {userSelectedAnsIdx !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-850 rounded-2xl space-y-1.5"
                    >
                      <span className="text-[10px] text-[#1565C0] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        Anotasi Pembahasan Penahiy:
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">{quizQuestions[currentQuestionIdx].explanation}</p>
                      
                      <div className="pt-2">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-4 py-2 bg-[#1565C0] text-white text-[11px] font-black rounded-lg hover:bg-[#1565C0]/90 transition shadow cursor-pointer uppercase tracking-wider"
                        >
                          {currentQuestionIdx + 1 === quizQuestions.length ? 'Lihat Hasil Akhir' : 'Lanjut Kuis'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                // Quiz end scoreboard
                <div className="max-w-md mx-auto text-center space-y-6 py-6">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-black text-base sm:text-lg text-gray-905 dark:text-white leading-none">Hasil IQ Saham Anda</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Level uji: {quizLevel}</span>
                  </div>

                  {/* Core Scoring circle badge */}
                  <div className="p-6 bg-gray-550 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850/60 rounded-3xl">
                    <span className="text-5xl font-mono font-black text-emerald-500 block">{quizScore} / 100</span>
                    <span className="text-xs text-gray-550 dark:text-gray-400 mt-2 block font-bold">
                      {quizScore >= 80 ? '🎖️ SANGAT CERDAS - Siap Mandiri Trading!' 
                       : quizScore >= 50 ? '🥈 CUKUP BAIK - Terus tingkatkan kurikulum!' 
                       : '🥉 BELAJAR LAGI - Disarankan mengulang Jalur Pemula.'}
                    </span>
                  </div>

                  <div className="flex gap-2.5 font-bold">
                    <button
                      onClick={handleStartQuiz}
                      className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-205 dark:border-gray-805 text-xs font-black hover:bg-gray-100 transition cursor-pointer"
                    >
                      Ulangi Level Ini
                    </button>
                    <button
                      onClick={() => setQuizStarted(false)}
                      className="flex-1 py-2.5 bg-[#1565C0] text-white rounded-xl text-xs font-black hover:bg-[#1565C0]/90 transition shadow-md cursor-pointer"
                    >
                      Kembali Pilih Level
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* FOOTER PLEDGE ACTION BUTTON AT BOTTOM */}
      <div className="bg-gradient-to-r from-[#1565C0]/10 to-blue-500/10 border border-blue-500/15 p-4 rounded-3xl flex items-center justify-between flex-wrap gap-4 text-left">
        <div className="flex items-center gap-3">
          <BookMarked className="w-6 h-6 text-[#1565C0] flex-shrink-0" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-wide leading-none">Butuh Panduan Terstruktur Lainnya?</h5>
            <p className="text-[11px] text-gray-400 leading-normal font-semibold">
              Kirimkan ulasan saran ke Penahiy Intel untuk materi baru yang Anda inginkan ditambahkan di kemudian hari.
            </p>
          </div>
        </div>

        <button className="px-3.5 py-1.8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[10px] uppercase shadow-sm transition cursor-pointer">
          Unduh E-Book Cetak Ringkas (PDF)
        </button>
      </div>

    </div>
  );
}
