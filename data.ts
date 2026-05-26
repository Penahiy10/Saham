/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketIndex, StockItem, BandarItem, NewsItem } from './types';

export const INITIAL_INDICES: MarketIndex[] = [
  { name: 'IHSG (Composite)', value: 6130.40, change: -76.34, changePercent: -1.23 },
  { name: 'LQ45', value: 910.95, change: -13.40, changePercent: -1.45 },
  { name: 'IDX30', value: 461.39, change: -6.73, changePercent: -1.44 },
];

export const INDONESIAN_STOCKS: StockItem[] = [
  { code: 'BBCA', name: 'Bank Central Asia Tbk', price: 9850, change: 150, changePercent: 1.55, volume: '48.2M', industry: 'Perbankan' },
  { code: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4780, change: 90, changePercent: 1.92, volume: '92.4M', industry: 'Perbankan' },
  { code: 'TLKM', name: 'Telkom Indonesia Tbk', price: 3420, change: -40, changePercent: -1.16, volume: '61.8M', industry: 'Telekomunikasi' },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 62, change: 3, changePercent: 5.08, volume: '1.2B', industry: 'Teknologi' },
  { code: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', price: 6100, change: 125, changePercent: 2.09, volume: '38.5M', industry: 'Perbankan' },
  { code: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 4950, change: 50, changePercent: 1.02, volume: '22.1M', industry: 'Perbankan' },
  { code: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 2840, change: -70, changePercent: -2.41, volume: '18.9M', industry: 'Pertambangan Batubara' },
  { code: 'ANTM', name: 'Aneka Tambang Tbk', price: 1515, change: -45, changePercent: -2.88, volume: '35.6M', industry: 'Pertambangan Logam' },
  { code: 'PGAS', name: 'Perusahaan Gas Negara Tbk', price: 1540, change: 15, changePercent: 0.98, volume: '14.2M', industry: 'Utilitas' },
  { code: 'PTBA', name: 'Bukit Asam Tbk', price: 2680, change: -30, changePercent: -1.11, volume: '9.8M', industry: 'Pertambangan Batubara' },
  { code: 'BRPT', name: 'Barito Pacific Tbk', price: 990, change: 75, changePercent: 8.20, volume: '112.5M', industry: 'Petrokimia' },
  { code: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2320, change: -20, changePercent: -0.85, volume: '11.5M', industry: 'Konsumsi Retail' },
  { code: 'KLBF', name: 'Kalbe Farma Tbk', price: 1560, change: 35, changePercent: 2.30, volume: '15.4M', industry: 'Farmasi' },
  { code: 'AMRT', name: 'Sumber Alfaria Trijaya Tbk', price: 2950, change: 10, changePercent: 0.34, volume: '8.4M', industry: 'Konsumsi Retail' },
  { code: 'ASII', name: 'Astra International Tbk', price: 4850, change: -120, changePercent: -2.41, volume: '27.3M', industry: 'Otomotif' },
  { code: 'MEDC', name: 'Medco Energi Internasional Tbk', price: 1210, change: 45, changePercent: 3.86, volume: '41.2M', industry: 'Minyak & Gas' },
  { code: 'BUKA', name: 'Bukalapak.com Tbk', price: 118, change: -4, changePercent: -3.28, volume: '34.8M', industry: 'Teknologi' },
  { code: 'INDF', name: 'Indofood Sukses Makmur Tbk', price: 6450, change: 100, changePercent: 1.57, volume: '5.2M', industry: 'Makanan & Minuman' },
  { code: 'ICBP', name: 'Indofood CBP Sukses Makmur Tbk', price: 11200, change: 150, changePercent: 1.36, volume: '6.1M', industry: 'Makanan & Minuman' },
  { code: 'HRUM', name: 'Harum Energy Tbk', price: 1225, change: -15, changePercent: -1.21, volume: '13.9M', industry: 'Pertambangan Batubara' },
  { code: 'MDKA', name: 'Merdeka Copper Gold Tbk', price: 2610, change: 10, changePercent: 0.38, volume: '24.1M', industry: 'Pertambangan Logam' },
  { code: 'HEAL', name: 'Medikaloka Hermina Tbk', price: 1320, change: 15, changePercent: 1.15, volume: '11.2M', industry: 'Kesehatan' },
  { code: 'ADES', name: 'Akasha Wira International Tbk', price: 8850, change: 250, changePercent: 2.91, volume: '1.4M', industry: 'Makanan & Minuman' },
  { code: 'MBMA', name: 'Merdeka Battery Materials Tbk', price: 540, change: -5, changePercent: -0.92, volume: '32.5M', industry: 'Pertambangan Logam' },
  { code: 'EXCL', name: 'XL Axiata Tbk', price: 2260, change: 30, changePercent: 1.35, volume: '18.4M', industry: 'Telekomunikasi' },
  { code: 'JSMR', name: 'Jasa Marga (Persero) Tbk', price: 5200, change: 125, changePercent: 2.47, volume: '7.8M', industry: 'Infrastruktur' },
  { code: 'SMGR', name: 'Semen Indonesia (Persero) Tbk', price: 3950, change: -70, changePercent: -1.74, volume: '9.2M', industry: 'Infrastruktur' },
  { code: 'INCO', name: 'Vale Indonesia Tbk', price: 3820, change: 10, changePercent: 0.26, volume: '14.5M', industry: 'Pertambangan Logam' },
  { code: 'BUMI', name: 'Bumi Resources Tbk', price: 112, change: 4, changePercent: 3.70, volume: '145.2M', industry: 'Pertambangan Batubara' },
  { code: 'CPIN', name: 'Charoen Pokphand Indonesia Tbk', price: 4950, change: 20, changePercent: 0.41, volume: '6.2M', industry: 'Agrikultur' },
  { code: 'BREN', name: 'Barito Renewables Energy Tbk', price: 7200, change: 325, changePercent: 4.73, volume: '25.6M', industry: 'Utilitas / Energi Hijau' },
  { code: 'CUAN', name: 'Petrindo Jaya Kreasi Tbk', price: 6800, change: 150, changePercent: 2.26, volume: '14.8M', industry: 'Energi / Tambang' },
  { code: 'UNTR', name: 'United Tractors Tbk', price: 24500, change: 400, changePercent: 1.66, volume: '4.9M', industry: 'Infrastruktur' },
  { code: 'ACES', name: 'Aspirasi Hidup Indonesia Tbk', price: 820, change: -10, changePercent: -1.20, volume: '16.5M', industry: 'Konsumsi Retail' },
  { code: 'SIDO', name: 'Industri Jamu dan Farmasi Sido Muncul Tbk', price: 615, change: 5, changePercent: 0.82, volume: '22.8M', industry: 'Farmasi' },
  { code: 'MYOR', name: 'Mayora Indah Tbk', price: 2450, change: 30, changePercent: 1.24, volume: '8.5M', industry: 'Makanan & Minuman' },
  { code: 'PWON', name: 'Pakuwon Jati Tbk', price: 412, change: -4, changePercent: -0.96, volume: '19.4M', industry: 'Properti / Real Estate' },
  { code: 'BSDE', name: 'Bumi Serpong Damai Tbk', price: 980, change: 15, changePercent: 1.55, volume: '12.6M', industry: 'Properti / Real Estate' },
  { code: 'FILM', name: 'MD Pictures Tbk', price: 3120, change: 80, changePercent: 2.63, volume: '4.8M', industry: 'Teknologi' }
];

export const TOP_GAINERS: StockItem[] = [
  { code: 'BRPT', name: 'Barito Pacific Tbk', price: 990, change: 75, changePercent: 8.20, volume: '112.5M', industry: 'Petrokimia' },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 62, change: 3, changePercent: 5.08, volume: '1.2B', industry: 'Teknologi' },
  { code: 'MEDC', name: 'Medco Energi Internasional Tbk', price: 1210, change: 45, changePercent: 3.86, volume: '41.2M', industry: 'Minyak & Gas' },
  { code: 'KLBF', name: 'Kalbe Farma Tbk', price: 1560, change: 35, changePercent: 2.30, volume: '15.4M', industry: 'Farmasi' },
  { code: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', price: 6100, change: 125, changePercent: 2.09, volume: '38.5M', industry: 'Perbankan' }
];

export const TOP_LOSERS: StockItem[] = [
  { code: 'BUKA', name: 'Bukalapak.com Tbk', price: 118, change: -4, changePercent: -3.28, volume: '34.8M', industry: 'Teknologi' },
  { code: 'ANTM', name: 'Aneka Tambang Tbk', price: 1515, change: -45, changePercent: -2.88, volume: '35.6M', industry: 'Pertambangan Logam' },
  { code: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 2840, change: -70, changePercent: -2.41, volume: '18.9M', industry: 'Pertambangan Batubara' },
  { code: 'ASII', name: 'Astra International Tbk', price: 4850, change: -120, changePercent: -2.41, volume: '27.3M', industry: 'Otomotif' },
  { code: 'TLKM', name: 'Telkom Indonesia Tbk', price: 3420, change: -40, changePercent: -1.16, volume: '61.8M', industry: 'Telekomunikasi' }
];

export const BANDAR_RADAR_DATA: BandarItem[] = [
  { code: 'BRPT', name: 'Barito Pacific Tbk', volumeRatio: 4.8, type: 'Akumulasi', strength: 'Sangat Kuat', netValue: '184.2B Net Buy' },
  { code: 'MEDC', name: 'Medco Energi Internasional Tbk', volumeRatio: 3.2, type: 'Akumulasi', strength: 'Kuat', netValue: '75.6B Net Buy' },
  { code: 'ANTM', name: 'Aneka Tambang Tbk', volumeRatio: 2.9, type: 'Distribusi', strength: 'Kuat', netValue: '91.3B Net Sell' },
];

export const NEWS_KILAT: NewsItem[] = [
  {
    id: 'news-1',
    time: '17:45 WIB',
    title: 'Asing Catatkan Net Buy Rp 850 Miliar di Saham Perbankan Big Cap, IHSG Ditutup Menguat',
    source: 'Penahiy News',
    sentiment: 'Positif',
    content: 'Investor asing kembali membanjiri pasar saham Indonesia dengan melakukan aksi beli bersih (net buy) mencapai Rp 850 miliar khusus di sektor keuangan perbankan besar. Saham-saham seperti BBCA, BMRI, dan BBRI menjadi incaran utama. Analis menilai kepercayaan investor global menguat menyusul laporan data makroekonomi domestik yang solid dengan inflasi terjaga di kisaran 2.1%.'
  },
  {
    id: 'news-2',
    time: '16:20 WIB',
    title: 'Grup Barito Melesat, Saham BRPT Catat Volume Transaksi Terbesar Pasca Ekspansi Energi Baru terbarukan',
    source: 'Emiten Monitor',
    sentiment: 'Positif',
    content: 'Saham PT Barito Pacific Tbk (BRPT) mengalami lonjakan transaksi volume lebih dari 4.8 kali lipat dari volume harian biasanya. Sentimen ini ditopang oleh pengumuman resmi perusahaan dalam komitmen pendanaan hijau senilai USD 350 juta untuk perluasan kapasitas pembangkit listrik tenaga panas bumi kelolaan anak usahanya. Indikasi akumulasi oleh broker asing terpantau masif.'
  },
  {
    id: 'news-3',
    time: '15:10 WIB',
    title: 'Harga Batubara Global Terkoreksi 3.5%, Saham ADRO dan PTBA Kompak Melemah',
    source: 'Dunia Tambang',
    sentiment: 'Negatif',
    content: 'Pelemahan permintaan musiman serta melimpahnya stok energi di Tiongkok memaksa harga kontrak berjangka batubara Newcastle terkoreksi tajam hingga 3.5% ke level USD 128 per ton. Fluktuasi ini langsung direspons negatif oleh pasar lokal dengan aksi ambil untung (profit taking) pada saham emiten batubara kelas berat seperti ADRO, PTBA, dan ITMG.'
  },
  {
    id: 'news-4',
    time: '14:30 WIB',
    title: 'Sinergi GoTo dan ByteDance Dorong Kenaikan Volume Belanja GTV, GOTO Parkir di Zona Hijau',
    source: 'TeknoFintech',
    sentiment: 'Positif',
    content: 'Kolaborasi integrasi sistem belanja TikTok Shop di e-commerce Tokopedia menunjukkan perkembangan volume transaksi kotor (GTV) yang melampaui estimasi kuartalan sebesar 15%. Saham GOTO merespons positif dengan ditutup menguat ke level Rp 62 per lembar saham diiringi aksi beli akumulatif broker domestik.'
  },
  {
    id: 'news-5',
    time: '13:05 WIB',
    title: 'Rapat Dewan Gubernur BI Pertahankan Suku Bunga Acuan BI-Rate Tetap di Level 6.25%',
    source: 'Makro Indonesia',
    sentiment: 'Netral',
    content: 'Bank Indonesia memutuskan untuk tetap mempertahankan BI-Rate di level 6.25% guna mengawal stabilitas nilai tukar Rupiah dari tekanan eksternal dan menjaga inflasi tetap berada dalam kisaran sasaran yang ditargetkan. Kebijakan ini dianggap netral karena telah diantisipasi sepenuhnya oleh para pelaku pasar finansial.'
  }
];

export const CORPORATE_CALENDAR = [
  { date: '25 Mei 2026', code: 'BBRI', event: 'RUPS Tahunan & Pengumuman Dividen Final' },
  { date: '26 Mei 2026', code: 'TLKM', event: 'Cum Date Dividen Tunai Rp124/Saham' },
  { date: '28 Mei 2026', code: 'ANTM', event: 'RUPS Luar Biasa (RUPSLB)' },
  { date: '01 Jun 2026', code: 'GOTO', event: 'Ex Date Dividen Saham Seri B' },
  { date: '03 Jun 2026', code: 'ADRO', event: 'Payment Date Dividen Interim K-2' },
  { date: '08 Jun 2026', code: 'KLBF', event: 'Cum Date Dividen Rp28/Saham' },
];

export const EDUCATIONAL_MODULES = [
  {
    title: 'Ayo Belajar: Membaca Broker Summary (Banderologi)',
    category: 'Banderologi',
    description: 'Bagaimana cara melacak jejak akumulasi bandar besar menggunakan data beli-jual harian.',
    readTime: '5 Menit Baca',
    level: 'Pemula',
    content: 'Analisa Banderologi berfokus pada melacak transaksi pelaku pasar besar (Market Makers/Bandar). Di Bursa Efek Indonesia, broker summary menunjukkan broker mana yang membeli (net buy) dan menjual (net sell) dalam frekuensi tinggi. Jika 3 broker teratas memborong lebih dari 50% seluruh saham beredar di hari itu sementara penjualnya tersebar ke puluhan broker ritel, pola ini disebut AKUMULASI, yang sering kali menjadi pemicu kenaikan harga berikutnya.'
  },
  {
    title: 'Apa itu Relative Strength Index (RSI)?',
    category: 'Teknikal',
    description: 'Mengidentifikasi kondisi jenuh beli (Overbought) dan jenuh jual (Oversold) untuk timing entri.',
    readTime: '4 Menit Baca',
    level: 'Pemula',
    content: 'RSI adalah indikator momentum dengan skala 0 hingga 100. Level di atas 70 umumnya menunjukkan kondisi Jenuh Beli (Overbought), mengindikasikan harga sudah naik terlalu cepat dan rentan terhadap aksi profit taking. Sebaliknya, level di bawah 30 menunjukkan Jenuh Jual (Oversold), di mana harga dinilai telah terkoreksi dalam dan berpotensi memicu technical rebound bagi para trader.'
  },
  {
    title: 'Mengenal Volume Spikes & Unusual Market Volume',
    category: 'Volume & Price Action',
    description: 'Pahami korelasi lonjakan volume dengan breakout harga yang valid.',
    readTime: '6 Menit Baca',
    level: 'Menengah',
    content: 'Sebuah tren naik yang sehat harus didukung oleh peningkatan volume. Apabila saham naik 5% namun volume-nya sangat tipis, kenaikan itu rawan berbalik arah (false breakout). Namun, jika harga naik diiringi volume transaksi yang melonjak hingga 3x atau 5x lipat rata-rata 20 hari sebelumnya (seperti Radar Bandar BRPT hari ini), itu menandakan partisipasi institusi besar dan kenaikan harga yang solid.'
  },
];
