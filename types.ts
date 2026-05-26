/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  loading?: boolean;
}

export interface StockItem {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  industry: string;
}

export interface BandarItem {
  code: string;
  name: string;
  volumeRatio: number; // e.g. 3.2x normal volume
  type: 'Akumulasi' | 'Distribusi';
  strength: 'Sangat Kuat' | 'Kuat' | 'Sedang' | 'Tipis';
  netValue: string; // e.g., "124B Net Buy" or "52B Net Sell"
}

export interface NewsItem {
  id: string;
  time: string;
  title: string;
  source: string;
  sentiment: 'Positif' | 'Negatif' | 'Netral';
  content: string; // Detail content for modal view
}

export interface WatchlistItem {
  code: string;
  name: string;
  price: number;
  changePercent: number;
}
