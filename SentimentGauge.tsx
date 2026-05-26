/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gauge, ShieldAlert, Heart, TrendingUp, Info } from 'lucide-react';

interface SentimentGaugeProps {
  isLoading: boolean;
  score: number; // 0 to 100
  marketHealthScore: number; // 0 to 100
}

export default function SentimentGauge({ isLoading, score: initialScore, marketHealthScore: initialHealth }: SentimentGaugeProps) {
  const [score, setScore] = useState(initialScore);
  const [health, setHealth] = useState(initialHealth);
  const [activeScenario, setActiveScenario] = useState<'standard' | 'bullish' | 'bearish'>('standard');

  // Interactive scenario toggle
  const handleScenarioChange = (scenario: 'standard' | 'bullish' | 'bearish') => {
    setActiveScenario(scenario);
    if (scenario === 'bullish') {
      setScore(84);
      setHealth(88);
    } else if (scenario === 'bearish') {
      setScore(22);
      setHealth(35);
    } else {
      setScore(initialScore);
      setHealth(initialHealth);
    }
  };

  // Convert 0-100 score to degrees for speedometer needle (from -90deg to +90deg)
  const needleRotation = ((score / 100) * 180) - 90;

  const getSentimentLabel = (val: number) => {
    if (val >= 65) return { label: 'BULLISH (Optimis)', color: 'text-saham-green bg-emerald-500/10 border-emerald-500/20' };
    if (val <= 35) return { label: 'BEARISH (Khawatir)', color: 'text-saham-red bg-rose-500/10 border-rose-500/20' };
    return { label: 'NETRAL (Konsolidasi)', color: 'text-saham-blue bg-blue-500/10 border-blue-500/20' };
  };

  const getHealthDescription = (val: number) => {
    if (val >= 75) {
      return "Arus dana asing (foreign inflow) mengalir deras didukung stabilitas makroekonomi domestik dan penguatan Rupiah. Kondisi bursa dalam fase akumulasi institusi yang sangat sehat.";
    }
    if (val <= 40) {
      return "Sentimen tertekan aksi jual masif investor institusi akibat kekhawatiran kenaikan suku bunga global serta capital outflow di bursa regional. Lindungi modal Anda.";
    }
    return "Pasar bergerak sideways dalam kisaran wajar. Investor ritel berhati-hati menunggu rilis data Produk Domestik Bruto (PDB) kuartalan dan laporan keuangan emiten utama.";
  };

  const sentimentInfo = getSentimentLabel(score);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 h-64 animate-pulse" />
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* 1. METER SENTIMEN PASAR */}
      <div id="sentiment-meter-card" className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
                Meter Sentimen Pasar (IDX)
              </h3>
            </div>
            
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sentimentInfo.color}`}>
              {sentimentInfo.label}
            </span>
          </div>

          <div className="text-xs text-gray-400 mb-1">
            Indikator sentimen mengukur optimisme trader retail & institusi terkini.
          </div>
        </div>

        {/* Speedometer Gauge Visualizer */}
        <div className="flex flex-col items-center justify-center my-4 relative">
          <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
            {/* Speedometer Arc SVG */}
            <svg className="w-64 h-32 overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF1744" /> {/* Bearish (Red) */}
                  <stop offset="50%" stopColor="#1565C0" /> {/* Neutral (Blue) */}
                  <stop offset="100%" stopColor="#00C853" /> {/* Bullish (Green) */}
                </linearGradient>
              </defs>
              {/* Semi-circle track */}
              <path
                d="M 12 128 A 116 116 0 0 1 244 128"
                fill="none"
                stroke="#e2e8f0"
                className="dark:stroke-gray-800"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 12 128 A 116 116 0 0 1 244 128"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="365"
                strokeDashoffset="0"
              />
            </svg>

            {/* Scale Labels */}
            <div className="absolute left-4 bottom-1 text-[10px] font-black text-rose-500 uppercase tracking-wider">Bearish</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-4 text-[10px] font-black text-blue-500 uppercase tracking-wider">Netral</div>
            <div className="absolute right-4 bottom-1 text-[10px] font-black text-emerald-500 uppercase tracking-wider">Bullish</div>

            {/* Rotating Needle Pin */}
            <div 
              className="absolute bottom-0 w-4 h-4 rounded-full bg-gray-800 dark:bg-white border-2 border-gray-300 dark:border-gray-900 z-10" 
              style={{ transform: 'translateY(50%)' }}
            />
            {/* Speedometer Needle */}
            <motion.div
              id="sentiment-needle"
              animate={{ rotate: needleRotation }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="absolute bottom-0 w-1.5 h-24 bg-gray-900 dark:bg-[#f1f5f9] rounded-t-full"
              style={{ 
                transformOrigin: '50% 100%',
                bottom: '0px',
                left: 'calc(50% - 3px)'
              }}
            />
          </div>

          {/* Large Sentiment Score Value */}
          <div className="text-center mt-3 z-20">
            <span className="text-4xl font-display font-black text-gray-950 dark:text-white leading-none">
              {score}
            </span>
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500 font-mono ml-1">/100</span>
          </div>
        </div>

        {/* Interactive Scenario Simulation within sentiment widget */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-500" /> Simulasi Makro:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleScenarioChange('standard')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                activeScenario === 'standard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleScenarioChange('bullish')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                activeScenario === 'bullish' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-emerald-400 hover:bg-emerald-200/10'
              }`}
            >
              Asing Masuk
            </button>
            <button
              onClick={() => handleScenarioChange('bearish')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                activeScenario === 'bearish' 
                  ? 'bg-rose-650 bg-rose-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-rose-400 hover:bg-rose-200/10'
              }`}
            >
              Hawkish Fed
            </button>
          </div>
        </div>
      </div>

      {/* 2. SKOR KESEHATAN PASAR */}
      <div id="market-health-card" className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
                Skor Kesehatan Pasar (IDX)
              </h3>
            </div>
            
            <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" /> Finansial Solid
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Algoritma kami menilai stabilitas makroekonomi, likuiditas transaksi bursa, dan rasio sehat buy-sell asing hari ini.
          </p>
        </div>

        {/* Big Health Number Card & Arc Ring */}
        <div className="flex flex-col sm:flex-row items-center gap-6 py-1">
          {/* Radial Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Background Ring & Progress Bar */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-gray-100 dark:stroke-gray-800"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="46"
                stroke={health >= 70 ? '#00C853' : health <= 40 ? '#FF1744' : '#1565C0'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="290"
                initial={{ strokeDashoffset: 290 }}
                animate={{ strokeDashoffset: 290 - (290 * health) / 100 }}
                transition={{ duration: 1, type: 'spring' }}
                strokeLinecap="round"
              />
            </svg>
            {/* Absolute Centered Score Text */}
            <div className="absolute text-center">
              <span className="text-3xl font-display font-black text-gray-950 dark:text-white block tracking-tight">
                {health}
              </span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest block uppercase">Skor</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-extrabold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-1">
              Catatan Makroekonomi:
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              "{getHealthDescription(health)}"
            </p>
          </div>
        </div>

        {/* Footer info stating the indicators scope */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 text-[10px] text-gray-400 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
          <span>Skor diperbarui harian pukul 16:15 WIB setelah penutupan pasar reguler.</span>
        </div>
      </div>

    </div>
  );
}
