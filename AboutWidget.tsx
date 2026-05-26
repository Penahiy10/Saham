/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Database, Cpu, Mail, CheckCircle, Clock } from 'lucide-react';

interface AboutWidgetProps {
  lastUpdateTime: string;
}

export default function AboutWidget({ lastUpdateTime }: AboutWidgetProps) {
  const [updateStatus, setUpdateStatus] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time status from our custom backend server
  const fetchUpdateStatus = async () => {
    try {
      const res = await fetch('/api/update-status');
      if (res.ok) {
        const data = await res.json();
        setUpdateStatus(data);
      }
    } catch (e) {
      console.warn('Backend update endpoint not reachable:', e);
    }
  };

  useEffect(() => {
    fetchUpdateStatus();
    const interval = setInterval(fetchUpdateStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerManualCronSync = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/cron', { method: 'POST' });
      if (res.ok) {
        await fetchUpdateStatus();
      }
    } catch (e) {
      console.error('Failed triggering manual sync:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Hero Card with clean look */}
      <div className="bg-gradient-to-r from-sky-600/10 via-sky-500/5 to-transparent border border-sky-500/15 rounded-2xl p-6 text-left relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-500/20 text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2.5 inline-block">
            Sistem Terminal Mandiri SahamPintar
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white leading-tight tracking-tight">
            Tentang SahamPintar (Penahiy) & Sumber Data
          </h2>
          <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed mt-2.5 font-semibold">
            SahamPintar adalah platform edukasi, perbandingan fundamental, dan analisis pergerakan bursa saham Indonesia yang dapat diakses secara gratis. Kami mengintegrasikan umpan data langsung bursa, kalkulator teknikal modular, dan asisten berpikir otomatis berbasis kecerdasan buatan (Gemini AI).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Data Sources & Connections (2 spans on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Sources Details Card */}
          <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" />
              Arsitektur Data & Alur Integrasi Real-Time
            </h3>
            
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/65">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-gray-900 dark:text-gray-200">1. Yahoo Finance API (Data Saham Aktual)</span>
                  <span className="text-[10px] px-2 py-0.2 bg-emerald-500/10 text-emerald-400 rounded font-bold">Terhubung</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Mendistribusikan umpan harga terakhir, volume harian, pembukaan/penutupan, nilai tertinggi/terendah hari ini, serta riwayat historis chart mingguan 7 hari secara real-time. Kode emiten bursa otomatis dipetakan ke format .JK (misal: BBCA.JK atau GOTO.JK).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/65">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-gray-900 dark:text-gray-200">2. Kalkulator Teknikal Frontend Tanpa Kuota API</span>
                  <span className="text-[10px] px-2 py-0.2 bg-sky-500/10 text-sky-400 rounded font-bold">Internal</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Untuk menghemat beban kuota API berbayar seperti Alpha Vantage di sisi pemula, seluruh indikator matematika rumit (seperti Simple Moving Average, Exponential Moving Average, RSI momentum, garis MACD, batas Bollinger Bands, dan Stochastic Oscillator) dikalkulasi secara mandiri di sisi peramban pengguna menggunakan rumus matematis murni.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/65">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-gray-900 dark:text-gray-200">3. Aggregator Feed Multi-Sumber (RSS Indonesia)</span>
                  <span className="text-[10px] px-2 py-0.2 bg-purple-500/10 text-purple-400 rounded font-bold">Teragregasi</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Menjaring berita kilat paling berpengaruh untuk emiten & bursa langsung dari portal tepercaya seperti Kontan Investasi, Investing.com Indonesia, dan Google News RSS Indonesia. Disinkronkan setiap 5 menit dengan backend cache memory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/65">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-gray-900 dark:text-gray-200">4. Gemini AI (Anak Analisis Sinyal Pintar)</span>
                  <span className="text-[10px] px-2 py-0.2 bg-indigo-500/10 text-indigo-400 rounded font-bold">Gemini 3.5 Flash</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Kecerdasan buatan generatif Gemini (model <code className="font-mono text-purple-400 font-bold">gemini-3.5-flash</code>) memformulasikan ulasan naratif komparatif. Gemini menerima data kuantitatif teknikal + angka fundamental likuiditas + skor sentimen berita kilat, lalu mensintesis petunjuk strategi trading serta target harga potensial secara objektif dalam hitungan detik.
                </p>
              </div>

            </div>
          </div>

          {/* Core Investment Advisory Disclaimer Banner */}
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-6 text-left shadow-sm">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-amber-600 dark:text-amber-400 flex items-center gap-2.5 mb-2.5">
              <ShieldAlert className="w-5 h-5" />
              Disclaimer Terbuka (Persetujuan Investasi)
            </h4>
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed font-semibold space-y-2">
              <span>
                Seluruh informasi riset, metrik rasio keuangan, indikator teknikal bursa, tabel komparasi, ulasan portofolio virtual, dan narasi sinyal rekomendasi dari Gemini AI yang tersaji di dalam aplikasi SahamPintar hanya bersifat sebagai instrumen edukasi penunjang. Informasi ini TIDAK boleh ditafsirkan sebagai bentuk rekomendasi beli/jual resmi atau ajakan penempatan modal investasi riil tertentu.
              </span>
              <br /><br />
              <span>
                Investasi pasar modal (saham) sangatlah fluktuatif dan sarat akan risiko kehilangan modal pribadi. SahamPintar (Penahiy) tidak bertindak sebagai penasihat keuangan dan tidak memikul pertanggungjawaban hukum atas seluruh bentuk keputusan transaksi, profit, maupun kerugian finansial yang timbul dari pengoperasian platform simulasi ini. Harap lakukan analisa komparasi mandiri secara matang (DYOR - Do Your Own Research) sebelum mengeksekusi dana asli di bursa.
              </span>
            </p>
          </div>

        </div>

        {/* Right Column: Connection States, Manual Trigger, Contacts */}
        <div className="space-y-6">
          
          {/* Caching status and updates control */}
          <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              Status Sinkronisasi Sistem
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-850">
                <span className="text-gray-400 font-bold">Waktu Server Saat Ini:</span>
                <span className="font-mono font-black text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-850">
                <span className="text-gray-400 font-bold">Terakhir Cron Database:</span>
                <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {updateStatus?.lastUpdated || lastUpdateTime} WIB
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-850">
                <span className="text-gray-400 font-bold">Status Background Sync:</span>
                <span className="font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${updateStatus?.isUpdating || isRefreshing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  <span className={updateStatus?.isUpdating || isRefreshing ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {updateStatus?.isUpdating || isRefreshing ? 'Sinkronisasi Aktif' : 'Standby / Siap'}
                  </span>
                </span>
              </div>

              <div className="pt-2">
                <button
                  id="force-sync-btn"
                  onClick={triggerManualCronSync}
                  disabled={isRefreshing}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3.5 bg-[#1565C0] hover:bg-[#1565C0]/90 text-white rounded-xl font-bold transition shadow-md text-xs disabled:opacity-50"
                >
                  <Cpu className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Mereset Database...' : 'Trigger Sync Database (Cron)'}
                </button>
                <span className="text-[9px] text-gray-400 text-center block mt-1.5 font-semibold">
                  Memaksa sinkronisasi ulang feed bursa, indices chart, dan berita pada cloud server Penahiy.
                </span>
              </div>
            </div>
          </div>

          {/* Feedback and Contact Form (Real information, no dummy fields) */}
          <div className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-500" />
              Kontak Hubung & Feedback
            </h3>
            
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-3">
              Kritik dan saran sangat berarti untuk kemajuan fitur analitik platform. Hubungi pengembang untuk kolaborasi fitur bursa di masa mendatang.
            </p>

            <div className="space-y-2.5">
              
              <div className="text-xs p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-905">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-extrabold">E-mail Premium</span>
                <a href="mailto:support@penahiy.id" className="font-semibold text-[#1565C0] font-mono hover:underline">
                  support@penahiy.id
                </a>
              </div>

              <div className="text-xs p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-905">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-extrabold">Telegram Komunitas Saham</span>
                <a href="https://t.me/sahampintar_penahiy" target="_blank" rel="noreferrer" className="font-semibold text-emerald-400 font-mono hover:underline block">
                  @sahampintar_penahiy
                </a>
              </div>

              <div className="text-xs p-3 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-905">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-extrabold">Situs Pengembang Utama</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 block font-mono">
                  https://www.penahiy.id
                </span>
              </div>

            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
              <span className="text-[10px] text-emerald-500 font-black block">VERSI PRODUK: 2.1.2-FINAL</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
