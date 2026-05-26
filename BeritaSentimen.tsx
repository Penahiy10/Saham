/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  TrendingUp, 
  Filter, 
  Newspaper, 
  Calendar, 
  PieChart, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  ArrowUpDown, 
  Eye, 
  EyeOff, 
  Check, 
  Info, 
  AlertCircle,
  HelpCircle,
  Hash,
  Activity,
  Award,
  Globe,
  ChevronRight,
  Bookmark,
  Share2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define news structures
interface RobustNewsItem {
  id: string;
  time: string;
  date: string;
  title: string;
  source: string;
  sentiment: 'Positif' | 'Negatif' | 'Netral';
  sentimentScore: number; // 0 to 100 representing how strong the sentiment is
  content: string;
  sector: string;
  emitenCode: string; // Ticker code if relevant (or 'Makro')
  author: string;
  readTime: string;
}

// 14 Comprehensive Realistic Indonesian News Items
const COMPREHENSIVE_NEWS: RobustNewsItem[] = [
  {
    id: 'news-1',
    time: '17:45 WIB',
    date: 'Hari Ini',
    title: 'Asing Catatkan Net Buy Rp 850 Miliar di Saham Perbankan Big Cap, IHSG Ditutup Menguat',
    source: 'Penahiy Intel',
    sentiment: 'Positif',
    sentimentScore: 92,
    content: 'Investor asing kembali membanjiri pasar saham Indonesia dengan melakukan aksi beli bersih (net buy) mencapai Rp 850 miliar khusus di sektor keuangan perbankan besar. Saham-saham seperti BBCA, BMRI, dan BBRI menjadi incaran utama. Analis menilai kepercayaan investor global menguat menyusul laporan data makroekonomi domestik yang solid dengan inflasi terjaga di kisaran 2.1%.',
    sector: 'Perbankan',
    emitenCode: 'BBCA',
    author: 'Andi Wijaya',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-2',
    time: '16:20 WIB',
    date: 'Hari Ini',
    title: 'Grup Barito Melesat, Saham BRPT Catat Volume Transaksi Terbesar Pasca Ekspansi Energi Baru terbarukan',
    source: 'Emiten Monitor',
    sentiment: 'Positif',
    sentimentScore: 88,
    content: 'Saham PT Barito Pacific Tbk (BRPT) mengalami lonjakan transaksi volume lebih dari 4.8 kali lipat dari volume harian biasanya. Sentimen ini ditopang oleh pengumuman resmi perusahaan dalam komitmen pendanaan hijau senilai USD 350 juta untuk perluasan kapasitas pembangkit listrik tenaga panas bumi kelolaan anak usahanya. Indikasi akumulasi oleh broker asing terpantau masif.',
    sector: 'Petrokimia',
    emitenCode: 'BRPT',
    author: 'Dewi Lestari',
    readTime: '4 mnt baca'
  },
  {
    id: 'news-3',
    time: '15:10 WIB',
    date: 'Hari Ini',
    title: 'Harga Batubara Global Terkoreksi 3.5%, Saham ADRO dan PTBA Kompak Melemah',
    source: 'Dunia Tambang',
    sentiment: 'Negatif',
    sentimentScore: 84,
    content: 'Pelemahan permintaan musiman serta melimpahnya stok energi di Tiongkok memaksa harga kontrak berjangka batubara Newcastle terkoreksi tajam hingga 3.5% ke level USD 128 per ton. Fluktuasi ini langsung direspons negatif oleh pasar lokal dengan aksi ambil untung (profit taking) pada saham emiten batubara kelas berat seperti ADRO, PTBA, dan ITMG.',
    sector: 'Energi / Tambang',
    emitenCode: 'ADRO',
    author: 'Budi Santoso',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-4',
    time: '14:30 WIB',
    date: 'Hari Ini',
    title: 'Sinergi GoTo dan ByteDance Dorong Kenaikan Volume Belanja GTV, GOTO Parkir di Zona Hijau',
    source: 'TeknoFintech',
    sentiment: 'Positif',
    sentimentScore: 78,
    content: 'Kolaborasi integrasi sistem belanja TikTok Shop di e-commerce Tokopedia menunjukkan perkembangan volume transaksi kotor (GTV) yang melampaui estimasi kuartalan sebesar 15%. Saham GOTO merespons positif dengan ditutup menguat ke level Rp 62 per lembar saham diiringi aksi beli akumulatif broker domestik.',
    sector: 'Teknologi',
    emitenCode: 'GOTO',
    author: 'Ryan Pratama',
    readTime: '2 mnt baca'
  },
  {
    id: 'news-5',
    time: '13:05 WIB',
    date: 'Hari Ini',
    title: 'Rapat Dewan Gubernur BI Pertahankan Suku Bunga Acuan BI-Rate Tetap di Level 6.25%',
    source: 'Makro Indonesia',
    sentiment: 'Netral',
    sentimentScore: 50,
    content: 'Bank Indonesia memutuskan untuk tetap mempertahankan BI-Rate di level 6.25% guna mengawal stabilitas nilai tukar Rupiah dari tekanan eksternal dan menjaga inflasi tetap berada dalam kisaran sasaran yang ditargetkan. Kebijakan ini dianggap netral karena telah diantisipasi sepenuhnya oleh para pelaku pasar finansial.',
    sector: 'Utilitas',
    emitenCode: 'Semua',
    author: 'Indra Hermawan',
    readTime: '5 mnt baca'
  },
  {
    id: 'news-6',
    time: '10:15 WIB',
    date: 'Hari Ini',
    title: 'Unilever Indonesia (UNVR) Catatkan Pemulihan Margin Keuntungan Sebesar 4.2% di Kuartal Pertama',
    source: 'Konsumsi Insight',
    sentiment: 'Positif',
    sentimentScore: 72,
    content: 'PT Unilever Indonesia Tbk (UNVR) mencatatkan tingkat efisiensi yang membaik dengan penghematan rantai distribusi bahan baku utama. Hal ini memulihkan margin kotor korporasi sebesar 420 basis poin ke level 49%. Sentimen ini mereda kekhawatiran pelaku pasar akan penurunan dominasi pangsa pasar UNVR di segmen ritel cepat.',
    sector: 'Konsumsi Retail',
    emitenCode: 'UNVR',
    author: 'Siti Rahma',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-7',
    time: '09:00 WIB',
    date: 'Kemarin',
    title: 'Laba Bersih Telkom Tumbuh Tipis 1.5% YoY, Perseroan Siapkan Capex Infrastruktur Serat Optik',
    source: 'Sinyal Digital Area',
    sentiment: 'Netral',
    sentimentScore: 52,
    content: 'Sektor jasa telekomunikasi pelat merah PT Telkom Indonesia Tbk (TLKM) membukukan perolehan laba tahun berjalan berjalan melambat di angka 1.5% secara tahunan (YoY). Capex dianggarkan secara matang untuk mematangkan infrastruktur kabel laut bawah tanah dan data center masa depan perseroan demi memenangkan konstelasi pasar 5G.',
    sector: 'Telekomunikasi',
    emitenCode: 'TLKM',
    author: 'Andi Wijaya',
    readTime: '4 mnt baca'
  },
  {
    id: 'news-8',
    time: '16:45 WIB',
    date: 'Kemarin',
    title: 'Aneka Tambang (ANTM) Alami Penurunan Laba Bersih 11% Akibat Volatilitas Eksternal Komoditas Nikel',
    source: 'Logam Mulia News',
    sentiment: 'Negatif',
    sentimentScore: 75,
    content: 'Rilis kinerja keuangan ANTM menunjukkan penurunan laba akibat tertekannya rata-rata harga jual nikel mentah global seiring melimpahnya pasokan smelter dari wilayah lain. Kendati demikian, kinerja anak usaha logam mulia emas tetap kokoh mendukung ketahanan aset jangka panjang emiten.',
    sector: 'Energi / Tambang',
    emitenCode: 'ANTM',
    author: 'Fajar Nugraha',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-9',
    time: '14:15 WIB',
    date: 'Kemarin',
    title: 'Medco Energi (MEDC) Raih Kontrak Eksplorasi Gas Lepas Pantai Baru Senilai USD 120 Juta',
    source: 'Indo Oil & Gas',
    sentiment: 'Positif',
    sentimentScore: 85,
    content: 'PT Medco Energi Internasional Tbk (MEDC) memenangkan tender konsesi blok lepas wilayah maritim utara. Proyeksi produksi gas harian diperkirakan meningkat dramatis mulai kuartal ke-4 tahun depan, memberikan suntikan estimasi pendapatan berulang (recurring income) yang kuat bagi korporasi.',
    sector: 'Energi / Tambang',
    emitenCode: 'MEDC',
    author: 'Budi Santoso',
    readTime: '4 mnt baca'
  },
  {
    id: 'news-10',
    time: '11:00 WIB',
    date: 'Kemarin',
    title: 'Bukalapak (BUKA) Luruskan Penyesuaian Strategi Bisnis Baru, Estimasi Beban R&D Direvisi Turun',
    source: 'Startup Trends',
    sentiment: 'Negatif',
    sentimentScore: 68,
    content: 'Manajemen Bukalapak.com mengungkapkan rencana restrukturisasi kecil untuk divisi produk di luar lini inti digital. Sinergi ini mengindikasikan prospek profitabilitas operasional jangka pendek yang menantang namun dinilai baik untuk melindungi tumpukan kas kas internal yang masih tebal.',
    sector: 'Teknologi',
    emitenCode: 'BUKA',
    author: 'Ryan Pratama',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-11',
    time: '09:20 WIB',
    date: '3 Hari Lalu',
    title: 'Semen Indonesia (SMGR) Hadapi Tekanan Margin Akibat Volatilitas Biaya Bahan Bakar Energi',
    source: 'Sinergi Industri',
    sentiment: 'Negatif',
    sentimentScore: 70,
    content: 'Tingginya rata-rata harga energi domestik menggerus laba kotor Semen Indonesia karena ketergantungan proses pembakaran kiln yang intensif energi batubara. Manajemen merencanakan adopsi pemanfaatan bahan bakar alternatif dari limbah industri (RDF) hingga 15% guna memperbaiki struktur biaya tahun ini.',
    sector: 'Infrastruktur & Tol',
    emitenCode: 'SMGR',
    author: 'Siti Rahma',
    readTime: '4 mnt baca'
  },
  {
    id: 'news-12',
    time: '15:10 WIB',
    date: '3 Hari Lalu',
    title: 'Minimarket Sumber Alfaria (AMRT) Catat Pertumbuhan Dobel Digit Didukung Ekspansi Gerai Luar Jawa',
    source: 'Ritel Monitor',
    sentiment: 'Positif',
    sentimentScore: 82,
    content: 'Pemilik jaringan ritel Alfamart (AMRT) memproyeksikan target perolehan laba tahun ini tumbuh 12% menyusul pesatnya penyerapan gerai baru di Sulawesi dan Kalimantan. Penjualan ritel domestik dinilai tetap tahan banting di tengah pergeseran gaya konsumsi masyarakat urban.',
    sector: 'Konsumsi Retail',
    emitenCode: 'AMRT',
    author: 'Dewi Lestari',
    readTime: '3 mnt baca'
  },
  {
    id: 'news-13',
    time: '10:30 WIB',
    date: '3 Hari Lalu',
    title: 'Rasio Kredit Macet NPL Bank Mandiri (BMRI) Menyusut ke Level Terbaik 1.1%',
    source: 'Penahiy Intel',
    sentiment: 'Positif',
    sentimentScore: 90,
    content: 'PT Bank Mandiri (Persero) Tbk membuktikan kehebatan manajemen kualitas kredit dengan menyusutkan rasio kredit bermasalah (NPL) gross ke level 1.1%, jauh di bawah batas sehat regulator sebesar 5%. Penurunan ini meminimalkan pencadangan beban CKPN dan berpotensi meningkatkan rasio pembayaran dividen tahun buku mendatang.',
    sector: 'Perbankan',
    emitenCode: 'BMRI',
    author: 'Andi Wijaya',
    readTime: '2 mnt baca'
  },
  {
    id: 'news-14',
    time: '08:15 WIB',
    date: '4 Hari Lalu',
    title: 'Jasa Marga (JSMR) Targetkan Penyelesaian Akses Tol Baru Menjelang Libur Akhir Tahun',
    source: 'Warta Jalan Tol',
    sentiment: 'Positif',
    sentimentScore: 80,
    content: 'JSMR mempercepat konstruksi jalur tol Trans-Jawa guna mengantisipasi ledakan lalu lintas masyarakat menjelang libur Natal dan Tahun Baru. Penambahan gerbang tarif diestimasi mendongkrak perolehan arus kas operasional (FFO) sebesar 8.5% secara pro-rata semester kedua.',
    sector: 'Infrastruktur & Tol',
    emitenCode: 'JSMR',
    author: 'Fajar Nugraha',
    readTime: '3 mnt baca'
  }
];

// Trending Topics keywords with custom counts
interface TopicItem {
  text: string;
  count: number;
}
const TRENDING_TOPICS: TopicItem[] = [
  { text: 'Dividen Jumbo', count: 18 },
  { text: 'Aksi Asing', count: 15 },
  { text: 'Bunga BI-Rate', count: 12 },
  { text: 'Energi Terbarukan', count: 10 },
  { text: 'Rebound Batubara', count: 8 },
  { text: 'Akuisisi GoTo', count: 7 },
  { text: 'Niel Smelter', count: 6 },
  { text: 'Ekspansi Luar Jawa', count: 5 },
  { text: 'Capex Serat Optik', count: 4 },
  { text: 'Kredit Macet Rendah', count: 3 }
];

// Sektor Heatmap News Sentiment Database
interface SektorSentiment {
  name: string;
  score: number; // 0 to 100 representing positive percentage
  newsCount: number;
}
const SEKTOR_HEATMAPS: SektorSentiment[] = [
  { name: 'Perbankan', score: 91, newsCount: 22 },
  { name: 'Petrokimia', score: 85, newsCount: 14 },
  { name: 'Infrastruktur & Tol', score: 79, newsCount: 11 },
  { name: 'Farmasi / Kesehatan', score: 74, newsCount: 8 },
  { name: 'Utilitas', score: 62, newsCount: 6 },
  { name: 'Telekomunikasi', score: 55, newsCount: 9 },
  { name: 'Konsumsi Retail', score: 48, newsCount: 15 },
  { name: 'Teknologi', score: 38, newsCount: 18 },
  { name: 'Otomotif & Industri', score: 35, newsCount: 7 },
  { name: 'Energi / Tambang', score: 24, newsCount: 26 },
];

// High Impact Financial Events Calendar for timeline
interface CalendarNewsEvent {
  day: string;
  date: string;
  title: string;
  category: 'Laporan Keuangan' | 'RUPS' | 'Aksi Korporasi' | 'Makro Ekonomi';
  impact: 'Tinggi' | 'Sedang' | 'Rendah';
  description: string;
}
const HIGH_IMPACT_CALENDAR: CalendarNewsEvent[] = [
  {
    day: 'Senin',
    date: '25 Mei 2026',
    title: 'RUPS Tahunan & Dividen Final BBRI',
    category: 'RUPS',
    impact: 'Tinggi',
    description: 'Keputusan final rasio dividen tunai (payout ratio) Bank Rakyat Indonesia dari laba tahun penuh.'
  },
  {
    day: 'Selasa',
    date: '26 Mei 2026',
    title: 'Cum Date Dividen Tunai Rp124/Saham TLKM',
    category: 'Aksi Korporasi',
    impact: 'Tinggi',
    description: 'Hari terakhir pendaftaran kepemilikan saham Telkom untuk mendapatkan hak pembagian dividen.'
  },
  {
    day: 'Rabu',
    date: '27 Mei 2026',
    title: 'Rilis Neraca Dagang Domestik BPS',
    category: 'Makro Ekonomi',
    impact: 'Sedang',
    description: 'Publikasi surplus/defisit neraca perdagangan Indonesia periode April oleh Badan Pusat Statistik.'
  },
  {
    day: 'Kamis',
    date: '28 Mei 2026',
    title: 'Laporan Keuangan Kuartal I Indofood (ICBP & INDF)',
    category: 'Laporan Keuangan',
    impact: 'Sedang',
    description: 'Publikasi laporan laba-rugi untuk kuartal pertama tahun buku 2026.'
  },
  {
    day: 'Jumat',
    date: '29 Mei 2026',
    title: 'RUPS Luar Biasa (RUPSLB) Aneka Tambang',
    category: 'RUPS',
    impact: 'Rendah',
    description: 'Agenda persetujuan pemegang saham mengenai pergantian pengurus dewan komisaris ANTM.'
  }
];

export default function BeritaSentimen() {
  // Filters & Sorting state
  const [activeSentimentFilter, setActiveSentimentFilter] = useState<'Semua' | 'Positif' | 'Negatif' | 'Netral'>('Semua');
  const [selectedSektor, setSelectedSektor] = useState<string>('Semua');
  const [emitenQuery, setEmitenQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'Terbaru' | 'Paling Relevan' | 'Sentimen Terkuat'>('Terbaru');
  
  // Custom tag topic selected filter trigger
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Expanded News cards storage
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);

  // Bookmarked news state for demo
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['news-1']);

  // Real-time news states
  const [newsList, setNewsList] = useState<RobustNewsItem[]>(COMPREHENSIVE_NEWS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    let active = true;
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Gagal mengambil data dari bursa news");
        const data = await res.json();
        
        const mappedData: RobustNewsItem[] = data.map((item: any, idx: number) => {
          // Detect emiten ticker in item title (4 letters uppercase)
          const emitenMatch = item.title.match(/\b([A-Z]{4})\b/);
          const detectedEmiten = emitenMatch ? emitenMatch[1] : 'Makro';
          
          let cleanDesc = item.content || item.title;
          // clean any HTML fragments gently
          cleanDesc = cleanDesc.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ");

          // Map sentiment string to exact required union type
          let mappedSentiment: 'Positif' | 'Negatif' | 'Netral' = 'Netral';
          if (item.sentiment === 'Positif') mappedSentiment = 'Positif';
          else if (item.sentiment === 'Negatif') mappedSentiment = 'Negatif';

          return {
            id: item.id || `news-${idx}`,
            time: item.time || "Baru saja",
            date: "Hari Ini",
            title: item.title,
            source: item.source || "Bursa Efek",
            sentiment: mappedSentiment,
            sentimentScore: item.sentiment === 'Positif' ? 85 + (idx % 10) : item.sentiment === 'Negatif' ? 25 + (idx % 10) : 50,
            content: cleanDesc,
            sector: item.source.includes("Investasi") ? "Investasi" : "Makro",
            emitenCode: detectedEmiten,
            author: 'Redaksi ' + (item.source || 'Bursa'),
            readTime: `${2 + (idx % 3)} mnt baca`
          };
        });

        if (active && mappedData.length > 0) {
          setNewsList(mappedData);
        }
      } catch (err) {
        console.error("News API fetch failed, using fallback database:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchNews();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`SahamPintar News: ${title}`);
      alert('Tautan Berita berhasil disalin ke clipboard!');
    } else {
      alert(`Berbagi judul berita: "${title}"`);
    }
  };

  // List of unique news sectors from newsList
  const uniqueSectors = useMemo(() => {
    const list = new Set(newsList.map(n => n.sector));
    return ['Semua', ...Array.from(list)];
  }, [newsList]);

  // Filter and sort core logic
  const filteredAndSortedNews = useMemo(() => {
    let result = [...newsList];

    // Filter by Sentiment: Positif | Negatif | Netral
    if (activeSentimentFilter !== 'Semua') {
      result = result.filter(n => n.sentiment === activeSentimentFilter);
    }

    // Filter by Sector
    if (selectedSektor !== 'Semua') {
      result = result.filter(n => n.sector === selectedSektor);
    }

    // Filter by Emiten code search (e.g., BBCA)
    if (emitenQuery.trim() !== '') {
      const q = emitenQuery.trim().toUpperCase();
      result = result.filter(n => 
        n.emitenCode.toUpperCase().includes(q) || 
        n.title.toUpperCase().includes(q)
      );
    }

    // Filter by Tag Cloud selection (optional helper)
    if (selectedTag) {
      // simple match if tag keyword is inside content or title
      const tagLower = selectedTag.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(tagLower) || 
        n.content.toLowerCase().includes(tagLower)
      );
    }

    // Sorting Core Logic
    if (sortBy === 'Terbaru') {
      // keep original database chronological ordering which starts with the newest
    } else if (sortBy === 'Paling Relevan') {
      // Sort by highest sentiment score (arbitrary proxy for high weight relevance)
      result.sort((a, b) => b.sentimentScore - a.sentimentScore);
    } else if (sortBy === 'Sentimen Terkuat') {
      // Sort Positif first, then Negatif, then Netral or by higher absolute score deviation
      result.sort((a, b) => {
        const scoreA = Math.abs(a.sentimentScore - 50);
        const scoreB = Math.abs(b.sentimentScore - 50);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [activeSentimentFilter, selectedSektor, emitenQuery, sortBy, selectedTag]);

  // Main Market Sentiment Gauge Metric (Score 68%)
  const marketSentimentValue = 68;
  const marketSentimentLabel = 'Optimis (Greed)';

  // AI Summary
  const aiSummaryText = 'Arus modal investor asing terpantau gencar membanjiri saham-saham perbankan berkapitalisasi pasar besar (big-cap), yang secara efektif mengimbangi sentimen ambil untung pada emiten komoditas batubara akibat koreksi harga global. Pasar secara keseluruhan didominasi oleh rona optimis didukung kestabilitas ekonomi dalam negeri serta inflasi dan suku bunga BI-Rate yang tetap konsisten terjaga.';

  return (
    <div id="berita-sentimen-view" className="space-y-6 text-left">
      
      {/* 1. HEADER HERO WITH SENTIMENT SPEED GAUGE & AI SUMMARY SUMMARY */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 filter blur-3xl rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 items-center">
          
          {/* Header titles */}
          <div className="lg:col-span-1 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-[#1565C0]/10 text-[#1565C0] rounded-xl">
                <Newspaper className="w-5.5 h-5.5" />
              </span>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-gray-900 dark:text-white leading-none">Berita & Sentimen Pasar</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Real-time IDX Intelligence</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Analisa otomatis puluhan rilis pers emiten serta perkembangan ekonomi makro guna menangkap arah tren pergerakan pasar secara presisi.
            </p>

            <div className="flex items-center gap-2.5 pt-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-saham-green text-[10px] font-bold rounded-lg">
                <Globe className="w-3.5 h-3.5" />
                Dunia Makro: Kondusif
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1565C0]/10 text-blue-400 text-[10px] font-bold rounded-lg">
                <Activity className="w-3.5 h-3.5" />
                VIX IDX: 14.2 (Rendah)
              </span>
            </div>
          </div>

          {/* Semicircular / Gauge Sentimen Meter */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-850 rounded-2xl relative">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-[#1565C0]" />
              Indikator Sentimen Pasar BEI Hari Ini
            </span>
            
            <div className="w-full max-w-[200px] aspect-[2/1] relative flex items-end justify-center overflow-hidden pt-3">
              {/* Outer gauge semicircle track */}
              <div className="absolute inset-0 w-full h-[200%] border-[22px] border-gray-200 dark:border-gray-800 rounded-full" />
              
              {/* Active color slice */}
              <div 
                className="absolute inset-0 w-full h-[200%] border-[22px] border-transparent border-t-emerald-500 border-r-emerald-500 rounded-full transition-transform duration-1000 origin-center"
                style={{ transform: `rotate(${(marketSentimentValue / 100) * 180 - 180}deg)` }}
              />

              {/* Digital score center overlay */}
              <div className="relative text-center pb-2 z-10 space-y-0.5">
                <span className="text-3xl font-mono font-black text-emerald-505 text-emerald-500 block leading-none">{marketSentimentValue}%</span>
                <span className="text-[10px] text-gray-550 dark:text-gray-400 font-extrabold uppercase tracking-wide block leading-none">{marketSentimentLabel}</span>
              </div>
            </div>

            {/* Scale ticks captions */}
            <div className="w-full flex justify-between px-2 text-[9px] text-gray-405 font-bold uppercase mt-2.5 border-t border-gray-100 dark:border-gray-850/60 pt-2">
              <span className="text-rose-500 font-bold">Takut (0)</span>
              <span className="text-gray-405">Netral (50)</span>
              <span className="text-emerald-500 font-bold">Optimis (100)</span>
            </div>
          </div>

          {/* AI Summary conditions in 2-3 sentences max */}
          <div className="lg:col-span-1 p-5 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/15 rounded-2xl text-left relative">
            <span className="absolute top-3 right-3 text-emerald-500">
              <Sparkles className="w-4 h-4 animate-bounce" />
            </span>
            <div className="flex items-center gap-1.5 mb-2">
              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Ringkasan AI Penahiy</h4>
            </div>
            
            <p className="text-xs text-gray-750 dark:text-gray-300 font-bold leading-relaxed">
              {aiSummaryText}
            </p>
          </div>

        </div>
      </div>

      {/* HEATMAP SENTIMEN SEKTOR INDONESIA */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-850/60">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-emerald-500/15 text-saham-green rounded text-xs font-bold font-mono">HEATMAP</span>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Peta Panas Sentimen Sektor BEI</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">Diperbarui real-time dari 134 emiten dipantau</span>
        </div>

        {/* Sector grids list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SEKTOR_HEATMAPS.map((sek, idx) => {
            // green-red scoring logic
            const isHighlyPositive = sek.score >= 75;
            const isPositive = sek.score >= 55 && sek.score < 75;
            const isNeutral = sek.score >= 45 && sek.score < 55;
            const isNegative = sek.score >= 30 && sek.score < 45;
            const isHighlyNegative = sek.score < 30;

            let bgClass = '';
            let borderClass = '';
            let textAccent = '';

            if (isHighlyPositive) {
              bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/5 hover:bg-emerald-500/15';
              borderClass = 'border-emerald-500/30';
              textAccent = 'text-emerald-500';
            } else if (isPositive) {
              bgClass = 'bg-green-500/10 dark:bg-green-500/5 hover:bg-green-500/15';
              borderClass = 'border-green-500/25';
              textAccent = 'text-green-500';
            } else if (isNeutral) {
              bgClass = 'bg-amber-400/10 dark:bg-amber-400/5 hover:bg-amber-400/15';
              borderClass = 'border-amber-400/20';
              textAccent = 'text-amber-500';
            } else if (isNegative) {
              bgClass = 'bg-orange-500/10 dark:bg-orange-500/5 hover:bg-orange-500/15';
              borderClass = 'border-orange-500/20';
              textAccent = 'text-orange-500';
            } else {
              bgClass = 'bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/15';
              borderClass = 'border-red-500/30';
              textAccent = 'text-red-500';
            }

            return (
              <div 
                key={idx}
                onClick={() => {
                  setSelectedTag(null);
                  setSelectedSektor(sek.name === 'Energi / Tambang' ? 'Energi / Tambang' : sek.name === 'Perbankan' ? 'Perbankan' : sek.name === 'Teknologi' ? 'Teknologi' : 'Semua');
                }}
                className={`p-3 rounded-2xl border transition text-left cursor-pointer ${bgClass} ${borderClass}`}
              >
                <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold block truncate leading-none mb-1">{sek.name}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-base font-mono font-black ${textAccent}`}>{sek.score}%</span>
                  <span className="text-[9px] text-gray-400 font-semibold">{sek.newsCount} berita</span>
                </div>
                {/* Micro trend lines bar indicator */}
                <div className="w-full h-1 bg-gray-150 dark:bg-gray-800 rounded-full mt-2 overflow-hidden relative">
                  <div className={`absolute top-0 left-0 h-full rounded-full ${isHighlyPositive || isPositive ? 'bg-emerald-500' : isNeutral ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${sek.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE 2-COLUMN MESH GRID (Left Sidebar: Trending, Right: News Feed & Calendar) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: TRENDING TOPICS tag cloud (1/4 column) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* TAG CLOUD PANEL */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-850/60">
              <Hash className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Trending Topik Hari Ini</h3>
            </div>
            
            <p className="text-[11px] text-gray-400 mb-4 leading-normal font-semibold">
              Kata kunci/frasa yang paling banyak disebutkan dalam ringkasan eksekutif emiten BEI hari ini. Klik tag untuk menyaring berita.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {TRENDING_TOPICS.map((topic, i) => {
                // Determine scale by size/frequency
                const isLarge = topic.count >= 12;
                const isMedium = topic.count >= 6 && topic.count < 12;
                
                const isSelected = selectedTag === topic.text;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTag(null); // toggle off
                      } else {
                        setSelectedTag(topic.text);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#1565C0] text-white border border-[#1565C0] shadow-sm'
                        : isLarge 
                          ? 'bg-gray-100 dark:bg-gray-950 text-xs text-[#1565C0] dark:text-blue-400 border border-gray-200 dark:border-gray-800 hover:border-blue-400/50' 
                          : isMedium
                            ? 'bg-gray-50/50 dark:bg-gray-950/40 text-[11px] text-gray-700 dark:text-gray-300 border border-gray-200/65 dark:border-gray-850 hover:border-gray-300'
                            : 'bg-transparent text-[10px] text-gray-450 dark:text-gray-400 border border-gray-200 dark:border-gray-850/80 hover:border-gray-300'
                    }`}
                  >
                    <span>{topic.text}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200/50 dark:bg-gray-800 text-gray-400'}`}>
                      {topic.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedTag && (
              <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-850/60">
                <button
                  onClick={() => setSelectedTag(null)}
                  className="w-full py-1.5 text-center bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/30 text-rose-500 rounded-xl text-[10px] font-bold transition cursor-pointer"
                >
                  Reset Filter Kata Kunci
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR WIDGET 2: HIGH IMPACT ECONOMIC CALENDAR */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-850/60">
              <Calendar className="w-4 h-4 text-[#1565C0]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Kalender Berita Penting</h3>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal font-semibold">
              Kumpulan agenda rilis finansial, rapat umum pemegang saham (RUPS), dan aksi korporasi berdampak tinggi minggu ini.
            </p>

            <div className="space-y-3.5 relative">
              {/* Vertical line connector */}
              <div className="absolute top-1 bottom-1 left-[31px] w-0.5 bg-gray-200 dark:bg-gray-800 pointer-events-none" />

              {HIGH_IMPACT_CALENDAR.map((ev, i) => (
                <div key={i} className="flex gap-3 relative z-10 text-xs">
                  {/* Left node with absolute date info */}
                  <div className="w-[64px] flex-shrink-0 text-left">
                    <span className="block text-[10px] font-mono font-black text-gray-900 dark:text-white leading-none">{ev.day}</span>
                    <span className="block text-[8px] text-gray-400 font-semibold mt-1 leading-none">{ev.date.split(' ').slice(0, 2).join(' ')}</span>
                  </div>

                  {/* Circle dot connector indicator */}
                  <div className="w-3 h-3 bg-white dark:bg-[#1E1E1E] border-2 border-[#1565C0] rounded-full mt-0.5 flex-shrink-0" />

                  {/* Body text details */}
                  <div className="flex-1 space-y-1 bg-gray-50/50 dark:bg-gray-950/20 p-2 rounded-xl border border-gray-150/50 dark:border-gray-850/60">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold ${
                        ev.category === 'RUPS' ? 'bg-amber-400/10 text-amber-500 border border-amber-400/20'
                        : ev.category === 'Aksi Korporasi' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : ev.category === 'Laporan Keuangan' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {ev.category}
                      </span>
                      {ev.impact === 'Tinggi' && (
                        <span className="text-[8px] uppercase font-black text-rose-500 animate-pulse bg-rose-500/10 px-1 rounded">HI IMPACT</span>
                      )}
                    </div>
                    <h5 className="font-bold text-[11px] text-gray-900 dark:text-white leading-tight mt-1">{ev.title}</h5>
                    <p className="text-[9px] text-gray-450 dark:text-gray-450 leading-snug">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCH FILTER TOOLBAR & EXPANDABLE NEWS LIST (3/4 column) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* SEARCH & FILTER CONTROLS TOOLBAR */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Row 1: Search & sorting */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Text Search Ticker */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-450">
                  <Search className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  id="news-ticker-search-input"
                  type="text"
                  placeholder="Cari berita berdasarkan emiten (ex: BBCA, GOTO) atau judul ..."
                  value={emitenQuery}
                  onChange={(e) => {
                    setSelectedTag(null);
                    setEmitenQuery(e.target.value);
                  }}
                  className="w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-450 dark:placeholder-gray-600 text-xs font-semibold border border-gray-150 dark:border-gray-850 rounded-2xl pl-10 pr-4 py-2.5 outline-none focus:border-[#1565C0] transition"
                />
                {emitenQuery && (
                  <button 
                    onClick={() => setEmitenQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                  >
                    <Info className="w-3.5 h-3.5 rotate-45" />
                  </button>
                )}
              </div>

              {/* Sorting combobox */}
              <div className="relative w-full md:w-48 flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase block flex-shrink-0">Sortir</span>
                <select
                  id="news-sorting-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs font-semibold border border-gray-150 dark:border-gray-850 rounded-2xl px-3 py-2.5 cursor-pointer outline-none focus:border-[#1565C0] transition"
                >
                  <option value="Terbaru">Terbaru (Intraday)</option>
                  <option value="Paling Relevan">Skor Sentimen Tertinggi</option>
                  <option value="Sentimen Terkuat">Polaritas Terkuat</option>
                </select>
              </div>
            </div>

            {/* Row 2: Sector options & Sentiment tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 border-t border-gray-100 dark:border-gray-850/60">
              
              {/* Sentiment tabs: Semua | Positif | Negatif | Netral */}
              <div className="flex bg-gray-50 dark:bg-gray-950 p-1 border border-gray-150 dark:border-gray-850 rounded-2xl select-none max-w-sm w-full font-bold">
                {(['Semua', 'Positif', 'Negatif', 'Netral'] as const).map(sent => {
                  const isActive = activeSentimentFilter === sent;
                  return (
                    <button
                      key={sent}
                      onClick={() => {
                        setSelectedTag(null);
                        setActiveSentimentFilter(sent);
                      }}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] text-center transition cursor-pointer ${
                        isActive 
                          ? 'bg-[#1565C0] text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {sent === 'Semua' ? 'Semua Berita' : sent}
                    </button>
                  );
                })}
              </div>

              {/* Sector drop-down options */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] text-gray-400 font-bold uppercase block flex-shrink-0">Sektor</span>
                <select
                  value={selectedSektor}
                  onChange={(e) => {
                    setSelectedTag(null);
                    setSelectedSektor(e.target.value);
                  }}
                  className="w-full sm:w-44 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs font-semibold border border-gray-150 dark:border-gray-855 rounded-2xl px-3 py-2 cursor-pointer outline-none focus:border-[#1565C0] transition"
                >
                  {uniqueSectors.map((sectorTyp, idx) => (
                    <option key={idx} value={sectorTyp}>
                      {sectorTyp === 'Semua' ? 'Semua Sektor BEI' : sectorTyp}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* If subset tag or search is active, show small filter badge notifications */}
            {(selectedSektor !== 'Semua' || activeSentimentFilter !== 'Semua' || emitenQuery !== '' || selectedTag) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-gray-400">
                <span>Filter aktif:</span>
                {selectedSektor !== 'Semua' && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-1">
                    Sektor: {selectedSektor}
                    <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setSelectedSektor('Semua')} />
                  </span>
                )}
                {activeSentimentFilter !== 'Semua' && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-1">
                    Sentimen: {activeSentimentFilter}
                    <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setActiveSentimentFilter('Semua')} />
                  </span>
                )}
                {emitenQuery !== '' && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-1">
                    Pencarian Ticker: "{emitenQuery}"
                    <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setEmitenQuery('')} />
                  </span>
                )}
                {selectedTag && (
                  <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-lg flex items-center gap-1">
                    Tag: {selectedTag}
                    <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setSelectedTag(null)} />
                  </span>
                )}
                <button 
                  onClick={() => {
                    setSelectedSektor('Semua');
                    setActiveSentimentFilter('Semua');
                    setEmitenQuery('');
                    setSelectedTag(null);
                  }}
                  className="text-[#1565C0] font-black hover:underline cursor-pointer"
                >
                  Bersihkan pencarian
                </button>
              </div>
            )}

          </div>

          {/* DYNAMIC NEWS GRID CARD RESULTS */}
          <div className="space-y-4">
            
            {/* Summary statistics caption bar */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <p className="font-semibold">
                Menampilkan <strong className="text-gray-900 dark:text-white font-mono">{filteredAndSortedNews.length}</strong> berita terfilter
              </p>
              {filteredAndSortedNews.length > 0 && (
                <span className="text-[10px] text-gray-400 font-medium">Klik pada ulasan kartu untuk ekspansi penuh konten</span>
              )}
            </div>

            {/* Empty stats placeholder block */}
            {filteredAndSortedNews.length === 0 && (
              <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-950 text-gray-450 border border-gray-200 dark:border-gray-850 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">Tidak Ada Emiten Berita yang Cocok</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Silakan perkecil query pencarian Anda, rubah saringan sentiment, atau kembalikan saringan filter sektor ke default "Semua Sektor".
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSektor('Semua');
                    setActiveSentimentFilter('Semua');
                    setEmitenQuery('');
                    setSelectedTag(null);
                  }}
                  className="px-4 py-2 bg-[#1565C0] text-white text-xs font-bold rounded-xl transition hover:bg-[#1565C0]/90 cursor-pointer"
                >
                  Atur Ulang Semua Pencarian
                </button>
              </div>
            )}

            {/* Active Render List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout animate">
                {filteredAndSortedNews.map((news) => {
                  const isExpanded = expandedNewsId === news.id;
                  
                  // Color indicators logic
                  const isPos = news.sentiment === 'Positif';
                  const isNeg = news.sentiment === 'Negatif';
                  
                  const sentimentColor = isPos 
                    ? 'bg-emerald-500/10 text-saham-green border border-emerald-500/20' 
                    : isNeg 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                      : 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

                  const isBookmarked = bookmarkedIds.includes(news.id);

                  return (
                    <motion.div
                      layout
                      key={news.id}
                      onClick={() => setExpandedNewsId(isExpanded ? null : news.id)}
                      className={`bg-white dark:bg-[#1E1E1E] border hover:border-gray-350 dark:hover:border-gray-700/60 rounded-3xl p-5 shadow-sm text-left transition cursor-pointer overflow-hidden relative ${
                        isExpanded 
                          ? 'ring-1 ring-[#1565C0] border-[#1565C0]' 
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      
                      {/* Top bar indicators */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                        
                        {/* Time & source tag */}
                        <div className="flex items-center gap-2.5 text-[10px] text-gray-400 font-semibold">
                          <span className="inline-flex items-center gap-1 text-[#1565C0]">
                            <span className="w-1.5 h-1.5 bg-[#1565C0] rounded-full animate-ping" />
                            {news.source}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {news.time} ({news.date})
                          </span>
                        </div>

                        {/* Sentiment badge and action items bar */}
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Sentiment strength indicator */}
                          <div className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${sentimentColor}`}>
                            {news.sentiment} ({news.sentimentScore}%)
                          </div>

                          {/* Interactive stock ticker bubble shortcut */}
                          {news.emitenCode !== 'Semua' && (
                            <span className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-350 text-[10px] font-mono font-black select-none">
                              ${news.emitenCode}
                            </span>
                          )}

                          {/* Bookmark trigger icon */}
                          <button
                            onClick={(e) => handleToggleBookmark(news.id, e)}
                            className={`p-1.5 rounded-lg transition border ${
                              isBookmarked 
                                ? 'bg-amber-400/15 border-amber-400/30 text-amber-500' 
                                : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-850 text-gray-400 hover:text-gray-2 w'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                          </button>

                          {/* Share button */}
                          <button
                            onClick={(e) => handleShare(news.title, e)}
                            className="p-1.5 rounded-lg transition border bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-850 text-gray-400 hover:text-gray-200"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>

                      {/* Title block */}
                      <h4 className="font-display font-black text-xs sm:text-sm text-gray-900 dark:text-white leading-tight">
                        {news.title}
                      </h4>

                      {/* Content block: 1-line truncation versus expanded view */}
                      <div className="text-xs text-gray-450 dark:text-gray-400 mt-2 font-semibold">
                        <p className={isExpanded ? 'leading-relaxed' : 'truncate leading-normal'}>
                          {news.content}
                        </p>
                      </div>

                      {/* Bottom author signature row */}
                      {isExpanded && (
                        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-gray-100 dark:border-gray-850/60 text-[10px] text-gray-400">
                          <p className="font-semibold">
                            Ditulis oleh: <strong className="text-gray-900 dark:text-white">{news.author}</strong> Tinjauan Analis
                          </p>
                          <span className="font-mono bg-gray-50 dark:bg-gray-950 py-0.5 px-2 rounded-lg border border-gray-200 dark:border-gray-850">
                            {news.readTime}
                          </span>
                        </div>
                      )}

                      {/* Expand/Collapse arrow floating tip */}
                      <div className="absolute bottom-2.5 right-5 text-[9px] font-bold uppercase text-gray-400 flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 pointer-events-none transition">
                        <span>{isExpanded ? 'tutup' : 'baca detail'}</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </div>

          {/* EDUCATIONAL DISCLAIMER CORNER */}
          <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-transparent border border-[#1565C0]/15 rounded-3xl p-6 text-left relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1565C0]/15 text-[#1565C0] rounded-2xl flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-extrabold text-sm text-gray-950 dark:text-white">Pentingnya Analisa Sentimen Berita</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Sinyal berita dan rona bodi sentimen berperan penting dalam memicu volatilitas harga saham jangka pendek. Namun, para pemula terdidik diingatkan bahwa keputusan investasi yang solid wajib dipadukan secara berimbang dengan analisa matriks fundamental perusahaan (seperti valuasi PER/PBV yang murah) serta tren arus volume bandar jangka menengah. Jangan melakukan transaksi spekulatif murni hanya didasarkan emosi berlebihan rilis berita semata.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
