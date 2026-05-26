/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Search, 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Star,
  Info,
  Menu,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  lastUpdateTime: string;
  onLogout?: () => void;
  selectedStockCode?: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  lastUpdateTime,
  onLogout,
  selectedStockCode
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saham', label: selectedStockCode ? `Detail Saham (${selectedStockCode})` : 'Detail Saham (BBCA)', icon: TrendingUp },
    { id: 'screener', label: 'Screener', icon: Search },
    { id: 'berita', label: 'Berita', icon: Newspaper },
    { id: 'kalender', label: 'Kalender', icon: Calendar },
    { id: 'edukasi', label: 'Edukasi', icon: BookOpen },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'about', label: 'Tentang & Disclaimer', icon: Info },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#121212] text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1565C0] flex items-center justify-center text-white">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <span className="font-display font-black text-base tracking-tight text-white leading-none block">Penahiy</span>
            <span className="text-[9px] text-gray-400 font-display">Analisa Tajam, Keputusan Cerdas</span>
          </div>
        </div>
        
        <button 
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Slider Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              id="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.div 
              id="mobile-menu-container"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#121212] border-r border-gray-800 z-50 p-5 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1565C0] flex items-center justify-center text-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-display font-bold text-lg text-white">Penahiy</span>
                    <span className="text-[8px] text-gray-400 block -mt-1">SahamPintar App</span>
                  </div>
                </div>
                <button 
                  id="mobile-menu-close"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 flex-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      id={`mobile-nav-${item.id}`}
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                        isActive 
                          ? 'bg-[#1E1E1E] text-white border-l-4 border-[#1565C0] pl-2' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#1565C0]' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-[#1565C0]" />}
                    </button>
                  );
                })}
              </nav>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold text-rose-500 hover:text-white hover:bg-rose-500/10 text-left transition duration-150"
                >
                  <LogOut className="w-5 h-5 text-rose-500" />
                  <span>Log Out / Keluar</span>
                </button>
              )}

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-saham-green animate-pulse-fast"></span>
                  <span className="text-xs text-gray-400">Data: {lastUpdateTime} WIB</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  GRATIS untuk pemula hingga trader aktif Indonesia.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121212] border-r border-gray-800 min-h-screen text-gray-200 sticky top-0 self-start">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1565C0] flex items-center justify-center text-white shadow-lg shadow-[#1565C0]/15">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Penahiy
              </span>
              <span className="text-[9px] font-semibold text-[#1565C0] tracking-widest block -mt-1 uppercase">
                SahamPintar App
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium italic mt-1 leading-snug">
            "Analisa Tajam, Keputusan Cerdas"
          </p>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`desktop-nav-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#1E1E1E] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-850/40'
                }`}
              >
                {/* Active Bar indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-lg bg-[#1565C0]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#1565C0]' : 'text-gray-400 group-hover:text-white'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-[#F43F5E] hover:text-white hover:bg-[#F43F5E]/10 text-left transition duration-200 mt-2"
            >
              <LogOut className="w-5 h-5 text-[#F43F5E] transition-transform duration-200" />
              <span>Log Out / Keluar</span>
            </button>
          )}
        </nav>

        {/* Info & Banner badge footer inside Sidebar */}
        <div className="p-4 m-4 rounded-2xl bg-gray-800/30 border border-gray-800/50 flex flex-col justify-end">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saham-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saham-green"></span>
            </span>
            <span className="text-xs font-semibold text-gray-300">IHSG Live Feed</span>
          </div>
          <div className="bg-gray-950/60 p-2 rounded-lg text-[11px] text-gray-400 font-mono flex justify-between mb-2">
            <span>Bursa Update:</span>
            <span className="text-emerald-400 font-bold">{lastUpdateTime} WIB</span>
          </div>
          <p className="text-[10px] text-gray-500 text-center leading-normal">
            Bursa Efek Indonesia (IDX)<br />Data di-refresh setiap seliap menit.
          </p>
        </div>
      </aside>
    </>
  );
}
