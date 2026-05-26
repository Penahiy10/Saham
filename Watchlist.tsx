/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Star, Search, Plus, Trash2, TrendingUp, TrendingDown, Sparkles, 
  Bell, Wallet, ArrowUpRight, ArrowDownRight, Info, Activity, 
  BarChart2, ShieldCheck, PlayCircle, Scale, CheckCircle2, History
} from 'lucide-react';
import { INDONESIAN_STOCKS } from '../data';
import { StockItem } from '../types';

interface WatchlistProps {
  watchlistCodes: string[];
  onToggleWatchlist: (code: string) => void;
  isLoading: boolean;
  onViewStockDetail?: (code: string) => void;
}

function isMarketOpenClient(): boolean {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wib = new Date(utc + (7 * 60 * 60 * 1000));

  const day = wib.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (day === 0 || day === 6) {
    return false; // Weekend closed
  }

  const hour = wib.getHours();
  const minute = wib.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Session 1: 09:00 - 12:00 WIB (540 to 720 minutes)
  // Session 2: 13:30 - 16:00 WIB (810 to 960 minutes)
  const isSession1 = timeInMinutes >= 540 && timeInMinutes <= 720;
  const isSession2 = timeInMinutes >= 810 && timeInMinutes <= 960;

  return isSession1 || isSession2;
}

// Fixed Fundamental Data dictionary for realistic Head-to-Head Comparison
const STOCK_FUNDAMENTALS: Record<string, {
  pe: number;
  pbv: number;
  roe: number;
  divYield: number;
  der: number;
  mcap: string;
}> = {
  BBCA: { pe: 24.5, pbv: 4.8, roe: 21.2, divYield: 2.2, der: 0.12, mcap: "1.210 T" },
  BBRI: { pe: 14.8, pbv: 2.6, roe: 18.5, divYield: 4.9, der: 0.82, mcap: "724 T" },
  TLKM: { pe: 15.2, pbv: 2.8, roe: 16.4, divYield: 4.2, der: 0.38, mcap: "339 T" },
  GOTO: { pe: -12.4, pbv: 0.7, roe: -8.5, divYield: 0.0, der: 0.09, mcap: "73 T" },
  BMRI: { pe: 11.2, pbv: 2.1, roe: 19.8, divYield: 5.2, der: 0.68, mcap: "568 T" },
  BBNI: { pe: 9.8, pbv: 1.2, roe: 14.5, divYield: 4.8, der: 0.55, mcap: "152 T" },
  ADRO: { pe: 5.8, pbv: 0.9, roe: 15.6, divYield: 11.8, der: 0.45, mcap: "91 T" },
  ANTM: { pe: 12.1, pbv: 1.5, roe: 11.2, divYield: 3.5, der: 0.31, mcap: "36 T" },
  PGAS: { pe: 8.4, pbv: 0.8, roe: 9.5, divYield: 6.8, der: 0.52, mcap: "37 T" },
  PTBA: { pe: 6.2, pbv: 1.1, roe: 13.5, divYield: 12.1, der: 0.38, mcap: "30 T" },
  BRPT: { pe: 45.2, pbv: 3.2, roe: 3.8, divYield: 0.5, der: 1.45, mcap: "93 T" },
  UNVR: { pe: 21.5, pbv: 12.4, roe: 58.2, divYield: 4.6, der: 0.98, mcap: "88 T" },
  KLBF: { pe: 22.8, pbv: 3.4, roe: 15.2, divYield: 2.5, der: 0.18, mcap: "73 T" },
  AMRT: { pe: 32.4, pbv: 8.5, roe: 26.4, divYield: 1.8, der: 0.25, mcap: "122 T" },
  ASII: { pe: 7.8, pbv: 1.0, roe: 12.8, divYield: 6.5, der: 0.48, mcap: "196 T" },
  MEDC: { pe: 6.4, pbv: 1.1, roe: 16.8, divYield: 3.2, der: 1.25, mcap: "30 T" },
  BUKA: { pe: -8.5, pbv: 0.4, roe: -4.2, divYield: 0.0, der: 0.05, mcap: "12 T" },
  INDF: { pe: 6.8, pbv: 1.1, roe: 14.8, divYield: 3.9, der: 0.72, mcap: "56 T" },
  ICBP: { pe: 14.5, pbv: 2.8, roe: 19.5, divYield: 2.8, der: 0.58, mcap: "130 T" },
  HRUM: { pe: 8.2, pbv: 1.3, roe: 12.4, divYield: 4.2, der: 0.22, mcap: "16 T" },
};

// Fixed historical returns for comparison chart (representing 7 simulated days)
const STOCK_HIST_DATA: Record<string, number[]> = {
  BBCA: [100, 101.2, 100.8, 99.6, 101.5, 102.1, 102.6],
  BBRI: [100, 99.2, 100.3, 102.8, 102.1, 101.2, 103.11],
  TLKM: [100, 98.8, 97.9, 98.5, 99.2, 98.1, 98.84],
  GOTO: [100, 103.5, 105.3, 100.0, 100.0, 101.8, 105.08],
  BMRI: [100, 101.5, 102.8, 101.2, 100.5, 101.1, 102.09],
  ADRO: [100, 97.5, 98.8, 96.8, 97.2, 98.5, 97.59],
  BRPT: [100, 104.2, 102.5, 106.8, 105.1, 108.5, 108.20],
  BUKA: [100, 98.9, 97.5, 96.2, 98.2, 97.8, 96.72],
};

interface AlertItem {
  id: string;
  code: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}

interface PortfolioPos {
  code: string;
  name: string;
  lots: number;
  buyPrice: number;
}

interface TradeHistoryItem {
  id: string;
  code: string;
  type: 'BUY' | 'SELL';
  lots: number;
  price: number;
  date: string;
  profit?: number;
}

interface PortfolioHistoryPoint {
  date: string;
  value: number;
}

export default function Watchlist({
  watchlistCodes,
  onToggleWatchlist,
  isLoading,
  onViewStockDetail,
}: WatchlistProps) {
  // Navigation inside the Widget
  const [subTab, setSubTab] = useState<'watchlist' | 'portfolio' | 'compare' | 'stats'>('watchlist');

  // Search variables
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // States saved to LocalStorage
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [customPriceChanges, setCustomPriceChanges] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [cash, setCash] = useState<number>(100000000); // 100M
  const [positions, setPositions] = useState<PortfolioPos[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistoryPoint[]>([]);

  // Local state alerts configuration
  const [alertCode, setAlertCode] = useState('BBCA');
  const [alertPrice, setAlertPrice] = useState<number>(10000);
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  // Compare section states
  const [compareStocks, setCompareStocks] = useState<string[]>(['BBCA', 'BBRI', 'GOTO']);

  // Localized alert triggered logs
  const [alertLogs, setAlertLogs] = useState<{ id: string; msg: string; time: string }[]>([]);

  // Simulation parameters (Beli/Jual form)
  const [simBuyCode, setSimBuyCode] = useState('BBCA');
  const [simBuyLots, setSimBuyLots] = useState<number>(10);
  const [simBuyPrice, setSimBuyPrice] = useState<number>(9850);

  const [simSellCode, setSimSellCode] = useState('BBCA');
  const [simSellLots, setSimSellLots] = useState<number>(10);

  // Notification requesting on load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Initialize and Sync local storage on mount
  useEffect(() => {
    const savedPrices = localStorage.getItem('saham-custom-prices');
    const savedChanges = localStorage.getItem('saham-custom-changes');
    const savedAlerts = localStorage.getItem('saham-alerts');
    const savedCash = localStorage.getItem('saham-portfolio-cash');
    const savedPos = localStorage.getItem('saham-portfolio-positions');
    const savedHistory = localStorage.getItem('saham-trade-history');
    const savedPFHist = localStorage.getItem('saham-portfolio-value-history');

    // 1. Initial prices load
    if (savedPrices && savedChanges) {
      try {
        setCustomPrices(JSON.parse(savedPrices));
        setCustomPriceChanges(JSON.parse(savedChanges));
      } catch (e) {
        initBaseStockPrices();
      }
    } else {
      initBaseStockPrices();
    }

    // 2. Initial Alert list
    if (savedAlerts) {
      try { setAlerts(JSON.parse(savedAlerts)); } catch (e) {}
    } else {
      setAlerts([
        { id: 'a1', code: 'BBCA', targetPrice: 10000, condition: 'above', active: true, createdAt: '2026-05-24 15:00' },
        { id: 'a2', code: 'GOTO', targetPrice: 65, condition: 'above', active: true, createdAt: '2026-05-24 15:10' }
      ]);
    }

    // 3. Portfolio Load
    if (savedCash) {
      setCash(parseFloat(savedCash));
    } else {
      setCash(100000000); // 100 Mil RP DEFAULT
    }

    if (savedPos) {
      try { setPositions(JSON.parse(savedPos)); } catch (e) {}
    } else {
      // Starting positions
      setPositions([
        { code: 'BBCA', name: 'Bank Central Asia Tbk', lots: 20, buyPrice: 9750 },
        { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', lots: 500, buyPrice: 60 }
      ]);
    }

    if (savedHistory) {
      try { setTradeHistory(JSON.parse(savedHistory)); } catch (e) {}
    } else {
      setTradeHistory([
        { id: 't1', code: 'BBCA', type: 'BUY', lots: 20, price: 9750, date: '24-05-2026' },
        { id: 't2', code: 'GOTO', type: 'BUY', lots: 500, price: 60, date: '24-05-2026' }
      ]);
    }

    // 4. Portfolio Growth Chart Setup
    if (savedPFHist) {
      try { setPortfolioHistory(JSON.parse(savedPFHist)); } catch (e) {}
    } else {
      // Mock past points to make the line chart display fully-equipped curves immediately
      const initialPoints: PortfolioHistoryPoint[] = [
        { date: '18 Mei', value: 98400000 },
        { date: '19 Mei', value: 99100000 },
        { date: '20 Mei', value: 98150000 },
        { date: '21 Mei', value: 99500000 },
        { date: '22 Mei', value: 100200000 },
        { date: '23 Mei', value: 101250000 },
        { date: '24 Mei', value: 102500000 },
      ];
      setPortfolioHistory(initialPoints);
      localStorage.setItem('saham-portfolio-value-history', JSON.stringify(initialPoints));
    }
  }, []);

  // Initialize Price state from hardcoded dataset
  const initBaseStockPrices = () => {
    const prices: Record<string, number> = {};
    const changes: Record<string, number> = {};
    INDONESIAN_STOCKS.forEach((s) => {
      prices[s.code] = s.price;
      changes[s.code] = s.changePercent;
    });
    setCustomPrices(prices);
    setCustomPriceChanges(changes);
    localStorage.setItem('saham-custom-prices', JSON.stringify(prices));
    localStorage.setItem('saham-custom-changes', JSON.stringify(changes));
  };

  // Fetch real-time bursa index data & override local prices
  useEffect(() => {
    const fetchLivePricesForWatchlist = async () => {
      try {
        const response = await fetch('/api/markets-summary');
        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            const liveMap = json.data;
            setCustomPrices(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(code => {
                if (liveMap[code]) {
                  next[code] = liveMap[code].price;
                }
              });
              return next;
            });
            setCustomPriceChanges(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(code => {
                if (liveMap[code]) {
                  next[code] = liveMap[code].changePercent;
                }
              });
              return next;
            });
          }
        }
      } catch (err) {
        console.warn("[Watchlist Live Update] Failed to sync with markets-summary:", err);
      }
    };

    fetchLivePricesForWatchlist();
  }, [isLoading]);

  // Synchronize simulation updates with Parent state loading transitions
  useEffect(() => {
    if (!isLoading && Object.keys(customPrices).length > 0) {
      // ONLY fluctuate prices if bursa/market is open
      if (isMarketOpenClient()) {
        fluctuatePricesRealAction();
      }
    }
  }, [isLoading]);

  // Action to Fluctuate pricing and trigger alarm checks
  const fluctuatePricesRealAction = () => {
    const nextPrices = { ...customPrices };
    const nextChanges = { ...customPriceChanges };

    Object.keys(nextPrices).forEach((ticker) => {
      // fluctuate based on volatility multiplier
      const isUp = Math.random() > 0.46;
      const magnitude = (Math.random() * 0.02) + 0.001; // Up to 2.1% movement per tick
      const multiplier = isUp ? (1 + magnitude) : (1 - magnitude);
      
      const oldPrice = nextPrices[ticker];
      const newPrice = Math.round(oldPrice * multiplier);
      nextPrices[ticker] = newPrice;
      
      // Update % change of day
      const pctDelta = (magnitude * 100) * (isUp ? 1 : -1);
      nextChanges[ticker] = parseFloat((nextChanges[ticker] + pctDelta).toFixed(2));
    });

    setCustomPrices(nextPrices);
    setCustomPriceChanges(nextChanges);
    localStorage.setItem('saham-custom-prices', JSON.stringify(nextPrices));
    localStorage.setItem('saham-custom-changes', JSON.stringify(nextChanges));

    // Evaluate active pricing alarms
    checkPriceAlerts(nextPrices);

    // Save snapshot of current overall portfolio asset value
    savePortfolioValuationSnapshot(nextPrices);
  };

  // Append new valuation point to history line
  const savePortfolioValuationSnapshot = (currentPrices: Record<string, number>) => {
    // Current valuation sum
    const totalAssets = getPortfolioTotalValue(currentPrices);
    const dateNow = new Date();
    const timeLabel = `${String(dateNow.getHours()).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')}`;
    
    setPortfolioHistory((prev) => {
      // limit tracker depth to 20 coordinates
      const cleaned = prev.length > 20 ? prev.slice(1) : prev;
      const updated = [...cleaned, { date: timeLabel, value: totalAssets }];
      localStorage.setItem('saham-portfolio-value-history', JSON.stringify(updated));
      return updated;
    });
  };

  const getStockPrice = (code: string): number => {
    return customPrices[code] || INDONESIAN_STOCKS.find((s) => s.code === code)?.price || 5000;
  };

  const getStockChangePercent = (code: string): number => {
    if (customPriceChanges[code] !== undefined) return customPriceChanges[code];
    return INDONESIAN_STOCKS.find((s) => s.code === code)?.changePercent || 0;
  };

  // Price Alarms Processor
  const checkPriceAlerts = (currentPrices: Record<string, number>) => {
    let alertFired = false;
    const updatedAlerts = alerts.map((item) => {
      if (!item.active) return item;
      const currentPrice = currentPrices[item.code];
      if (!currentPrice) return item;

      let triggered = false;
      if (item.condition === 'above' && currentPrice >= item.targetPrice) triggered = true;
      if (item.condition === 'below' && currentPrice <= item.targetPrice) triggered = true;

      if (triggered) {
        alertFired = true;
        // Launch real local notification in browser
        triggerBrowserSystemNotification(item.code, currentPrice, item.targetPrice);

        // Append to localized UI alert log list
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setAlertLogs((prev) => [
          {
            id: String(Math.random()),
            msg: `Alarm dipicu! Saham ${item.code} menyentuh target harga Rp ${item.targetPrice.toLocaleString('id-ID')} (Harga saat ini: Rp ${currentPrice.toLocaleString('id-ID')})`,
            time: timeNow
          },
          ...prev
        ]);

        return { ...item, active: false }; // deactivate triggered alarm
      }
      return item;
    });

    if (alertFired) {
      setAlerts(updatedAlerts);
      localStorage.setItem('saham-alerts', JSON.stringify(updatedAlerts));
    }
  };

  // Web Notification Api deployment
  const triggerBrowserSystemNotification = (code: string, current: number, target: number) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`🎯 Target Harga ${code} Tercapai!`, {
        body: `Harga ${code} menyentuh Rp ${current.toLocaleString('id-ID')} (Alarm target: Rp ${target.toLocaleString('id-ID')})`,
        icon: '/favicon.ico'
      });
    }
  };

  const addPriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: AlertItem = {
      id: "alert-" + Date.now(),
      code: alertCode,
      targetPrice: alertPrice,
      condition: alertCondition,
      active: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const nextAlerts = [newAlert, ...alerts];
    setAlerts(nextAlerts);
    localStorage.setItem('saham-alerts', JSON.stringify(nextAlerts));
    
    // In-app alert feedback toast
    alert(`Success: Alarm harga berhasil disetel untuk ${alertCode} di Rp ${alertPrice.toLocaleString('id-ID')}!`);
  };

  const deleteAlert = (id: string) => {
    const nextAlerts = alerts.filter(a => a.id !== id);
    setAlerts(nextAlerts);
    localStorage.setItem('saham-alerts', JSON.stringify(nextAlerts));
  };

  // Get active watchlist assets filtered
  const watchedStocks = INDONESIAN_STOCKS.filter((s) => watchlistCodes.includes(s.code));

  // Search autocomplete filter list
  const availableToAdd = INDONESIAN_STOCKS.filter(
    (stock) =>
      !watchlistCodes.includes(stock.code) &&
      (stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddStock = (code: string) => {
    onToggleWatchlist(code);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleQuickAdd = (code: string) => {
    onToggleWatchlist(code);
  };

  // Automated algorithmic scores and signals
  const calculateHealthScore = (code: string): number => {
    const scoreMap: Record<string, number> = {
      BBCA: 92, BBRI: 88, BMRI: 87, TLKM: 79, BBNI: 81, UNVR: 74, KLBF: 76, AMRT: 80, INDF: 75, ICBP: 82, ASII: 68, ADRO: 72, ANTM: 65, PTBA: 69, PGAS: 61, MEDC: 63, HRUM: 59, BRPT: 55, GOTO: 42, BUKA: 35
    };
    return scoreMap[code] || 70;
  };

  const generateAISignal = (code: string, changePercent: number): { text: string; color: string } => {
    if (code === 'BBCA') return { text: 'STRONG BUY (Accum.)', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    if (code === 'GOTO') return { text: 'HOLD (Sideways)', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (code === 'BUKA') return { text: 'REDUCE (Underperform)', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };

    if (changePercent > 3) {
      return { text: 'BULLISH BREAKOUT', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    } else if (changePercent > 0.5) {
      return { text: 'ACCUMULATE / BUY', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    } else if (changePercent < -3) {
      return { text: 'OVERSOLD / SPARK', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' };
    } else if (changePercent < -0.5) {
      return { text: 'DISTRIBUTION (Reduce)', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    }
    return { text: 'WAIT & SEE / HOLD', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  };

  // Virtual Trading Execution
  const executeBuyTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPrice = getStockPrice(simBuyCode);
    const amountRequired = simBuyLots * 100 * currentPrice;

    if (amountRequired > cash) {
      alert(`⚠️ Dana virtual tidak mencukupi! Anda butuh Rp ${amountRequired.toLocaleString('id-ID')} tapi sisa saldo kas hanya Rp ${cash.toLocaleString('id-ID')}`);
      return;
    }

    // Deduct cash and update holdings
    const updatedCash = cash - amountRequired;
    setCash(updatedCash);
    localStorage.setItem('saham-portfolio-cash', String(updatedCash));

    // Update positions array
    let updatedPositions = [...positions];
    const existingIdx = updatedPositions.findIndex(p => p.code === simBuyCode);
    if (existingIdx >= 0) {
      // Calculate new weighted Average Cost (buy price)
      const existingPos = updatedPositions[existingIdx];
      const totalLots = existingPos.lots + simBuyLots;
      const totalValue = (existingPos.lots * 100 * existingPos.buyPrice) + amountRequired;
      const nextAvgPrice = Math.round(totalValue / (totalLots * 100));
      
      updatedPositions[existingIdx] = {
        ...existingPos,
        lots: totalLots,
        buyPrice: nextAvgPrice
      };
    } else {
      const stockMeta = INDONESIAN_STOCKS.find(s => s.code === simBuyCode);
      updatedPositions.push({
        code: simBuyCode,
        name: stockMeta ? stockMeta.name : 'Unknown Stock',
        lots: simBuyLots,
        buyPrice: currentPrice
      });
    }

    setPositions(updatedPositions);
    localStorage.setItem('saham-portfolio-positions', JSON.stringify(updatedPositions));

    // Log transaction
    const newHistoryItem: TradeHistoryItem = {
      id: "hist-" + Date.now(),
      code: simBuyCode,
      type: 'BUY',
      lots: simBuyLots,
      price: currentPrice,
      date: new Date().toLocaleDateString('id-ID')
    };
    const nextHist = [newHistoryItem, ...tradeHistory];
    setTradeHistory(nextHist);
    localStorage.setItem('saham-trade-history', JSON.stringify(nextHist));

    // Success response toast
    alert(`🎉 Pembelian berhasil! Membeli ${simBuyLots} lot ${simBuyCode} pada harga Rp ${currentPrice.toLocaleString('id-ID')}`);
    
    // Auto sync dashboard valuation
    savePortfolioValuationSnapshot(customPrices);
  };

  const executeSellTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const existingIdx = positions.findIndex(p => p.code === simSellCode);
    
    if (existingIdx < 0) {
      alert(`⚠️ Anda tidak memiliki kepemilikan saham ${simSellCode} di portofolio!`);
      return;
    }

    const currentPos = positions[existingIdx];
    if (simSellLots > currentPos.lots) {
      alert(`⚠️ Kepemilikan tidak cukup! Lot dimiliki: ${currentPos.lots} lot. Lot yang ingin dijual: ${simSellLots} lot.`);
      return;
    }

    const currentPrice = getStockPrice(simSellCode);
    const proceeds = simSellLots * 100 * currentPrice;
    
    // Calculate profit realized
    const totalCostOfSold = simSellLots * 100 * currentPos.buyPrice;
    const realizedProfit = proceeds - totalCostOfSold;

    // Credit cash and update positions
    const updatedCash = cash + proceeds;
    setCash(updatedCash);
    localStorage.setItem('saham-portfolio-cash', String(updatedCash));

    let updatedPositions = [...positions];
    if (currentPos.lots === simSellLots) {
      // Sold out completed
      updatedPositions = updatedPositions.filter(p => p.code !== simSellCode);
    } else {
      updatedPositions[existingIdx] = {
        ...currentPos,
        lots: currentPos.lots - simSellLots
      };
    }

    setPositions(updatedPositions);
    localStorage.setItem('saham-portfolio-positions', JSON.stringify(updatedPositions));

    // Log transaction with realized returns
    const newHistoryItem: TradeHistoryItem = {
      id: "hist-" + Date.now(),
      code: simSellCode,
      type: 'SELL',
      lots: simSellLots,
      price: currentPrice,
      date: new Date().toLocaleDateString('id-ID'),
      profit: realizedProfit
    };
    const nextHist = [newHistoryItem, ...tradeHistory];
    setTradeHistory(nextHist);
    localStorage.setItem('saham-trade-history', JSON.stringify(nextHist));

    alert(`💸 Penjualan berhasil! Menjual ${simSellLots} lot ${simSellCode} seharga Rp ${currentPrice.toLocaleString('id-ID')}. Profit terealisasi: Rp ${realizedProfit.toLocaleString('id-ID')}`);
    
    // Auto sync dashboard valuation
    savePortfolioValuationSnapshot(customPrices);
  };

  // Reset Sandbox Virtual Simulation 
  const handleResetSandbox = () => {
    const isReset = confirm("Apakah Anda yakin ingin me-reset portofolio virtual Anda kembali ke modal awal Rp 100 Juta?");
    if (isReset) {
      setCash(100000000);
      setPositions([
        { code: 'BBCA', name: 'Bank Central Asia Tbk', lots: 20, buyPrice: 9750 },
        { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', lots: 500, buyPrice: 60 }
      ]);
      setTradeHistory([
        { id: 't1', code: 'BBCA', type: 'BUY', lots: 20, price: 9750, date: '24-05-2026' },
        { id: 't2', code: 'GOTO', type: 'BUY', lots: 500, price: 60, date: '24-05-2026' }
      ]);
      const initialPoints = [
        { date: '18 Mei', value: 98400000 },
        { date: '19 Mei', value: 99100000 },
        { date: '20 Mei', value: 98150000 },
        { date: '21 Mei', value: 99500000 },
        { date: '22 Mei', value: 100200000 },
        { date: '23 Mei', value: 101250000 },
        { date: '24 Mei', value: 102500000 },
      ];
      setPortfolioHistory(initialPoints);
      
      localStorage.setItem('saham-portfolio-cash', '100000000');
      localStorage.setItem('saham-portfolio-positions', JSON.stringify([
        { code: 'BBCA', name: 'Bank Central Asia Tbk', lots: 20, buyPrice: 9750 },
        { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', lots: 500, buyPrice: 60 }
      ]));
      localStorage.setItem('saham-trade-history', JSON.stringify([
        { id: 't1', code: 'BBCA', type: 'BUY', lots: 20, price: 9750, date: '24-05-2026' },
        { id: 't2', code: 'GOTO', type: 'BUY', lots: 500, price: 60, date: '24-05-2026' }
      ]));
      localStorage.setItem('saham-portfolio-value-history', JSON.stringify(initialPoints));

      alert('Portofolio virtual Anda berhasil di-reset ke modal awal Rp 100.000.000!');
    }
  };

  // Calculations of portfolio stats
  const getPortfolioTotalValue = (prices: Record<string, number>): number => {
    const sharesValue = positions.reduce((acc, pos) => {
      const livePrice = prices[pos.code] || pos.buyPrice;
      return acc + (pos.lots * 100 * livePrice);
    }, 0);
    return cash + sharesValue;
  };

  const getHoldingsCost = (): number => {
    return positions.reduce((acc, pos) => acc + (pos.lots * 100 * pos.buyPrice), 0);
  };

  const getHoldingsMarketValue = (prices: Record<string, number>): number => {
    return positions.reduce((acc, pos) => {
      const livePrice = prices[pos.code] || pos.buyPrice;
      return acc + (pos.lots * 100 * livePrice);
    }, 0);
  };

  const totalPortfolioValue = getPortfolioTotalValue(customPrices);
  const holdingsCost = getHoldingsCost();
  const holdingsMarketValue = getHoldingsMarketValue(customPrices);
  const totalGainLossIndex = totalPortfolioValue - 100000000;
  const totalGainLossPercent = (totalGainLossIndex / 100000000) * 100;

  // Personal performance metrics tracker
  const getPerformanceStats = () => {
    if (tradeHistory.length === 0) {
      return { bestCode: '-', worstCode: '-', winRate: 0, totalTrades: 0 };
    }

    // Calculate win rate from history records that have realized profit
    const closedSellTrades = tradeHistory.filter((t) => t.type === 'SELL' && t.profit !== undefined);
    
    // Add current open positions profit/loss to evaluate absolute overall success rates
    const activeProfitPositions = positions.map(pos => {
      const current = getStockPrice(pos.code);
      const isProfitable = current > pos.buyPrice;
      return { isWin: isProfitable };
    });

    const totalDealsEvaluated = closedSellTrades.length + activeProfitPositions.length;
    const totalWinsEvaluated = closedSellTrades.filter(t => (t.profit || 0) > 0).length + activeProfitPositions.filter(p => p.isWin).length;

    const winRate = totalDealsEvaluated > 0 ? parseFloat(((totalWinsEvaluated / totalDealsEvaluated) * 100).toFixed(1)) : 0;

    // Track best and worst holding Performance
    let bestCode = '-';
    let worstCode = '-';
    let bestReturn = -Infinity;
    let worstReturn = Infinity;

    positions.forEach((pos) => {
      const cur = getStockPrice(pos.code);
      const pctReturn = ((cur - pos.buyPrice) / pos.buyPrice) * 100;
      if (pctReturn > bestReturn) {
        bestReturn = pctReturn;
        bestCode = `${pos.code} (+${pctReturn.toFixed(1)}%)`;
      }
      if (pctReturn < worstReturn) {
        worstReturn = pctReturn;
        worstCode = `${pos.code} (${pctReturn.toFixed(1)}%)`;
      }
    });

    return {
      bestCode: bestCode !== '-' ? bestCode : 'N/A',
      worstCode: worstCode !== '-' ? worstCode : 'N/A',
      winRate: winRate,
      totalTrades: tradeHistory.length
    };
  };

  const performanceMetrics = getPerformanceStats();

  const handleUpdateAlertCodeSelection = (code: string) => {
    setAlertCode(code);
    setAlertPrice(getStockPrice(code));
  };

  const handleUpdateSimBuySelection = (code: string) => {
    setSimBuyCode(code);
    setSimBuyPrice(getStockPrice(code));
  };

  return (
    <div className="space-y-6">
      
      {/* 4 CORE SUB NAVIGATION TAB BUTTONS FOR PREMIUM GRAPHIC DESIGN */}
      <div className="flex flex-wrap items-center justify-between p-1 bg-gray-100 dark:bg-gray-900/60 rounded-2xl gap-1">
        <div className="flex items-center gap-1 flex-1 sm:flex-initial overflow-x-auto">
          <button
            id="subtab-watchlist-anchor"
            onClick={() => setSubTab('watchlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              subTab === 'watchlist' 
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1565C0] shadow-sm' 
                : 'text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Star className={`w-3.8 h-3.8 ${subTab === 'watchlist' ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Watchlist & Alert Harga</span>
          </button>

          <button
            id="subtab-portfolio-anchor"
            onClick={() => setSubTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              subTab === 'portfolio' 
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1565C0] shadow-sm' 
                : 'text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-3.8 h-3.8 text-emerald-500" />
            <span>Simulasi Portofolio Virtual</span>
          </button>

          <button
            id="subtab-compare-anchor"
            onClick={() => setSubTab('compare')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              subTab === 'compare' 
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1565C0] shadow-sm' 
                : 'text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-3.8 h-3.8 text-sky-500" />
            <span>Perbandingan Saham (Compare)</span>
          </button>

          <button
            id="subtab-stats-anchor"
            onClick={() => setSubTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              subTab === 'stats' 
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1565C0] shadow-sm' 
                : 'text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.8 h-3.8 text-purple-500" />
            <span>Statistik & Log Transaksi</span>
          </button>
        </div>

        {/* Dynamic simulator trigger directly in current view */}
        <button
          onClick={fluctuatePricesRealAction}
          className="flex items-center gap-1.5 px-3 py-1.8 bg-emerald-500/10 hover:bg-emerald-500/20 text-saham-green text-[10px] font-black rounded-lg transition border border-emerald-500/10 cursor-pointer"
          title="Sinkronisasi manual instan pergerakan harga seluruh bursa"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Simulasi Fluktuasi Bursa</span>
        </button>
      </div>

      {/* SUBTAB 1 : PERSONAL WATCHLIST & ALERT SETTINGS SHEET */}
      {subTab === 'watchlist' && (
        <div className="space-y-6">
          <div id="watchlist-table-root" className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="font-display font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                  ⭐️ Sektor Pantau Watchlist Personal
                </h4>
                <p className="text-[11px] text-gray-450 leading-relaxed">
                  Tambah dan kelola saham target pantau Anda. Disimpan real-time di penyimpanan lokal web sandbox.
                </p>
              </div>

              {/* SEARCH BOX CONTROLLERS WITH FLOATING DROP-DOWNS */}
              <div className="relative max-w-sm w-full">
                <div className="flex items-center bg-gray-55/60 dark:bg-gray-900 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
                  <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    id="search-add-stock-field"
                    type="text"
                    placeholder="Masukkan kode saham... (contoh: ADRO, TLKM)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full bg-transparent border-none text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none font-semibold"
                  />
                </div>

                {/* DROP DOWN AUTOCOMPLETE MATCHES */}
                {showDropdown && searchQuery.trim().length > 0 && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#1E1E22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto">
                      {availableToAdd.length > 0 ? (
                        availableToAdd.map((stock) => (
                          <button
                            id={`add-btn-${stock.code}`}
                            key={stock.code}
                            onClick={() => handleAddStock(stock.code)}
                            className="w-full text-left px-4 py-2.8 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between text-xs font-semibold border-b border-gray-100 dark:border-gray-800/40 cursor-pointer"
                          >
                            <div>
                              <span className="font-extrabold text-gray-900 dark:text-white mr-2 font-mono">{stock.code}</span>
                              <span className="text-[11px] text-gray-400 truncate max-w-[150px] inline-block">{stock.name}</span>
                            </div>
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">+ Watchlist</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-[11px] text-gray-450 text-center font-bold">Tidak ada bursa saham yang cocok.</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* HIGH PRECISION CORRESPONDING DATA TABLE */}
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left min-w-[650px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">
                    <th className="px-6 py-4">Kode</th>
                    <th className="px-4 py-4">Emiten</th>
                    <th className="px-4 py-4 text-right">Harga (IDR)</th>
                    <th className="px-4 py-4 text-right">Persentase Hari Ini</th>
                    <th className="px-4 py-4 text-center">Skor Kesehatan</th>
                    <th className="px-4 py-4 text-center">Sinyal Rekomendasi AI</th>
                    <th className="px-6 py-4 text-center">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-xs">
                  {watchedStocks.length > 0 ? (
                    watchedStocks.map((stock) => {
                      const curPrice = getStockPrice(stock.code);
                      const curPct = getStockChangePercent(stock.code);
                      const isUp = curPct >= 0;
                      const health = calculateHealthScore(stock.code);
                      const aiSig = generateAISignal(stock.code, curPct);

                      return (
                        <tr key={stock.code} className="hover:bg-gray-50/45 dark:hover:bg-gray-900/10 transition">
                          <td className="px-6 py-4.5 font-bold font-mono text-gray-900 dark:text-white text-sm">
                            {onViewStockDetail ? (
                              <button
                                onClick={() => onViewStockDetail(stock.code)}
                                className="hover:text-blue-500 hover:underline text-left cursor-pointer transition uppercase font-bold font-mono"
                              >
                                {stock.code}
                              </button>
                            ) : (
                              stock.code
                            )}
                          </td>
                          <td className="px-4 py-4.5">
                            {onViewStockDetail ? (
                              <button
                                onClick={() => onViewStockDetail(stock.code)}
                                className="text-left font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 hover:underline cursor-pointer transition block font-bold"
                              >
                                {stock.name}
                              </button>
                            ) : (
                              <div className="font-bold text-gray-800 dark:text-gray-200">{stock.name}</div>
                            )}
                            <span className="text-[10px] text-gray-400 font-semibold">{stock.industry}</span>
                          </td>
                          <td className="px-4 py-4.5 text-right font-mono font-black text-gray-900 dark:text-gray-100">
                            {curPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-4.5 text-right">
                            <span className={`inline-flex items-center gap-1 font-mono font-black px-2.5 py-1 rounded-lg text-[11px] ${
                              isUp ? 'text-saham-green bg-emerald-500/10' : 'text-saham-red bg-rose-500/10'
                            }`}>
                              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {isUp ? '+' : ''}{curPct.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-4.5">
                            <div className="flex flex-col items-center justify-center">
                              <span className={`text-[11px] font-extrabold ${
                                health >= 80 ? 'text-emerald-500' : health >= 60 ? 'text-amber-500' : 'text-rose-500'
                              }`}>{health} / 100</span>
                              <div className="w-24 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mt-1">
                                <div 
                                  className={`h-full rounded-full ${
                                    health >= 80 ? 'bg-emerald-500' : health >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${health}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4.5 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border uppercase ${aiSig.color}`}>
                              {aiSig.text}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-center">
                            <button
                              id={`watchlist-delete-${stock.code}`}
                              onClick={() => onToggleWatchlist(stock.code)}
                              className="p-1.8 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Hapus emiten dari daftar pantau"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 px-4">
                        <p className="text-gray-400 text-xs font-semibold">
                          Belum ada saham terdaftar di personal watchlist Anda. Tambahkan Emiten favorit Anda di form pencarian!
                        </p>
                        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                          <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" /> Tambah Cepat:
                          </span>
                          {['BBCA', 'GOTO', 'TLKM', 'BRPT', 'ADRO'].map((code) => (
                            <button
                              id={`quick-add-${code}`}
                              key={code}
                              onClick={() => handleQuickAdd(code)}
                              className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 hover:border-[#1565C0] hover:text-white hover:bg-[#1565C0] transition cursor-pointer"
                            >
                              + {code}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DUAL COHESIVE SEC: ALARM HARGA SETUP & TRIGGER LOGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: NEW ALARM CRITERIA CONFIG FORM */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-amber-500" />
                <h4 className="font-display font-extrabold text-[#1565C0] text-sm sm:text-base">Atur Alarm Harga (Target Alert)</h4>
              </div>
              <p className="text-xs text-gray-400 leading-snug mb-5">
                Konfigurasikan sistem monitor harga. Program akan memantau live fluktuasi pasar dan memicu push alarm browser saat harga tercapai.
              </p>

              <form onSubmit={addPriceAlert} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bursa Ticker Saham</label>
                  <select
                    id="alert-select-ticker"
                    value={alertCode}
                    onChange={(e) => handleUpdateAlertCodeSelection(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3.5 py-2.5 rounded-xl text-gray-800 dark:text-white font-semibold focus:ring-1 focus:ring-emerald-500"
                  >
                    {INDONESIAN_STOCKS.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kondisi Pemicu</label>
                    <select
                      id="alert-select-condition"
                      value={alertCondition}
                      onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                      className="w-full bg-gray-50 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3.5 py-2.5 rounded-xl text-gray-800 dark:text-white font-semibold"
                    >
                      <option value="above">Menyentuh atau di atas (&gt;=)</option>
                      <option value="below">Menyentuh atau di bawah (&lt;=)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Target Harga (IDR)</label>
                    <input
                      id="alert-price-input"
                      type="number"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3.5 py-2.5 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/15 p-3 rounded-xl text-[10px] text-amber-500 font-bold flex gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>Sistem HTML5 Notification API diintegrasikan. Pastikan Anda mengizinkan izin (permission) notifikasi browser Anda untuk menerima alert popup.</span>
                </div>

                <button
                  id="btn-register-alert"
                  type="submit"
                  className="w-full py-3 bg-[#1565C0] hover:bg-[#0D47A1] text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Daftarkan Alarm Aktif
                </button>
              </form>
            </div>

            {/* COLUMN 2: ACTIVE ALERTS LIST & TRIGGERED NOTIFICATION HISTORY */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-display font-extrabold text-gray-900 dark:text-white text-sm sm:text-base mb-3">
                  🔔 Alarm Aktif & Riwayat Terpemicu
                </h4>
                
                {/* Visual log alerts if triggered in current session */}
                {alertLogs.length > 0 && (
                  <div className="mb-4 space-y-2 max-h-36 overflow-y-auto">
                    {alertLogs.map((log) => (
                      <div key={log.id} className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex justify-between items-start text-[11px] font-bold text-rose-500 animate-pulse">
                        <p>{log.msg}</p>
                        <span className="text-[9px] font-mono opacity-80 whitespace-nowrap ml-2">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-semibold text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase">
                        <th className="py-2.5">Kode</th>
                        <th className="py-2.5 text-center">Kondisi</th>
                        <th className="py-2.5 text-right">Target Harga</th>
                        <th className="py-2.5 text-center">Harga Live</th>
                        <th className="py-2.5 text-center">Status</th>
                        <th className="py-2.5 text-right">Opsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-55 dark:divide-gray-800/30">
                      {alerts.length > 0 ? (
                        alerts.map((item) => {
                          const livePrice = getStockPrice(item.code);
                          return (
                            <tr key={item.id} className="hover:bg-gray-50/20 dark:hover:bg-gray-900/5">
                              <td className="py-3 font-mono font-bold text-gray-900 dark:text-white">{item.code}</td>
                              <td className="py-3 text-center text-[11px]">
                                <span className={`px-2 py-0.5 rounded font-mono font-extrabold ${item.condition === 'above' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                  {item.condition === 'above' ? '≥' : '≤'} Price
                                </span>
                              </td>
                              <td className="py-3 text-right font-mono font-bold">Rp {item.targetPrice.toLocaleString('id-ID')}</td>
                              <td className="py-3 text-center font-mono font-bold text-gray-500">Rp {livePrice.toLocaleString('id-ID')}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-1.8 py-0.5 rounded text-[10px] font-extrabold ${
                                  item.active ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 bg-gray-300/10 dark:bg-gray-800/40'
                                }`}>
                                  {item.active ? 'Menunggu' : 'Terpicu'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  id={`delete-alert-${item.id}`}
                                  onClick={() => deleteAlert(item.id)}
                                  className="p-1 rounded text-gray-400 hover:text-rose-500 transition cursor-pointer"
                                  title="Discarte Alarm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-450 font-bold text-[11px]">
                            Tidak ada monitor alarm harga aktif dikonfigurasi saat ini. Setel alarm di panel kiri!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-850 pt-4 mt-4 leading-normal text-[10px] text-gray-400 font-semibold italic">
                💡 Catatan: Fluktuasi harga akan dievaluasi saat bursa diperbarui secara berkala, atau ketika tombol "Simulasi Fluktuasi Bursa" di pojok kanan atas ditekan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2 : VIRTUAL TRADING PORTFOLIO SIMULATOR */}
      {subTab === 'portfolio' && (
        <div className="space-y-6">
          
          {/* SANDBOX KEY ASSET STATUS BOARD CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Total Nilai Portofolio (Asset)</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-lg sm:text-xl font-mono font-black text-gray-900 dark:text-white">
                  Rp {totalPortfolioValue.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-mono text-gray-400 block font-bold leading-none">IDR</span>
              </div>
              <p className="text-[10px] text-gray-450 font-semibold mt-1 leading-none">Kas virtual + Nilai Saham Pasar saat ini</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Total Profit / Loss Simulasi</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg sm:text-xl font-mono font-black ${totalGainLossIndex >= 0 ? 'text-saham-green' : 'text-saham-red'}`}>
                  {totalGainLossIndex >= 0 ? '+' : ''}Rp {totalGainLossIndex.toLocaleString('id-ID')}
                </span>
              </div>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-black mt-1 ${totalGainLossIndex >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {totalGainLossIndex >= 0 ? '▲' : '▼'} {totalGainLossIndex >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </span>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Sisa Kas Virtual (Cash Balance)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-mono font-black text-[#1565C0]">
                  Rp {cash.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[10px] text-gray-450 font-semibold mt-1 leading-none">Dana siap pakai untuk belanja saham virtual</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Nilai Kepemilikan Emiten (Market Value)</span>
              <div className="flex items-baseline gap-1.5 animate-pulse-slow">
                <span className="text-lg sm:text-xl font-mono font-black text-gray-700 dark:text-gray-300">
                  Rp {holdingsMarketValue.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[10px] text-gray-450 font-semibold mt-1 leading-none">Modal terbenam pada saham bursa (Cost: Rp {holdingsCost.toLocaleString('id-ID')})</p>
            </div>

          </div>

          {/* TRADING PORTFOLIO MAIN LIST & BUY/SELL CONTROL INTERFACES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PORTFOLIO ACTIVE POSITIONS LEDGER LIST */}
            <div className="lg:col-span-8 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                    💼 Daftar Kepemilikan Portofolio Virtual
                  </h4>
                  <p className="text-[11px] text-gray-450 font-semibold">Semua posisi investasi terbuka saat ini.</p>
                </div>

                <button
                  onClick={handleResetSandbox}
                  className="px-2.5 py-1 text-[10px] text-red-500 bg-red-500/10 hover:bg-red-500/20 font-black rounded-lg transition border border-red-500/10 cursor-pointer"
                  title="Kembalikan sandbox portofolio ke saldo awal Rp 100 Juta"
                >
                  Reset Portofolio
                </button>
              </div>

              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[580px] border-collapse font-semibold text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase">
                      <th className="px-6 py-3.5">Saham</th>
                      <th className="px-4 py-3.5 text-center">Lot</th>
                      <th className="px-4 py-3.5 text-right">Harga Beli Rata-Rata</th>
                      <th className="px-4 py-3.5 text-right">Harga Sekarang</th>
                      <th className="px-4 py-3.5 text-right">Nilai Pasar</th>
                      <th className="px-4 py-3.5 text-right">Profit / Loss (IDR)</th>
                      <th className="px-4 py-3.5 text-right">% Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40">
                    {positions.length > 0 ? (
                      positions.map((pos) => {
                        const curPrice = getStockPrice(pos.code);
                        const mktVal = pos.lots * 100 * curPrice;
                        const originalCost = pos.lots * 100 * pos.buyPrice;
                        const posProfit = mktVal - originalCost;
                        const posReturn = (posProfit / originalCost) * 100;
                        const isPosWin = posProfit >= 0;

                        return (
                          <tr key={pos.code} className="hover:bg-gray-55/40 dark:hover:bg-gray-900/5">
                            <td className="px-6 py-4">
                              <span className="font-bold text-gray-900 dark:text-white text-sm font-mono block">{pos.code}</span>
                              <span className="text-[10px] text-gray-400 truncate max-w-[130px] block mt-0.5 leading-none">{pos.name}</span>
                            </td>
                            <td className="px-4 py-4 text-center font-mono font-bold text-gray-800 dark:text-gray-200">
                              {pos.lots} <span className="text-[9px] text-gray-400 italic font-semibold">({(pos.lots * 100).toLocaleString('id-ID')} lbr)</span>
                            </td>
                            <td className="px-4 py-4 text-right font-mono text-gray-900 dark:text-gray-200">
                              Rp {pos.buyPrice.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-4 text-right font-mono font-bold text-gray-500">
                              Rp {curPrice.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-4 text-right font-mono font-black text-gray-800 dark:text-gray-200">
                              Rp {mktVal.toLocaleString('id-ID')}
                            </td>
                            <td className={`px-4 py-4 text-right font-mono font-black ${isPosWin ? 'text-saham-green' : 'text-saham-red'}`}>
                              {isPosWin ? '+' : ''}{posProfit.toLocaleString('id-ID')}
                            </td>
                            <td className={`px-4 py-4 text-right font-mono font-black ${isPosWin ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {isPosWin ? '▲' : '▼'} {isPosWin ? '+' : ''}{posReturn.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-12 px-4 text-[11px] text-gray-450 font-bold">
                          💼 Portofolio virtual Anda kosong. Gunakan form di sebelah kanan untuk mengeksekusi pembelian virtual awal Anda!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* HIGH FIDELITY VIRTUAL BUY/SELL TRANSACTION DESK */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* TRANSACTION PANEL SECTION */}
              <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-display font-extrabold text-[#1565C0] text-sm">Meja Transaksi Virtual (Beli)</h4>
                </div>

                <form onSubmit={executeBuyTransaction} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Pilih Emiten</label>
                    <select
                      id="buy-select-ticker"
                      value={simBuyCode}
                      onChange={(e) => handleUpdateSimBuySelection(e.target.value)}
                      className="w-full bg-gray-55 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3 py-2.2 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                    >
                      {INDONESIAN_STOCKS.map((s) => (
                        <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Jumlah Lot (1 lot = 100 lbr)</label>
                      <input
                        id="buy-lot-input"
                        type="number"
                        min="1"
                        value={simBuyLots}
                        onChange={(e) => setSimBuyLots(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-gray-55 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Harga Beli (IDR)</label>
                      <input
                        id="buy-price-input"
                        type="number"
                        value={simBuyPrice}
                        onChange={(e) => setSimBuyPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-55 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-3.5 rounded-xl border border-gray-150 dark:border-gray-850 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-gray-500">
                      <span>Total Transaksi:</span>
                      <span className="font-mono text-gray-800 dark:text-white">Rp {(simBuyLots * 100 * simBuyPrice).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 leading-none">
                      <span>Sisa Kas Setelah Eksekusi:</span>
                      <span className="font-mono text-emerald-500">Rp {(cash - (simBuyLots * 100 * simBuyPrice)).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <button
                    id="btn-execute-buy"
                    type="submit"
                    className="w-full py-2.5 bg-saham-green hover:bg-emerald-600 font-display font-black text-white text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Eksekusi Order Beli Saham
                  </button>
                </form>
              </div>

              {/* SELL TRANSACTION REVERSED PANEL */}
              {positions.length > 0 && (
                <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-rose-500" />
                    <h4 className="font-display font-extrabold text-[#1565C0] text-sm">Meja Jual Portofolio</h4>
                  </div>

                  <form onSubmit={executeSellTransaction} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Miliki Saham Untuk Dijual</label>
                      <select
                        id="sell-select-ticker"
                        value={simSellCode}
                        onChange={(e) => setSimSellCode(e.target.value)}
                        className="w-full bg-gray-55 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3 py-2.2 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                      >
                        {positions.map((s) => (
                          <option key={s.code} value={s.code}>{s.code} ({s.lots} Lot)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Jumlah Jual (Lot)</label>
                      <input
                        id="sell-lot-input"
                        type="number"
                        min="1"
                        value={simSellLots}
                        onChange={(e) => setSimSellLots(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-gray-55 dark:bg-gray-950 text-xs border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-xl text-gray-800 dark:text-white font-semibold focus:outline-none"
                      />
                    </div>

                    <button
                      id="btn-execute-sell"
                      type="submit"
                      className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 font-display font-black text-white text-xs rounded-xl shadow-md cursor-pointer animate-pulse-slow"
                    >
                      Eksekusi Order Jual Realized
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* HIGH POLISHED SVG AREA PORTFOLIO PERFORMANCE LINE GRAPH */}
          <div className="p-6 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-5 h-5 text-[#1565C0]" />
              <div>
                <h4 className="font-display font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">
                  📈 Grafik Pertumbuhan Nilai Portofolio (Valuation History)
                </h4>
                <p className="text-[11px] text-gray-450 leading-relaxed font-semibold">
                  Visualisasi performa nilai absolut keseluruhan saldo Sandbox dari waktu ke waktu (termasuk kas + valuasi pasar portofolio).
                </p>
              </div>
            </div>

            {/* PURE HAND-CRAFTED SVG RESPONSIVE PATH CHART */}
            {portfolioHistory.length > 1 ? (
              <div className="p-4 bg-gray-50/50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-850 mt-4">
                <div className="w-full overflow-x-auto">
                  <svg viewBox="0 0 700 220" className="w-full min-w-[500px]">
                    <defs>
                      <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    
                    {/* SVG DOTTED Y AXIS GRID LINES */}
                    {[0, 1, 2, 3].map((g) => {
                      const yPos = 20 + g * 50;
                      return (
                        <line 
                          key={g} 
                          x1="45" y1={yPos} x2="680" y2={yPos} 
                          stroke="#4B5563" strokeOpacity="0.10" strokeDasharray="3,3" 
                        />
                      );
                    })}

                    {/* RENDER DYNAMIC PATH FROM VALUATION ARRAY */}
                    {(() => {
                      const values = portfolioHistory.map((h) => h.value);
                      const minVal = Math.min(...values);
                      const maxVal = Math.max(...values);
                      const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);

                      const xStart = 50;
                      const xEnd = 670;
                      const yStart = 170;
                      const yEnd = 20;

                      // Map function
                      const coordinates = portfolioHistory.map((pt, idx) => {
                        const x = xStart + (idx / (portfolioHistory.length - 1)) * (xEnd - xStart);
                        const y = yStart - ((pt.value - minVal) / range) * (yStart - yEnd);
                        return { x, y, value: pt.value, label: pt.date };
                      });

                      const pathString = coordinates.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
                      const areaString = `${pathString} L ${coordinates[coordinates.length - 1].x.toFixed(1)} 170 L ${coordinates[0].x.toFixed(1)} 170 Z`;

                      return (
                        <>
                          {/* Rich area shader */}
                          <path d={areaString} fill="url(#area-grad)" />
                          
                          {/* Core trace line */}
                          <path d={pathString} fill="none" stroke="#10B981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Interactive data trackers circles */}
                          {coordinates.map((c, i) => (
                            <g key={i} className="group/dot cursor-pointer">
                              <circle cx={c.x} cy={c.y} r="3" fill="#10B981" className="hover:r-5 transition duration-150" />
                              <circle cx={c.x} cy={c.y} r="7" fill="#10B981" fillOpacity="0" className="hover:fill-opacity-15 hover:stroke-[#10B981] hover:stroke-1 cursor-pointer" />
                              
                              {/* Hover tooltip for financial details */}
                              <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150 pointer-events-none">
                                <rect x={c.x - 55} y={c.y - 32} width="112" height="24" rx="6" fill="#1A1A1E" stroke="#10B981" strokeWidth="0.8" />
                                <text x={c.x} y={c.y - 17} textAnchor="middle" fill="#10B981" fontSize="9" className="font-mono font-black">
                                  Rp {(c.value / 1000000).toFixed(2)}M
                                </text>
                              </g>
                            </g>
                          ))}

                          {/* Value captions borders */}
                          <text x="15" y="24" fill="#6B7280" fontSize="8" className="font-mono font-bold">{(maxVal / 1000000).toFixed(1)}M</text>
                          <text x="15" y="99" fill="#6B7280" fontSize="8" className="font-mono font-bold">{((maxVal + minVal) / 2000000).toFixed(1)}M</text>
                          <text x="15" y="174" fill="#6B7280" fontSize="8" className="font-mono font-bold">{(minVal / 1000000).toFixed(1)}M</text>

                          {/* Time label captions */}
                          {coordinates.map((c, i) => (
                            <text key={i} x={c.x} y="195" textAnchor="middle" fill="#9CA3AF" fontSize="8.5" className="font-semibold font-mono">
                              {c.label}
                            </text>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center text-gray-550 border border-gray-100 dark:border-gray-800 rounded-xl mt-4">
                Memproses garis korelasi historis. Transaksikan setidaknya 1 lot saham untuk memicu visualisasi tren.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3 : STOCK HEAD TO HEAD COMPARE CHIP */}
      {subTab === 'compare' && (
        <div className="space-y-6">
          
          {/* STOCK COMPARATORS SELECTORS WIDGET */}
          <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-sky-500" />
              <h4 className="font-display font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">
                ⚖️ Komparasi Head-to-Head Fundamental Saham
              </h4>
            </div>
            <p className="text-xs text-gray-400 mb-5 leading-normal max-w-2xl">
              Pilih hingga 3 emiten saham bursa dari opsi di bawah untuk melihat perbandingan rasio keuangan komparatif mereka secara bersisian, serta menganalisa metrik yang lebih unggul.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Saham Pembanding Ke-{idx + 1}</label>
                  <select
                    id={`compare-select-slot-${idx}`}
                    value={compareStocks[idx] || ''}
                    onChange={(e) => {
                      const next = [...compareStocks];
                      next[idx] = e.target.value;
                      setCompareStocks(next);
                    }}
                    className="w-full bg-white dark:bg-gray-900 text-xs border border-gray-200 dark:border-gray-850 px-3 py-2 rounded-xl text-gray-800 dark:text-white font-bold"
                  >
                    <option value="">-- Pilih Emiten --</option>
                    {INDONESIAN_STOCKS.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* HEAD TO HEAD METRICS COMPARISON LEAF TABLE SHEET */}
          {compareStocks.filter(Boolean).length > 1 ? (
            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h4 className="font-display font-extrabold text-gray-900 dark:text-white text-sm sm:text-base mb-4">
                📊 Tabel Komparasi Rasio Finansial Realistis
              </h4>

              {(() => {
                const activeCompareCodes = compareStocks.filter(Boolean);
                
                // Helper to check which stock has the superior value
                // In PER and DER, lower is better. In ROE, Yield, and Health, larger is better.
                const findBestStockValue = (metric: 'pe' | 'pbv' | 'roe' | 'divYield' | 'der' | 'health', type: 'min' | 'max'): string => {
                  let bestVal = type === 'min' ? Infinity : -Infinity;
                  let bestTicker = '';
                  
                  activeCompareCodes.forEach((ticker) => {
                    let val = 0;
                    if (metric === 'health') {
                      val = calculateHealthScore(ticker);
                    } else {
                      val = STOCK_FUNDAMENTALS[ticker]?.[metric as 'pe' | 'pbv' | 'roe' | 'divYield' | 'der'] || 0;
                    }

                    // For PE ratio, omit negative values from ideal minimums
                    if (metric === 'pe' && val < 0) return;

                    if (type === 'min' && val < bestVal) {
                      bestVal = val;
                      bestTicker = ticker;
                    } else if (type === 'max' && val > bestVal) {
                      bestVal = val;
                      bestTicker = ticker;
                    }
                  });
                  return bestTicker;
                };

                const bestPER = findBestStockValue('pe', 'min');
                const bestPBV = findBestStockValue('pbv', 'min');
                const bestROE = findBestStockValue('roe', 'max');
                const bestYield = findBestStockValue('divYield', 'max');
                const bestDER = findBestStockValue('der', 'min');
                const bestHealth = findBestStockValue('health', 'max');

                return (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="w-full text-xs text-left border-collapse min-w-[500px] font-semibold">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase">
                          <th className="px-6 py-3">Rasio Finansial</th>
                          {activeCompareCodes.map((code) => (
                            <th key={code} className="px-4 py-3 text-center">{code}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-55 dark:divide-gray-850/40">
                        
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">Harga Saat Ini (IDR)</td>
                          {activeCompareCodes.map((code) => (
                            <td key={code} className="px-4 py-3.5 text-center font-mono font-bold text-gray-900 dark:text-white">
                              Rp {getStockPrice(code).toLocaleString('id-ID')}
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">Kapitalisasi Pasar (Market Cap)</td>
                          {activeCompareCodes.map((code) => (
                            <td key={code} className="px-4 py-3.5 text-center font-mono">
                              {STOCK_FUNDAMENTALS[code]?.mcap || 'N/A'}
                            </td>
                          ))}
                        </tr>

                        {/* P/E COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">
                            Price to Earnings (P/E) Ratio
                            <span className="text-[9px] text-gray-400 block font-normal leading-none mt-0.5">Semakin rendah semakin murah (ideal &gt; 0)</span>
                          </td>
                          {activeCompareCodes.map((code) => {
                            const val = STOCK_FUNDAMENTALS[code]?.pe ?? 0;
                            const isBest = code === bestPER;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val.toFixed(1)}x {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* PBV COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">
                            Price to Book Value (PBV)
                            <span className="text-[9px] text-gray-400 block font-normal leading-none mt-0.5">Metrik valuasi harga aset per lembar (ideal &lt; 1.5)</span>
                          </td>
                          {activeCompareCodes.map((code) => {
                            const val = STOCK_FUNDAMENTALS[code]?.pbv ?? 0;
                            const isBest = code === bestPBV;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val.toFixed(1)}x {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* ROE COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">
                            Return on Equity (ROE)
                            <span className="text-[9px] text-gray-400 block font-normal leading-none mt-0.5">Efisiensi perusahaan mencetak laba (ideal &gt; 15%)</span>
                          </td>
                          {activeCompareCodes.map((code) => {
                            const val = STOCK_FUNDAMENTALS[code]?.roe ?? 0;
                            const isBest = code === bestROE;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val.toFixed(1)}% {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* DIVIDEND COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">
                            Dividend Yield (%)
                            <span className="text-[9px] text-gray-400 block font-normal leading-none mt-0.5">Rasio pembagian laba cash tahunan kepada investor</span>
                          </td>
                          {activeCompareCodes.map((code) => {
                            const val = STOCK_FUNDAMENTALS[code]?.divYield ?? 0;
                            const isBest = code === bestYield;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val.toFixed(1)}% {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* DER COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">
                            Debt to Equity Ratio (DER)
                            <span className="text-[9px] text-gray-400 block font-normal leading-none mt-0.5">Rasio rasio utang terhadap modal (ideal &lt; 1.0)</span>
                          </td>
                          {activeCompareCodes.map((code) => {
                            const val = STOCK_FUNDAMENTALS[code]?.der ?? 0;
                            const isBest = code === bestDER;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val.toFixed(2)}x {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* HEALTH SCORE COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">Skor Kesehatan Saham</td>
                          {activeCompareCodes.map((code) => {
                            const val = calculateHealthScore(code);
                            const isBest = code === bestHealth;
                            return (
                              <td key={code} className={`px-4 py-3.5 text-center font-mono font-bold ${isBest ? 'text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 font-black' : ''}`}>
                                {val} / 100 {isBest && '🏆'}
                              </td>
                            );
                          })}
                        </tr>

                        {/* AI SIGNAL COMPARISON */}
                        <tr>
                          <td className="px-6 py-3.5 text-gray-500 font-bold">Analisis AI Signal Terpadu</td>
                          {activeCompareCodes.map((code) => {
                            const curPct = getStockChangePercent(code);
                            const sigMeta = generateAISignal(code, curPct);
                            return (
                              <td key={code} className="px-4 py-3.5 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] uppercase font-black ${sigMeta.color}`}>
                                  {sigMeta.text}
                                </span>
                              </td>
                            );
                          })}
                        </tr>

                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* DOCK COMPARATIVE MULTI HISTORICAL CHART */}
              <div className="mt-8 border-t border-gray-150 dark:border-gray-850 pt-6">
                <div className="flex items-center gap-1.8 mb-4">
                  <Activity className="w-5 h-5 text-sky-500" />
                  <div>
                    <h5 className="font-display font-extrabold text-[13px] sm:text-sm text-gray-900 dark:text-white">
                      📊 Grafik Korelasi Historis (Relative 7-Day Performance)
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      Disetarakan mulai dari level basis index 100 untuk memvisualisasikan pergerakan return komparatif emiten.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-850">
                  <div className="overflow-x-auto">
                    <svg viewBox="0 0 650 200" className="w-full min-w-[450px]">
                      {/* Grid tracker */}
                      {[0, 1, 2, 3].map((g) => {
                        const y = 20 + g * 50;
                        return (
                          <line 
                            key={g} 
                            x1="35" y1={y} x2="630" y2={y} 
                            stroke="#4B5563" strokeOpacity="0.08" strokeDasharray="3,2" 
                          />
                        );
                      })}

                      {(() => {
                        const activeCodes = compareStocks.filter(Boolean);
                        const colors = ['#3B82F6', '#10B981', '#EC4899'];
                        
                        return (
                          <>
                            {activeCodes.map((code, codeIdx) => {
                              const points = STOCK_HIST_DATA[code] || [100, 101, 100, 99, 100, 101, 102];
                              const minVal = 95;
                              const maxVal = 110;
                              const range = maxVal - minVal;

                              const xStart = 40;
                              const xEnd = 620;
                              const yStart = 170;
                              const yEnd = 20;

                              const coords = points.map((val, idx) => {
                                const x = xStart + (idx / (points.length - 1)) * (xEnd - xStart);
                                const y = yStart - ((val - minVal) / range) * (yStart - yEnd);
                                return { x, y, value: val };
                              });

                              const pathStr = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');

                              return (
                                <g key={code}>
                                  {/* Line graph */}
                                  <path d={pathStr} fill="none" stroke={colors[codeIdx % colors.length]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  
                                  {/* Label markers dots */}
                                  {coords.map((c, i) => (
                                    <circle key={i} cx={c.x} cy={c.y} r="2.5" fill={colors[codeIdx % colors.length]} />
                                  ))}
                                </g>
                              );
                            })}

                            {/* Label captions axes */}
                            <text x="10" y="24" fill="#9CA3AF" fontSize="8" className="font-mono">110%</text>
                            <text x="10" y="99" fill="#9CA3AF" fontSize="8" className="font-mono">102.5%</text>
                            <text x="10" y="174" fill="#9CA3AF" fontSize="8" className="font-mono">95%</text>

                            {/* Legend trackers label */}
                            <g transform="translate(45, 15)">
                              {activeCodes.map((code, idx) => (
                                <g key={code} transform={`translate(${idx * 110}, 0)`}>
                                  <rect width="10" height="10" rx="3" fill={colors[idx % colors.length]} />
                                  <text x="16" y="9" fill="#9CA3AF" fontSize="9" className="font-black font-mono">{code}</text>
                                </g>
                              ))}
                            </g>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl text-center shadow-sm">
              <Scale className="w-8 h-8 text-sky-500 mx-auto opacity-45 mb-2 animate-bounce" />
              <p className="text-xs text-gray-500 font-semibold">
                Silakan pilih minimal 2 atau 3 emiten saham pada selector di atas untuk melihat tabel komparasi fundamental serta grafik korelasi data.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4 : STATISTICS & TRADE HISTORICAL LOGS */}
      {subTab === 'stats' && (
        <div className="space-y-6">
          
          {/* STATS ANALYTICAL SUMMARY BADGES */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <ShieldCheck className="w-6 h-6 text-[#1565C0] mx-auto mb-2" />
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Win Rate Sandbox</span>
              <div className="text-xl font-mono font-black text-gray-900 dark:text-white mt-1">
                {performanceMetrics.winRate}%
              </div>
              <p className="text-[9px] text-gray-450 mt-1 font-semibold leading-none">Rasio keputusan investasi yang mendulang profit</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <TrendingUp className="w-6 h-6 text-saham-green mx-auto mb-2" />
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Saham Terbaik (Best)</span>
              <div className="text-sm font-bold text-emerald-400 mt-2 truncate">
                {performanceMetrics.bestCode}
              </div>
              <p className="text-[9px] text-gray-450 mt-1 font-semibold leading-none">Emiten dengan persentase float return tertinggi</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <TrendingDown className="w-6 h-6 text-saham-red mx-auto mb-2" />
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Saham Terburuk (Worst)</span>
              <div className="text-sm font-bold text-rose-450 mt-2 truncate">
                {performanceMetrics.worstCode}
              </div>
              <p className="text-[9px] text-gray-450 mt-1 font-semibold leading-none">Emiten dengan persentase performa terendah</p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <History className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total Eksekusi Transaksi</span>
              <div className="text-xl font-mono font-black text-purple-400 mt-1">
                {performanceMetrics.totalTrades}
              </div>
              <p className="text-[9px] text-gray-450 mt-1 font-semibold leading-none">Riwayat order masuk (Beli/Jual) yang tercatat</p>
            </div>

          </div>

          {/* HISTORICAL LEDGER TRANSACTION TABLE SHEET */}
          <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h4 className="font-display font-extrabold text-gray-900 dark:text-white text-sm sm:text-base mb-4">
              📝 Buku Riwayat Transaksi Simulasi (Ledger Logs)
            </h4>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-xs text-left min-w-[500px] border-collapse font-semibold">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-extrabold uppercase">
                    <th className="px-6 py-3">ID Transaksi</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3 text-center">Kode</th>
                    <th className="px-4 py-3 text-center">Tipe Order</th>
                    <th className="px-4 py-3 text-right">Volume (Lot)</th>
                    <th className="px-4 py-3 text-right font-mono">Beban Eksekusi</th>
                    <th className="px-6 py-3 text-right">Keuntungan Terealisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-55 dark:divide-gray-850/40">
                  {tradeHistory.length > 0 ? (
                    tradeHistory.map((item) => {
                      const isBuy = item.type === 'BUY';
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/20 dark:hover:bg-gray-900/5">
                          <td className="px-6 py-3.5 font-mono text-gray-450 text-[10px] font-bold">#{item.id}</td>
                          <td className="px-4 py-3.5 font-mono text-gray-500">{item.date}</td>
                          <td className="px-4 py-3.5 text-center font-mono font-black text-gray-900 dark:text-white">{item.code}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black ${
                              isBuy ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono">{item.lots} lot</td>
                          <td className="px-4 py-3.5 text-right font-mono text-gray-900 dark:text-white">Rp {item.price.toLocaleString('id-ID')}</td>
                          <td className={`px-6 py-3.5 text-right font-mono font-bold ${
                            !isBuy && item.profit !== undefined && item.profit >= 0 ? 'text-emerald-400' : !isBuy && item.profit !== undefined && item.profit < 0 ? 'text-rose-400' : 'text-gray-400 font-semibold'
                          }`}>
                            {!isBuy && item.profit !== undefined ? `+Rp ${item.profit.toLocaleString('id-ID')}` : isBuy ? '-' : 'Rp 0'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-450 text-[11px] font-bold">
                        Belum ada riwayat transaksi terisi di database local ledger Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
