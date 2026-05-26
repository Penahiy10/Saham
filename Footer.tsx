/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Info, FileText } from 'lucide-react';

interface FooterProps {
  lastUpdateTime: string;
}

export default function Footer({ lastUpdateTime }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-gray-250 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 py-8 px-6 text-left transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
        
        {/* Footnote branding & disclaimer */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-display font-black text-sm text-gray-900 dark:text-white tracking-tight">
              Penahiy <span className="font-sans text-xs text-gray-400 font-semibold font-mono">v1.2.0</span>
            </span>
            <span className="text-[10px] text-gray-404 bg-gray-200 dark:bg-gray-800 p-1 py-0.5 rounded text-gray-450 uppercase font-bold tracking-wider">Gratis Selamanya</span>
          </div>
          
          <p className="text-[11px] text-gray-450 text-gray-400 leading-relaxed font-semibold">
            <strong>DISCLAIMER INVESTASI:</strong> Perdagangan saham dan investasi instrumen finansial mengandung risiko capital loss yang tinggi. Seluruh publikasi data harian, analisa broker bunderologi, sinyal teknikal, dan artikel edukasi di platform <strong>Penahiy (SahamPintar App)</strong> disediakan murni untuk keperluan referensi pendidikan dan simulasi semata. Platform ini tidak menerima titipan dana atau menawarkan janji profit pasti, serta bukan merupakan rekomendasi beli/jual legal (financial advice). Segala keputusan finansial akhir dan konsekuensinya sepenuhnya menjadi hak dan tanggung jawab pribadi Anda sebagai investor cerdas.
          </p>
        </div>

        {/* Timestamps & details */}
        <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-400 border-l border-gray-200 dark:border-gray-800 pl-4">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Keamanan SSL Enkripsi
          </div>
          <div>Server Node: <span className="text-gray-950 dark:text-gray-200 font-bold">Active (0.0.0.0)</span></div>
          <div>Terakhir Update: <span className="text-emerald-500 font-bold">{lastUpdateTime} WIB</span></div>
          <div className="mt-1 text-[9px] text-gray-500">© 2026 Penahiy. Dibuat dengan presisi tinggi untuk trader Indonesia.</div>
        </div>

      </div>
    </footer>
  );
}
