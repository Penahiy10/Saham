/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sliders, 
  Filter, 
  Sparkles, 
  Download, 
  ArrowUpDown, 
  Check, 
  CheckSquare, 
  Square, 
  Star, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  X, 
  ExternalLink, 
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Highly rich datasets specifically for Penahiy / SahamPintar Screener
// Comprising 30 well-known Indonesian companies with full fundamental, technical, and bandarology properties
interface ScreenerStock {
  code: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  per: number;
  pbv: number;
  roe: number;
  der: number;
  marketCap: 'Small' | 'Mid' | 'Large';
  hasDividend: boolean;
  dividendYield: number;
  aiSignal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  trend: 'Uptrend' | 'Sideways' | 'Downtrend';
  rsiStatus: 'Oversold' | 'Normal' | 'Overbought';
  rsiValue: number;
  vsMA200: 'Di atas' | 'Di bawah';
  bandarPattern: 'Akumulasi' | 'Distribusi' | 'Normal';
  foreignFlow: 'Net Beli' | 'Net Jual';
  healthScore: number;
}

const MASTER_SCREENER_STOCKS: ScreenerStock[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk',
    sector: 'Perbankan',
    price: 9850,
    changePercent: 1.55,
    per: 24.5,
    pbv: 4.8,
    roe: 21.5,
    der: 0.12,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 2.28,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 62,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 87
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk',
    sector: 'Perbankan',
    price: 4780,
    changePercent: 1.92,
    per: 14.8,
    pbv: 2.2,
    roe: 18.2,
    der: 0.85,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 4.82,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 55,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 82
  },
  {
    code: 'TLKM',
    name: 'Telkom Indonesia Tbk',
    sector: 'Telekomunikasi',
    price: 3420,
    changePercent: -1.16,
    per: 15.2,
    pbv: 2.8,
    roe: 16.5,
    der: 0.45,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 4.18,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 45,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 78
  },
  {
    code: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk',
    sector: 'Teknologi',
    price: 62,
    changePercent: 5.08,
    per: 99.9, // represents high or negative
    pbv: 0.75,
    roe: -8.5,
    der: 0.22,
    marketCap: 'Mid',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 61,
    vsMA200: 'Di bawah',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 54
  },
  {
    code: 'BMRI',
    name: 'Bank Mandiri (Persero) Tbk',
    sector: 'Perbankan',
    price: 6100,
    changePercent: 2.09,
    per: 11.2,
    pbv: 2.1,
    roe: 19.5,
    der: 0.9,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 5.24,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 68,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 85
  },
  {
    code: 'BBNI',
    name: 'Bank Negara Indonesia Tbk',
    sector: 'Perbankan',
    price: 4950,
    changePercent: 1.02,
    per: 9.8,
    pbv: 1.25,
    roe: 14.8,
    der: 0.78,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 5.05,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 52,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 81
  },
  {
    code: 'ADRO',
    name: 'Adaro Energy Indonesia Tbk',
    sector: 'Energi / Tambang',
    price: 2840,
    changePercent: -2.41,
    per: 4.8,
    pbv: 0.95,
    roe: 24.1,
    der: 0.35,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 12.45,
    aiSignal: 'Hold',
    trend: 'Downtrend',
    rsiStatus: 'Oversold',
    rsiValue: 28,
    vsMA200: 'Di bawah',
    bandarPattern: 'Distribusi',
    foreignFlow: 'Net Jual',
    healthScore: 72
  },
  {
    code: 'ANTM',
    name: 'Aneka Tambang Tbk',
    sector: 'Energi / Tambang',
    price: 1515,
    changePercent: -2.88,
    per: 12.4,
    pbv: 1.55,
    roe: 12.8,
    der: 0.45,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 3.52,
    aiSignal: 'Sell',
    trend: 'Downtrend',
    rsiStatus: 'Oversold',
    rsiValue: 25,
    vsMA200: 'Di bawah',
    bandarPattern: 'Distribusi',
    foreignFlow: 'Net Jual',
    healthScore: 68
  },
  {
    code: 'PGAS',
    name: 'Perusahaan Gas Negara Tbk',
    sector: 'Utilitas',
    price: 1540,
    changePercent: 0.98,
    per: 8.5,
    pbv: 0.82,
    roe: 10.4,
    der: 1.15,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 6.2,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 48,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 71
  },
  {
    code: 'PTBA',
    name: 'Bukit Asam Tbk',
    sector: 'Energi / Tambang',
    price: 2680,
    changePercent: -1.11,
    per: 5.6,
    pbv: 1.1,
    roe: 21.0,
    der: 0.38,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 14.18,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 33,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 74
  },
  {
    code: 'BRPT',
    name: 'Barito Pacific Tbk',
    sector: 'Petrokimia',
    price: 990,
    changePercent: 8.2,
    per: 48.5,
    pbv: 3.5,
    roe: 6.2,
    der: 1.85,
    marketCap: 'Large',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Overbought',
    rsiValue: 74,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 66
  },
  {
    code: 'UNVR',
    name: 'Unilever Indonesia Tbk',
    sector: 'Konsumsi Retail',
    price: 2320,
    changePercent: -0.85,
    per: 21.2,
    pbv: 18.5,
    roe: 44.5,
    der: 2.15,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 6.81,
    aiSignal: 'Sell',
    trend: 'Downtrend',
    rsiStatus: 'Oversold',
    rsiValue: 26,
    vsMA200: 'Di bawah',
    bandarPattern: 'Distribusi',
    foreignFlow: 'Net Jual',
    healthScore: 59
  },
  {
    code: 'KLBF',
    name: 'Kalbe Farma Tbk',
    sector: 'Farmasi / Kesehatan',
    price: 1560,
    changePercent: 2.3,
    per: 22.4,
    pbv: 3.1,
    roe: 14.8,
    der: 0.18,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 2.24,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 58,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 79
  },
  {
    code: 'AMRT',
    name: 'Sumber Alfaria Trijaya Tbk',
    sector: 'Konsumsi Retail',
    price: 2950,
    changePercent: 0.34,
    per: 32.4,
    pbv: 8.8,
    roe: 28.5,
    der: 0.65,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 1.82,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 56,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 83
  },
  {
    code: 'ASII',
    name: 'Astra International Tbk',
    sector: 'Otomotif & Industri',
    price: 4850,
    changePercent: -2.41,
    per: 6.8,
    pbv: 0.95,
    roe: 15.2,
    der: 0.98,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 7.22,
    aiSignal: 'Hold',
    trend: 'Downtrend',
    rsiStatus: 'Normal',
    rsiValue: 35,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 70
  },
  {
    code: 'MEDC',
    name: 'Medco Energi Internasional Tbk',
    sector: 'Energi / Tambang',
    price: 1210,
    changePercent: 3.86,
    per: 5.2,
    pbv: 1.05,
    roe: 22.4,
    der: 1.65,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 2.85,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 64,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 76
  },
  {
    code: 'BUKA',
    name: 'Bukalapak.com Tbk',
    sector: 'Teknologi',
    price: 118,
    changePercent: -3.28,
    per: 99.9,
    pbv: 0.48,
    roe: -3.5,
    der: 0.05,
    marketCap: 'Small',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Sell',
    trend: 'Downtrend',
    rsiStatus: 'Oversold',
    rsiValue: 21,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 48
  },
  {
    code: 'INDF',
    name: 'Makanan & Konsumsi',
    sector: 'Konsumsi Retail',
    price: 6450,
    changePercent: 1.57,
    per: 6.4,
    pbv: 0.85,
    roe: 14.2,
    der: 1.05,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 4.85,
    aiSignal: 'Buy',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 49,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 77
  },
  {
    code: 'ICBP',
    name: 'Indofood CBP Sukses Makmur Tbk',
    sector: 'Konsumsi Retail',
    price: 11200,
    changePercent: 1.36,
    per: 14.2,
    pbv: 2.8,
    roe: 19.8,
    der: 0.88,
    marketCap: 'Large',
    hasDividend: true,
    dividendYield: 3.5,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 58,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 84
  },
  {
    code: 'HRUM',
    name: 'Harum Energy Tbk',
    sector: 'Energi / Tambang',
    price: 1225,
    changePercent: -1.21,
    per: 7.2,
    pbv: 1.2,
    roe: 15.5,
    der: 0.42,
    marketCap: 'Small',
    hasDividend: true,
    dividendYield: 3.12,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 41,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 71
  },
  {
    code: 'BUMI',
    name: 'Bumi Resources Tbk',
    sector: 'Energi / Tambang',
    price: 88,
    changePercent: -1.12,
    per: 18.5,
    pbv: 1.1,
    roe: 4.8,
    der: 2.85,
    marketCap: 'Small',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Sell',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 38,
    vsMA200: 'Di bawah',
    bandarPattern: 'Distribusi',
    foreignFlow: 'Net Jual',
    healthScore: 50
  },
  {
    code: 'CPIN',
    name: 'Charoen Pokphand Indonesia Tbk',
    sector: 'Konsumsi Retail',
    price: 4920,
    changePercent: 0.41,
    per: 28.5,
    pbv: 3.2,
    roe: 11.4,
    der: 0.55,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 2.1,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 44,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 73
  },
  {
    code: 'EXCL',
    name: 'XL Axiata Tbk',
    sector: 'Telekomunikasi',
    price: 2260,
    changePercent: 1.35,
    per: 18.2,
    pbv: 1.2,
    roe: 7.8,
    der: 1.95,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 2.81,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 53,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 70
  },
  {
    code: 'JSMR',
    name: 'Jasa Marga (Persero) Tbk',
    sector: 'Infrastruktur & Tol',
    price: 5200,
    changePercent: 2.45,
    per: 8.8,
    pbv: 1.15,
    roe: 13.5,
    der: 2.45,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 4.12,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 63,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 75
  },
  {
    code: 'MDKA',
    name: 'Merdeka Copper Gold Tbk',
    sector: 'Energi / Tambang',
    price: 2610,
    changePercent: -0.38,
    per: 99.9,
    pbv: 3.4,
    roe: -2.3,
    der: 1.25,
    marketCap: 'Mid',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 47,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 58
  },
  {
    code: 'SMGR',
    name: 'Semen Indonesia Tbk',
    sector: 'Infrastruktur & Tol',
    price: 3950,
    changePercent: -1.74,
    per: 10.5,
    pbv: 0.85,
    roe: 7.9,
    der: 0.68,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 5.5,
    aiSignal: 'Hold',
    trend: 'Downtrend',
    rsiStatus: 'Normal',
    rsiValue: 31,
    vsMA200: 'Di bawah',
    bandarPattern: 'Distribusi',
    foreignFlow: 'Net Jual',
    healthScore: 66
  },
  {
    code: 'INCO',
    name: 'Vale Indonesia Tbk',
    sector: 'Energi / Tambang',
    price: 3820,
    changePercent: 0.26,
    per: 11.8,
    pbv: 0.95,
    roe: 8.1,
    der: 0.15,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 2.9,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 42,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 71
  },
  {
    code: 'HEAL',
    name: 'Medikaloka Hermina Tbk',
    sector: 'Farmasi / Kesehatan',
    price: 1320,
    changePercent: 1.15,
    per: 31.4,
    pbv: 3.8,
    roe: 12.2,
    der: 0.48,
    marketCap: 'Mid',
    hasDividend: true,
    dividendYield: 1.1,
    aiSignal: 'Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 59,
    vsMA200: 'Di atas',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Beli',
    healthScore: 76
  },
  {
    code: 'ADES',
    name: 'Akasha Wira International Tbk',
    sector: 'Konsumsi Retail',
    price: 8850,
    changePercent: 3.12,
    per: 9.8,
    pbv: 2.1,
    roe: 21.4,
    der: 0.22,
    marketCap: 'Small',
    hasDividend: true,
    dividendYield: 2.5,
    aiSignal: 'Strong Buy',
    trend: 'Uptrend',
    rsiStatus: 'Normal',
    rsiValue: 66,
    vsMA200: 'Di atas',
    bandarPattern: 'Akumulasi',
    foreignFlow: 'Net Beli',
    healthScore: 84
  },
  {
    code: 'MBMA',
    name: 'Merdeka Battery Materials Tbk',
    sector: 'Energi / Tambang',
    price: 540,
    changePercent: -0.92,
    per: 88.0,
    pbv: 2.1,
    roe: 2.4,
    der: 0.75,
    marketCap: 'Mid',
    hasDividend: false,
    dividendYield: 0,
    aiSignal: 'Hold',
    trend: 'Sideways',
    rsiStatus: 'Normal',
    rsiValue: 46,
    vsMA200: 'Di bawah',
    bandarPattern: 'Normal',
    foreignFlow: 'Net Jual',
    healthScore: 61
  }
];

// List of all sectors present in our robust master list
const ALL_SECTORS = [
  'Perbankan',
  'Telekomunikasi',
  'Teknologi',
  'Energi / Tambang',
  'Utilitas',
  'Petrokimia',
  'Konsumsi Retail',
  'Farmasi / Kesehatan',
  'Otomotif & Industri',
  'Infrastruktur & Tol'
];

interface ScreenerProps {
  watchlistCodes?: string[];
  onToggleWatchlist?: (code: string) => void;
  onViewStockDetail?: (code: string) => void;
}

export default function Screener({ 
  watchlistCodes = [], 
  onToggleWatchlist, 
  onViewStockDetail 
}: ScreenerProps) {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic stock prices and performance state supporting daily/real-time updates
  const [stocksList, setStocksList] = React.useState<ScreenerStock[]>(MASTER_SCREENER_STOCKS);
  const [isLoadingLiveScreener, setIsLoadingLiveScreener] = React.useState(false);

  React.useEffect(() => {
    const fetchScreenerUpdates = async () => {
      setIsLoadingLiveScreener(true);
      try {
        const response = await fetch('/api/markets-summary');
        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            const liveMap = json.data;
            setStocksList(prev => prev.map(stock => {
              const live = liveMap[stock.code];
              if (live) {
                // Keep pre-computed rich fundamental data, but update live price & percentage movement
                return {
                  ...stock,
                  price: live.price,
                  changePercent: live.changePercent
                };
              }
              return stock;
            }));
          }
        }
      } catch (err) {
        console.warn("[Screener Live Update] Error syncing static indicators with live API feeds:", err);
      } finally {
        setIsLoadingLiveScreener(false);
      }
    };
    fetchScreenerUpdates();
  }, []);

  // 1. FILTER CONTROLS STATE
  // Fundamental Filter States
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [perMax, setPerMax] = useState<number>(100);
  const [pbvMax, setPbvMax] = useState<number>(20);
  const [roeMin, setRoeMin] = useState<number>(0);
  const [derMax, setDerMax] = useState<number>(5);
  const [marketCaps, setMarketCaps] = useState<string[]>([]);
  const [dividendOption, setDividendOption] = useState<'Semua' | 'Ada' | 'Tidak Ada'>('Semua');

  // Technical Filter States
  const [selectedAiSignals, setSelectedAiSignals] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [rsiOption, setRsiOption] = useState<'Semua' | 'Oversold' | 'Normal' | 'Overbought'>('Semua');
  const [vsMA200Option, setVsMA200Option] = useState<'Semua' | 'Di atas' | 'Di bawah'>('Semua');

  // Radar Bandar Filter States
  const [selectedBandarPatterns, setSelectedBandarPatterns] = useState<string[]>([]);
  const [selectedForeignFlows, setSelectedForeignFlows] = useState<string[]>([]);

  // Sorting State
  const [sortBy, setSortBy] = useState<keyof ScreenerStock>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Active shortcut selected (for styling)
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  // Toggle filter drawer on mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 2. PRESETS FILTER SHORTCUT MECHANISMS
  const applyPreset = (presetName: string) => {
    setActiveShortcut(presetName);
    
    // Clear other filters first
    resetAllFilters(false);

    switch (presetName) {
      case 'undervalue':
        // PER < 15, PBV < 1.5, ROE > 12%
        setPerMax(15);
        setPbvMax(1.5);
        setRoeMin(12);
        break;
      
      case 'highDividend':
        // dividendYield > 4%
        setDividendOption('Ada');
        setRoeMin(10); // healthy company
        break;
      
      case 'momentum':
        // Uptrend + Strong Buy
        setSelectedTrends(['Uptrend']);
        setSelectedAiSignals(['Strong Buy', 'Buy']);
        setRsiOption('Normal'); // momentum in healthy RSI zone
        break;
      
      case 'radarBandar':
        // Bandar: Accumulation & Foreign flows: Net buy
        setSelectedBandarPatterns(['Akumulasi']);
        setSelectedForeignFlows(['Net Beli']);
        break;

      case 'blueChipCheap':
        // Large-cap and PBV < 2.5
        setMarketCaps(['Large']);
        setPbvMax(2.5);
        break;

      case 'turnaround':
        // Low ROE but high momentum/Buying AI Signal & very solid DER
        setRoeMin(0); 
        setSelectedAiSignals(['Strong Buy', 'Buy']);
        setDerMax(1.5);
        setPbvMax(1.5);
        break;

      default:
        break;
    }
  };

  const resetAllFilters = (clearShortcut = true) => {
    if (clearShortcut) {
      setActiveShortcut(null);
    }
    // Fundamentals
    setSelectedSectors([]);
    setPerMax(100);
    setPbvMax(20);
    setRoeMin(0);
    setDerMax(5);
    setMarketCaps([]);
    setDividendOption('Semua');

    // Technical
    setSelectedAiSignals([]);
    setSelectedTrends([]);
    setRsiOption('Semua');
    setVsMA200Option('Semua');

    // Bandar
    setSelectedBandarPatterns([]);
    setSelectedForeignFlows([]);
  };

  // Sector Multi-Select Toggler
  const toggleSector = (sector: string) => {
    setActiveShortcut(null);
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  // AI Signal Multi-Select Toggler
  const toggleAiSignal = (sig: string) => {
    setActiveShortcut(null);
    setSelectedAiSignals(prev => 
      prev.includes(sig) ? prev.filter(s => s !== sig) : [...prev, sig]
    );
  };

  // Trend Multi-Select Toggler
  const toggleTrend = (trend: string) => {
    setActiveShortcut(null);
    setSelectedTrends(prev => 
      prev.includes(trend) ? prev.filter(t => t !== trend) : [...prev, trend]
    );
  };

  // Market Cap Multi-Select Toggler
  const toggleMarketCap = (cap: string) => {
    setActiveShortcut(null);
    setMarketCaps(prev => 
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  };

  // Bandar patterns Multi-Select Toggler
  const toggleBandarPattern = (pattern: string) => {
    setActiveShortcut(null);
    setSelectedBandarPatterns(prev => 
      prev.includes(pattern) ? prev.filter(p => p !== pattern) : [...prev, pattern]
    );
  };

  // Foreign Toggler
  const toggleForeignFlow = (flow: string) => {
    setActiveShortcut(null);
    setSelectedForeignFlows(prev => 
      prev.includes(flow) ? prev.filter(f => f !== flow) : [...prev, flow]
    );
  };

  // 3. CORE FILTERING LOGIC MATCH ENGINE
  const filteredStocks = useMemo(() => {
    return stocksList.filter(stock => {
      // 1. Text Search query (Filter code or name)
      if (searchQuery) {
        const query = searchQuery.trim().toLowerCase();
        const matchesCode = stock.code.toLowerCase().includes(query);
        const matchesName = stock.name.toLowerCase().includes(query);
        if (!matchesCode && !matchesName) return false;
      }

      // 2. Sector matching
      if (selectedSectors.length > 0 && !selectedSectors.includes(stock.sector)) {
        return false;
      }

      // 3. PER value matching
      if (stock.per > perMax) return false;

      // 4. PBV value matching
      if (stock.pbv > pbvMax) return false;

      // 5. ROE value matching
      if (stock.roe < roeMin) return false;

      // 6. DER value matching
      if (stock.der > derMax) return false;

      // 7. Market Cap classification
      if (marketCaps.length > 0 && !marketCaps.includes(stock.marketCap)) {
        return false;
      }

      // 8. Dividend matching
      if (dividendOption === 'Ada' && !stock.hasDividend) return false;
      if (dividendOption === 'Tidak Ada' && stock.hasDividend) return false;

      // 9. AI Signals matching
      if (selectedAiSignals.length > 0 && !selectedAiSignals.includes(stock.aiSignal)) {
        return false;
      }

      // 10. Trend matching
      if (selectedTrends.length > 0 && !selectedTrends.includes(stock.trend)) {
        return false;
      }

      // 11. RSI matching
      if (rsiOption !== 'Semua' && stock.rsiStatus !== rsiOption) return false;

      // 12. vsMA200 matching
      if (vsMA200Option !== 'Semua' && stock.vsMA200 !== vsMA200Option) return false;

      // 13. Bandar Patterns
      if (selectedBandarPatterns.length > 0 && !selectedBandarPatterns.includes(stock.bandarPattern)) {
        return false;
      }

      // 14. Foreign Flows
      if (selectedForeignFlows.length > 0 && !selectedForeignFlows.includes(stock.foreignFlow)) {
        return false;
      }

      return true;
    });
  }, [
    stocksList, searchQuery, selectedSectors, perMax, pbvMax, roeMin, derMax, 
    marketCaps, dividendOption, selectedAiSignals, selectedTrends, 
    rsiOption, vsMA200Option, selectedBandarPatterns, selectedForeignFlows
  ]);

  // 4. COLUMN INTERACTIVE SORT ENGINE
  const sortedStocks = useMemo(() => {
    const list = [...filteredStocks];
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        const strA = valA as string;
        const strB = valB as string;
        return sortOrder === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      } else if (typeof valA === 'number') {
        const numA = valA as number;
        const numB = valB as number;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      } else {
        // boolean fallbacks
        const boolA = valA ? 1 : 0;
        const boolB = valB ? 1 : 0;
        return sortOrder === 'asc' ? boolA - boolB : boolB - boolA;
      }
    });
    return list;
  }, [filteredStocks, sortBy, sortOrder]);

  const triggerSort = (column: keyof ScreenerStock) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // 5. COMMODITY EXPORT TO FILE GRAPHIC SPEC
  const handleExportCSV = () => {
    // Generate simple csv file layout structure
    const headers = [
      'Kode Ticker', 'Nama Emiten', 'Sektor', 'Harga Terakhir', 'Perubahan %',
      'PER (x)', 'PBV (x)', 'ROE (%)', 'DER (x)', 'Dividen Yield', 
      'Rekomendasi AI', 'Tren Teknikal', 'Skor Kesehatan'
    ];
    
    const csvContent = sortedStocks.map(s => [
      s.code,
      `"${s.name}"`,
      s.sector,
      s.price,
      s.changePercent,
      s.per,
      s.pbv,
      s.roe,
      s.der,
      s.dividendYield,
      s.aiSignal,
      s.trend,
      s.healthScore
    ].join(';')).join('\n');

    const rawString = headers.join(';') + '\n' + csvContent;
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), rawString], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Screener_Saham_Penahiy_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. AI SIGNAL PIE BAR STATISTICS ANALYSIS
  const signalStats = useMemo(() => {
    const counts = { 'Strong Buy': 0, 'Buy': 0, 'Hold': 0, 'Sell': 0, 'Strong Sell': 0 };
    sortedStocks.forEach(s => {
      if (counts[s.aiSignal] !== undefined) {
        counts[s.aiSignal]++;
      }
    });
    
    const totalFiltered = sortedStocks.length || 1;
    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / totalFiltered) * 100),
      color: label === 'Strong Buy' ? 'bg-emerald-650 bg-emerald-500' 
             : label === 'Buy' ? 'bg-green-550 bg-green-500'
             : label === 'Hold' ? 'bg-yellow-550 bg-amber-500' 
             : label === 'Sell' ? 'bg-orange-550 bg-orange-500' 
             : 'bg-red-550 bg-red-500'
    }));
  }, [sortedStocks]);

  return (
    <div id="expert-screener-view" className="space-y-6 text-left">
      
      {/* SCREENER SECTION TITLE PLATFORM OVERVIEW */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 filter blur-2xl rounded-full" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-500/10 text-saham-green rounded-xl">
                <Sliders className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-gray-900 dark:text-white">Screener Saham Cerdas Penahiy</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1 mr-3 leading-relaxed font-semibold">
              Filter emiten Bursa Efek Indonesia secara real-time berdasarkan konstelasi fundamental, sinyal momentum teknikal, dan status akumulasi bandarologi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              id="exportcsv-screener-btn"
              onClick={handleExportCSV}
              disabled={sortedStocks.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1565C0] hover:bg-[#1565C0]/90 disabled:opacity-40 text-white text-xs font-bold rounded-2xl transition shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Ekspor ke CSV
            </button>
            <button 
              onClick={() => resetAllFilters(true)}
              className="inline-flex items-center gap-1 px-3 py-2.5 border border-gray-250 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-2xl text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bersihkan Filter
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PRESET FILTER SHORTCUT PANEL */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-gray-100 dark:border-gray-850">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold text-gray-450 text-gray-400 uppercase tracking-widest leading-none">Preset Shortcut Saringan Cepat</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'undervalue', label: 'Saham Undervalue', tip: 'PER rendah, PBV murah, ROE tinggi' },
            { id: 'highDividend', label: 'Dividen Tinggi', tip: 'Perkakas tebal, profit stabil' },
            { id: 'momentum', label: 'Saham Momentum', tip: 'Teknikal Uptrend + Strong AI Buy' },
            { id: 'radarBandar', label: 'Radar Bandar', tip: 'Akumulasi & Asing gencar net beli' },
            { id: 'blueChipCheap', label: 'Blue Chip Murah', tip: 'Kapitalisasi dominan, PBV terdiskon' },
            { id: 'turnaround', label: 'Turnaround Candidate', tip: 'Aset andalan pulih dari tekanan leverage' },
          ].map(preset => (
            <button
              id={`preset-btn-${preset.id}`}
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-left relative group cursor-pointer ${
                activeShortcut === preset.id
                  ? 'bg-emerald-500/10 border-saham-green text-saham-green shadow-sm'
                  : 'bg-gray-50/50 dark:bg-gray-950/20 border-gray-150 dark:border-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-350 dark:hover:border-gray-700'
              }`}
            >
              <span className="block leading-none">{preset.label}</span>
              <span className="text-[9px] text-gray-450 dark:text-gray-500 font-medium block mt-0.5 leading-none">{preset.tip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* COMPREHENSIVE RESPONSIVE 2-COLUMN MESH */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: CRISTALLINE FILTER SETTINGS */}
        <div className="xl:col-span-1 space-y-5">
          
          {/* Mobile Filter Toggle handle */}
          <div className="xl:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300"
            >
              <span className="inline-flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#1565C0]" />
                {showMobileFilters ? 'Sembunyikan Panel Filter' : 'Buka Semua Parameter Filter'}
              </span>
              <span className="px-2 py-0.5 text-[9px] bg-[#1565C0]/25 text-blue-400 rounded">
                {selectedSectors.length + marketCaps.length + selectedAiSignals.length + selectedTrends.length} Aktif
              </span>
            </button>
          </div>

          <div className={`xl:block space-y-5 ${showMobileFilters ? 'block' : 'hidden md:hidden xl:block'}`}>
            
            {/* PANEL CATEGORY 1: FUNDAMENTAL FILTERS */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-gray-100 dark:border-gray-850">
                1. Analisa Fundamental
              </h3>
              
              <div className="space-y-4">
                
                {/* Sector Multi-select lists */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Sektor Industri BEI ({selectedSectors.length})</label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs select-none">
                    {ALL_SECTORS.map(sec => {
                      const isChecked = selectedSectors.includes(sec);
                      return (
                        <div 
                          key={sec} 
                          onClick={() => toggleSector(sec)}
                          className="flex items-center gap-2 p-1.5 hover:bg-gray-50/50 dark:hover:bg-gray-950/20 rounded cursor-pointer transition text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-4 h-4 text-[#1565C0]" /> : <Square className="w-4 h-4 text-gray-400" />}
                          <span className="truncate leading-none">{sec}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PER Sliders */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                    <span className="text-gray-400">PEG/PER Maksimal</span>
                    <span className="font-mono text-emerald-500">{perMax}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={perMax}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setPerMax(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#1565C0]"
                  />
                </div>

                {/* PBV Sliders */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                    <span className="text-gray-400">PBV Maksimal</span>
                    <span className="font-mono text-emerald-500">{pbvMax}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={pbvMax}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setPbvMax(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#1565C0]"
                  />
                </div>

                {/* ROE Min Slider */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                    <span className="text-gray-400">ROE Minimal</span>
                    <span className="font-mono text-emerald-500">{roeMin}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={roeMin}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setRoeMin(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#1565C0]"
                  />
                </div>

                {/* Debt/Equity slider */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                    <span className="text-gray-400">DER Maksimal</span>
                    <span className="font-mono text-emerald-500">{derMax}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={derMax}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setDerMax(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#1565C0]"
                  />
                </div>

                {/* Market caps block checkboxes */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Kapitalisasi Pasar</label>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {['Small', 'Mid', 'Large'].map((cap) => {
                      const isChecked = marketCaps.includes(cap);
                      return (
                        <div 
                          key={cap}
                          onClick={() => toggleMarketCap(cap)}
                          className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-950/20 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#1565C0]" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                          <span>{cap} Cap</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dividends layout toggle */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Status Dividen</label>
                  <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-gray-950 p-1 border border-gray-150 dark:border-gray-850 rounded-xl text-[10px] font-bold">
                    {(['Semua', 'Ada', 'Tidak Ada'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => {
                          setActiveShortcut(null);
                          setDividendOption(opt);
                        }}
                        className={`py-1.5 rounded-lg text-center transition ${dividendOption === opt ? 'bg-[#1565C0] text-white' : 'text-gray-400'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* PANEL CATEGORY 2: TECHNICAL FILTERS */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-gray-100 dark:border-gray-850">
                2. Sinyal & Teknikal
              </h3>
              
              <div className="space-y-4">
                
                {/* Sinyal list checks */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Sinyal AI Penahiy</label>
                  <div className="space-y-1 text-xs">
                    {['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'].map(sig => {
                      const isChecked = selectedAiSignals.includes(sig);
                      return (
                        <div 
                          key={sig}
                          onClick={() => toggleAiSignal(sig)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-950/20 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#1565C0]" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                          <span className={`w-2 h-2 rounded-full ${
                            sig.includes('Buy') ? 'bg-emerald-500' : sig.includes('Hold') ? 'bg-amber-400' : 'bg-rose-500'
                          }`} />
                          <span className="font-semibold">{sig}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trend checkboxes */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Kondisi Tren Harga</label>
                  <div className="space-y-1 text-xs">
                    {['Uptrend', 'Sideways', 'Downtrend'].map(trend => {
                      const isChecked = selectedTrends.includes(trend);
                      return (
                        <div 
                          key={trend}
                          onClick={() => toggleTrend(trend)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-950/20 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#1565C0]" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                          <span>{trend}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RSI limit choices */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Status Jenuh (RSI 14)</label>
                  <select
                    value={rsiOption}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setRsiOption(e.target.value as any);
                    }}
                    className="w-full bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs font-semibold border border-gray-150 dark:border-gray-850 rounded-xl px-2 py-1.5 cursor-pointer"
                  >
                    <option value="Semua">Semua RSI</option>
                    <option value="Oversold">Oversold (Jenuh Jual &lt;30)</option>
                    <option value="Normal">Normal (Stabil 30 - 70)</option>
                    <option value="Overbought">Overbought (Jenuh Beli &gt;70)</option>
                  </select>
                </div>

                {/* Position Vs MA200 */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Posisi vs MA200 (Long term)</label>
                  <select
                    value={vsMA200Option}
                    onChange={(e) => {
                      setActiveShortcut(null);
                      setVsMA200Option(e.target.value as any);
                    }}
                    className="w-full bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-white text-xs font-semibold border border-gray-150 dark:border-gray-850 rounded-xl px-2 py-1.5 cursor-pointer"
                  >
                    <option value="Semua">Semua Posisi</option>
                    <option value="Di atas">Di atas MA-200 (Bullish)</option>
                    <option value="Di bawah">Di bawah MA-200 (Bearish)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* PANEL CATEGORY 3: RADAR BANDAR (BANDAROLOGY) FILTERS */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-gray-100 dark:border-gray-850">
                3. Radar Bandar (Banderologi)
              </h3>
              
              <div className="space-y-4">
                
                {/* Bandar pattern */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Pola Transaksi Bandar</label>
                  <div className="space-y-1 text-xs">
                    {['Akumulasi', 'Distribusi', 'Normal'].map(pat => {
                      const isChecked = selectedBandarPatterns.includes(pat);
                      return (
                        <div 
                          key={pat}
                          onClick={() => toggleBandarPattern(pat)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-950/20 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#1565C0]" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                          <span>{pat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Foreign flow */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Arus Modal Asing (10 Hari)</label>
                  <div className="space-y-1 text-xs">
                    {['Net Beli', 'Net Jual'].map(flow => {
                      const isChecked = selectedForeignFlows.includes(flow);
                      return (
                        <div 
                          key={flow}
                          onClick={() => toggleForeignFlow(flow)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-950/20 rounded cursor-pointer text-gray-700 dark:text-gray-300"
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#1565C0]" /> : <Square className="w-3.5 h-3.5 text-gray-400" />}
                          <span>Asing: {flow}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SCREENER RESULTS & AI DIAGNOSTIC DISTRIBUTION */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* STATS BREAKDOWN BENTO BLOCK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            
            {/* Total count summary */}
            <div className="flex flex-col justify-between p-2.5">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ringkasan Saringan</span>
                <h3 className="text-3xl font-mono font-black text-gray-950 dark:text-white leading-none block mt-2.5">
                  {sortedStocks.length} <span className="text-xs font-sans text-gray-450 font-bold">ditemukan</span>
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 block mt-2 leading-tight">
                Terseleksi dari total <strong className="text-gray-900 dark:text-white font-mono">{stocksList.length}</strong> emiten fundamental BEI yang dipantau Penahiy. 
              </p>
            </div>

            {/* Signal Distribution Visual Progress bars */}
            <div className="md:col-span-2 p-1 text-left space-y-2.5 border-t md:border-t-0 md:border-l dark:border-gray-800 md:pl-6 pt-4 md:pt-0">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Distribusi Rekomendasi AI Saham Terfilter</span>
              
              <div className="space-y-1.5">
                {signalStats.map((stat, i) => {
                  if (stat.count === 0) return null;
                  return (
                    <div key={i} className="flex items-center gap-3 text-[10px]">
                      <span className="w-20 font-bold text-gray-400 truncate tracking-tight">{stat.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                        <div className={`absolute left-0 top-0 h-full rounded-full ${stat.color}`} style={{ width: `${stat.percent}%` }} />
                      </div>
                      <span className="w-10 text-right font-mono font-black text-gray-900 dark:text-white">{stat.count} ({stat.percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TABLE GRAPHICS CARD CONTAINER */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm Space-y-4">
            
            {/* Controls table toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              
              {/* Search text field */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-filter-screener-input"
                  type="text"
                  placeholder="Cari kode saham atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Table Quick filter description */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold mb-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Tekan salah satu nama kolom tabel di bawah untuk mengurutkan (Sort).</span>
              </div>
            </div>

            {/* RESULTS DATATABLE GRAPHIC */}
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-150 dark:border-gray-800 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/30 dark:bg-gray-850/10 text-[9px]">
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 rounded-l-lg" onClick={() => triggerSort('code')}>
                      <div className="flex items-center gap-1">
                        Kode {sortBy === 'code' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100" onClick={() => triggerSort('name')}>
                      <div className="flex items-center gap-1">
                        Nama Emiten {sortBy === 'name' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100" onClick={() => triggerSort('sector')}>
                      <div className="flex items-center gap-1 text-center justify-center">
                        Sektor {sortBy === 'sector' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-right" onClick={() => triggerSort('price')}>
                      <div className="flex items-center gap-1 justify-end">
                        Harga (Rp) {sortBy === 'price' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-right" onClick={() => triggerSort('changePercent')}>
                      <div className="flex items-center gap-1 justify-end">
                        % Hari {sortBy === 'changePercent' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-right" onClick={() => triggerSort('per')}>
                      <div className="flex items-center gap-1 justify-end">
                        PER {sortBy === 'per' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-right" onClick={() => triggerSort('pbv')}>
                      <div className="flex items-center gap-1 justify-end">
                        PBV {sortBy === 'pbv' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-right" onClick={() => triggerSort('roe')}>
                      <div className="flex items-center gap-1 justify-end">
                        ROE {sortBy === 'roe' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-center" onClick={() => triggerSort('aiSignal')}>
                      <div className="flex items-center gap-1 justify-center">
                        Sinyal AI {sortBy === 'aiSignal' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 text-center" onClick={() => triggerSort('healthScore')}>
                      <div className="flex items-center gap-1 justify-center">
                        Kes {sortBy === 'healthScore' && <ArrowUpDown className="w-3 h-3 text-[#1565C0]" />}
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800/20">
                  {sortedStocks.length > 0 ? (
                    sortedStocks.map((stock) => {
                      const isUp = stock.changePercent >= 0;
                      const inWatchlist = watchlistCodes.includes(stock.code);

                      return (
                        <tr
                          id={`screener-row-code-${stock.code}`}
                          key={stock.code}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 font-semibold"
                        >
                          {/* Kode ticker code badge */}
                          <td className="py-3 px-3 font-display font-black text-sm tracking-wide text-gray-900 dark:text-white">
                            {stock.code}
                          </td>
                          
                          {/* Stock human local name */}
                          <td className="py-3 px-3 text-gray-500 dark:text-gray-400 font-medium truncate max-w-[120px]">
                            {stock.name}
                          </td>

                          {/* Industry tagged badge */}
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 truncate block max-w-[100px]">
                              {stock.sector}
                            </span>
                          </td>

                          {/* Last recorded close price */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-gray-950 dark:text-white">
                            Rp{stock.price.toLocaleString('id-ID')}
                          </td>

                          {/* Real daily pricing difference points */}
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex items-center font-mono font-bold ${
                              isUp ? 'text-saham-green' : 'text-saham-red'
                            }`}>
                              {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </td>

                          {/* Essential valuation ratios details */}
                          <td className="py-3 px-3 text-right font-mono text-gray-800 dark:text-gray-300">
                            {stock.per === 99.9 ? '-' : `${stock.per}x`}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-800 dark:text-gray-300">
                            {stock.pbv}x
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-gray-800 dark:text-gray-300">
                            <span className={stock.roe > 15 ? 'text-emerald-500 font-bold' : ''}>
                              {stock.roe}%
                            </span>
                          </td>

                          {/* AI Action Indicator tags */}
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-center tracking-tight inline-block ${
                              stock.aiSignal.includes('Strong Buy') ? 'bg-emerald-500/10 text-saham-green border border-emerald-500/20' 
                              : stock.aiSignal.includes('Buy') ? 'bg-green-500/10 text-emerald-400'
                              : stock.aiSignal.includes('Hold') ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-rose-500/10 text-saham-red'
                            }`}>
                              {stock.aiSignal}
                            </span>
                          </td>

                          {/* Corporate overall financial health index */}
                          <td className="py-3 px-3 text-center">
                            <span className={`font-mono font-black text-sm ${
                              stock.healthScore >= 80 ? 'text-emerald-500' 
                              : stock.healthScore >= 70 ? 'text-amber-400' 
                              : 'text-gray-400'
                            }`}>
                              {stock.healthScore}
                            </span>
                          </td>

                          {/* ACTION PANEL BUTTONS LINKS FOR DETAILED HOVERS */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View comprehensive details switch trigger */}
                              <button
                                id={`action-view-${stock.code}`}
                                onClick={() => onViewStockDetail && onViewStockDetail(stock.code)}
                                className="p-1.5 hover:bg-[#1565C0]/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer relative group-hover:block"
                                title="Lihat Analisis Detail"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Watchlist code buttons bookmarks */}
                              <button
                                id={`action-watch-${stock.code}`}
                                onClick={() => onToggleWatchlist && onToggleWatchlist(stock.code)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  inWatchlist 
                                    ? 'text-amber-500 bg-amber-500/10' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                                title={inWatchlist ? "Keluarkan dari watchlist" : "Tambahkan ke watchlist"}
                              >
                                <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-500' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-gray-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <AlertCircle className="w-8 h-8 text-gray-500" />
                          <div>
                            <p className="text-sm">Tidak ada emiten yang memenuhi kriteria filter saat ini.</p>
                            <p className="text-[10px] text-gray-500 font-medium mt-1">Coba kurangi beberapa kriteria filter atau tekan tombol "Bersihkan Filter".</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Note guidelines underneath table metrics */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-850 text-left flex items-start gap-1.5 text-[10px] text-gray-400 leading-normal font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span>
                Kategori kapitalisasi pasar didefinisikan secara konvensional: <strong>Large Cap</strong> (&gt;Rp 100 Triliun), <strong>Mid Cap</strong> (Rp 10T - Rp 100T), dan <strong>Small Cap</strong> (&lt;Rp 10Triliun). Rasio fundamental disesuaikan berkala pasca audit laporan keuangan kuartal triwulan.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
