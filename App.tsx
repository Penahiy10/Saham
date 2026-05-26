/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Star, AlertCircle, TrendingUp, CheckCircle, Smartphone, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import datasets
import { 
  INITIAL_INDICES, 
  INDONESIAN_STOCKS, 
  TOP_GAINERS, 
  TOP_LOSERS, 
  BANDAR_RADAR_DATA, 
  NEWS_KILAT 
} from './data';
import { MarketIndex, StockItem } from './types';

// Import custom sections/widgets
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import SentimentGauge from './components/SentimentGauge';
import TopMovers from './components/TopMovers';
import RadarBandar from './components/RadarBandar';
import FlashNews from './components/FlashNews';
import Watchlist from './components/Watchlist';
import SahamClass from './components/SahamClass';
import SahamDetail from './components/SahamDetail';
import Screener from './components/Screener';
import KalenderWidget from './components/KalenderWidget';
import EdukasiWidget from './components/EdukasiWidget';
import BeritaSentimen from './components/BeritaSentimen';
import AboutWidget from './components/AboutWidget';
import Footer from './components/Footer';
import LoginPortal from './components/LoginPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStockCode, setSelectedStockCode] = useState<string>('BBCA');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [watchlistCodes, setWatchlistCodes] = useState<string[]>(['BBCA', 'GOTO', 'TLKM']);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [gainers, setGainers] = useState<StockItem[]>(TOP_GAINERS);
  const [losers, setLosers] = useState<StockItem[]>(TOP_LOSERS);
  const [sentimentScore, setSentimentScore] = useState<number>(72);
  const [healthScore, setHealthScore] = useState<number>(78);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('18.00');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('penahiy-loggedin') === 'true';
  });

  // Initialize Theme and LocalStorage watchlist on mount
  useEffect(() => {
    // Default to dark mode is checked here
    const savedTheme = localStorage.getItem('penahiy-theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedWatchlist = localStorage.getItem('penahiy-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlistCodes(JSON.parse(savedWatchlist));
      } catch (err) {
        console.error('Failed reading watchlist storage');
      }
    }
  }, []);

  // Theme Toggler
  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('penahiy-theme', 'dark');
      triggerToast('Mode Gelap diaktifkan - hemat baterai & aman untuk mata!');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('penahiy-theme', 'light');
      triggerToast('Mode Terang diaktifkan!');
    }
  };

  // Set alert toast helper helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Bookmark / Unbookmark ticker to personal watchlist
  const handleToggleWatchlist = (code: string) => {
    let nextWatchlist: string[];
    if (watchlistCodes.includes(code)) {
      nextWatchlist = watchlistCodes.filter((c) => c !== code);
      triggerToast(`$${code} ditiadakan dari Watchlist Anda.`);
    } else {
      nextWatchlist = [...watchlistCodes, code];
      triggerToast(`$${code} berhasil ditambahkan ke Watchlist Anda!`);
    }
    setWatchlistCodes(nextWatchlist);
    localStorage.setItem('penahiy-watchlist', JSON.stringify(nextWatchlist));
  };

  const fetchRealTimeData = async (silent = false) => {
    if (!silent) setIsSimulating(true);
    try {
      const response = await fetch('/api/markets-summary');
      if (!response.ok) throw new Error('Failed to retrieve summary');
      const json = await response.json();
      if (json.success && json.data) {
        const d = json.data;

        // 1. Update Index Cards
        const updatedIndices = [
          {
            name: 'IHSG (Composite)',
            value: d['^JKSE']?.price || 6130.40,
            change: d['^JKSE']?.change ?? -76.34,
            changePercent: d['^JKSE']?.changePercent ?? -1.23
          },
          {
            name: 'LQ45',
            value: d['^JKLQ45']?.price || 910.95,
            change: d['^JKLQ45']?.change ?? -13.40,
            changePercent: d['^JKLQ45']?.changePercent ?? -1.45
          },
          {
            name: 'IDX30',
            value: d['^JK30']?.price || 461.39,
            change: d['^JK30']?.change ?? -6.73,
            changePercent: d['^JK30']?.changePercent ?? -1.44
          }
        ];
        setIndices(updatedIndices);

        // 2. Update Gainers in state matching the template structure
        const updatedGainers = gainers.map(s => {
          const live = d[s.code];
          if (live) {
            return {
              ...s,
              price: live.price,
              change: live.change,
              changePercent: live.changePercent
            };
          }
          return s;
        });
        setGainers(updatedGainers);

        // 3. Update Losers in state matching the template structure
        const updatedLosers = losers.map(s => {
          const live = d[s.code];
          if (live) {
            return {
              ...s,
              price: live.price,
              change: live.change,
              changePercent: live.changePercent
            };
          }
          return s;
        });
        setLosers(updatedLosers);

        // 4. Update Time
        const nowLocalStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
        setLastUpdateTime(nowLocalStr);

        if (!silent) {
          triggerToast('Data bursa diperbarui secara realtime dari Yahoo Finance!');
        }
      }
    } catch (err) {
      console.error('Failed to load live bursa data:', err);
      if (!silent) {
        triggerToast('Gagal memuat data bursa realtime. Menggunakan simulasi lokal.');
      }
    } finally {
      if (!silent) setIsSimulating(false);
    }
  };

  // Poll real-time bursa index data every 15 seconds
  useEffect(() => {
    fetchRealTimeData(true);
    const interval = (isLoggedIn) ? setInterval(() => {
      fetchRealTimeData(true);
    }, 15000) : undefined;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]);

  // Simulate pricing or trigger manually fetch bursa data
  const handleSimulateUpdate = () => {
    fetchRealTimeData(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginPortal 
        onLoginSuccess={(userEmail) => {
          localStorage.setItem('penahiy-loggedin', 'true');
          setIsLoggedIn(true);
          triggerToast(`Masuk berhasil sebagai: ${userEmail}`);
        }} 
      />
    );
  }

  return (
    <div className={darkMode ? 'dark bg-[#0A0A0A] text-gray-150 min-h-screen text-gray-200 font-sans' : 'bg-gray-50 text-gray-900 min-h-screen font-sans'}>
      <div className="flex flex-col md:flex-row">
        
        {/* Responsive Sider Navigation Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          lastUpdateTime={lastUpdateTime}
          selectedStockCode={selectedStockCode}
          onLogout={() => {
            localStorage.removeItem('penahiy-loggedin');
            setIsLoggedIn(false);
            triggerToast('Sesi Berakhir. Log out berhasil.');
          }}
        />

        {/* Content main flow */}
        <main className="flex-1 flex flex-col justify-between min-w-0">
          
          {/* Global Header toolbar */}
          <Header 
            activeTab={activeTab}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            lastUpdateTime={lastUpdateTime}
            onSimulateUpdate={handleSimulateUpdate}
            isSimulating={isSimulating}
          />

          {/* Subview container */}
          <div className="px-6 py-6 space-y-6 max-w-7xl w-full mx-auto">
            
            {/* Simulation Alert Banner */}
            {isSimulating && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4.5 flex items-center justify-between shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saham-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-saham-green"></span>
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-emerald-600 dark:text-emerald-400">Sinkronisasi Feed Bursa (IDX)...</h5>
                    <p className="text-[10px] text-gray-500 leading-none mt-0.5">Memuat bursa order book, data bandar, dan ulasan emiten asing.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CORRESPONDING VIEWS SWITCH */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* 1. MAIN INTEGRATED DASHBOARD TABS */}
                {activeTab === 'dashboard' && (
                  <>
                    {/* Brand Banner Penahiy */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-[#1565C0] to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg text-left transition-all duration-300 border border-blue-500/10">
                      {/* Ambient background blur circles */}
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
                        <TrendingUp className="w-64 h-64 text-white" />
                      </div>
                      <div className="absolute left-1/3 top-0 opacity-10 pointer-events-none transform -translate-y-1/2">
                        <div className="w-80 h-80 rounded-full bg-white blur-3xl"></div>
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-white/10">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                            <span>Platform Intelijen Saham</span>
                          </div>
                          <div className="space-y-1.5">
                            <h2 className="text-2.5xl sm:text-4xl font-display font-extrabold tracking-tight drop-shadow-sm">
                              Penahiy
                            </h2>
                            <p className="text-sm sm:text-lg text-blue-50/90 font-semibold tracking-wide font-sans">
                              Analisis Tajam, Investasi Lebih Cerdas
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-2xl font-light">
                            Selamat datang di pusat komando investasi Anda. Kami menyajikan data sekuritas terintegrasi, kalkulasi sentimen berbasis AI, analisis bandarologi, serta pemantauan real-time terhadap <span className="text-yellow-300 font-extrabold underline decoration-wavy">950+ saham aktif</span> di Bursa Efek Indonesia (BEI) secara dinamis & profesional.
                          </p>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-6 shrink-0 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-full md:w-auto md:min-w-[200px] justify-between">
                          <div>
                            <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">Pantauan Saham</div>
                            <div className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
                              950+ <span className="text-xs text-teal-300 font-semibold uppercase font-sans">Emiten</span>
                            </div>
                          </div>
                          <div className="h-px w-full bg-white/10 hidden md:block" />
                          <div>
                            <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">Status Data</div>
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-xs font-bold text-teal-300">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                              </span>
                              <span>Real-Time (IDX Feed)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HERO 3 MAIN INDEX CARDS */}
                    <MetricCard indices={indices} isLoading={isSimulating} />

                    {/* SENTIMEN PASAR & SKOR KESEHATAN GRIDS */}
                    <SentimentGauge 
                      isLoading={isSimulating} 
                      score={sentimentScore}
                      marketHealthScore={healthScore}
                    />

                    {/* INTERACTIVE CUSTOM WATCHLIST FOR CENTRAL USER PREFERENCE */}
                    <Watchlist 
                      watchlistCodes={watchlistCodes} 
                      onToggleWatchlist={handleToggleWatchlist} 
                      isLoading={isSimulating} 
                      onViewStockDetail={(code) => {
                        setSelectedStockCode(code);
                        setActiveTab('saham');
                      }}
                    />

                    {/* TOP MOVERS OVERVIEW */}
                    <TopMovers 
                      gainers={gainers} 
                      losers={losers} 
                      watchlist={watchlistCodes}
                      onToggleWatchlist={handleToggleWatchlist}
                      isLoading={isSimulating}
                      onViewStockDetail={(code) => {
                        setSelectedStockCode(code);
                        setActiveTab('saham');
                      }}
                    />

                    {/* RADAR BANDAR ANOMALIES */}
                    <RadarBandar radarData={BANDAR_RADAR_DATA} isLoading={isSimulating} />

                    {/* FLASH NEWS & DETAILED MODALS */}
                    <FlashNews newsList={NEWS_KILAT} isLoading={isSimulating} />
                  </>
                )}


                {/* 2. CORE STOCK CHARTS & LEDGER TAB */}
                {activeTab === 'saham' && (
                  <SahamDetail 
                    selectedStockCode={selectedStockCode}
                    onToggleWatchlist={handleToggleWatchlist} 
                    watchlistCodes={watchlistCodes} 
                    onSelectStock={setSelectedStockCode}
                  />
                )}


                {/* 3. EXPERT SCREENER SECTOR FILTERS TAB */}
                {activeTab === 'screener' && (
                  <Screener 
                    watchlistCodes={watchlistCodes}
                    onToggleWatchlist={handleToggleWatchlist}
                    onViewStockDetail={(code) => {
                      setSelectedStockCode(code);
                      setActiveTab('saham');
                    }}
                  />
                )}


                {/* 4. EXPANDABLE LATEST DISCUSSIONS / NEWS TAB */}
                {activeTab === 'berita' && (
                  <BeritaSentimen />
                )}


                {/* 5. CORPORATE EVENTS CALENDAR SUMMARY TAB */}
                {activeTab === 'kalender' && (
                  <KalenderWidget />
                )}


                {/* 6. INDONESIAN ACADEMIC LEARNING CORNER TAB */}
                {activeTab === 'edukasi' && (
                  <EdukasiWidget />
                )}


                {/* 7. FULL DEDICATED WATCHLIST SHEET TAB */}
                {activeTab === 'watchlist' && (
                  <div className="space-y-6">
                    <Watchlist 
                      watchlistCodes={watchlistCodes} 
                      onToggleWatchlist={handleToggleWatchlist} 
                      isLoading={isSimulating} 
                      onViewStockDetail={(code) => {
                        setSelectedStockCode(code);
                        setActiveTab('saham');
                      }}
                    />
                    
                    {/* Watchlist educational reminder tips */}
                    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-left shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h4 className="font-display font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">Tips Meminimalisir Kerugian: Diversifikasi Portofolio</h4>
                      </div>
                      <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed font-semibold">
                        Grup regulator menyarankan agar pemula membatasi alokasi dana maksimal <strong>15%</strong> pada satu ticker saham tunggal. Buatlah diversifikasi wajar dengan mengoleksi saham bursa dari sektor berbeda (misalnya: Perbankan besar seperti BBCA ramah dividen, dipadukan energi andalan batubara ADRO, dan telekomunikasi TLKM) untuk mendistribusikan risiko investasi secara cermat.
                      </p>
                    </div>
                  </div>
                )}

                {/* 8. TENTANG & SUMBER DATA DISCLAIMER TAB */}
                {activeTab === 'about' && (
                  <AboutWidget lastUpdateTime={lastUpdateTime} />
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Investment disclaimer Footer */}
          <Footer lastUpdateTime={lastUpdateTime} />

        </main>

      </div>

      {/* FLOATING SUCCESS TOAST ALERTS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#161b22] border border-emerald-500/30 text-white rounded-2xl p-4 flex items-center gap-3 shadow-2xl max-w-sm text-left"
          >
            <CheckCircle className="w-5 h-5 text-saham-green flex-shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-gray-100">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
