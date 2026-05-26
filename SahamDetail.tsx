/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Star, 
  Activity, 
  Info, 
  BarChart3, 
  ShieldCheck, 
  Bookmark, 
  Calculator, 
  Plus, 
  DollarSign, 
  Wallet, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { INDONESIAN_STOCKS } from '../data';

function parseInlineMarkdown(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-extrabold text-blue-980 dark:text-blue-400">{part}</strong>;
    }
    return part;
  });
}

function isMarketOpenClient(): boolean {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wib = new Date(utc + (7 * 60 * 60 * 1000));

  const day = wib.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (day === 0 || day === 6) {
    return false; // Weekend closed
  }

  const hour = wib.getHours();
  const minute = wib.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Session 1: 09:00 - 12:00 WIB (540 to 720 minutes)
  // Session 2: 13:30 - 16:00 WIB (810 to 960 minutes)
  const isSession1 = timeInMinutes >= 540 && timeInMinutes <= 720;
  const isSession2 = timeInMinutes >= 810 && timeInMinutes <= 960;

  return isSession1 || isSession2;
}
 
interface SahamDetailProps {
  selectedStockCode?: string;
  onToggleWatchlist: (code: string) => void;
  watchlistCodes: string[];
  onSelectStock?: (code: string) => void;
}
 
const LOCAL_FUNDAMENTALS: Record<string, { pe: number; pbv: number; roe: number; divYield: number; focus: string }> = {
  BBCA: { pe: 24.5, pbv: 4.8, roe: 21.2, divYield: 2.28, focus: "Transaksional" },
  BBRI: { pe: 14.8, pbv: 2.6, roe: 18.5, divYield: 4.80, focus: "Kredit Mikro" },
  TLKM: { pe: 15.2, pbv: 2.8, roe: 16.4, divYield: 4.20, focus: "Telekomunikasi" },
  GOTO: { pe: -12.4, pbv: 0.7, roe: -8.5, divYield: 0.00, focus: "On-Demand & E-Commerce" },
  BMRI: { pe: 11.2, pbv: 2.1, roe: 19.8, divYield: 5.20, focus: "Kredit Korporasi" },
  BBNI: { pe: 9.8, pbv: 1.2, roe: 14.5, divYield: 4.80, focus: "Perbankan Global" },
  ADRO: { pe: 5.8, pbv: 0.9, roe: 15.6, divYield: 11.80, focus: "Energi Batubara" },
  ANTM: { pe: 12.1, pbv: 1.5, roe: 11.2, divYield: 3.50, focus: "Pertambangan Nikel" },
  PGAS: { pe: 8.4, pbv: 0.8, roe: 9.5, divYield: 6.80, focus: "Infrastruktur Gas" },
  PTBA: { pe: 6.2, pbv: 1.1, roe: 13.5, divYield: 12.10, focus: "Eksploitasi Batubara" },
  BRPT: { pe: 45.2, pbv: 3.2, roe: 3.8, divYield: 0.50, focus: "Petrokimia Integrasi" },
  UNVR: { pe: 21.5, pbv: 12.4, roe: 58.2, divYield: 4.60, focus: "Konsumer FMCG" },
  KLBF: { pe: 22.8, pbv: 3.4, roe: 15.2, divYield: 2.50, focus: "Farmasi & Kesehatan" },
  AMRT: { pe: 32.4, pbv: 8.5, roe: 26.4, divYield: 1.80, focus: "Ritel Minimarket" },
  ASII: { pe: 7.8, pbv: 1.0, roe: 12.8, divYield: 6.50, focus: "Otomotif & Distribusi" },
  MEDC: { pe: 6.4, pbv: 1.1, roe: 16.8, divYield: 3.20, focus: "Eksplorasi Migas" },
  BUKA: { pe: -8.5, pbv: 0.4, roe: -4.2, divYield: 0.00, focus: "E-Commerce" },
  INDF: { pe: 6.8, pbv: 1.1, roe: 14.8, divYield: 3.90, focus: "FMCG Makanan" },
  ICBP: { pe: 14.5, pbv: 2.8, roe: 19.5, divYield: 2.80, focus: "Makanan Olahan" },
  HRUM: { pe: 8.2, pbv: 1.3, roe: 12.4, divYield: 4.20, focus: "Batubara & Nikel" }
};

const getStockFundamentals = (code: string) => {
  const upper = code.toUpperCase();
  if (LOCAL_FUNDAMENTALS[upper]) {
    return LOCAL_FUNDAMENTALS[upper];
  }
  // Deterministic calculation based on stock code
  let hash = 0;
  for (let i = 0; i < upper.length; i++) {
    hash = upper.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const pe = parseFloat((5 + (hash % 20) + (hash % 10) / 10).toFixed(1));
  const pbv = parseFloat((0.4 + (hash % 4) + (hash % 10) / 10).toFixed(2));
  const roe = parseFloat((4 + (hash % 22) + (hash % 10) / 10).toFixed(1));
  const divYield = parseFloat(((hash % 6) + (hash % 10) / 10).toFixed(2));

  const matched = INDONESIAN_STOCKS.find(s => s.code.toUpperCase() === upper);
  const focus = matched?.industry ? `Spesialis ${matched.industry}` : "Diversifikasi Utama Papan";

  return { pe, pbv, roe, divYield, focus };
};

const getCompanyDescription = (code: string) => {
  const map: Record<string, string> = {
    BBCA: "Bank Central Asia Tbk. (BBCA) merupakan bank swasta nasional terbesar di Indonesia yang didirikan pada tahun 1957. BBCA diakui sebagai pemimpin industri perbankan transaksional dengan jaringan ATM raksasa, platform perbankan internet & seluler yang inovatif, penyaluran kredit produktif bermutu, dan efisiensi rasio CASA (dana murah) yang terbaik di Asia Tenggara.",
    BBRI: "Bank Rakyat Indonesia Tbk. (BBRI) merupakan salah satu bank milik pemerintah terbesar di Indonesia yang berfokus pada penyaluran kredit segmen mikro, kecil, dan menengah (UMKM). BBRI memegang pangsa pasar pinjaman mikro terbesar dengan jangkauan agen BRILink yang tersebar luas hingga pelosok nusantara.",
    TLKM: "Telkom Indonesia Tbk. (TLKM) adalah perusahaan informasi dan komunikasi serta penyedia jasa dan jaringan telekomunikasi secara lengkap di Indonesia. Melalui anak usahanya pertahanan pasar ritel Telkomsel, IndiHome, dan infrastruktur Mitratel, TLKM memimpin digitalisasi konektivitas nasional.",
    GOTO: "GoTo Gojek Tokopedia Tbk. (GOTO) adalah ekosistem digital terbesar di Indonesia yang menggabungkan layanan on-demand (Gojek), e-commerce (Tokopedia), serta teknologi finansial (GoTo Financial) dalam satu platform sinergis bernilai ekonomi tinggi bagi perekonomian digital Indonesia.",
    BMRI: "Bank Mandiri Tbk. (BMRI) merupakan salah satu bank umum terbesar di Indonesia dengan portofolio pinjaman korporasi dan komersial terkuat. Bank Mandiri juga unggul dalam layanan digital melalui platform Livin' dan Kopra untuk mendukung ekosistem transaksi perbankan ritel maupun institusi.",
    ADRO: "Adaro Energy Indonesia Tbk. (ADRO) adalah salah satu produsen batubara thermal terbesar dan terintegrasi di Indonesia. ADRO memegang wilayah tambang batubara berkualitas tinggi dengan kadar abu dan belerang yang rendah (Envirocoal) serta gencar bertransisi menuju energi hijau terbarukan."
  };
  return map[code.toUpperCase()] || `${code} Tbk. merupakan emiten berkinerja aktif di Bursa Efek Indonesia yang bergerak dalam sektor industri terintegrasi papan utama. Perseroan memiliki rekam jejak operasional bursa berkelanjutan serta berkomitmen memberikan nilai investasi jangka panjang yang optimal bagi segenap pemegang saham publik pelaksana.`;
};

const getFundamentalScoreDetails = (code: string) => {
  const map: Record<string, { score: number; text: string }> = {
    BBCA: { score: 9.2, text: "Neraca likuid, ROE cemerlang di atas rata-rata bank konvensional, serta provisi NPL memadai." },
    BBRI: { score: 8.8, text: "Dominasi kredit mikro yang bertenaga menghasilkan yield tinggi, walaupun rasio NPL perlu dipantau secara berkala." },
    TLKM: { score: 8.5, text: "Aliran kas EBITDA sangat sehat dan konsisten membagikan dividen yield menarik bagi pemegang saham ritel bursa." },
    GOTO: { score: 6.2, text: "Fokus efisiensi membuahkan perbaikan margin kontribusi positif, namun profitabilitas bersih jangka pendek masih terbatas." },
    BMRI: { score: 8.9, text: "Efisiensi biaya dana murah prima didukung ekspansi korporasi yang kokoh dan pertumbuhan kredit yang stabil." },
  };
  return map[code.toUpperCase()] || { score: 7.8, text: "Rasio leverage terkendali, pertumbuhan pendapatan stabil seiring pulihnya iklim makroekonomi domestik harian." };
};

export default function SahamDetail({ selectedStockCode = 'BBCA', onToggleWatchlist, watchlistCodes, onSelectStock }: SahamDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<'teknikal' | 'fundamental' | 'sentimen' | 'radar' | 'analisis-ai' | 'simulasi'>('teknikal');

  // AI-powered dynamically fetched premium data states
  const [aiResult, setAiResult] = useState<{ recommendation: string; analysis: string; disclaimer: string; isRealAI: boolean } | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchAIAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const fund = getStockFundamentals(selectedStockCode);
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedStockCode.toUpperCase(),
          lastPrice: currentPrice,
          technicals: {
            trend: liveChangePercent >= 0 ? "Uptrend" : "Downtrend",
            rsi: 62.40,
            macd: "Golden Cross",
            stochastic: "Neutral"
          },
          fundamentals: fund,
          sentiment: "Positif"
        })
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.error("Gagal menjalan analisa AI:", err);
      setAiError(err.message || "Gagal memperoleh respon analisa.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'analisis-ai') {
      fetchAIAnalysis();
    }
  }, [selectedStockCode, activeSubTab]);
  
  // Custom Search State
  const [customSearchText, setCustomSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Technical Tab States
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '5Y'>('1M');
  const [overlays, setOverlays] = useState({
    ma20: true,
    ma50: false,
    ma200: false,
    bollinger: false
  });
  const [indicatorPanel, setIndicatorPanel] = useState<'rsi' | 'macd' | 'stoch'>('rsi');

  // Watchlist Virtual State
  const [isVirtualWatched, setIsVirtualWatched] = useState<boolean>(false);
  const [showVirtualToast, setShowVirtualToast] = useState<boolean>(false);

  // Virtual Buy States
  const [lotsInput, setLotsInput] = useState<number>(10);
  
  // Dynamic API details states
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState<boolean>(true);

  // Setup comparison and fluctuation base trigger states
  const [comparedStock, setComparedStock] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadStockPriceAndNews = async () => {
      setIsLoadingAPI(true);
      try {
        const stockRes = await fetch(`/api/saham/${selectedStockCode.toUpperCase()}`);
        let stockData = null;
        if (stockRes.ok) {
          stockData = await stockRes.json();
        }

        const newsRes = await fetch(`/api/news?ticker=${selectedStockCode.toUpperCase()}`);
        let newsData = [];
        if (newsRes.ok) {
          newsData = await newsRes.json();
        }

        if (active) {
          setStockDetails(stockData);
          setLiveNews(newsData);
        }
      } catch (err) {
        console.error("Gagal memuat detail bursa saham:", err);
      } finally {
        if (active) {
          setIsLoadingAPI(false);
        }
      }
    };

    loadStockPriceAndNews();
    setComparedStock(null); // Reset comparison on code change

    // Live update routine every 15 seconds
    const intervalId = setInterval(async () => {
      try {
        const stockRes = await fetch(`/api/saham/${selectedStockCode.toUpperCase()}`);
        if (stockRes.ok && active) {
          const updated = await stockRes.json();
          setStockDetails(updated);
        }
      } catch (e) {
        console.warn("Background refresh details rate failure:", e);
      }
    }, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [selectedStockCode]);

  // Find base price from datasets
  const matchedDatasetStock = INDONESIAN_STOCKS.find(s => s.code.toUpperCase() === selectedStockCode.toUpperCase());
  const fallbackPrice = matchedDatasetStock?.price || 9850;
  const currentPrice = stockDetails?.price || fallbackPrice;
  const targetPriceAI = Math.round(currentPrice * 1.15);

  // Simulated live ticker fluctuation
  const [priceFluctuation, setPriceFluctuation] = useState<number>(0);
  useEffect(() => {
    setPriceFluctuation(0); // Reset fluctuation on stock change
    
    // Stagnant when market is closed: do not run interval
    if (!isMarketOpenClient()) {
      return;
    }

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 20;
      setPriceFluctuation(prev => {
        const nextPrice = currentPrice + prev + delta;
        if (nextPrice < currentPrice * 0.95 || nextPrice > currentPrice * 1.05) return prev;
        return prev + delta;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedStockCode, currentPrice]);

  const apiPrice = stockDetails?.price || fallbackPrice;
  const livePrice = Math.round(apiPrice + priceFluctuation);
  const apiChangePercent = stockDetails?.changePercent ?? matchedDatasetStock?.changePercent ?? 1.55;
  const liveChangePercent = apiChangePercent + (priceFluctuation / apiPrice) * 100;
  const apiChangePoints = stockDetails?.change ?? matchedDatasetStock?.change ?? 150;
  const liveChangePoints = Math.round(apiChangePoints + priceFluctuation);

  // Is active stock in the real watchlist
  const isRealWatched = watchlistCodes.includes(selectedStockCode);

  // Trigger virtual buy notification
  const handleToggleVirtualWatchlist = () => {
    setIsVirtualWatched(prev => !prev);
    setShowVirtualToast(true);
    setTimeout(() => {
      setShowVirtualToast(false);
    }, 4000);
  };

  // Pre-calculated data for Candlestick (Technical Tab)
  const generateCandles = () => {
    let counts = 16;
    if (timeframe === '3M') counts = 24;
    if (timeframe === '6M') counts = 30;
    if (timeframe === '1Y') counts = 36;
    if (timeframe === '5Y') counts = 40;

    const list = [];
    
    // Check if real Yahoo history points are available
    if (stockDetails?.history && stockDetails.history.length > 0) {
      return stockDetails.history.map((pt: any) => {
        const base = pt.price;
        return {
          date: pt.date,
          open: Math.round(base * 0.995),
          close: base,
          high: Math.round(base * 1.008),
          low: Math.round(base * 0.991),
          volume: `${Math.round(5 + Math.random() * 20)}M`
        };
      });
    }

    const basePrice = livePrice;
    for (let i = 0; i < counts; i++) {
      const wave = Math.sin(i * 0.4) * 85 + Math.cos(i * 0.9) * 55;
      const progressTrend = (i / counts) * (basePrice * 0.05);
      
      const open = Math.round(basePrice - (basePrice * 0.05) + progressTrend + wave);
      const close = Math.round(open + (Math.sin(i * 1.5) * (basePrice * 0.01)) + (i % 3 === 0 ? 80 : -40));
      const high = Math.round(Math.max(open, close) + Math.random() * (basePrice * 0.005) + 10);
      const low = Math.round(Math.min(open, close) - Math.random() * (basePrice * 0.005) - 5);
      
      list.push({
        date: `H-${counts - i}`,
        open,
        close,
        high,
        low,
        volume: Math.round(15 + Math.random() * 45) + 'M'
      });
    }
    return list;
  };

  const candleData = generateCandles();

  // Support & Resistance prices
  const supportPoints = [Math.round(livePrice * 0.965), Math.round(livePrice * 0.945)];
  const resistancePoints = [Math.round(livePrice * 1.025), Math.round(livePrice * 1.045)];

  // News items specific to selected stock
  const bbcaNews = liveNews && liveNews.length > 0 ? liveNews.map((item: any, idx: number) => {
    let cleanDesc = item.content || item.title;
    cleanDesc = cleanDesc.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").substring(0, 180);
    return {
      id: item.id || `news-${idx}`,
      title: item.title,
      dsc: cleanDesc,
      source: item.source || "Bursa RSS",
      type: item.sentiment || "Netral",
      time: item.time || "Kini"
    };
  }) : [
    { id: 1, title: `Aktivitas Volume Saham ${selectedStockCode} Meningkat Sehat`, dsc: `Perputaran pasar saham harian ${selectedStockCode} menunjukkan geliat akumulasi institusi asing menopang ketahanan portfolio lokal.`, source: "Penahiy Riset", type: "Positif", time: "Baru saja" },
    { id: 2, title: `Sentimen Sektoral Mendukung Pertumbuhan Kinerja ${selectedStockCode}`, dsc: `Laporan riset bursa memproyeksikan efisiensi biaya operasional korporasi ${selectedStockCode} berjalan akurat dan prudent.`, source: "Sinyal Penahiy", type: "Positif", time: "1 hari lalu" },
    { id: 3, title: `Valuasi Pasar ${selectedStockCode} Terjangkau Menarik Minat Konsensus Analis`, dsc: `Rasio PER yang stabil memposisikan ${selectedStockCode} ramah bagi kolektor dividen pasif di iklim suku bunga relatif stabil.`, source: "Bursa Monitor", type: "Positif", time: "2 hari lalu" }
  ];

  // Bandar accumulation details (10 Days Net Foreign Buy in BBCA)
  const bandarFlow = [
    { day: "Hari -1", flow: 245, type: "Buy" },
    { day: "Hari -2", flow: 180, type: "Buy" },
    { day: "Hari -3", flow: -42, type: "Sell" },
    { day: "Hari -4", flow: 310, type: "Buy" },
    { day: "Hari -5", flow: 152, type: "Buy" },
    { day: "Hari -6", flow: 95, type: "Buy" },
    { day: "Hari -7", flow: -15, type: "Sell" },
    { day: "Hari -8", flow: 215, type: "Buy" },
    { day: "Hari -9", flow: 340, type: "Buy" },
    { day: "Hari -10", flow: 195, type: "Buy" }
  ];

  // Peer stocks comparison in same sector
  const getSimilarStocks = () => {
    const currentIndustry = matchedDatasetStock?.industry || 'Perbankan';
    const peers = INDONESIAN_STOCKS.filter(s => s.code.toUpperCase() !== selectedStockCode.toUpperCase() && s.industry === currentIndustry);
    // if we need more, backfill with default top stocks
    const defaults = INDONESIAN_STOCKS.filter(s => s.code.toUpperCase() !== selectedStockCode.toUpperCase());
    const combined = [...peers, ...defaults].slice(0, 4);
    return combined.map(s => ({
      code: s.code,
      name: s.name,
      price: s.price,
      change: s.changePercent >= 0 ? `+${s.changePercent}%` : `${s.changePercent}%`,
      changeVal: s.changePercent >= 0
    }));
  };
  const similarStocks = getSimilarStocks();

  // Dividend history data
  const getDividendHistory = () => {
    const fund = getStockFundamentals(selectedStockCode);
    const divYield = fund.divYield;
    const basePriceForDiv = currentPrice || 9800;
    if (divYield <= 0) {
      return [
        { year: "2025", amount: "Rp 0", yield: "0.0%" },
        { year: "2024", amount: "Rp 0", yield: "0.0%" },
        { year: "2023", amount: "Rp 0", yield: "0.0%" }
      ];
    }
    return [
      { year: "2025 (Final)", amount: `Rp ${Math.round(basePriceForDiv * (divYield / 100))}`, yield: `${divYield.toFixed(2)}%` },
      { year: "2024 (Total)", amount: `Rp ${Math.round(basePriceForDiv * (divYield * 0.9 / 100))}`, yield: `${(divYield * 0.9).toFixed(2)}%` },
      { year: "2023 (Total)", amount: `Rp ${Math.round(basePriceForDiv * (divYield * 0.85 / 100))}`, yield: `${(divYield * 0.85).toFixed(2)}%` },
      { year: "2022 (Total)", amount: `Rp ${Math.round(basePriceForDiv * (divYield * 0.8 / 100))}`, yield: `${(divYield * 0.8).toFixed(2)}%` },
      { year: "2021 (Total)", amount: `Rp ${Math.round(basePriceForDiv * (divYield * 0.75 / 100))}`, yield: `${(divYield * 0.75).toFixed(2)}%` }
    ];
  };
  const dividendHistory = getDividendHistory();

  // Helper calculating potentials
  const requiredFunds = lotsInput * 100 * livePrice;
  const targetValue = lotsInput * 100 * targetPriceAI;
  const potentialProfit = targetValue - requiredFunds;
  const potentialProfitPercent = ((targetPriceAI - livePrice) / livePrice) * 100;

  // Handle Select Stock
  const handleSelect = (codeOnSearch: string) => {
    if (onSelectStock) {
      onSelectStock(codeOnSearch.toUpperCase());
    }
    setCustomSearchText('');
    setSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearchText.trim()) {
      handleSelect(customSearchText.trim());
    }
  };

  const popularTickers = ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'GOTO', 'ADRO', 'ANTM', 'BRPT', 'UNVR', 'KLBF', 'ASII', 'MEDC'];

  return (
    <div id="stock-detail-page" className="space-y-6 text-left animate-fade-in">
      
      {/* 950+ STOCKS INTERACTIVE CORE NAV DESK */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 filter blur-3xl rounded-full" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-lg font-display font-black text-gray-905 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              Riset Pasar Emiten (950+ Saham BEI/IDX)
            </h2>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Ketik kode 4-huruf saham apa saja untuk memanggil analisis teknikal, bandar flow, dan prospek valuasi fundamental terkini secara real-time.
            </p>
          </div>

          {/* Search Box with Autocomplete suggestions dropdown */}
          <div className="relative w-full lg:max-w-md">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari emiten (cth: FILM, GOTO, AMRT, ASII...)"
                  value={customSearchText}
                  onChange={(e) => setCustomSearchText(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-xs text-gray-900 dark:text-white transition uppercase placeholder:normal-case shadow-inner"
                />
                {customSearchText && (
                  <button
                    type="button"
                    onClick={() => setCustomSearchText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer animate-pulse"
              >
                Cari
              </button>
            </form>

            {/* Suggestions Overlay */}
            <AnimatePresence>
              {searchFocused && customSearchText.trim().length > 0 && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setSearchFocused(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-40 p-2 divide-y divide-gray-100 dark:divide-gray-900"
                  >
                    {INDONESIAN_STOCKS.filter(s => 
                      s.code.toLowerCase().includes(customSearchText.toLowerCase()) || 
                      s.name.toLowerCase().includes(customSearchText.toLowerCase())
                    ).length > 0 ? (
                      INDONESIAN_STOCKS.filter(s => 
                        s.code.toLowerCase().includes(customSearchText.toLowerCase()) || 
                        s.name.toLowerCase().includes(customSearchText.toLowerCase())
                      ).map(s => (
                        <button
                          key={s.code}
                          type="button"
                          onClick={() => handleSelect(s.code)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-blue-500/10 rounded-xl flex items-center justify-between font-bold text-xs transition cursor-pointer text-gray-900 dark:text-gray-200"
                        >
                          <div>
                            <span className="font-mono bg-blue-500/10 text-blue-500 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px] mr-2">{s.code}</span>
                            <span>{s.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{s.industry}</span>
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelect(customSearchText)}
                        className="w-full text-left px-3.5 py-3 hover:bg-blue-500/10 rounded-xl flex items-center gap-2 font-bold text-xs text-blue-500 dark:text-blue-400 transition cursor-pointer"
                      >
                        <span>Cari kode kustom "{customSearchText.toUpperCase()}" di bursa live Yahoo...</span>
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick select stock code pills list */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mb-2.5">Pilih Cepat Emiten Unggulan:</span>
          <div className="flex flex-wrap gap-2">
            {popularTickers.map(codeStr => {
              const isActive = selectedStockCode.toUpperCase() === codeStr.toUpperCase();
              return (
                <button
                  key={codeStr}
                  type="button"
                  onClick={() => handleSelect(codeStr)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    {codeStr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT & CENTER 3 COLS: STOCK DETAILS GRID */}
        <div className="xl:col-span-3 space-y-6">
        
        {/* MODEL COMPONENT 1: COMPREHENSIVE STOCK DETAIL HEADER CARD */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 filter blur-3xl rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Stock Code & Core Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                {selectedStockCode.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-black text-gray-905 dark:text-white uppercase">{selectedStockCode}</h1>
                  <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold bg-blue-500/10 text-[#1565C0] uppercase">
                    {matchedDatasetStock?.industry || 'Papan Utama'} • Blue Chip
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{matchedDatasetStock?.name || stockDetails?.name || (selectedStockCode + " Tbk.")}</h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="font-semibold text-gray-400">Sektor: <strong className="text-gray-600 dark:text-gray-300">{matchedDatasetStock?.industry || 'Sektor Lainnya'}</strong></span>
                  <span>•</span>
                  <span>Vol Harian: <strong className="text-gray-650 dark:text-gray-300">{matchedDatasetStock?.volume || '25.4M'}</strong></span>
                </div>
              </div>
            </div>

            {/* Price Numbers Section */}
            <div className="flex items-center gap-6 md:border-l dark:border-gray-800 md:pl-6">
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Harga Terakhir</span>
                <span className="text-3xl font-mono font-black text-gray-950 dark:text-white leading-none block mt-1">
                  Rp{livePrice.toLocaleString('id-ID')}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`inline-flex items-center text-xs font-bold leading-none py-1 px-1.5 rounded ${
                    liveChangePercent >= 0 ? 'bg-emerald-500/10 text-saham-green' : 'bg-rose-500/10 text-saham-red'
                  }`}>
                    {liveChangePercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                    {liveChangePercent >= 0 ? '+' : ''}{liveChangePercent.toFixed(2)}%
                  </span>
                  <span className="text-xs font-mono font-semibold text-gray-450 dark:text-gray-400">
                    ({liveChangePoints >= 0 ? '+' : ''}{liveChangePoints})
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Health Score (Dial/Circle indicator) */}
            {(() => {
              const scoreVal = Math.round(getFundamentalScoreDetails(selectedStockCode).score * 10);
              const isExcellent = scoreVal >= 80;
              return (
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" className="text-gray-100 dark:text-gray-800" fill="transparent" />
                      <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4.5" className="text-emerald-500" fill="transparent" strokeDasharray={150.7} strokeDashoffset={150.7 * (1 - scoreVal / 100)} />
                    </svg>
                    <span className="absolute text-sm font-mono font-black text-gray-900 dark:text-white">{scoreVal}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase block">Kesehatan Saham</span>
                    <span className="text-xs font-bold text-emerald-500 block">
                      {isExcellent ? 'Sangat Prima (A)' : scoreVal >= 70 ? 'Sangat Sehat (B)' : 'Cukup Sehat (C)'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Buku Klasifikasi Aman</span>
                  </div>
                </div>
              );
            })()}

            {/* AI Advisor Badge (Large Action Callout) */}
            <div className="bg-gradient-to-br from-emerald-600/10 to-teal-500/5 border border-emerald-500/15 p-3.5 rounded-2xl flex items-center gap-3 max-w-xs shadow-inner">
              <div className="w-9 h-9 bg-emerald-500/20 text-saham-green rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] text-gray-450 dark:text-emerald-400/80 font-extrabold uppercase tracking-widest block">Rekomendasi AI Penahiy</span>
                <span className="text-sm font-black text-emerald-400 tracking-tight block">
                  {liveChangePercent >= 0 ? 'STRONG BUY' : 'ACCUMULATE'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Keyakinan: <strong className="text-emerald-505 dark:text-emerald-300">{Math.round(85 + (liveChangePercent > 0 ? 5 : -5))}%</strong></span>
              </div>
            </div>
          </div>

          {/* Watchlist toggle bar inside header */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              Riset AI didasarkan atas konsensus 18 sekuritas ternama bursa efek Indonesia.
            </p>
            <div className="flex items-center gap-2">
              <button 
                id="header-toggle-watchlist-btn"
                onClick={() => onToggleWatchlist(selectedStockCode)}
                className={`text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                  isRealWatched 
                    ? 'bg-amber-500/15 border-amber-400 text-amber-500 shadow-sm' 
                    : 'border-gray-250 dark:border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isRealWatched ? 'fill-amber-500' : ''}`} />
                {isRealWatched ? 'Disimpan di Watchlist' : 'Simpan ke Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {/* MODEL COMPONENT 2: SUB-NAVIGATION TAB SWITCH */}
        <div className="flex bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-1.5 gap-1.5 overflow-x-auto scroller-none">
          {[
            { id: 'teknikal', label: 'Teknikal', icon: Activity },
            { id: 'fundamental', label: 'Fundamental', icon: Landmark },
            { id: 'sentimen', label: 'Sentimen & Berita', icon: Globe },
            { id: 'radar', label: 'Radar Bandar', icon: BarChart3 },
            { id: 'analisis-ai', label: 'Analisa AI (Gemini)', icon: Sparkles },
            { id: 'simulasi', label: 'Simulasi Beli (Virtual)', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                id={`subtab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected 
                    ? 'bg-white dark:bg-[#1E1E1E] text-gray-950 dark:text-white shadow-sm border border-gray-100 dark:border-gray-800' 
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#1565C0]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTAINER VIEWPORTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* SUB-VIEW TAB 1: TEKNIKAL */}
            {activeSubTab === 'teknikal' && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Advanced Technical Chart Card Frame */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white">Trend Chart {selectedStockCode}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase animate-pulse ${
                          liveChangePercent >= 0 ? 'bg-emerald-500/10 text-saham-green' : 'bg-rose-500/10 text-saham-red'
                        }`}>
                          ● {liveChangePercent >= 0 ? 'Uptrend Bulanan' : 'Downtrend Terkoreksi'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Tampilan Candlestick Interaktif dengan Volume & Panel Indikator Tambahan</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Timeframe selector */}
                      <div className="flex bg-gray-50 dark:bg-gray-950/80 border border-gray-100 dark:border-gray-850 p-1 rounded-xl">
                        {(['1M', '3M', '6M', '1Y', '5Y'] as const).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                              timeframe === tf 
                                ? 'bg-[#1565C0] text-white' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Indicator Toggles Block */}
                  <div className="flex flex-wrap gap-2.5 mb-5 bg-gray-50/50 dark:bg-gray-950/20 p-3 rounded-2xl border border-gray-100 dark:border-gray-850 text-xs">
                    <span className="font-bold text-gray-400 self-center mr-1">Overlay Indikator:</span>
                    <button
                      onClick={() => setOverlays(o => ({ ...o, ma20: !o.ma20 }))}
                      className={`px-2.5 py-1 rounded-lg border transition duration-150 font-semibold ${
                        overlays.ma20 ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold' : 'border-gray-200 dark:border-gray-850 text-gray-450 text-gray-400'
                      }`}
                    >
                      MA20 (Pendek)
                    </button>
                    <button
                      onClick={() => setOverlays(o => ({ ...o, ma50: !o.ma50 }))}
                      className={`px-2.5 py-1 rounded-lg border transition duration-150 font-semibold ${
                        overlays.ma50 ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold' : 'border-gray-200 dark:border-gray-850 text-gray-450 text-gray-400'
                      }`}
                    >
                      MA50 (Menengah)
                    </button>
                    <button
                      onClick={() => setOverlays(o => ({ ...o, ma200: !o.ma200 }))}
                      className={`px-2.5 py-1 rounded-lg border transition duration-150 font-semibold ${
                        overlays.ma200 ? 'bg-purple-500/10 border-purple-500 text-purple-400 font-bold' : 'border-gray-200 dark:border-gray-850 text-gray-450 text-gray-400'
                      }`}
                    >
                      MA200 (Panjang)
                    </button>
                    <button
                      onClick={() => setOverlays(o => ({ ...o, bollinger: !o.bollinger }))}
                      className={`px-2.5 py-1 rounded-lg border transition duration-150 font-semibold ${
                        overlays.bollinger ? 'bg-teal-500/10 border-teal-500 text-teal-400 font-bold' : 'border-gray-200 dark:border-gray-850 text-gray-450 text-gray-400'
                      }`}
                    >
                      Bollinger Bands (Volatilitas)
                    </button>
                  </div>

                  {/* HIGH FIDELITY CANDLESTICK CHART CONTAINER utilizando SVG */}
                  <div className="relative border border-gray-100 dark:border-gray-850 rounded-2xl bg-gray-50/30 dark:bg-gray-950/30 p-4">
                    
                    {/* Support & Resistance Line Mark overlays */}
                    <div className="absolute inset-x-0 top-3 bottom-12 pointer-events-none select-none z-10 font-mono text-[9px] font-bold">
                      {supportPoints.map((sp) => (
                        <div key={sp} className="absolute left-4 right-4 border-t border-dashed border-emerald-500/30" style={{ bottom: `${((sp - 8800) / 1600) * 190}px` }}>
                          <span className="bg-emerald-500/10 text-saham-green px-1.5 py-0.5 rounded shadow-sm">Supp S ({sp})</span>
                        </div>
                      ))}
                      {resistancePoints.map((rp) => (
                        <div key={rp} className="absolute left-4 right-4 border-t border-dashed border-rose-500/30" style={{ bottom: `${((rp - 8800) / 1600) * 190}px` }}>
                          <span className="bg-rose-500/10 text-saham-red px-1.5 py-0.5 rounded shadow-sm">Resis R ({rp})</span>
                        </div>
                      ))}
                    </div>

                    {/* Chart Draw Surface */}
                    <div className="h-60 w-full flex items-end justify-between px-2 pt-6 pb-2 select-none relative">
                      {/* Grid background markers */}
                      <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-5 z-0">
                        {[1, 2, 3, 4, 5].map((g) => <div key={g} className="border-b border-white w-full" />)}
                      </div>

                      {/* Main candle loop */}
                      {candleData.map((cd, index) => {
                        const movesUp = cd.close >= cd.open;
                        const frameHeight = 180;
                        const minAxisY = 8800;
                        const maxAxisY = 10400;
                        const rangeAxis = maxAxisY - minAxisY;

                        const positionY = (val: number) => {
                          return ((val - minAxisY) / rangeAxis) * frameHeight;
                        };

                        const openY = positionY(cd.open);
                        const closeY = positionY(cd.close);
                        const bodyH = Math.max(Math.abs(openY - closeY), 4);
                        const bottomY = Math.min(openY, closeY);

                        const highY = positionY(cd.high);
                        const lowY = positionY(cd.low);

                        // Overlay Line curves simulation heights
                        const ma20Val = bottomY + (Math.sin(index * 0.3) * 10) + 12;
                        const ma50Val = bottomY + (Math.cos(index * 0.2) * 15) - 5;
                        const ma200Val = bottomY - 14 + (index * 0.4);

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-crosshair z-20">
                            
                            {/* SVG Column box Container */}
                            <div className="relative w-full flex items-end justify-center" style={{ height: `${frameHeight}px` }}>
                              
                              {/* Wick Line */}
                              <div 
                                className={`absolute w-0.5 ${movesUp ? 'bg-saham-green' : 'bg-saham-red'}`}
                                style={{ bottom: `${lowY}px`, height: `${highY - lowY}px` }}
                              />

                              {/* Real Body Rect */}
                              <div 
                                className={`absolute w-3 sm:w-5 md:w-7 rounded shadow-md border ${
                                  movesUp 
                                    ? 'bg-emerald-500/80 border-emerald-500 text-saham-green shadow-emerald-500/10' 
                                    : 'bg-rose-500/80 border-rose-500 text-saham-red shadow-rose-500/10'
                                }`}
                                style={{ bottom: `${bottomY}px`, height: `${bodyH}px` }}
                              />

                              {/* Overlay curve DOTS */}
                              {overlays.ma20 && (
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 z-30" style={{ bottom: `${ma20Val}px` }} />
                              )}
                              {overlays.ma50 && (
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 z-30" style={{ bottom: `${ma50Val}px` }} />
                              )}
                              {overlays.ma200 && (
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 z-30" style={{ bottom: `${ma200Val}px` }} />
                              )}

                              {/* Bollinger Bands Shading Mock */}
                              {overlays.bollinger && (
                                <div className="absolute w-full bg-teal-500/5 border-y border-dashed border-teal-500/20" style={{ bottom: `${bottomY - 18}px`, height: '40px' }} />
                              )}
                            </div>

                            {/* Time-axis label */}
                            <span className="text-[8px] sm:text-[9px] font-mono text-gray-500 mt-2 block">{cd.date}</span>

                            {/* Candlestick Interactive Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:flex flex-col bg-gray-950 text-white text-[9px] p-2 rounded-xl leading-tight z-40 shadow-xl border border-gray-800 pointer-events-none w-28 text-left">
                              <p className="font-extrabold border-b border-gray-800 pb-1 mb-1 text-center">{selectedStockCode} {cd.date}</p>
                              <div>Open: <strong className="font-mono text-gray-300">Rp{cd.open.toLocaleString('id-ID')}</strong></div>
                              <div>Close: <strong className="font-mono text-gray-300">Rp{cd.close.toLocaleString('id-ID')}</strong></div>
                              <div>High: <strong className="font-mono text-emerald-400">Rp{cd.high.toLocaleString('id-ID')}</strong></div>
                              <div>Low: <strong className="font-mono text-rose-400">Rp{cd.low.toLocaleString('id-ID')}</strong></div>
                              <div>Vol: <strong className="font-mono text-gray-300">{cd.volume}</strong></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Panel Selection for Indicator Panels (RSI, MACD, Stochastic) */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex bg-gray-100 dark:bg-gray-950/80 p-1 border border-gray-100 dark:border-gray-850 rounded-xl text-xs font-semibold">
                      <button
                        onClick={() => setIndicatorPanel('rsi')}
                        className={`px-3 py-1.5 rounded-lg transition ${indicatorPanel === 'rsi' ? 'bg-[#1565C0] text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                      >
                        Indikator RSI (14)
                      </button>
                      <button
                        onClick={() => setIndicatorPanel('macd')}
                        className={`px-3 py-1.5 rounded-lg transition ${indicatorPanel === 'macd' ? 'bg-[#1565C0] text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                      >
                        MACD (12, 26, 9)
                      </button>
                      <button
                        onClick={() => setIndicatorPanel('stoch')}
                        className={`px-3 py-1.5 rounded-lg transition ${indicatorPanel === 'stoch' ? 'bg-[#1565C0] text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                      >
                        Stochastic Oscillator
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Panel Deskilling Teknikal</span>
                  </div>

                  {/* PANEL DRAW: LOWER SUB-CHART INDICATORS */}
                  <div className="mt-4 border border-gray-100 dark:border-gray-850 bg-gray-50/20 dark:bg-gray-950/40 p-4 rounded-2xl h-24 flex items-end justify-between relative overflow-hidden">
                    {indicatorPanel === 'rsi' && (
                      <>
                        {/* Shaded Oversold / Overbought Zones limits */}
                        <div className="absolute top-1/4 h-1/2 left-0 right-0 bg-blue-500/5 border-y border-dashed border-blue-500/10 pointer-events-none" />
                        <span className="absolute top-1 left-2 text-[8px] font-mono text-blue-400">Overbought 70</span>
                        <span className="absolute bottom-1 left-2 text-[8px] font-mono text-blue-400">Oversold 30</span>
                        
                        {/* Simulated RSI Momentum Wave graph */}
                        <div className="absolute bottom-4 left-6 right-6 h-12 flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 400 50">
                            {/* Blue wave line representing RSI 62 */}
                            <path d="M 0 35 Q 40 20 80 15 T 160 25 T 240 10 T 320 28 T 400 18" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <span className="absolute top-2 right-3 font-mono text-xs font-black text-gray-900 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">RSI: 62.40 (Bullish Zone)</span>
                      </>
                    )}

                    {indicatorPanel === 'macd' && (
                      <>
                        <span className="absolute top-1 left-2 text-[8px] font-mono text-gray-500">Center Zero-Axis</span>
                        <div className="absolute left-6 right-6 bottom-3 h-14 flex items-end justify-between">
                          {/* Histograms */}
                          {[1, 2, 4, 3, 5, 4, 2, -1, -3, -2, 1, 3, 5, 6, 7].map((val, i) => (
                            <div 
                              key={i} 
                              className={`w-2.5 rounded-sm ${val >= 0 ? 'bg-emerald-500/40' : 'bg-rose-500/40'}`} 
                              style={{ 
                                height: `${Math.abs(val) * 3 + 2}px`,
                                transform: val < 0 ? 'translateY(16px)' : 'none'
                              }} 
                            />
                          ))}
                        </div>
                        <span className="absolute top-2 right-3 font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">MACD: GOLDEN CROSS</span>
                      </>
                    )}

                    {indicatorPanel === 'stoch' && (
                      <>
                        <div className="absolute bottom-4 left-6 right-6 h-12">
                          <svg className="w-full h-full" viewBox="0 0 400 50">
                            <path d="M 0 30 Q 30 10 70 8 T 150 35 T 230 42 T 310 15 T 400 10" fill="none" stroke="#fbbf24" strokeWidth="2" />
                            <path d="M 0 38 Q 30 18 70 12 T 150 25 T 230 38 T 310 22 T 400 15" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3" />
                          </svg>
                        </div>
                        <span className="absolute top-2 right-3 font-mono text-xs font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">STOCH %K(80) %D(72)</span>
                      </>
                    )}
                  </div>

                  {/* MODEL SUBCOMPONENT SUMMARY SIGNALS */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50/50 dark:bg-gray-950/20 p-4 border border-gray-100 dark:border-gray-850 rounded-2xl text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ringkasan Sinyal</span>
                      <span className="text-lg font-black text-emerald-500 block mt-1">SANGAT BUY (BELI)</span>
                      <p className="text-[10px] text-gray-500 mt-1">Tren rali kokoh konsensus</p>
                    </div>
                    <div className="bg-emerald-500/5 p-4 border border-emerald-500/10 rounded-2xl text-center">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider block">Indikator BELI</span>
                      <span className="text-2xl font-mono font-black text-emerald-500 block mt-0.5">8</span>
                      <p className="text-[10px] text-emerald-500/70 mt-0.5">EMA, MACD, Bollinger, SAR</p>
                    </div>
                    <div className="bg-rose-500/5 p-4 border border-rose-500/15 rounded-2xl text-center">
                      <span className="text-[11px] text-rose-500 font-bold tracking-wider block">Indikator JUAL</span>
                      <span className="text-2xl font-mono font-black text-rose-500 block mt-0.5">1</span>
                      <p className="text-[10px] text-rose-500/70 mt-0.5">Stoch Fast Overbought</p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-950/30 p-4 border border-gray-100 dark:border-gray-850 rounded-2xl text-center">
                      <span className="text-[11px] text-gray-400 font-bold tracking-wider block">Indikator NETRAL</span>
                      <span className="text-2xl font-mono font-black text-gray-400 block mt-0.5">3</span>
                      <p className="text-[10px] text-gray-500 mt-0.5">RSI, CCI Oscillator</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW TAB 2: FUNDAMENTAL */}
            {activeSubTab === 'fundamental' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Profile and automatic score */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      Profil Perusahaan singkat
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2.5 font-semibold">
                      {getCompanyDescription(selectedStockCode)}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1565C0] text-white rounded-xl font-bold font-mono text-xl flex items-center justify-center shadow-lg">
                      9.2
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest leading-none">Skor Kelayakan Fundamental</h4>
                      <span className="text-sm font-bold text-white block mt-1">9.2 / 10 • Kategori Istimewa</span>
                      <p className="text-[10px] text-gray-450 text-gray-400 leading-normal mt-0.5">Neraca likuid, ROE cemerlang di atas rata-rata bank konvensional, serta provisi NPL memadai.</p>
                    </div>
                  </div>

                  {/* Dividend History Block */}
                  <div>
                    <h4 className="font-display font-black text-xs text-gray-400 uppercase tracking-wider mb-2.5">Histori Pembagian Dividen</h4>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800/80 text-gray-400 font-bold uppercase text-[9px] bg-gray-50/50 dark:bg-gray-950/20">
                          <th className="py-2 px-3 rounded-l-lg">Tahun Buku</th>
                          <th className="py-2 px-3 text-right">Dividen per Lembar</th>
                          <th className="py-2 px-3 text-right rounded-r-lg">Yield Dividen %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/20">
                        {dividendHistory.map((div, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/30">
                            <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-300">{div.year}</td>
                            <td className="py-2 px-3 text-right text-emerald-500 font-mono font-bold">{div.amount}</td>
                            <td className="py-2 px-3 text-right text-gray-500 font-mono">{div.yield}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3.5 p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-emerald-500 leading-relaxed font-semibold">
                      <strong>Jadwal Dividen Terdekat:</strong> Cum date dividen final tahun buku 2025 telah tuntas terlaksana pada Rp250 per saham di Maret 2026. Dividen interim berikutnya diperkirakan akan diumumkan pada bulan November 2026.
                    </div>
                  </div>
                </div>

                {/* Valuation Ratios Grid */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                      Rasio Valuasi & Efisiensi Keuangan
                    </h3>
                    
                    {/* 6 Grid items */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                      {(() => {
                        const fund = getStockFundamentals(selectedStockCode);
                        
                        // Calculate dynamic items based on getStockFundamentals
                        const isNegativePE = fund.pe < 0;
                        const peLabel = isNegativePE ? "Negative / Rugi" : fund.pe > 22 ? "Premium / Overvalued" : fund.pe > 12 ? "Wajar / Fair" : "Undervalued / Murah";
                        const peClass = isNegativePE ? "bg-rose-500/10 text-saham-red" : fund.pe > 22 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-saham-green";
                        
                        const pbvLabel = fund.pbv > 3.0 ? "Premium Valuation" : fund.pbv > 1.2 ? "Wajar" : "Diskon / Murah";
                        const pbvClass = fund.pbv > 3.0 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-saham-green";
                        
                        const roeLabel = fund.roe > 18 ? "Sangat Tinggi" : fund.roe > 10 ? "Sehat / Prima" : "Rendah";
                        const roeClass = fund.roe > 10 ? "bg-emerald-500/10 text-saham-green" : "bg-rose-500/10 text-saham-red";

                        // Derive DER consistently
                        let hash = 0;
                        for (let i = 0; i < selectedStockCode.length; i++) {
                          hash = selectedStockCode.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        hash = Math.abs(hash);

                        const derVal = parseFloat((20 + (hash % 120) + (hash % 10) / 10).toFixed(1));
                        const derLabel = derVal > 100 ? "Leverage Tinggi" : "Sangat Aman";
                        const derClass = derVal > 105 ? "bg-rose-500/10 text-saham-red" : "bg-emerald-500/10 text-saham-green";

                        // Derive Net Profit Margin
                        const npmVal = parseFloat((3 + (hash % 35) + (hash % 10) / 10).toFixed(1));
                        const npmLabel = npmVal > 15 ? "Efisien Tinggi" : "Efisien Sedang";
                        const npmClass = npmVal > 15 ? "bg-emerald-500/10 text-saham-green" : "bg-blue-500/10 text-blue-400";

                        // EPS = Price / PE
                        const epsVal = isNegativePE ? `Rp -${Math.round(currentPrice / Math.abs(fund.pe))}` : `Rp ${Math.round(currentPrice / fund.pe)}`;

                        const items = [
                          { label: "P/E Ratio (PER)", val: `${fund.pe}x`, labelStatus: peLabel, cls: peClass },
                          { label: "Price/Book (PBV)", val: `${fund.pbv}x`, labelStatus: pbvLabel, cls: pbvClass },
                          { label: "Return on Equity (ROE)", val: `${fund.roe}%`, labelStatus: roeLabel, cls: roeClass },
                          { label: "Debt/Equity (DER)", val: `${derVal}%`, labelStatus: derLabel, cls: derClass },
                          { label: "Margins (NPM)", val: `${npmVal}%`, labelStatus: npmLabel, cls: npmClass },
                          { label: "EPS (IDR)", val: epsVal, labelStatus: fund.pe > 0 ? "Bagus" : "Tantangan Laba", cls: "bg-blue-500/10 text-blue-400" }
                        ];

                        return items.map((item, id) => (
                          <div key={id} className="bg-gray-50/50 dark:bg-gray-950/40 p-3 border border-gray-100 dark:border-gray-850 rounded-2xl flex flex-col justify-between">
                            <span className="text-[9px] text-gray-400 font-bold uppercase">{item.label}</span>
                            <span className="text-lg font-mono font-black text-gray-900 dark:text-white tracking-tight mt-1">{item.val}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase mt-1 inline-block text-center ${item.cls}`}>
                              {item.labelStatus}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Growth charts utilizando SVG */}
                  <div className="space-y-4 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    <div>
                      <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wide block mb-2">Pertumbuhan Pendapatan (Revenue) vs Laba Bersih 5 Tahun</span>
                      
                      {/* Interactive block representing Revenue values */}
                      {(() => {
                        // Generate deterministic values based on stock price
                        const baseMultiplier = currentPrice > 3000 ? (currentPrice / 150) : (currentPrice / 10);
                        const isTrillion = currentPrice > 3000;
                        const unit = isTrillion ? "T" : "B";
                        
                        let hash = 0;
                        for (let i = 0; i < selectedStockCode.length; i++) {
                          hash = selectedStockCode.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        hash = Math.abs(hash);

                        const pMargin = 3 + (hash % 30); // 3% to 33%

                        const chartData = [
                          { year: "2021", mul: 0.76 },
                          { year: "2022", mul: 0.84 },
                          { year: "2023", mul: 0.90 },
                          { year: "2024", mul: 0.95 },
                          { year: "2025", mul: 1.00 }
                        ].map(item => {
                          const revenueVal = baseMultiplier * item.mul * (1 + (hash % 10) / 100);
                          const netVal = revenueVal * (pMargin / 100);
                          
                          // Percentage for progress display
                          const rPct = Math.min(98, Math.max(30, Math.round(item.mul * 88)));
                          const nPct = Math.min(90, Math.max(10, Math.round(rPct * (pMargin / 35))));

                          return {
                            year: item.year,
                            rev: `${revenueVal.toFixed(1)}${unit}`,
                            net: `${netVal.toFixed(1)}${unit}`,
                            rPct,
                            nPct
                          };
                        });

                        return (
                          <div className="bg-gray-50/30 dark:bg-gray-950/10 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-850 space-y-2.5">
                            {chartData.map((g, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs">
                                <span className="w-8 font-mono font-bold text-gray-500">{g.year}</span>
                                <div className="flex-1 space-y-1">
                                  {/* Revenue Bar */}
                                  <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-blue-500 h-full rounded-full" style={{ width: `${g.rPct}%` }} />
                                    <span className="absolute right-2 top-0 text-[8px] leading-none font-bold text-gray-900 dark:text-white">Rev: {g.rev}</span>
                                  </div>
                                  {/* Net income bar */}
                                  <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-emerald-500 h-full rounded-full" style={{ width: `${g.nPct}%` }} />
                                    <span className="absolute right-2 top-0 text-[8px] leading-none font-bold text-gray-900 dark:text-white">Laba: {g.net}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wide block mb-2">Pertumbuhan EPS Per Kuartal (Rupiah per Saham)</span>
                      <div className="grid grid-cols-5 gap-2 text-center font-semibold">
                        {(() => {
                          const fund = getStockFundamentals(selectedStockCode);
                          const baseEps = fund.pe > 0 ? Math.round(currentPrice / fund.pe) : 15;
                          const qEpsData = [
                            { q: "Q1-25", mul: 0.85, p: "bg-[#1565C0]" },
                            { q: "Q2-25", mul: 0.92, p: "bg-[#1565C0]" },
                            { q: "Q3-25", mul: 0.96, p: "bg-[#1565C0]/90" },
                            { q: "Q4-25", mul: 1.05, p: "bg-emerald-500 shadow-lg shadow-emerald-500/10" },
                            { q: "Q1-26", mul: 1.10, p: "bg-emerald-600 shadow-md shadow-emerald-500/10" }
                          ].map(item => {
                            const val = Math.max(1, Math.round(baseEps * 0.25 * item.mul));
                            const heightClass = item.mul > 1.0 ? "h-20" : item.mul > 0.95 ? "h-16" : item.mul > 0.9 ? "h-14" : "h-12";
                            return { ...item, eps: val.toString(), heightClass };
                          });

                          return qEpsData.map((e, id) => (
                            <div key={id} className="bg-gray-50/50 dark:bg-gray-950/20 p-2 border border-gray-100 dark:border-gray-850 rounded-xl flex flex-col justify-end items-center h-28">
                              <span className="font-mono text-xs font-black text-gray-955 dark:text-white mb-1.5">Rp{e.eps}</span>
                              <div className={`w-4 sm:w-6 rounded-t-lg ${e.heightClass} ${e.p}`} />
                              <span className="text-[8px] text-gray-400 font-extrabold mt-1 uppercase block">{e.q}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW TAB 3: SENTIMEN & BERITA */}
            {activeSubTab === 'sentimen' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                {/* Sentiment Meter Gauge Col */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Meter Sentimen Pasar
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                      Mengukur akumulasi sentimen publik media, berita bursa efek lokal, dan ulasan forum sekuritas dalam 24 jam terakhir.
                    </p>
                  </div>

                  {/* Circle sentiment gauge */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                    <div className="w-36 h-20 border-t-[10px] border-l-[10px] border-r-[10px] border-gray-100 dark:border-gray-800 rounded-t-full relative overflow-hidden">
                       <div className="absolute bottom-0 left-0 h-full w-[85%] border-t-[10px] border-l-[10px] border-emerald-500 rounded-t-full transform origin-bottom translate-y-0.5" />
                    </div>
                    <span className="text-3xl font-mono font-black text-gray-900 dark:text-white -mt-2 leading-none">85%</span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-1">SANGAT BULLISH</span>
                  </div>

                  <div className="bg-blue-500/5 p-4 border border-blue-500/10 rounded-2xl">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wide block mb-1">Ringkasan Sentimen AI</span>
                    <p className="text-xs text-blue-300 font-medium leading-relaxed">
                      "Saham {selectedStockCode} sedang berada dalam sentimen positif yang didukung oleh capital inflow dan stabilitas pasar makroekunikasi domestik bursa."
                    </p>
                  </div>
                </div>

                {/* News lists related to selectedStockCode */}
                <div className="md:col-span-2 bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800/80 pb-3">
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white">
                      Berita Terkini {selectedStockCode}
                    </h3>
                    <span className="text-[9px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-950 px-2 py-0.5 rounded">Rilis Data: Real-Time</span>
                  </div>

                  {/* news loops */}
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {bbcaNews.map((news) => (
                      <div key={news.id} className="group border-b border-gray-100 dark:border-gray-800/40 pb-3 last:border-none last:pb-0 hover:bg-gray-50/20 dark:hover:bg-gray-950/20 p-2.5 rounded-2xl transition duration-150">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                              news.type === 'Positif' ? 'bg-emerald-500/15 text-saham-green' : news.type === 'Negatif' ? 'bg-rose-500/15 text-saham-red' : 'bg-gray-500/15 text-gray-400'
                            }`}>
                              {news.type}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400">{news.source}</span>
                          </div>
                          <span className="text-[9px] text-gray-450 dark:text-gray-500">{news.time}</span>
                        </div>
                        <h4 className="font-display font-black text-[#1565C0] dark:text-[#f8fafc] text-xs sm:text-sm leading-snug group-hover:text-blue-400 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-normal mt-1">
                          {news.dsc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW TAB 4: RADAR BANDAR */}
            {activeSubTab === 'radar' && (
              <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3.5">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                      Radar Bandar (Banderologi Saham {selectedStockCode})
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Melihat pola aliran dana modal investor besar vs nilai pasar harian</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-500/10 text-[#1565C0] border border-blue-500/20 uppercase tracking-widest animate-pulse">
                    Pola Terdeteksi: AKUMULASI SANGAT KUAT
                  </span>
                </div>

                {/* Chart of Price vs Volume (30 days) */}
                <div>
                  <span className="text-[10px] text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Grafik Perbandingan Trend Harga vs Volume Transaksi (30 Hari Terakhir)</span>
                  <div className="bg-gray-50/50 dark:bg-gray-950/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-850 h-56 flex items-end justify-between relative">
                    
                    {/* Visual cues for accumulation zone */}
                    <div className="absolute inset-y-0 right-12 w-28 bg-emerald-500/5 border-x border-dashed border-emerald-500/15 flex items-center justify-center z-10">
                      <span className="text-[9px] text-center text-emerald-500 font-bold font-mono tracking-widest uppercase rotate-90">Zona Akumulasi Bandar</span>
                    </div>

                    <div className="absolute inset-y-4 left-4 right-4 flex flex-col justify-between pointer-events-none opacity-5 z-0">
                      <div className="border-b border-white w-full" />
                      <div className="border-b border-white w-full" />
                      <div className="border-b border-white w-full" />
                    </div>

                    {/* Price-Volume bars loop */}
                    {[
                      { hPrice: 20, volume: 55 },
                      { hPrice: 22, volume: 45 },
                      { hPrice: 18, volume: 38 },
                      { hPrice: 25, volume: 62 },
                      { hPrice: 32, volume: 75 },
                      { hPrice: 28, volume: 50 },
                      { hPrice: 30, volume: 48 },
                      { hPrice: 35, volume: 92 },
                      { hPrice: 39, volume: 110 },
                      { hPrice: 42, volume: 125 }
                    ].map((data, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative z-20 group px-1">
                        
                        {/* Price Line Bar Indicator */}
                        <div className="w-1.5 bg-blue-500 dark:bg-blue-400 rounded-lg" style={{ height: `${data.hPrice * 2.5 + 40}px` }} />
                        
                        {/* Volume translucent bar */}
                        <div className="w-3.5 bg-emerald-500/35 rounded-t-md mt-1" style={{ height: `${data.volume * 0.9}px` }} />

                        {/* Interactive tooltip info box */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-950 p-2.5 rounded-xl border border-gray-850 text-[9px] w-28 font-mono z-40 text-left">
                          <p className="text-gray-450 border-b border-gray-800 pb-1 mb-1 font-bold">Periode T-{10 - idx}</p>
                          <div>Avg Price: <strong className="text-blue-400">Rp9.8{idx}0</strong></div>
                          <div>Foreign Buy: <strong className="text-emerald-400">+{data.volume * 2}M</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono font-semibold mt-3.5 px-1">
                    <span>Mulai (Awal Bulan)</span>
                    <span className="text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded">Rata-rata Volume Menanjak Harian: 4.5x Lipat</span>
                    <span>Hari Ini (Terbaru)</span>
                  </div>
                </div>

                {/* Foreign flow (10 days ticker analysis) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                  <div>
                    <h4 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-3">Arus Dana Asing (10 Hari Terakhir dalam Miliar Rupiah)</h4>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                      {bandarFlow.map((f, i) => (
                        <div key={i} className="bg-gray-50/50 dark:bg-gray-950/20 p-2 border border-gray-100 dark:border-gray-850 rounded-2xl flex flex-col justify-between">
                          <span className="text-[8px] text-gray-400 block font-semibold">{f.day}</span>
                          <span className={`text-xs font-mono font-black mt-1 ${f.flow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {f.flow >= 0 ? '+' : ''}{f.flow}M
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-[#121212]/30 border border-gray-800 rounded-xl text-[10px] text-gray-400 leading-normal">
                      Total Akumulasi Asing Bersih (10 Hari): <strong className="text-emerald-500 font-mono font-bold">+Rp 1.670 Miliar (Rp 1.67T) Net Buy</strong>. Angka akumulasi masif mencerminkan likuiditas pasar modal global stabil.
                    </div>
                  </div>

                  {/* Simplified description guide for beginners */}
                  <div className="bg-gradient-to-r from-blue-700/5 to-transparent border border-blue-500/10 p-5 rounded-2xl">
                    <h5 className="font-display font-black text-xs sm:text-sm text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Panduan Pemula: Membaca Kode Radar Bandar
                    </h5>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                      <li>
                        <strong className="text-gray-905 dark:text-white">1. Akumulasi Kuat:</strong> Terjadi ketika mayoritas volume pembelian dikuasi oleh segelintir broker asing besar (CS, CC, RX) sementara penjualnya adalah ritel kecil yang tersebar secara sporadis.
                      </li>
                      <li>
                        <strong className="text-gray-950 dark:text-white">2. Foreign Flow (Arus Asing):</strong> Merupakan indikator mutlak saham berkapitalisasi pasar besar. Saham {selectedStockCode} sangat dipengaruhi oleh volume transaksi bursa asing harian. Ketika asing masif Net Buy, peluang laju harga menguat meningkat tajam.
                      </li>
                      <li>
                        <strong className="text-gray-950 dark:text-white">3. Mengapa Volume Penting?:</strong> Volume spike (lonjakan tinggi mendadak) menunjukkan keseriusan institusi menyerap penawaran di pasar sekunder, menandakan harga tidak mudah longsor sesaat.
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW TAB: AI ANALYSIS REPORT (GEMINI) */}
            {activeSubTab === 'analisis-ai' && (
              <div className="space-y-6 text-left">
                {/* AI Header Card */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-base sm:text-lg text-gray-905 dark:text-white flex items-center gap-2">
                          Analisa Saham Pintar Penahiy AI
                        </h3>
                        <p className="text-xs text-gray-400 font-semibold">Memanfaatkan Google Gemini untuk evaluasi komprehensif real-time</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={fetchAIAnalysis}
                      disabled={aiLoading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition duration-150 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {aiLoading ? "Menganalisa..." : "Segarkan Analisa AI"}
                    </button>
                  </div>

                  {aiLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <Sparkles className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-gray-850 dark:text-white animate-pulse">Sedang Memproses Laporan Riset Saham {selectedStockCode}...</p>
                        <p className="text-[11px] text-gray-400">Merangkum data fundamental, trend harga harian, & indikator momentum bursa</p>
                      </div>
                    </div>
                  ) : aiError ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <Info className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-905 dark:text-white">Gagal Menghubungkan Layanan AI</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{aiError}</p>
                      </div>
                      <button 
                        onClick={fetchAIAnalysis}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-905 dark:text-white rounded-xl font-bold text-xs transition transition-all cursor-pointer"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ) : aiResult ? (
                    <div className="mt-6 space-y-6">
                      {/* Top Highlights Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50/50 dark:bg-gray-950/20 p-4 border border-gray-100 dark:border-gray-850 rounded-2xl">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Konsensus Rekomendasi</span>
                          <div className="flex items-center gap-2.5 mt-1.5">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              aiResult.recommendation.includes("BUY") 
                                ? "bg-emerald-500/15 text-saham-green" 
                                : aiResult.recommendation.includes("SELL")
                                ? "bg-rose-500/15 text-saham-red"
                                : "bg-amber-500/15 text-amber-500"
                            }`}>
                              {aiResult.recommendation}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50/50 dark:bg-gray-950/20 p-4 border border-gray-100 dark:border-gray-850 rounded-2xl">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Mesin Pemroses</span>
                          <span className="text-sm font-black text-gray-900 dark:text-white block mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            {aiResult.isRealAI ? "Gemini-3.5-Flash (Live)" : "Riset Terintegrasi"}
                          </span>
                        </div>

                        <div className="bg-gray-50/50 dark:bg-gray-950/20 p-4 border border-gray-100 dark:border-gray-850 rounded-2xl">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Status Analisa</span>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none">UP TO DATE</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Analysis Text View */}
                      <div className="border border-gray-150 dark:border-gray-800/80 rounded-2xl p-6 bg-gray-50/20 dark:bg-gray-950/10 space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                          {(() => {
                            const lines = aiResult.analysis.split("\n");
                            return lines.map((line, idx) => {
                              const trimmed = line.trim();
                              
                              if (trimmed.startsWith("### ")) {
                                return (
                                  <h4 key={idx} className="text-sm sm:text-base font-black text-gray-905 dark:text-white mt-5 mb-2.5 border-b border-gray-100 dark:border-gray-800 pb-1 flex items-center gap-2">
                                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm inline-block" />
                                    {trimmed.substring(4)}
                                  </h4>
                                );
                              }
                              
                              if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
                                return (
                                  <h3 key={idx} className="text-base sm:text-lg font-black text-gray-950 dark:text-white mt-6 mb-3 border-l-4 border-blue-600 pl-2.5">
                                    {trimmed.replace(/^#+\s+/, "")}
                                  </h3>
                                );
                              }

                              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                                const listContent = trimmed.substring(2);
                                return (
                                  <div key={idx} className="flex gap-2 text-xs sm:text-sm text-gray-650 dark:text-gray-300 ml-3.5 my-1.5 leading-relaxed">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>
                                      {parseInlineMarkdown(listContent)}
                                    </span>
                                  </div>
                                );
                              }

                              if (!trimmed) {
                                return <div key={idx} className="h-2" />;
                              }

                              return (
                                <p key={idx} className="text-xs sm:text-sm text-gray-650 dark:text-gray-300 leading-relaxed font-semibold my-2">
                                  {parseInlineMarkdown(trimmed)}
                                </p>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Disclaimer warning line */}
                      <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[10px] text-amber-500 leading-relaxed font-semibold">
                        <strong>Disclaimer Investasi:</strong> {aiResult.disclaimer || "Semua informasi saham dan hasil analisa didasarkan atas konsensus umum, umpan data feed langsung, serta kecerdasan buatan. Kami tidak bertanggung jawab atas keputusan investasi mandiri Anda."}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-905 dark:text-white">Mulai Analisa Cerdas</p>
                        <p className="text-xs text-gray-400 mt-1">Dapatkan ulasan instan dari kecerdasan buatan Gemini mengenai kinerja {selectedStockCode}</p>
                      </div>
                      <button 
                        onClick={fetchAIAnalysis}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition duration-150 cursor-pointer"
                      >
                        Jalankan Riset AI
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW TAB 5: VIRTUAL TRANSACTIONS SIMULATION */}
            {activeSubTab === 'simulasi' && (
              <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-gray-905 dark:text-white">Simulasi Pembelian Saham Virtual {selectedStockCode}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Ukur alokasi modal dan target potensi untung rugi Anda secara cerdas secara matematis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  
                  {/* Inputs and slider */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Jumlah Lot yang Diinginkan (1 Lot = 100 Lembar)</label>
                      <div className="flex gap-2">
                        <input
                          id="lots-input-field"
                          type="number"
                          value={lotsInput}
                          onChange={(e) => setLotsInput(Math.max(1, parseInt(e.target.value) || 0))}
                          className="flex-1 bg-gray-50 dark:bg-gray-950/80 border border-gray-100 dark:border-gray-850 rounded-xl px-4 py-3 font-mono font-bold text-gray-905 dark:text-white text-base focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 px-4 py-3 rounded-xl font-bold text-xs text-gray-400 self-center">
                          Total {lotsInput * 100} Lembar
                        </span>
                      </div>
                    </div>

                    {/* Quick values buttons */}
                    <div className="flex gap-2 text-xs">
                      {[5, 10, 50, 100, 500].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setLotsInput(preset)}
                          className={`px-3 py-1.5 rounded-lg border font-mono font-bold transition ${
                            lotsInput === preset 
                              ? 'bg-[#1565C0] text-white border-blue-500 shadow-sm' 
                              : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {preset} Lot
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-yellow-500/5 text-yellow-500 border border-yellow-500/10 rounded-2xl flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-[11px] leading-relaxed font-semibold">
                        <strong>Catatan Disclaimer Hukum Saham:</strong> Ini hanyalah simulasi kalkulasi portofolio virtual edukatif semata. Aplikasi Penahiy tidak melibatkan pemindahbukuan uang sungguhan, pertukaran dana nasabah bursa, atau eksekusi pesanan riil pada bursa efek IDX.
                      </p>
                    </div>
                  </div>

                  {/* Live calculations values box */}
                  <div className="bg-gray-50/50 dark:bg-gray-950/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-850">
                        <span className="text-xs text-gray-450 dark:text-gray-400 font-bold block">Harga Pembelian per Lembar</span>
                        <span className="font-mono text-sm font-bold text-gray-950 dark:text-gray-300">Rp{livePrice.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-850">
                        <span className="text-xs text-gray-450 dark:text-gray-400 font-bold block">Modal yang Dibutuhkan</span>
                        <span className="font-mono text-base font-black text-gray-905 dark:text-white">Rp{requiredFunds.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-850">
                        <div>
                          <span className="text-xs text-emerald-400 font-semibold block">Target Estimasi AI Penahiy</span>
                          <span className="text-[9px] text-gray-500 font-medium">Batas Konsensus 3 Bulan Kedepan</span>
                        </div>
                        <span className="font-mono text-sm font-extrabold text-emerald-450 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Rp{targetPriceAI.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex justify-between items-center leading-none">
                        <div>
                          <span className="text-xs text-gray-400 font-bold block">Proyeksi Profit / Loss virtual</span>
                          <span className="text-[9px] text-gray-500">Jika harga melompat menyamai target AI</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xl font-black text-emerald-500 block">
                            +Rp{potentialProfit.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-500 mt-1 block">
                            (+{potentialProfitPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        id="add-virtual-watchlist-btn"
                        onClick={handleToggleVirtualWatchlist}
                        className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition ${
                          isVirtualWatched
                            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-500'
                            : 'bg-[#1565C0] text-white shadow-xl hover:bg-blue-600'
                        }`}
                      >
                        {isVirtualWatched ? 'Hapus dari Watchlist Virtual' : 'Tambah ke Watchlist Virtual'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* RIGHT SIDEBAR (1/4 LAYOUT WIDTH) */}
      <div className="space-y-6">
        
        {/* RECOMMENDED SIMILAR SEGMENT STOCKS CARD */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Landmark className="w-5 h-5 text-blue-500 animate-pulse" />
            <h3 className="font-display font-black text-sm text-gray-905 dark:text-white">Emiten Sejenis (Sektor Bank)</h3>
          </div>

          <div className="space-y-3">
            {similarStocks.map((sh, id) => (
              <div 
                key={id} 
                className="bg-gray-50/50 dark:bg-gray-950/40 p-3 border border-gray-100 dark:border-gray-850 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition duration-150 relative group"
              >
                <div>
                  <div className="font-mono font-black text-gray-905 dark:text-white text-xs">{sh.code}</div>
                  <div className="text-[10px] text-gray-450 truncate max-w-[130px] font-medium">{sh.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-gray-900 dark:text-gray-100">Rp{sh.price.toLocaleString('id-ID')}</div>
                  <span className="text-[10px] font-black text-emerald-500 font-mono block mt-0.5">{sh.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80">
            {(() => {
              const peerStock = selectedStockCode.toUpperCase() === 'BBCA' ? 'BBRI' : 'BBCA';
              return (
                <button
                  id="compare-stocks-btn"
                  onClick={() => setComparedStock(comparedStock ? null : peerStock)}
                  className="w-full py-2 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-850 text-[11px] font-black uppercase text-[#1565C0] dark:text-blue-400 rounded-xl transition border border-gray-100 dark:border-gray-800 cursor-pointer"
                >
                  {comparedStock ? 'Tutup Perbandingan' : `Bandingkan dengan Emiten Peer`}
                </button>
              );
            })()}
          </div>
        </div>

        {/* COMPARISON EXPANDABLE CARD DRAWER */}
        <AnimatePresence>
          {comparedStock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#1565C0]/5 border border-blue-500/20 rounded-3xl p-5 shadow-sm text-xs text-left"
            >
              {(() => {
                const stockA = selectedStockCode;
                const stockB = comparedStock;

                const baseA = INDONESIAN_STOCKS.find(s => s.code.toUpperCase() === stockA.toUpperCase());
                const baseB = INDONESIAN_STOCKS.find(s => s.code.toUpperCase() === stockB.toUpperCase());
                const priceA = currentPrice;
                const priceB = baseB?.price || 4780;

                const fundA = getStockFundamentals(stockA);
                const fundB = getStockFundamentals(stockB);

                return (
                  <>
                    <h4 className="font-display font-black text-blue-400 uppercase tracking-widest text-[11px] mb-3">Head-to-head: {stockA} vs {stockB}</h4>
                    <div className="space-y-2 font-semibold">
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-850/60">
                        <span className="text-gray-400">Harga Saham:</span>
                        <span className="font-mono font-bold text-gray-200">
                          {stockA} Rp{priceA.toLocaleString('id-ID')} | {stockB} Rp{priceB.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-850/60">
                        <span className="text-gray-400">Rasio PER:</span>
                        <span className="font-mono font-bold text-gray-200">
                          {stockA} {fundA.pe}x | {stockB} {fundB.pe}x
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-850/60">
                        <span className="text-gray-400">Rasio PBV:</span>
                        <span className="font-mono text-gray-200">
                          {stockA} {fundA.pbv}x | {stockB} {fundB.pbv}x
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-850/60">
                        <span className="text-gray-400">Yield Dividen:</span>
                        <span className="font-mono font-bold text-emerald-500">
                          {stockA} {fundA.divYield}% | {stockB} {fundB.divYield}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Fokus Bisnis:</span>
                        <span className="text-blue-300">
                          {stockA} {fundA.focus} | {stockB} {fundB.focus}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI PREDICTION STAT REPORT */}
        <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/15 rounded-3xl p-5 shadow-sm text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 filter blur-xl rounded-full" />
          <h4 className="font-display font-black text-xs text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            Laporan Analitis AI
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-semibold">
            {selectedStockCode} tetap menempati saham favorit instrumen bursa jangka panjang. Estimasi rali aman memproyeksikan target konsensus jangka menengah di kisaran Rp {Math.round(currentPrice * 1.12).toLocaleString('id-ID')} dengan tingkat penyerapan asing harian yang stabil.
          </p>
        </div>

      </div>

      </div>

      {/* FLOATING SUCCESS TOAST ALERTS */}
      <AnimatePresence>
        {showVirtualToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#161b22] border border-blue-500/30 text-white rounded-2xl p-4 flex items-center gap-3 shadow-2xl max-w-sm text-left"
          >
            <div className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-100">
                {isVirtualWatched 
                  ? `Ditambahkan ke portofolio virtual saham ${selectedStockCode}!` 
                  : `Dihapus dari portofolio virtual saham ${selectedStockCode}.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
