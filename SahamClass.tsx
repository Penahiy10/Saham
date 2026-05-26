/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AreaChart, TrendingUp, DollarSign, BarChart2, Activity, ListCollapse } from 'lucide-react';
import { INDONESIAN_STOCKS } from '../data';
import { StockItem } from '../types';

export default function SahamClass() {
  const [selectedCode, setSelectedCode] = useState('BBCA');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [showIndicators, setShowIndicators] = useState(false);
  const [tick, setTick] = useState(0);

  // Auto flickering Bid-Ask ledger simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const stock = INDONESIAN_STOCKS.find((s) => s.code === selectedCode) || INDONESIAN_STOCKS[0];

  // Derive static financials based on the stock price
  const getFinancialStats = (item: StockItem) => {
    const peRatio = item.industry === 'Teknologi' ? 42.1 : item.industry === 'Perbankan' ? 14.8 : 8.4;
    const divYield = item.industry === 'Perbankan' ? 4.25 : item.industry === 'Teknologi' ? 0.0 : 6.12;
    const marketCap = item.price > 5000 ? '1,210.4 Triliun' : item.price > 1000 ? '184.5 Triliun' : '38.2 Triliun';
    return { peRatio, divYield, marketCap };
  };

  const stats = getFinancialStats(stock);

  // Dynamic candle points based on stock price and timeframe
  const getCandles = () => {
    const base = stock.price;
    const count = timeframe === '1D' ? 8 : timeframe === '1W' ? 5 : timeframe === '1M' ? 12 : 20;
    const candleData: { open: number; close: number; high: number; low: number; label: string }[] = [];

    for (let i = 0; i < count; i++) {
      const factor = (Math.sin(i * 0.8) + Math.cos(i * 0.3)) * 0.03 + (stock.changePercent / 150);
      const open = base * (1 + factor * (1 - i / count) - 0.015);
      const close = base * (1 + factor * (1 - i / count) + 0.012);
      const high = Math.max(open, close) * 1.015;
      const low = Math.min(open, close) * 0.982;
      candleData.push({
        open,
        close,
        high,
        low,
        label: timeframe === '1D' ? `${9 + i}:00` : `H-${count - i}`
      });
    }
    return candleData;
  };

  const candles = getCandles();

  // Simulated Order Book (Bid / Ask Queues)
  const getOrderBook = () => {
    const midPrice = stock.price;
    const bids: { price: number; qty: string }[] = [];
    const asks: { price: number; qty: string }[] = [];

    // Modify quantities slightly on ticks to show life
    const tickSeed = (tick % 5);

    for (let i = 1; i <= 5; i++) {
      bids.push({
        price: midPrice - (i * 10),
        qty: `${(1500 * (6 - i) + (tickSeed * 210)).toLocaleString('id-ID')}`
      });
      asks.push({
        price: midPrice + (i * 10),
        qty: `${(1200 * i + (tickSeed * 180)).toLocaleString('id-ID')}`
      });
    }

    return { bids, asks };
  };

  const { bids, asks } = getOrderBook();

  return (
    <div id="interactive-charting-tab" className="space-y-6">
      
      {/* Ticker selector controls */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Emiten:</label>
          <select
            id="saham-ticker-selector"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {INDONESIAN_STOCKS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframes */}
        <div className="flex bg-gray-50 dark:bg-gray-900 rounded-xl p-1 gap-1 border border-gray-100 dark:border-gray-800/80">
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <button
              id={`timeframe-tab-${tf.toLowerCase()}`}
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                timeframe === tf
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-450 text-gray-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Candlestick Mock Chart Graphic Frame */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-gray-105 dark:border-gray-800/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-display font-black text-gray-950 dark:text-white">
                  ${stock.code} Intraday Candlesticks
                </h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  stock.changePercent >= 0 ? 'bg-emerald-500/10 text-saham-green' : 'bg-rose-500/10 text-saham-red'
                }`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-[10px] text-gray-450 text-gray-400 font-semibold">{stock.name} ({timeframe} View)</p>
            </div>

            {/* Check overlay option */}
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                showIndicators 
                  ? 'bg-emerald-600/10 border-saham-green text-emerald-400' 
                  : 'border-gray-200 dark:border-gray-800 text-gray-400'
              }`}
            >
              Overlay MA-20
            </button>
          </div>

          {/* Interactive Candles Area */}
          <div className="h-64 w-full relative flex items-end justify-between px-2 pt-6 pb-2 select-none">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-gray-400 w-full" />
              <div className="border-b border-gray-400 w-full" />
              <div className="border-b border-gray-400 w-full" />
              <div className="border-b border-gray-400 w-full" />
            </div>

            {/* Candlesticks loop render */}
            {candles.map((candle, idx) => {
              const goesUp = candle.close >= candle.open;
              const unitHeight = 180; // canvas scale heights
              const minVal = Math.min(...candles.map((c) => c.low));
              const maxVal = Math.max(...candles.map((c) => c.high));
              const range = maxVal - minVal;

              const getPixelY = (val: number) => {
                return ((val - minVal) / range) * unitHeight;
              };

              const top = getPixelY(Math.max(candle.open, candle.close));
              const bottom = getPixelY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(top - bottom, 3);
              const highY = getPixelY(candle.high);
              const lowY = getPixelY(candle.low);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-crosshair">
                  {/* Candlestick Box & Wick */}
                  <div className="relative w-full flex items-center justify-center" style={{ height: `${unitHeight}px` }}>
                    {/* Wick Line */}
                    <div 
                      className={`absolute w-0.5 ${goesUp ? 'bg-saham-green' : 'bg-saham-red'}`}
                      style={{ 
                        bottom: `${lowY}px`, 
                        top: `${unitHeight - highY}px` 
                      }}
                    />

                    {/* Candle Real Body */}
                    <div 
                      className={`absolute w-4 sm:w-6 rounded-xs shadow-xs border ${
                        goesUp 
                          ? 'bg-saham-green/80 border-saham-green' 
                          : 'bg-saham-red/80 border-saham-red'
                      }`}
                      style={{ 
                        bottom: `${bottom}px`, 
                        height: `${bodyHeight}px` 
                      }}
                    />
                  </div>

                  {/* Horizontal indicators overlay curve mock style */}
                  {showIndicators && (
                    <div 
                      className="absolute w-2 h-2 rounded-full bg-blue-500 z-10 border border-white"
                      style={{ bottom: `${(bottom + top) / 2 + 10}px` }}
                    />
                  )}

                  {/* Label under date */}
                  <span className="text-[9px] font-mono font-semibold text-gray-400 dark:text-gray-500 mt-2 block">{candle.label}</span>

                  {/* Popup Tooltip bubble */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-gray-950 text-white text-[9px] p-2 rounded-lg leading-tight z-30 shadow-xl border border-gray-800 pointer-events-none w-24">
                    <div className="font-bold border-b border-gray-800 pb-1 mb-1 text-center">${stock.code}</div>
                    <div>High: <span className="font-mono">{Math.round(candle.high)}</span></div>
                    <div>Low: <span className="font-mono">{Math.round(candle.low)}</span></div>
                    <div>Close: <span className="font-mono">{Math.round(candle.close)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 leading-snug mt-3">
            *Arahkan kursor Anda ke setiap lilin (candle) untuk mendapatkan info detil pembukaan, penutupan, dan nilai tertinggi/terendah.
          </p>
        </div>

        {/* Dynamic Bid-Ask Ledger Order-Book & Statistics Card */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-150 dark:border-gray-800/60 pb-3">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <h4 className="text-sm font-display font-black text-gray-905 dark:text-white">
                Live Order Book & Stats
              </h4>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-left">
              <div className="bg-gray-50/50 dark:bg-gray-900/30 p-2.5 border border-gray-100 dark:border-gray-850 rounded-xl">
                <div className="text-[9px] text-gray-400 font-bold uppercase">Rasio P/E (TTM)</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white font-mono mt-0.5">{stats.peRatio}x</div>
              </div>
              <div className="bg-gray-50/50 dark:bg-gray-900/30 p-2.5 border border-gray-100 dark:border-gray-850 rounded-xl">
                <div className="text-[9px] text-gray-400 font-bold uppercase">Yield Dividen</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white font-mono mt-0.5">{stats.divYield}%</div>
              </div>
              <div className="col-span-2 bg-gray-50/50 dark:bg-gray-900/30 p-2.5 border border-gray-100 dark:border-gray-850 rounded-xl">
                <div className="text-[9px] text-gray-400 font-bold uppercase">Kapitalisasi Pasar (Est.)</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white font-mono mt-0.5">IDR {stats.marketCap}</div>
              </div>
            </div>

            {/* Simulated Live Book */}
            <div className="text-left space-y-1">
              <div className="grid grid-cols-5 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="col-span-2 text-emerald-600">Bid (Beli) Vol</span>
                <span className="text-center text-gray-300">|</span>
                <span className="col-span-2 text-right text-rose-500">Vol Ask (Jual)</span>
              </div>

              {/* Bid Ask rows render */}
              {bids.map((bid, i) => {
                const ask = asks[i];
                return (
                  <div key={i} className="grid grid-cols-5 text-[11px] font-mono py-1 border-b border-gray-550 dark:border-gray-800/20 font-semibold">
                    <span className="col-span-2 text-emerald-500">{bid.qty}</span>
                    <span className="text-emerald-500 text-center">{bid.price.toLocaleString('id-ID')}</span>
                    <span className="text-rose-500 text-center">{ask.price.toLocaleString('id-ID')}</span>
                    <span className="col-span-1 text-rose-500 text-right">{ask.qty}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-left text-[10px] text-emerald-500 font-medium leading-normal mt-4">
            Order book di-refresh secara real-time setiap 1.5 detik menggunakan simulasi volatilitas bursa IDX Penahiy. Target emiten sedang dikoleksi broker CC.
          </div>
        </div>

      </div>

    </div>
  );
}
