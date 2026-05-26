/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MarketIndex } from '../types';

interface MetricCardProps {
  indices: MarketIndex[];
  isLoading: boolean;
}

export default function MetricCard({ indices, isLoading }: MetricCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {indices.map((idx, index) => {
        const isUp = idx.change >= 0;
        
        // Generate a pseudo-sparkline path based on values for premium look
        const sparklinePoints = isUp 
          ? "5,45 25,35 45,40 65,20 85,25 105,5 125,12 145,2"
          : "5,5 25,15 45,10 65,30 85,25 105,38 125,35 145,45";

        if (isLoading) {
          return (
            <div 
              key={`skeleton-${index}`}
              className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-12"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mt-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          );
        }

        return (
          <motion.div
            id={`idx-card-${idx.name.toLowerCase().replace(/\s+/g, '-')}`}
            key={idx.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 relative overflow-hidden group"
          >
            {/* Ambient Background Glow for Positive/Negative */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-10 group-hover:opacity-15 transition-opacity duration-200 pointer-events-none ${
              isUp ? 'bg-saham-green' : 'bg-saham-red'
            }`} />

            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide">
                {idx.name}
              </span>

              {/* Dynamic Badge */}
              <span className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isUp 
                  ? 'bg-emerald-500/10 text-saham-green dark:text-emerald-400' 
                  : 'bg-rose-500/10 text-saham-red dark:text-rose-400'
              }`}>
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>

            {/* Main Numeric Indicators */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                {idx.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-semibold ${isUp ? 'text-saham-green' : 'text-saham-red'}`}>
                {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{idx.change.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold font-mono">
                Volume: ~18.4T IDR (Est.)
              </span>
              
              {/* Premium Sparkline */}
              <div className="w-20 h-6">
                <svg className="w-full h-full overflow-visible" strokeWidth="2" fill="none">
                  <path
                    d={sparklinePoints}
                    stroke={isUp ? '#00C853' : '#FF1744'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
