/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Bell, 
  BellOff, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  CalendarDays, 
  Award, 
  Star, 
  List, 
  Layers, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  DollarSign,
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Struct definitions
interface CorporateEvent {
  id: string;
  dateStr: string; // e.g. "2026-05-25" for easy parsing
  day: number;     // Day of month
  month: number;   // 4 for May, 5 for June
  year: number;    // 2026
  displayDate: string; // "25 Mei 2026"
  code: string;    // e.g. "BBRI"
  companyName: string; // e.g. "Bank Rakyat Indonesia (Persero) Tbk"
  category: 'Laporan Keuangan' | 'Dividen' | 'RUPS' | 'IPO' | 'Libur Bursa';
  detail: string;
  impact: 'Tinggi' | 'Sedang' | 'Rendah';
}

interface IPOItem {
  id: string;
  companyName: string;
  tickerProposed: string;
  sector: string;
  offeringDate: string;
  priceRange: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  sharesRange: string;
  underwriter: string;
}

// 1. Comprehensive Corporate Financial Event Calendar (2026-05 & 2026-06)
const EVENT_DB: CorporateEvent[] = [
  {
    id: 'ev-1',
    dateStr: '2026-05-01',
    day: 1,
    month: 4,
    year: 2026,
    displayDate: '1 Mei 2026',
    code: 'BURSA',
    companyName: 'Bursa Efek Indonesia',
    category: 'Libur Bursa',
    detail: 'Hari Buruh Internasional (Pasar Tutup)',
    impact: 'Tinggi'
  },
  {
    id: 'ev-2',
    dateStr: '2026-05-05',
    day: 5,
    month: 4,
    year: 2026,
    displayDate: '5 Mei 2026',
    code: 'NCD',
    companyName: 'PT Nusantara Cloud Digital Tbk',
    category: 'IPO',
    detail: 'Pencatatan Perdana (Listing) di Papan Utama',
    impact: 'Sedang'
  },
  {
    id: 'ev-3',
    dateStr: '2026-05-11',
    day: 11,
    month: 4,
    year: 2026,
    displayDate: '11 Mei 2026',
    code: 'TLKM',
    companyName: 'PT Telkom Indonesia (Persero) Tbk',
    category: 'Laporan Keuangan',
    detail: 'Rilis Pembaruan Laporan Keuangan Kuartal I-2026',
    impact: 'Sedang'
  },
  {
    id: 'ev-4',
    dateStr: '2026-05-14',
    day: 14,
    month: 4,
    year: 2026,
    displayDate: '14 Mei 2026',
    code: 'BURSA',
    companyName: 'Bursa Efek Indonesia',
    category: 'Libur Bursa',
    detail: 'Hari Kenaikan Yesus Kristus (Pasar Tutup)',
    impact: 'Tinggi'
  },
  {
    id: 'ev-5',
    dateStr: '2026-05-18',
    day: 18,
    month: 4,
    year: 2026,
    displayDate: '18 Mei 2026',
    code: 'BMRI',
    companyName: 'PT Bank Mandiri (Persero) Tbk',
    category: 'Dividen',
    detail: 'Cum Date Dividen Tunai Saham Senilai Rp 350 per Lembah',
    impact: 'Tinggi'
  },
  {
    id: 'ev-6',
    dateStr: '2026-05-20',
    day: 20,
    month: 4,
    year: 2026,
    displayDate: '20 Mei 2026',
    code: 'ADRO',
    companyName: 'PT Adaro Energy Indonesia Tbk',
    category: 'RUPS',
    detail: 'Rapat Umum Pemegang Saham Tahunan (RUPST) Agenda Dividen',
    impact: 'Tinggi'
  },
  {
    id: 'ev-7',
    dateStr: '2026-05-25',
    day: 25,
    month: 4,
    year: 2026,
    displayDate: '25 Mei 2026',
    code: 'BBRI',
    companyName: 'PT Bank Rakyat Indonesia (Persero) Tbk',
    category: 'RUPS',
    detail: 'Rapat Umum Pemegang Saham Tahunan (RUPST) & Pengumuman Pembagian Dividen Final 2025',
    impact: 'Tinggi'
  },
  {
    id: 'ev-8',
    dateStr: '2026-05-26',
    day: 26,
    month: 4,
    year: 2026,
    displayDate: '26 Mei 2026',
    code: 'TLKM',
    companyName: 'PT Telkom Indonesia (Persero) Tbk',
    category: 'Dividen',
    detail: 'Cum Date Pembagian Dividen Rp 124 per Saham untuk Tahun Buku 2025',
    impact: 'Tinggi'
  },
  {
    id: 'ev-9',
    dateStr: '2026-05-27',
    day: 27,
    month: 4,
    year: 2026,
    displayDate: '27 Mei 2026',
    code: 'MAKRO',
    companyName: 'Bank Indonesia & BPS',
    category: 'Laporan Keuangan', // count under macro reporting
    detail: 'Rilis Data Neraca Dagang Domestik (Estimasi Surplus)',
    impact: 'Sedang'
  },
  {
    id: 'ev-10',
    dateStr: '2026-05-28',
    day: 28,
    month: 4,
    year: 2026,
    displayDate: '28 Mei 2026',
    code: 'ANTM',
    companyName: 'PT Aneka Tambang Tbk',
    category: 'RUPS',
    detail: 'Rapat Umum Pemegang Saham Luar Biasa (RUPSLB) Pergantian Komisaris',
    impact: 'Sedang'
  },
  {
    id: 'ev-11',
    dateStr: '2026-05-28',
    day: 28,
    month: 4,
    year: 2026,
    displayDate: '28 Mei 2026',
    code: 'ICBP',
    companyName: 'PT Indofood CBP Sukses Makmur Tbk',
    category: 'Laporan Keuangan',
    detail: 'Rilis Laporan Keuangan Kuartal I-2026',
    impact: 'Tinggi'
  },
  {
    id: 'ev-12',
    dateStr: '2026-05-29',
    day: 29,
    month: 4,
    year: 2026,
    displayDate: '29 Mei 2026',
    code: 'GOTO',
    companyName: 'PT GoTo Gojek Tokopedia Tbk',
    category: 'RUPS',
    detail: 'RUPSLB Persetujuan Rencana Pengalihan Saham Treasuri',
    impact: 'Tinggi'
  },
  {
    id: 'ev-13',
    dateStr: '2026-06-01',
    day: 1,
    month: 5,
    year: 2026,
    displayDate: '1 Juni 2026',
    code: 'BURSA',
    companyName: 'Bursa Efek Indonesia',
    category: 'Libur Bursa',
    detail: 'Hari Lahir Pancasila (Pasar Tutup)',
    impact: 'Tinggi'
  },
  {
    id: 'ev-14',
    dateStr: '2026-06-01',
    day: 1,
    month: 5,
    year: 2026,
    displayDate: '1 Juni 2026',
    code: 'GOTO',
    companyName: 'PT GoTo Gojek Tokopedia Tbk',
    category: 'Dividen',
    detail: 'Ex Date Dividen Saham Seri B Terkait Restrukturisasi',
    impact: 'Sedang'
  },
  {
    id: 'ev-15',
    dateStr: '2026-06-03',
    day: 3,
    month: 5,
    year: 2026,
    displayDate: '3 Juni 2026',
    code: 'ADRO',
    companyName: 'PT Adaro Energy Indonesia Tbk',
    category: 'Dividen',
    detail: 'Tanggal Pembayaran (Payment Date) Dividen Interim K-2 2025',
    impact: 'Tinggi'
  },
  {
    id: 'ev-16',
    dateStr: '2026-06-08',
    day: 8,
    month: 5,
    year: 2026,
    displayDate: '8 Juni 2026',
    code: 'KLBF',
    companyName: 'PT Kalbe Farma Tbk',
    category: 'Dividen',
    detail: 'Cum Date Pembagian Dividen Tunai Rp 28 per Saham',
    impact: 'Sedang'
  },
  {
    id: 'ev-17',
    dateStr: '2026-06-12',
    day: 12,
    month: 5,
    year: 2026,
    displayDate: '12 Juni 2026',
    code: 'KGE',
    companyName: 'PT Krakatau Green Energy Tbk',
    category: 'IPO',
    detail: 'Listing Perdana di Pasar Utama BEI',
    impact: 'Sedang'
  },
  {
    id: 'ev-18',
    dateStr: '2026-06-15',
    day: 15,
    month: 5,
    year: 2026,
    displayDate: '15 Juni 2026',
    code: 'BBCA',
    companyName: 'PT Bank Central Asia Tbk',
    category: 'Laporan Keuangan',
    detail: 'Penyampaian Laporan Keuangan Publikasi Bulanan per Mei 2026',
    impact: 'Rendah'
  },
  {
    id: 'ev-19',
    dateStr: '2026-06-18',
    day: 18,
    month: 5,
    year: 2026,
    displayDate: '18 Juni 2026',
    code: 'BBNI',
    companyName: 'PT Bank Negara Indonesia (Persero) Tbk',
    category: 'RUPS',
    detail: 'Rapat Umum Pemegang Saham Luar Biasa agenda pengangkatan struktur direksi baru',
    impact: 'Sedang'
  },
  {
    id: 'ev-20',
    dateStr: '2026-06-22',
    day: 22,
    month: 5,
    year: 2026,
    displayDate: '22 Juni 2026',
    code: 'ASII',
    companyName: 'PT Astra International Tbk',
    category: 'Dividen',
    detail: 'Cum Date Dividen Final Senilai Rp 420 per Saham Kelompok Astra',
    impact: 'Tinggi'
  },
  {
    id: 'ev-21',
    dateStr: '2026-06-25',
    day: 25,
    month: 5,
    year: 2026,
    displayDate: '25 Juni 2026',
    code: 'AMRT',
    companyName: 'PT Sumber Alfaria Trijaya Tbk (Alfamart)',
    category: 'RUPS',
    detail: 'RUPST Membahas Laba Ditahan & Paparan Publik (Public Expose)',
    impact: 'Sedang'
  },
  {
    id: 'ev-22',
    dateStr: '2026-06-29',
    day: 29,
    month: 5,
    year: 2026,
    displayDate: '29 Juni 2026',
    code: 'BURSA',
    companyName: 'Bursa Efek Indonesia',
    category: 'Libur Bursa',
    detail: 'Tahun Baru Hijriah (Tutup Operasional Buku Kliring)',
    impact: 'Tinggi'
  }
];

// 2. IPO Stock Tracker data
const IPO_TRACKER_DB: IPOItem[] = [
  {
    id: 'ipo-1',
    companyName: 'PT Nusantara Cloud Digital Tbk',
    tickerProposed: 'NCDI',
    sector: 'Teknologi & Infrastruktur Digital',
    offeringDate: '2 Mei - 5 Mei 2026',
    priceRange: 'Rp 120 - Rp 140',
    status: 'Selesai',
    sharesRange: '2.5 Miliar Lembar',
    underwriter: 'PT Mandiri Sekuritas'
  },
  {
    id: 'ipo-2',
    companyName: 'PT Krakatau Green Energy Tbk',
    tickerProposed: 'KGEI',
    sector: 'Energi Baru Terbarukan',
    offeringDate: '25 Mei - 29 Mei 2026',
    priceRange: 'Rp 280 - Rp 310',
    status: 'Sedang Berlangsung',
    sharesRange: '3.8 Miliar Lembar',
    underwriter: 'PT Ciptadana Sekuritas Asia'
  },
  {
    id: 'ipo-3',
    companyName: 'PT Agro Lestari Mandiri Tbk',
    tickerProposed: 'ALMI',
    sector: 'Barang Konsumen Primer (Staples)',
    offeringDate: '8 Juni - 12 Juni 2026',
    priceRange: 'Rp 450 - Rp 500',
    status: 'Akan Datang',
    sharesRange: '1.2 Miliar Lembar',
    underwriter: 'PT Indo Premier Sekuritas'
  },
  {
    id: 'ipo-4',
    companyName: 'PT Batubara Merdeka Indo Tbk',
    tickerProposed: 'BMDI',
    sector: 'Energi / Pertambangan Minerba',
    offeringDate: '15 Juni - 19 Juni 2026',
    priceRange: 'Rp 180 - Rp 210',
    status: 'Akan Datang',
    sharesRange: '950 Juta Lembar',
    underwriter: 'PT BNI Sekuritas'
  },
  {
    id: 'ipo-5',
    companyName: 'PT Multi Logistik Samudera Tbk',
    tickerProposed: 'MLSA',
    sector: 'Transportasi & Logistik Maritim',
    offeringDate: '23 Juni - 26 Juni 2026',
    priceRange: 'Rp 100 - Rp 115',
    status: 'Akan Datang',
    sharesRange: '500 Juta Lembar',
    underwriter: 'PT Sinarmas Sekuritas'
  }
];

export default function KalenderWidget() {
  // Navigation: May 2026 or June 2026
  // We represent months as index: 4 = May, 5 = June
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(4); 
  const currentYear = 2026;

  // Active toggled filters for event categories
  const [selectedCategories, setSelectedCategories] = useState<{
    'Laporan Keuangan': boolean;
    'Dividen': boolean;
    'RUPS': boolean;
    'IPO': boolean;
    'Libur Bursa': boolean;
  }>({
    'Laporan Keuangan': true,
    'Dividen': true,
    'RUPS': true,
    'IPO': true,
    'Libur Bursa': true
  });

  // Selected date on the visual calendar to display in detail section
  const [selectedDay, setSelectedDay] = useState<{day: number, events: CorporateEvent[]} | null>(null);

  // Sorting parameter for upcoming checklist table
  const [tableSortAsc, setTableSortAsc] = useState<boolean>(true);

  // Reminders state stored inside client browser local storage 
  const [reminders, setReminders] = useState<string[]>([]);
  const [justNotifiedId, setJustNotifiedId] = useState<string | null>(null);

  // Sync state with localStorage safely
  useEffect(() => {
    try {
      const persisted = window.localStorage.getItem('sahampintar_calendar_reminders');
      if (persisted) {
        setReminders(JSON.parse(persisted));
      }
    } catch (e) {
      console.warn('Gagal memuat reminders dari localStorage', e);
    }
  }, []);

  const handleToggleReminder = (id: string) => {
    let nextReminders: string[];
    if (reminders.includes(id)) {
      nextReminders = reminders.filter(rId => rId !== id);
    } else {
      nextReminders = [...reminders, id];
      // trigger alert effect
      setJustNotifiedId(id);
      setTimeout(() => setJustNotifiedId(null), 2500);
    }
    setReminders(nextReminders);
    try {
      window.localStorage.setItem('sahampintar_calendar_reminders', JSON.stringify(nextReminders));
    } catch (e) {
       console.error(e);
    }
  };

  // Switch category filter helper
  const handleToggleCategory = (cat: 'Laporan Keuangan' | 'Dividen' | 'RUPS' | 'IPO' | 'Libur Bursa') => {
    setSelectedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Computed: Immediate events in the next 7 days from system anchor May 24, 2026 
  // Anchor dates range: 24 May 2026 to 31 May 2026
  const thisWeekHighlights = useMemo(() => {
    return EVENT_DB.filter(ev => {
      if (ev.month === 4 && ev.day >= 24 && ev.day <= 31) {
        return true;
      }
      return false;
    });
  }, []);

  // Filter based event database list
  const filteredEventsForLists = useMemo(() => {
    return EVENT_DB.filter(ev => selectedCategories[ev.category]);
  }, [selectedCategories]);

  // Compute upcoming events table (30 days from now, we'll display list from the active view database)
  const sortedUpcomingEvents = useMemo(() => {
    const sorted = [...filteredEventsForLists];
    sorted.sort((a, b) => {
      // Order first by month, then by day
      if (a.month !== b.month) {
        return tableSortAsc ? a.month - b.month : b.month - a.month;
      }
      return tableSortAsc ? a.day - b.day : b.day - a.day;
    });
    return sorted;
  }, [filteredEventsForLists, tableSortAsc]);

  // Compute Days for standard Visual monthly calendar (May 2026 & June 2026)
  // May 2026: Friday (Idx 5) starting index with 31 days.
  // June 2026: Monday (Idx 1) starting index with 30 days.
  const calendarGridDays = useMemo(() => {
    const daysInMonth = currentMonthIndex === 4 ? 31 : 30; // 31 for May, 30 for June
    const monthStartDayOffset = currentMonthIndex === 4 ? 5 : 1; // 5 space blocks for May, 1 space block for June
    
    const elements: { dayNum: number | null, dateStr: string, eventsOnDay: CorporateEvent[] }[] = [];
    
    // Empty prepended grid slots
    for (let i = 0; i < monthStartDayOffset; i++) {
      elements.push({ dayNum: null, dateStr: '', eventsOnDay: [] });
    }

    // Days list construction
    for (let d = 1; d <= daysInMonth; d++) {
      const formattedDay = d < 10 ? `0${d}` : `${d}`;
      const formattedMonth = currentMonthIndex + 1 < 10 ? `0${currentMonthIndex + 1}` : `${currentMonthIndex + 1}`;
      const searchDateStr = `2026-${formattedMonth}-${formattedDay}`;

      // Search events occurring on this exact date
      const activeEvents = EVENT_DB.filter(ev => 
        ev.day === d && 
        ev.month === currentMonthIndex && 
        ev.year === currentYear &&
        selectedCategories[ev.category] // must respect currently active category toggles!
      );

      elements.push({
        dayNum: d,
        dateStr: searchDateStr,
        eventsOnDay: activeEvents
      });
    }

    return elements;
  }, [currentMonthIndex, selectedCategories]);

  // Colors config based on event category
  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'Laporan Keuangan':
        return { text: 'text-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-500/5', dot: 'bg-blue-500', border: 'border-blue-500/20' };
      case 'Dividen':
        return { text: 'text-emerald-500', bg: 'bg-emerald-500/10 dark:bg-emerald-500/5', dot: 'bg-emerald-500', border: 'border-emerald-500/20' };
      case 'RUPS':
        return { text: 'text-amber-500', bg: 'bg-amber-500/10 dark:bg-amber-500/5', dot: 'bg-amber-500', border: 'border-amber-500/20' };
      case 'IPO':
        return { text: 'text-purple-500', bg: 'bg-purple-500/10 dark:bg-purple-500/5', dot: 'bg-purple-500', border: 'border-purple-500/20' };
      case 'Libur Bursa':
        return { text: 'text-rose-500', bg: 'bg-rose-500/10 dark:bg-rose-500/5', dot: 'bg-rose-500', border: 'border-rose-500/20' };
      default:
        return { text: 'text-gray-400', bg: 'bg-gray-500/10', dot: 'bg-gray-400', border: 'border-gray-500/20' };
    }
  };

  // Month navigation changer
  const handlePrevMonth = () => {
    setSelectedDay(null);
    setCurrentMonthIndex(prev => prev === 5 ? 4 : 5);
  };
  const handleNextMonth = () => {
    setSelectedDay(null);
    setCurrentMonthIndex(prev => prev === 4 ? 5 : 4);
  };

  return (
    <div id="corporate-calendar-main-view" className="space-y-6 text-left">
      
      {/* HEADER SECTION HERO */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1565C0]/5 filter blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-[#1565C0]/10 text-[#1565C0] rounded-xl">
                <CalendarIcon className="w-5.5 h-5.5" />
              </span>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-gray-900 dark:text-white leading-none">Kalender Publik Bursa Efek</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Aksi Korporasi & IPO Monitor</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 max-w-2xl font-semibold leading-relaxed">
              Kawal ketat pergerakan RUPS luar biasa, pembagian dividen final tunai (cum/ex dates), rilis pendapatan kuartalan, pencatatan perdana saham (IPO), serta hari libur nasional IHSG bursa efek Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Anchor Hari Ini: 24 Mei 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-saham-green text-[10px] font-bold rounded-lg border border-emerald-500/20">
              <DollarSign className="w-3.5 h-3.5" />
              Fokus Dividen Final
            </span>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT MINGGU INI (May 24 to May 31 2026) */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-850/60">
          <span className="p-1 px-2 bg-[#1565C0]/15 text-[#1565C0] rounded text-xs font-bold font-mono">HIGHLIGHTS</span>
          <h3 className="text-sm font-black text-gray-900 dark:text-white">Agenda Berdampak Tinggi 7 Hari Ke Depan</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {thisWeekHighlights.map((ev) => {
            const theme = getCategoryTheme(ev.category);
            const isBookmarked = reminders.includes(ev.id);

            return (
              <div 
                key={ev.id} 
                className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between relative overflow-hidden ${
                  isBookmarked ? 'border-[#1565C0]/63' : 'border-gray-150 dark:border-gray-850'
                } bg-gray-50/50 dark:bg-gray-950/20 hover:scale-[1.01]`}
              >
                {/* Subtle top indicator category */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${theme.bg} ${theme.text}`}>
                    {ev.category}
                  </span>
                  
                  {ev.impact === 'Tinggi' && (
                    <span className="text-[8px] bg-rose-500/10 text-rose-500 font-extrabold uppercase px-1 rounded">
                      High Impact
                    </span>
                  )}
                </div>

                {/* Event core body */}
                <div className="space-y-1 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-black text-gray-950 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 px-1.5 py-0.2 rounded">
                      ${ev.code}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{ev.displayDate}</span>
                  </div>

                  <h5 className="font-bold text-xs text-gray-905 dark:text-gray-205 leading-tight line-clamp-2 pt-1">{ev.detail}</h5>
                </div>

                {/* Reminder Button trigger */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-850/60 flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-semibold truncate max-w-[90px]">
                    {ev.companyName}
                  </span>

                  <button
                    onClick={() => handleToggleReminder(ev.id)}
                    className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition ${
                      isBookmarked
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-850 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {isBookmarked ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{isBookmarked ? 'Aktif' : 'Ingat'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE MONTHLY VISUAL GRID & EVENT CATEGORIES FILTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* INTERACTIVE MONTHLY CALENDAR GRID (Left/Center 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
            
            {/* Header: Month switcher */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-gray-850/60">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#1565C0]" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  Kalender Visual: {currentMonthIndex === 4 ? 'Mei 2026' : 'Juni 2026'}
                </h3>
              </div>

              {/* Navigation switches buttons */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 px-2.5 rounded-xl border border-gray-200 dark:border-gray-805 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center gap-1 cursor-pointer text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Mei
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 px-2.5 rounded-xl border border-gray-200 dark:border-gray-805 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition flex items-center gap-1 cursor-pointer text-xs"
                >
                  Juni <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MONTHLY CALENDAR GRID TRACKER */}
            <div className="space-y-4">
              
              {/* Day Titles columns */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono font-black uppercase text-gray-400">
                <span>Min</span>
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
              </div>

              {/* Day numbers grid mapping */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarGridDays.map((cell, index) => {
                  const isDayEmpty = cell.dayNum === null;
                  
                  // Check if this date has any dynamic filtered events
                  const dayEvents = cell.eventsOnDay;
                  const hasEvents = dayEvents.length > 0;
                  
                  // Track selected state
                  const isSelected = selectedDay && selectedDay.day === cell.dayNum && currentMonthIndex === (selectedDay.events[0]?.month);

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (!isDayEmpty && hasEvents) {
                          setSelectedDay({
                            day: cell.dayNum!,
                            events: dayEvents
                          });
                        } else if (!isDayEmpty) {
                          setSelectedDay(null);
                        }
                      }}
                      className={`min-h-[58px] p-1.5 rounded-2xl border transition text-left flex flex-col justify-between relative ${
                        isDayEmpty 
                          ? 'bg-gray-50/10 dark:bg-gray-950/5 border-transparent pointer-events-none' 
                          : isSelected
                            ? 'bg-[#1565C0]/10 border-[#1565C0] text-gray-950 dark:text-white shadow-sm ring-1 ring-[#1565C0]'
                            : hasEvents
                              ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-850 hover:border-[#1565C0]/70 cursor-pointer shadow-sm'
                              : 'bg-gray-50/30 dark:bg-gray-950/20 border-gray-150 dark:border-gray-850/60 text-gray-400'
                      }`}
                    >
                      {/* Day number count label */}
                      <span className={`text-[11px] font-mono font-bold block ${
                        isSelected ? 'text-[#1565C0]' : 'text-gray-800 dark:text-gray-300'
                      }`}>
                        {cell.dayNum}
                      </span>

                      {/* Display Category specific interactive dot indicators */}
                      <div className="flex flex-wrap gap-0.8 items-center mt-1.5">
                        {dayEvents.slice(0, 3).map((ev, eIdx) => {
                          const categoryTheme = getCategoryTheme(ev.category);
                          return (
                            <div 
                              key={eIdx}
                              title={`${ev.code}: ${ev.category}`}
                              className={`w-1.5 h-1.5 rounded-full ${categoryTheme.dot} ${
                                ev.impact === 'Tinggi' ? 'animate-pulse scale-125' : ''
                              }`} 
                            />
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span className="text-[8px] text-gray-400 font-bold block font-mono">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Scale legend captions overlay */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-850/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">LEGENDA WARNA EVENT:</span>
              <div className="flex flex-wrap gap-2.5">
                {(['Laporan Keuangan', 'Dividen', 'RUPS', 'IPO', 'Libur Bursa'] as const).map(cat => {
                  const theme = getCategoryTheme(cat);
                  const isFilteredOut = !selectedCategories[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition duration-150 cursor-pointer ${
                        isFilteredOut 
                          ? 'border-gray-200 dark:border-gray-850/60 text-gray-400 bg-gray-50/30 dark:bg-gray-950/10 line-through opacity-50' 
                          : `${theme.border} ${theme.bg} ${theme.text}`
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* DETAILED CLICKED EVENT SIDE PANEL INFO (Right 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Calendar day click target details card */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-850/60">
              <Info className="w-4 h-4 text-[#1565C0]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Riset Detail Agenda Terpilih</h3>
            </div>

            {selectedDay ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-850">
                  <span className="text-xs font-mono font-black text-gray-900 dark:text-white">
                    Tanggal: {selectedDay.day} {currentMonthIndex === 4 ? 'Mei 2026' : 'Juni 2026'}
                  </span>
                  <button 
                    onClick={() => setSelectedDay(null)}
                    className="text-[10px] text-gray-450 hover:text-red-500 font-semibold"
                  >
                    Tutup
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedDay.events.map((ev, eIdx) => {
                    const theme = getCategoryTheme(ev.category);
                    const isBookmarked = reminders.includes(ev.id);

                    return (
                      <div key={eIdx} className="p-3.5 bg-gray-50/50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-850 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${theme.bg} ${theme.text}`}>
                            {ev.category}
                          </span>
                          
                          {/* Stock Code Badge */}
                          <span className="px-1.5 py-0.2 scale-90 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[10px] font-mono font-black rounded text-gray-700 dark:text-gray-300">
                            ${ev.code}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-gray-950 dark:text-white leading-snug">{ev.companyName}</h4>
                          <p className="text-[11px] text-gray-450 dark:text-gray-400 font-semibold leading-relaxed">{ev.detail}</p>
                        </div>

                        {/* Interactive toggle block inside details card */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-850/60 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-bold">Bobot Dampak: 
                            <strong className="text-gray-800 dark:text-gray-300 ml-1 uppercase">{ev.impact}</strong>
                          </span>

                          <button
                            onClick={() => handleToggleReminder(ev.id)}
                            className={`p-1 px-2 text-[9px] font-bold rounded-lg transition border flex items-center gap-1 ${
                              isBookmarked 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-transparent text-gray-500 border-gray-250 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-850'
                            }`}
                          >
                            {isBookmarked ? <Check className="w-3 h-3" /> : <Bell className="w-3 h-3 text-amber-500" />}
                            <span>{isBookmarked ? 'Diingat' : 'Ingatkan'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 space-y-2">
                <CalendarDays className="w-8 h-8 text-gray-300 dark:text-gray-800 mx-auto animate-pulse" />
                <p className="text-xs font-semibold leading-relaxed">
                  Silakan ketuk tanggal di kalender visual yang memiliki tanda dot berwarna untuk membuka detail data agenda.
                </p>
              </div>
            )}
          </div>

          {/* ACTIVE ALERTS DISPLAY AND INTRADAY SUGGESTIONS TIPS */}
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/15 rounded-3xl p-5 text-left relative overflow-hidden">
            <span className="absolute top-4 right-4 text-amber-500 opacity-60">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-550 text-amber-500" />
              <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-none">Rekomendasi Ritel Dividen</h4>
            </div>

            <p className="text-[11px] text-gray-650 dark:text-gray-350 leading-relaxed font-bold">
              Pembelian di hari <strong>Cum Date</strong> menjamin bahwa investor perorangan berhak atas dividen tunai tahun buku emiten sebelumnya. Membeli saham sewaktu <strong>Ex Date</strong> sudah tidak lagi berhak memperoleh deviden meskipun harga sering langsung terkoreksi. Gunakan saringan dividen dari kalender ini dengan matang.
            </p>
          </div>

          {/* MY LISTED USER REMINDERS PERSISTED FROM LOCALSTORAGE */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-250 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-850/60">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Pengingat Saya 
                  <span className="ml-1.5 font-mono px-1.5 py-0.2 text-[9px] bg-[#1565C0]/10 text-[#1565C0] rounded-full font-black">{reminders.length}</span>
                </h3>
              </div>
              {reminders.length > 0 && (
                <button 
                  onClick={() => {
                    setReminders([]);
                    window.localStorage.removeItem('sahampintar_calendar_reminders');
                  }}
                  className="text-[9px] text-[#1565C0] hover:underline font-extrabold"
                >
                  Reset Semua
                </button>
              )}
            </div>

            {reminders.length > 0 ? (
              <div className="space-y-2 mt-2 max-h-[220px] overflow-y-auto pr-1">
                {EVENT_DB.filter(ev => reminders.includes(ev.id)).map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-150/40 dark:border-gray-850 text-xs">
                    <div className="space-y-0.5 truncate max-w-[140px]">
                      <span className="text-[9px] font-mono font-black text-gray-500">${ev.code} ({ev.displayDate.split(' ').slice(0, 2).join(' ')})</span>
                      <p className="font-bold truncate text-[11px] text-gray-900 dark:text-white">{ev.detail}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleReminder(ev.id)}
                      className="p-1 text-[9px] bg-sky-505 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/15 rounded font-extrabold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed text-center py-4">
                Belum ada agenda korporasi yang ditandai untuk pengingat. Ketuk tombol <strong className="text-[#1565C0]">Ingatkan Saya</strong> pada daftar tabel.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* LIST EVENT TABULAR DATA SHEET (NEXT 30 DAYS CHRONOLOGICAL) */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left">
        
        {/* Title and Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-gray-850/60">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-emerald-500/15 text-saham-green rounded text-xs font-bold font-mono">TIMELINE</span>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Daftar Agenda Finansial IDX Terlengkap</h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold">
              Kategori menyala: <strong>{Object.values(selectedCategories).filter(Boolean).length} / 5</strong>
            </span>
            
            <button
              onClick={() => setTableSortAsc(p => !p)}
              className="inline-flex items-center gap-1 py-1 px-3 text-xs bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl font-bold cursor-pointer transition hover:bg-gray-100"
            >
              Tanggal: <strong>{tableSortAsc ? 'Terlama' : 'Terbaru'}</strong>
            </button>
          </div>
        </div>

        {/* Dynamic Table Layout */}
        <div className="overflow-x-auto rounded-2xl border border-gray-150 dark:border-gray-850">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-550 bg-gray-50 dark:bg-gray-950 text-gray-400 font-black uppercase text-[10px] tracking-wider border-b border-gray-150 dark:border-gray-850">
                <th className="p-3">Tanggal</th>
                <th className="p-3">Ticker Emiten</th>
                <th className="p-3">Kategori Event</th>
                <th className="p-4">Deskripsi / Detail Agenda</th>
                <th className="p-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-850 font-semibold text-gray-700 dark:text-gray-300">
              {sortedUpcomingEvents.map((ev) => {
                const theme = getCategoryTheme(ev.category);
                const isBookmarked = reminders.includes(ev.id);

                return (
                  <tr key={ev.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20 transition">
                    {/* Date */}
                    <td className="p-3 font-mono font-bold text-gray-950 dark:text-white whitespace-nowrap">
                      {ev.displayDate}
                    </td>

                    {/* Stock Code Badge */}
                    <td className="p-3">
                      <span className="px-2 py-0.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[100%] font-mono font-black rounded text-gray-900 dark:text-white">
                        ${ev.code}
                      </span>
                    </td>

                    {/* Category Column */}
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${theme.bg} ${theme.text}`}>
                        <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
                        {ev.category}
                      </span>
                    </td>

                    {/* Details Column */}
                    <td className="p-4 max-w-sm">
                      <div className="space-y-0.5 text-xs text-gray-800 dark:text-gray-200 line-clamp-2">
                        <strong className="block text-gray-954 text-gray-450 text-[10px] uppercase font-bold">{ev.companyName}</strong>
                        <span className="italic">{ev.detail}</span>
                      </div>
                    </td>

                    {/* Action Items */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleReminder(ev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                          isBookmarked
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-850 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                      >
                        {isBookmarked ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Aktif
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 text-amber-500" /> Ingatkan Saya
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sortedUpcomingEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-semibold italic">
                    Tidak ada agenda yang cocok di tabel. Atur filter tombol legenda untuk mengaktifkan baris data kembali.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* IPO TRACKER COMPREHENSIVE SHEET */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-gray-850/60">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-purple-500/15 text-purple-400 rounded text-xs font-bold font-mono">IPO MONITOR</span>
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Saham Perdana (IPO Tracker)</h3>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">Perusahaan Pencatatan Baru IDX Terkini</span>
        </div>

        <p className="text-xs text-gray-500 max-w-4xl font-semibold leading-relaxed">
          Penyaringan saham baru yang sedang melakukan Bookbuilding atau Penawaran Umum Perdana. Investasi IPO berisiko fluktuasi tinggi namun memiliki momentum keuntungan awal yang besar pasca dicatatkan.
        </p>

        {/* IPO Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
          {IPO_TRACKER_DB.map((ipo) => {
            const isSelesai = ipo.status === 'Selesai';
            const isBerlangsung = ipo.status === 'Sedang Berlangsung';
            
            return (
              <div 
                key={ipo.id} 
                className="p-4 border border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-950/20 rounded-2xl flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-800 transition"
              >
                <div className="space-y-3">
                  {/* Status & code top info */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 text-[10px] font-mono font-black text-[#1565C0]">
                      e-IPO: {ipo.tickerProposed}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      isSelesai ? 'bg-gray-105 bg-gray-500/10 text-gray-400 border border-gray-500/15'
                      : isBerlangsung ? 'bg-rose-500/10 text-rose-500 border border-rose-500/15 animate-pulse'
                      : 'bg-emerald-500/10 text-saham-green border border-emerald-500/15'
                    }`}>
                      {ipo.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display font-black text-sm text-gray-950 dark:text-white leading-tight">{ipo.companyName}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold block">{ipo.sector}</span>
                  </div>

                  {/* Pricing and shares range details */}
                  <div className="py-2.5 border-y border-gray-100 dark:border-gray-850 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="block text-[9px] text-gray-450 uppercase font-bold">Kisaran Harga</span>
                      <strong className="block text-gray-900 dark:text-white font-mono">{ipo.priceRange}</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-450 uppercase font-bold">Masa Penawaran</span>
                      <strong className="block text-gray-900 dark:text-white font-mono">{ipo.offeringDate.split(' 2026')[0]}</strong>
                    </div>
                  </div>

                  {/* Micro attributes details */}
                  <div className="space-y-1 text-[10px] text-gray-450">
                    <p className="flex justify-between">
                      <span>Total Saham Ditawarkan:</span>
                      <strong className="text-gray-800 dark:text-gray-300">{ipo.sharesRange}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Underwriter Utama:</span>
                      <strong className="text-gray-800 dark:text-gray-200">{ipo.underwriter}</strong>
                    </p>
                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-850/60 flex items-center justify-between">
                  {isBerlangsung ? (
                    <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                      Tahap Penawaran Umum
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-450 font-bold">Metode Penjatahan Elektronik</span>
                  )}

                  <a 
                    href="https://e-ipo.co.id/id" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#1565C0] hover:bg-[#1565C0]/90 text-white rounded-xl text-[10px] font-black transition cursor-pointer"
                  >
                    Ikut e-IPO
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FLOAT POPUP NOTIFIER ON NEW REMINDER TRIGGERED */}
      <AnimatePresence>
        {justNotifiedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="fixed bottom-6 right-6 bg-[#1A1A1A] text-white border border-emerald-500/30 p-4.5 rounded-2xl flex items-center gap-3.5 z-55 shadow-2xl max-w-sm"
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Check className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="font-bold text-xs">Agenda Sukses Ditambahkan!</h5>
              <p className="text-[10px] text-gray-400 mt-0.5">Kami akan mengabari Anda menjelang hari H acara melalui panel ringkasan.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
