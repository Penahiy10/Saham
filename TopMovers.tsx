/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Search, Plus, Check } from 'lucide-react';
import { StockItem } from '../types';

interface TopMoversProps {
  gainers: StockItem[];
  losers: StockItem[];
  watchlist: string[]; // List of stock codes currently watched
  onToggleWatchlist: (code: string) => void;
  isLoading: boolean;
  onViewStockDetail?: (code: string) => void;
}

interface StockRowProps {
  key?: string;
  item: StockItem;
  isGainer: boolean;
  watchlist: string[];
  onToggleWatchlist: (code: string) => void;
  onViewStockDetail?: (code: string) => void;
}

function StockRow({ item, isGainer, watchlist, onToggleWatchlist, onViewStockDetail }: StockRowProps) {
  const isWatched = watchlist.includes(item.code);
  return (
    <tr 
      id={`stock-row-${item.code}`}
      key={item.code} 
      className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors"
    >
      {/* Watchlist Star Toggle */}
      <td className="py-2.5 pl-3 pr-1 text-center">
        <button
          onClick={() => onToggleWatchlist(item.code)}
          className="p-1 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 cursor-pointer"
          title={isWatched ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
        >
          <Star className={`w-4 h-4 ${isWatched ? 'text-amber-400 fill-amber-400' : ''}`} />
        </button>
      </td>

      {/* Stock Core Details */}
      <td className="py-2.5 px-3">
        {onViewStockDetail ? (
          <button
            onClick={() => onViewStockDetail(item.code)}
            className="hover:text-blue-500 hover:underline text-left cursor-pointer transition uppercase"
          >
            <div className="font-display font-black text-gray-950 dark:text-white tracking-wide text-sm">{item.code}</div>
          </button>
        ) : (
          <div className="font-display font-black text-gray-950 dark:text-white tracking-wide text-sm">{item.code}</div>
        )}
        <div className="text-[10px] text-gray-400 truncate max-w-[130px] font-medium">{item.name}</div>
      </td>

      {/* Regular Price */}
      <td className="py-2.5 px-3 text-right">
        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-150">
          {item.price.toLocaleString('id-ID')}
        </div>
        <div className="text-[9px] text-gray-400">{item.industry}</div>
      </td>

      {/* Percentage Change */}
      <td className="py-2.5 px-3 text-right">
        <span className={`inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded ${
          isGainer 
            ? 'bg-emerald-500/10 text-saham-green' 
            : 'bg-rose-500/10 text-saham-red'
        }`}>
          {isGainer ? '+' : ''}{item.changePercent.toFixed(2)}%
        </span>
      </td>

      {/* Day Volume */}
      <td className="py-2.5 px-3 text-right hidden sm:table-cell font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
        {item.volume}
      </td>
    </tr>
  );
}

export default function TopMovers({
  gainers,
  losers,
  watchlist,
  onToggleWatchlist,
  isLoading,
  onViewStockDetail,
}: TopMoversProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  // Filter lists based on user search query (case-insensitive)
  const filterList = (list: StockItem[]) => {
    return list.filter(
      (item) =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredGainers = filterList(gainers);
  const filteredLosers = filterList(losers);

  const TableHeader = () => (
    <thead>
      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold text-[10px] uppercase tracking-wider text-left bg-gray-50/50 dark:bg-gray-800/10">
        <th className="py-2 pl-3 pr-1 w-8 text-center"></th>
        <th className="py-2 px-3 text-left">Kode/Nama</th>
        <th className="py-2 px-3 text-right">Harga (IDR)</th>
        <th className="py-2 px-3 text-right">Perubahan</th>
        <th className="py-2 px-3 text-right hidden sm:table-cell">Volume</th>
      </tr>
    </thead>
  );

  return (
    <div id="top-movers-section" className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      
      {/* Header and Live Search Filter bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
            Top Movers Teraktif Hari Ini
          </h3>
          <p className="text-xs text-gray-400">
            Pergerakan saham dengan kenaikan dan penurunan persentase harga harian terbesar.
          </p>
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="saham-search-input"
            type="text"
            placeholder="Cari Kode atau Emiten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-xs border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-semibold"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Mobile responsive toggle buttons */}
          <div className="flex md:hidden bg-gray-100 dark:bg-gray-900 rounded-xl p-1 mb-4">
            <button
              onClick={() => setActiveTab('gainers')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'gainers'
                  ? 'bg-white dark:bg-[#1E1E1E] text-saham-green shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Top Gainers
            </button>
            <button
              onClick={() => setActiveTab('losers')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'losers'
                  ? 'bg-white dark:bg-[#1E1E1E] text-saham-red shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" /> Top Losers
            </button>
          </div>

          {/* Side-by-Side tables on desktop, Tab-switched on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TOP GAINERS TABLE */}
            <div className={`space-y-3 ${activeTab !== 'gainers' ? 'hidden md:block' : 'block'}`}>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10 text-saham-green text-xs font-bold">
                <TrendingUp className="w-4 h-4" /> Top 5 Saham Menguat Terbesar
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <TableHeader />
                  <tbody>
                    {filteredGainers.length > 0 ? (
                      filteredGainers.map((item) => (
                        <StockRow 
                          key={`gainer-${item.code}`} 
                          item={item} 
                          isGainer={true} 
                          watchlist={watchlist}
                          onToggleWatchlist={onToggleWatchlist}
                          onViewStockDetail={onViewStockDetail}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-gray-400 font-bold">
                          Tidak ada saham gainer yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOP LOSERS TABLE */}
            <div className={`space-y-3 ${activeTab !== 'losers' ? 'hidden md:block' : 'block'}`}>
              <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/10 text-saham-red text-xs font-bold">
                <TrendingDown className="w-4 h-4" /> Top 5 Saham Melemah Terbesar
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <TableHeader />
                  <tbody>
                    {filteredLosers.length > 0 ? (
                      filteredLosers.map((item) => (
                        <StockRow 
                          key={`loser-${item.code}`} 
                          item={item} 
                          isGainer={false} 
                          watchlist={watchlist}
                          onToggleWatchlist={onToggleWatchlist}
                          onViewStockDetail={onViewStockDetail}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-gray-400 font-bold">
                          Tidak ada saham loser yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
