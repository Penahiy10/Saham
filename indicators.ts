/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

// Simple Moving Average
export function calculateSMA(prices: number[], period: number = 20): number[] {
  if (prices.length < period) return Array(prices.length).fill(prices[prices.length - 1] || 0);
  const result: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(prices[i]);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      result.push(parseFloat((sum / period).toFixed(2)));
    }
  }
  return result;
}

// Exponential Moving Average
export function calculateEMA(prices: number[], period: number = 20): number[] {
  if (prices.length === 0) return [];
  const result: number[] = [prices[0]];
  const k = 2 / (period + 1);

  for (let i = 1; i < prices.length; i++) {
    const emaValue = prices[i] * k + result[i - 1] * (1 - k);
    result.push(parseFloat(emaValue.toFixed(2)));
  }
  return result;
}

// Relative Strength Index (RSI)
export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < 2) return Array(prices.length).fill(50);
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // Initial average
  if (prices.length <= period) {
    return Array(prices.length).fill(50);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // Fill first indices with neutral momentum
  for (let i = 0; i < period; i++) {
    rsi.push(50);
  }

  const initialRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(parseFloat((100 - 100 / (1 + initialRS)).toFixed(2)));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(parseFloat((100 - 100 / (1 + rs)).toFixed(2)));
  }

  return rsi;
}

// Moving Average Convergence Divergence (MACD)
export interface MACDResult {
  macdLine: number[];
  signalLine: number[];
  histogram: number[];
}

export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const emaFast = calculateEMA(prices, fastPeriod);
  const emaSlow = calculateEMA(prices, slowPeriod);
  
  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macdLine.push(parseFloat((emaFast[i] - emaSlow[i]).toFixed(2)));
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    histogram.push(parseFloat((macdLine[i] - signalLine[i]).toFixed(2)));
  }

  return { macdLine, signalLine, histogram };
}

// Bollinger Bands
export interface BollingerBandsResult {
  upper: number[];
  middle: number[];
  lower: number[];
}

export function calculateBollingerBands(prices: number[], period: number = 20, multiplier: number = 2): BollingerBandsResult {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(prices[i]);
      lower.push(prices[i]);
    } else {
      let sumSqDiff = 0;
      const sma = middle[i];
      for (let j = 0; j < period; j++) {
        sumSqDiff += Math.pow(prices[i - j] - sma, 2);
      }
      const stdDev = Math.sqrt(sumSqDiff / period);
      upper.push(parseFloat((sma + multiplier * stdDev).toFixed(2)));
      lower.push(parseFloat((sma - multiplier * stdDev).toFixed(2)));
    }
  }

  return { upper, middle, lower };
}

// Stochastic Oscillator
export interface StochasticResult {
  k: number[];
  d: number[];
}

export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14,
  smoothK: number = 3,
  smoothD: number = 3
): StochasticResult {
  if (closes.length < period) {
    return {
      k: Array(closes.length).fill(50),
      d: Array(closes.length).fill(50)
    };
  }

  const kRaw: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      kRaw.push(50);
    } else {
      // Find lowest low and highest high over past 'period' days
      let lowestLow = Infinity;
      let highestHigh = -Infinity;
      for (let j = 0; j < period; j++) {
        const idx = i - j;
        if (lows[idx] < lowestLow) lowestLow = lows[idx];
        if (highs[idx] > highestHigh) highestHigh = highs[idx];
      }
      
      const denominator = highestHigh - lowestLow;
      const kVal = denominator === 0 ? 50 : 100 * ((closes[i] - lowestLow) / denominator);
      kRaw.push(parseFloat(kVal.toFixed(2)));
    }
  }

  const k = calculateSMA(kRaw, smoothK);
  const d = calculateSMA(k, smoothD);

  return { k, d };
}
