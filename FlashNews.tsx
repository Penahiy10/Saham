/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Newspaper, Bell, ExternalLink, Calendar, X, Heart, MessageSquare } from 'lucide-react';
import { NEWS_KILAT } from '../data';
import { NewsItem } from '../types';

interface FlashNewsProps {
  newsList: NewsItem[];
  isLoading: boolean;
}

export default function FlashNews({ newsList, isLoading }: FlashNewsProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const getSentimentStyle = (sentiment: 'Positif' | 'Negatif' | 'Netral') => {
    switch (sentiment) {
      case 'Positif':
        return 'bg-emerald-500/10 text-saham-green border-emerald-500/15';
      case 'Negatif':
        return 'bg-rose-500/10 text-saham-red border-rose-500/15';
      default:
        return 'bg-blue-500/10 text-[#1565C0] border-blue-500/15';
    }
  };

  const getRelatedTickers = (title: string) => {
    const tickers: string[] = [];
    if (title.includes('BBCA')) tickers.push('BBCA');
    if (title.includes('BBRI')) tickers.push('BBRI');
    if (title.includes('BMRI')) tickers.push('BMRI');
    if (title.includes('BRPT')) tickers.push('BRPT');
    if (title.includes('ADRO')) tickers.push('ADRO');
    if (title.includes('PTBA')) tickers.push('PTBA');
    if (title.includes('GOTO')) tickers.push('GOTO');
    if (title.includes('ANTM')) tickers.push('ANTM');
    
    // Default related list if dry
    if (tickers.length === 0) {
      if (title.includes('Asing')) return ['BBCA', 'BMRI', 'BBRI'];
      if (title.includes('Bunga')) return ['IHSG', 'LQ45'];
      return ['IHSG'];
    }
    return tickers;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-250 dark:bg-gray-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="flash-news-section" className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header section with bells and whistles */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Newspaper className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
                Berita Kilat (Flash News)
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Real-time Feed
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            Berita makroekonomi dan rumors pasar modal terhangat yang dirangkum langsung oleh tim analis Penahiy.
          </p>

          {/* Table list of news */}
          <div className="space-y-3.5">
            {newsList.map((news) => (
              <div
                id={`news-item-${news.id}`}
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-900/10 hover:bg-gray-50/100 dark:hover:bg-gray-800/20 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition duration-150 cursor-pointer text-left"
              >
                {/* News Time info */}
                <div className="text-[10px] font-bold font-mono text-gray-400 whitespace-nowrap mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-1.5 py-0.5 rounded">
                  {news.time}
                </div>

                {/* News title & chip */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getSentimentStyle(news.sentiment)}`}>
                      Sinyal {news.sentiment}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{news.source}</span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-emerald-500 transition duration-100">
                    {news.title}
                  </h4>
                </div>

                {/* Trigger link icon */}
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 mt-1 flex-shrink-0 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Action footnote for full index */}
        <div className="mt-5 text-center">
          <p className="text-[10px] text-gray-400 font-semibold">
            Menampilkan 5 Berita Terkini. Klik berita untuk membaca ulasan analitis lengkap.
          </p>
        </div>
      </div>

      {/* READING MODE MODAL DETAIL OVERLAY */}
      {selectedNews && (
        <div 
          id="news-modal-overlay"
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            id="news-modal-container"
            className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant design top banner */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-400" />
            
            {/* Close trigger */}
            <button
              id="news-modal-close"
              onClick={() => setSelectedNews(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider mt-1">
              <span>{selectedNews.time}</span>
              <span>•</span>
              <span>{selectedNews.source}</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-display font-black text-gray-900 dark:text-white leading-snug mb-3">
              {selectedNews.title}
            </h3>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getSentimentStyle(selectedNews.sentiment)}`}>
                Sentimen Pasar: {selectedNews.sentiment}
              </span>
              
              {/* Target Tickers related */}
              {getRelatedTickers(selectedNews.title).map((ticker) => (
                <span 
                  key={ticker} 
                  className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  ${ticker}
                </span>
              ))}
            </div>

            {/* Paragraph body */}
            <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
              {selectedNews.content}
            </div>

            {/* Footer with actions inside Modal */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-gray-400">
                <button className="flex items-center gap-1 hover:text-rose-500 transition cursor-pointer">
                  <Heart className="w-4 h-4 fill-current text-rose-500" /> 124 Menyukai
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition cursor-pointer">
                  <MessageSquare className="w-4 h-4" /> 18 Diskusi
                </button>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-semibold rounded-xl text-xs hover:bg-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white transition duration-150"
              >
                Selesai Membaca
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
