/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, RefreshCw, Star, Info, Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lastUpdateTime: string;
  onSimulateUpdate: () => void;
  isSimulating: boolean;
}

export default function Header({
  activeTab,
  darkMode,
  toggleDarkMode,
  lastUpdateTime,
  onSimulateUpdate,
  isSimulating,
}: HeaderProps) {
  
  // Format tab title to printable Indonesian headline
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Ringkasan Pasar Saham';
      case 'saham':
        return 'Analisa Saham & Interaktif Chart';
      case 'screener':
        return 'Screener Saham Cerdas';
      case 'berita':
        return 'Grup Berita & Makro Ekonomi';
      case 'kalender':
        return 'Kalender Aksi Korporasi';
      case 'edukasi':
        return 'Pojok Belajar Investasi';
      case 'watchlist':
        return 'Watchlist Saham Pilihan';
      default:
        return 'Dashboard Saham';
    }
  };

  return (
    <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div>
        {/* Breadcrumb & Subtitle */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
          <span>Platform Penahiy</span>
          <span>•</span>
          <span className="text-[#1565C0] font-bold">SahamPintar INDONESIA</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-gray-900 dark:text-white leading-tight">
          {getTabTitle()}
        </h1>
      </div>

      {/* Action buttons & badge on the right */}
      <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
        
        {/* Flash simulated reload */}
        <button
          id="simulate-update-btn"
          onClick={onSimulateUpdate}
          disabled={isSimulating}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-gray-850 transition shadow-sm disabled:opacity-50"
          title="Simulasi Perubahan Harga & Live Update"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-500' : 'text-gray-400'}`} />
          <span className="hidden lg:inline">Update Real-Time</span>
          <span className="lg:hidden">Update</span>
        </button>

        {/* Realtime Live Pulse Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-[#1A1A1A] border border-emerald-100 dark:border-gray-800 px-3 py-1.5 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saham-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-saham-green"></span>
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Data: {lastUpdateTime} WIB
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition cursor-pointer hidden md:block">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></span>
        </div>

        {/* Light Dark Mode Toggle */}
        <button
          id="theme-toggler"
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 cursor-pointer shadow-sm"
          aria-label="Toggle Theme Mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-700" />
          )}
        </button>
      </div>
    </header>
  );
}
