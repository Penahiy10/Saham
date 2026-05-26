/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Radio, ShieldAlert, Wifi, Activity, Sparkles, ChevronRight, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { BandarItem } from '../types';

interface RadarBandarProps {
  radarData: BandarItem[];
  isLoading: boolean;
}

export default function RadarBandar({ radarData, isLoading }: RadarBandarProps) {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Broker activities logs mock data to make interaction incredible!
  const getBrokerSummary = (code: string) => {
    switch (code) {
      case 'BRPT':
        return {
          buyer: ['Broker CC (Mandiri)', 'Broker AK (UBS)', 'Broker CS (Credit Suisse)'],
          seller: ['Broker YP (Mirae)', 'Broker PD (Indo Premier)', 'Broker XC (Ajaib)'],
          analysis: "Akumulasi didominasi broker asing institusional (CC & AK) dengan transaksi jumbo di pasar reguler, mengeringkan suplai ritel lokal."
        };
      case 'MEDC':
        return {
          buyer: ['Broker BK (JP Morgan)', 'Broker KZ (CLSA)', 'Broker YP (Mirae)'],
          seller: ['Broker NI (BNI Sekuritas)', 'Broker DR (Dahlia)', 'Broker DH (Sinarmas)'],
          analysis: "Pembelian terpusat pada broker asing menyusul breakout teknikal komoditas brent crude oil. Partisipasi institusional kuat."
        };
      default:
        return {
          buyer: ['Broker YP (Mirae)', 'Broker PD (Indo Premier)', 'Broker KK (Phillip)'],
          seller: ['Broker CS (Credit Suisse)', 'Broker AK (UBS)', 'Broker RX (Macquarie)'],
          analysis: "Distribusi agresif oleh broker institusi luar negeri menyasar ke investor ritel domestik yang menampung kejatuhan harga."
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="radar-bandar-section" className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      
      {/* Title block */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Radio className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
              Radar Bandar & Volume Unik (Spike)
            </h3>
            <p className="text-xs text-gray-400">
              Sinyal deteksi volume tidak wajar (di atas 20-day MA) yang mengindikasikan pergerakan uang besar (Smart Money).
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-red-500/10 text-rose-500 font-bold border border-rose-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Wifi className="w-3 h-3 animate-pulse" /> Live Detektor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {radarData.map((item) => {
          const isAccum = item.type === 'Akumulasi';
          const brokerDetails = getBrokerSummary(item.code);
          const isSelected = selectedStock === item.code;

          return (
            <div
              id={`bandar-badge-${item.code}`}
              key={item.code}
              onClick={() => setSelectedStock(isSelected ? null : item.code)}
              className={`rounded-xl p-4.5 border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gray-50/100 dark:bg-gray-800/20 border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-gray-50/50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/10'
              }`}
            >
              {/* Card visual contents */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-display font-black text-lg text-gray-950 dark:text-white tracking-wide">
                      {item.code}
                    </span>
                    <span className="text-[10px] text-gray-400 block -mt-1 truncate max-w-[130px]">{item.name}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    isAccum 
                      ? 'bg-emerald-500/10 text-saham-green' 
                      : 'bg-rose-500/10 text-saham-red'
                  }`}>
                    <Activity className="w-3 h-3 text-current" />
                    {isAccum ? 'Potensi Akumulasi' : 'Potensi Distribusi'}
                  </span>
                </div>

                {/* Ratio representation */}
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-2xl font-display font-black text-gray-950 dark:text-white tracking-tight">
                    {item.volumeRatio}x
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Volume Normal</span>
                </div>

                {/* Progress Visual Bar for Volume spike strength */}
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isAccum ? 'bg-saham-green' : 'bg-saham-red'}`} 
                    style={{ width: `${Math.min((item.volumeRatio / 5) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              {/* Bottom tag metrics */}
              <div className="mt-4 pt-3 border-t border-gray-250 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 font-bold font-mono">{item.netValue}</span>
                <span className={`font-bold uppercase ${
                  item.strength === 'Sangat Kuat' ? 'text-emerald-500' : 'text-blue-500'
                }`}>
                  {item.strength}
                </span>
              </div>

              {/* Collapsible details overlay preview */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-3 border-t border-emerald-500/20 text-xs flex flex-col gap-2 rounded text-left"
                >
                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-white dark:bg-[#121212] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div>
                      <div className="text-emerald-500 font-bold mb-1">Top Buyer (Net Buy):</div>
                      {brokerDetails.buyer.map((b) => (
                        <div key={b} className="text-gray-600 dark:text-gray-300 truncate font-mono">{b}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-rose-500 font-bold mb-1">Top Seller (Net Sell):</div>
                      {brokerDetails.seller.map((b) => (
                        <div key={b} className="text-gray-650 dark:text-gray-400 truncate font-mono">{b}</div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal italic">
                    {brokerDetails.analysis}
                  </p>
                </motion.div>
              )}

              {/* Guide prompt */}
              {!isSelected && (
                <div className="text-[9px] text-[#1565C0] font-semibold text-right mt-1.5 hover:underline flex items-center justify-end">
                  Lihat Analisa Broker <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3.5 rounded-xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#1565C0] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#1565C0] leading-snug">
          <strong>Tip Edukasi:</strong> Volume Spike adalah salah satu sinyal teknikal terkuat. Ketika harga memecah (breakout) resistance kunci dengan volume di atas 2x lipat rata-rata, peluang kelanjutan tren naik (bullish continuation) mencapai <strong>82%</strong>.
        </p>
      </div>

    </div>
  );
}
