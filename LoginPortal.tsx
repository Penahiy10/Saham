import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stock random points data generator (User's specific formula)
  const POINTS_COUNT = 140;
  const generateStockData = (baseValue: number, points = POINTS_COUNT) => {
    const data = [baseValue];
    for (let i = 1; i < points; i++) {
      const change = (Math.random() - 0.48) * baseValue * 0.008;
      const newVal = data[i-1] + change;
      data.push(Math.max(newVal, baseValue * 0.85));
    }
    return data;
  };

  // React Refs to keep live points
  const ihsgPoints = useRef<number[]>([]);
  const lq45Points = useRef<number[]>([]);
  const idx30Points = useRef<number[]>([]);
  const [displayIhsg, setDisplayIhsg] = useState('6.130,40 (-1.23%)');
  const [tickerData, setTickerData] = useState<any>(null);

  // Helper to check if the bursa is currently open (identical to server-side WIB scheduling)
  const isClientMarketOpen = (): boolean => {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const wib = new Date(utc + (7 * 60 * 60 * 1000));

    const day = wib.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    if (day === 0 || day === 6) return false;

    const hour = wib.getHours();
    const minute = wib.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Session 1: 09:00 - 12:00 WIB
    // Session 2: 13:30 - 16:00 WIB
    const isSession1 = timeInMinutes >= 540 && timeInMinutes <= 720;
    const isSession2 = timeInMinutes >= 810 && timeInMinutes <= 960;

    return isSession1 || isSession2;
  };

  useEffect(() => {
    // Generate initial datasets - use 6130.40 base for high coherence
    ihsgPoints.current = generateStockData(6130.40, POINTS_COUNT);
    lq45Points.current = generateStockData(910.95, POINTS_COUNT);
    idx30Points.current = generateStockData(461.39, POINTS_COUNT);

    setDisplayIhsg('6.130,40 (-1.23%)');

    // Dynamic push mechanism: every 3 seconds append a new point to keep canvas alive
    const interval = setInterval(() => {
      // IHSG dynamic ticker change (keeps canvas moving, but doesn't change displayed index textual price if closed)
      const lastIhsg = ihsgPoints.current[ihsgPoints.current.length - 1];
      const changeIhsg = (Math.random() - 0.48) * lastIhsg * 0.006;
      ihsgPoints.current.shift();
      ihsgPoints.current.push(Math.max(lastIhsg + changeIhsg, 5000));

      // LQ45
      const lastLq = lq45Points.current[lq45Points.current.length - 1];
      const changeLq = (Math.random() - 0.48) * lastLq * 0.006;
      lq45Points.current.shift();
      lq45Points.current.push(Math.max(lastLq + changeLq, 700));

      // IDX30
      const lastIdx = idx30Points.current[idx30Points.current.length - 1];
      const changeIdx = (Math.random() - 0.48) * lastIdx * 0.006;
      idx30Points.current.shift();
      idx30Points.current.push(Math.max(lastIdx + changeIdx, 350));

      // Update state price ONLY if market is actively open
      if (isClientMarketOpen()) {
        const currentPriceVal = ihsgPoints.current[POINTS_COUNT - 1];
        if (currentPriceVal) {
          setDisplayIhsg(currentPriceVal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch real-time market indices summary from the API
  useEffect(() => {
    const loadRealSummary = async () => {
      try {
        const res = await fetch('/api/markets-summary');
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.data) {
          setTickerData(json.data);
          
          const ihsgPrice = json.data['^JKSE']?.price || 6130.40;
          const lqPrice = json.data['^JKLQ45']?.price || 910.95;
          const idxPrice = json.data['^JK30']?.price || 461.39;

          // Seed canvas trend curves with accurate live prices
          ihsgPoints.current = generateStockData(ihsgPrice, POINTS_COUNT);
          lq45Points.current = generateStockData(lqPrice, POINTS_COUNT);
          idx30Points.current = generateStockData(idxPrice, POINTS_COUNT);

          const ihsgChangePercent = json.data['^JKSE']?.changePercent ?? -1.23;
          const sign = ihsgChangePercent >= 0 ? '+' : '';
          
          const formattedPrice = ihsgPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          setDisplayIhsg(`${formattedPrice} (${sign}${ihsgChangePercent.toFixed(2)}%)`);
        }
      } catch (err) {
        console.error("Failed to load real-time summary inside LoginPortal:", err);
      }
    };

    loadRealSummary();
    const refreshInterval = setInterval(loadRealSummary, 10000); // 10 seconds frequency

    return () => clearInterval(refreshInterval);
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawSingleChartPath = (points: number[], minVal: number, maxVal: number, strokeStyle: string) => {
      if (points.length === 0) return;
      const padX = 100;
      const plotWidth = canvas.width - padX;
      
      const coords: { x: number; y: number }[] = [];
      for (let i = 0; i < points.length; i++) {
        const x = (plotWidth / (points.length - 1)) * i;
        const norm = (points[i] - minVal) / (maxVal - minVal);
        const y = canvas.height - (norm * (canvas.height * 0.70) + (canvas.height * 0.15));
        coords.push({ x, y });
      }

      // Create translucent fill gradients
      const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fillGradient.addColorStop(0, strokeStyle + '1D'); // opacity approx 0.11
      fillGradient.addColorStop(0.5, strokeStyle + '0B'); // opacity approx 0.04
      fillGradient.addColorStop(1, 'transparent');

      // Draw path
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        const exc = (coords[i - 1].x + coords[i].x) / 2;
        const eyc = (coords[i - 1].y + coords[i].y) / 2;
        ctx.quadraticCurveTo(coords[i - 1].x, coords[i - 1].y, exc, eyc);
      }
      ctx.lineTo(coords[coords.length - 1].x, coords[coords.length - 1].y);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1.85;
      ctx.shadowBlur = 4;
      ctx.shadowColor = strokeStyle;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area below
      ctx.beginPath();
      ctx.moveTo(coords[0].x, canvas.height);
      ctx.lineTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        ctx.lineTo(coords[i].x, coords[i].y);
      }
      ctx.lineTo(coords[coords.length - 1].x, canvas.height);
      ctx.closePath();
      ctx.fillStyle = fillGradient;
      ctx.fill();
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 8]);

      // Vertical lines
      const columns = 10;
      for (let i = 1; i < columns; i++) {
        const x = (canvas.width / columns) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines with text
      const rows = 8;
      ctx.fillStyle = 'rgba(156, 163, 175, 0.35)';
      ctx.font = '9px Inter, sans-serif';
      for (let i = 1; i < rows; i++) {
        const y = (canvas.height / rows) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.fillText((8000 - i * 1000).toLocaleString('id-ID'), 12, y - 4);
      }
      ctx.setLineDash([]);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      // Render 3 simulated index streams
      drawSingleChartPath(ihsgPoints.current, 6200, 7800, '#10B981'); // Green IHSG
      drawSingleChartPath(lq45Points.current, 800, 1050, '#3B82F6');   // Blue LQ45
      drawSingleChartPath(idx30Points.current, 400, 600, '#F59E0B');  // Yellow IDX30

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast(`Koneksi terverifikasi! Masuk sebagai ${email}`);
      
      // Delay transition to home dashboard for great visual feel
      setTimeout(() => {
        onLoginSuccess(email);
      }, 1000);
    }, 2000);
  };

  const handleGoogleSSO = () => {
    triggerToast("Menghubungkan integrasi Google Workspace Single Sign-On...");
    setTimeout(() => {
      onLoginSuccess("sso.user@gmail.com");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0E1A] text-[#F9FAFB] overflow-hidden select-none font-sans flex flex-col justify-between">
      
      {/* 1. BACKGROUND CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block pointer-events-none" />

      {/* 2. GRADIENT SAFETY SURFACE BLOCKING OVERLAY */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(10, 14, 26, 0.70) 0%, rgba(10, 14, 26, 0.85) 50%, rgba(10, 14, 26, 0.96) 100%)'
        }}
      />

      {/* 3. RUNNING TICKER TAPE BAR */}
      <div className="relative z-30 w-full h-[38px] bg-gray-900/90 border-b border-white/5 flex items-center overflow-hidden">
        <div 
          className="flex whitespace-nowrap"
          style={{
            animation: 'ticker-move 28s linear infinite'
          }}
        >
          {Array(2).fill(0).map((_, groupIdx) => (
            <React.Fragment key={groupIdx}>
              {tickerData ? (
                Object.keys(tickerData).map((key) => {
                  const s = tickerData[key];
                  const isUp = s.changePercent >= 0;
                  const nameLabel = s.code.startsWith("^") ? s.code.replace("^", "") : s.code;
                  return (
                    <div 
                      key={`${key}-${groupIdx}`} 
                      className={`inline-flex items-center px-6 text-xs font-bold font-mono tracking-wider ${
                        isUp ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-sm ${
                        isUp ? 'bg-[#10B981] shadow-[#10B981]' : 'bg-[#EF4444] shadow-[#EF4444]'
                      }`} />
                      <span>{nameLabel} {s.price.toLocaleString('id-ID')} {isUp ? '+' : ''}{s.changePercent.toFixed(2)}%</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="inline-flex items-center px-6 text-xs font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 shadow-[0_0_8px_#10B981]"></span>
                    <span className="text-[#10B981]">IHSG +0,65%</span>
                  </div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`a-${groupIdx}`}>BBCA 9.700 +3,85%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`b-${groupIdx}`}>BBRI 5.100 +6,25%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#EF4444]" key={`c-${groupIdx}`}>TLKM 3.980 -1,24%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#EF4444]" key={`d-${groupIdx}`}>GOTO 62 -5,63%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`e-${groupIdx}`}>AMMN 9.800 +4,21%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`f-${groupIdx}`}>LQ45 +0,66%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#EF4444]" key={`g-${groupIdx}`}>IDX30 -0,42%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`h-${groupIdx}`}>ANTM 1.875 +2,45%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`i-${groupIdx}`}>BMRI 6.350 +3,52%</div>
                  <div className="inline-flex items-center px-6 text-xs font-bold text-[#10B981]" key={`j-${groupIdx}`}>ASII 4.890 +1,23%</div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Ticker Keyframes Hack embedded in block */}
      <style>{`
        @keyframes ticker-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float-loop-one {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.2deg); }
        }
        @keyframes float-loop-two {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-0.3deg); }
        }
        @keyframes float-loop-three {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.1deg); }
        }
      `}</style>

      {/* 4. MAIN VIEWPORT */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12 py-8">
        
        {/* LEFT DECK (FLOATING INFO PANEL NODES) */}
        <div className="hidden md:flex flex-col gap-6 max-w-[360px] text-left">
          
          {/* Card 1: IHSG real indices */}
          <div 
            className="bg-gray-900/65 backdrop-blur-md border border-white/5 rounded-[14px] p-5 shadow-2xl flex items-center w-[340px] animate-[float-loop-one_6s_ease-in-out_infinite]"
            style={{ animation: 'float-loop-one 6s ease-in-out infinite' }}
          >
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#10B981] flex items-center gap-1.5 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                🟢 INDEKS BI IHSG
              </div>
              <div className="text-2xl font-black tracking-tight text-white">{displayIhsg}</div>
              <div className="text-xs text-[#9CA3AF] font-medium leading-tight">Sektor Keuangan Menguat · +0,65%</div>
            </div>
            
            {/* Sparkline */}
            <svg className="w-[70px] h-[22px] ml-4 shrink-0" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 25 Q 15 15 30 20 T 60 10 T 90 5 T 100 2" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 25 Q 15 15 30 20 T 60 10 T 90 5 T 100 2 L 100 30 L 0 30 Z" fill="url(#spark-grad-react)" opacity="0.1" />
              <defs>
                <linearGradient id="spark-grad-react" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Card 2: Market Score index health */}
          <div 
            className="bg-gray-900/65 backdrop-blur-md border border-white/5 rounded-[14px] p-5 shadow-2xl text-left w-[340px]"
            style={{ animation: 'float-loop-two 8s ease-in-out infinite' }}
          >
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#9CA3AF] mb-1.5">💪 SKOR SEHAT BURSA</div>
            <div className="text-2xl font-black text-[#F59E0B]">74 <span className="text-[13px] text-[#9CA3AF] font-semibold">/ 100</span></div>
            <div className="text-xs text-[#9CA3AF] font-medium leading-tight flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Sentimen Emiten: SEHAT AKUMULASI
            </div>
          </div>

          {/* Card 3: Radar Bandar statistics summary */}
          <div 
            className="bg-gray-900/65 backdrop-blur-md border border-white/5 rounded-[14px] p-5 shadow-2xl text-left w-[340px]"
            style={{ animation: 'float-loop-three 7s ease-in-out infinite' }}
          >
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#9CA3AF] mb-1.5">🔍 RADAR BANDAR</div>
            <div className="text-2xl font-black text-[#3B82F6]">AKUMULASI</div>
            <div className="text-xs text-[#9CA3AF] font-medium leading-tight mt-1">3 Saham Terdeteksi Transaksi Tidak Wajar</div>
          </div>

        </div>

        {/* RIGHT CORE LOGIN FORM CONTAINER */}
        <div className="w-full max-w-[420px] bg-[#111827]/85 backdrop-blur-lg border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-[0_25px_50px_rgba(0,0,0,0.5)] text-center animate-[scale-logo_0.5s_ease_forwards]">
          
          {/* Logo PENAHIY SVG Header block */}
          <div className="mb-6 flex justify-center">
            <svg width="280" height="52" viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg" className="block max-w-full">
              <defs>
                <linearGradient id="logo-p-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="logo-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              <g transform="translate(5, 5)">
                <rect x="11" y="9" width="6" height="28" rx="2" fill="url(#logo-p-grad)" opacity="0.15" filter="blur(2px)" />
                <line x1="14" y1="3" x2="14" y2="41" stroke="url(#logo-p-grad)" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="11" y="10" width="6" height="24" rx="2.5" fill="url(#logo-p-grad)" />
                <path d="M15 11 C28 11, 31 18, 15 25" stroke="url(#logo-p-grad)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                <path d="M19 24 L29 14 M24 14 L29 14 L29 19" stroke="url(#logo-p-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <text x="56" y="32" fill="url(#logo-text-grad)" fontFamily="'Inter', sans-serif" fontSize="21" fontWeight="900" letterSpacing="4px">PENAHIY</text>
              <text x="56" y="47" fill="#9CA3AF" fontFamily="'Inter', sans-serif" fontSize="8.5" fontWeight="700" letterSpacing="1px" opacity="0.85">ANALISA TAJAM, INVESTASI LEBIH CERDAS</text>
            </svg>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white mb-1.5">Selamat Datang Kembali</h2>
          <p className="text-xs text-[#9CA3AF] font-semibold mb-6">Masuk untuk melihat analisa saham terkini</p>

          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[#374151]/50 to-transparent mb-6" />

          {/* LOGIN FORM */}
          <form className="space-y-4 text-left" onSubmit={handleFormLogin}>
            
            {/* Input Email Address */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-wider mb-2" htmlFor="react-login-email">Alamat Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-500 w-[18px] h-[18px] pointer-events-none" />
                <input 
                  type="email" 
                  id="react-login-email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15 transition font-medium"
                  placeholder="nama@email.com" 
                  required 
                />
              </div>
            </div>

            {/* Input Security Password Entry */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-wider mb-2" htmlFor="react-login-password">Password Akun</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-500 w-[18px] h-[18px] pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="react-login-password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1F2937] border border-[#374151] rounded-xl py-3.5 pl-11 pr-11 text-sm text-white outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15 transition font-medium"
                  placeholder="Masukkan kata sandi tebal" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-white transition p-1"
                  aria-label="Tampilkan sandi"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Extra Preferences lines */}
            <div className="flex justify-between items-center text-xs pt-1">
              <label className="flex items-center gap-2 text-[#9CA3AF] font-semibold cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#3B82F6] w-4 h-4 rounded" />
                <span>Ingat saya</span>
              </label>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); triggerToast("Instruksi pengaturan ulang keamanan dikirimkan ke e-mail."); }}
                className="text-[#3B82F6] font-bold hover:underline"
              >
                Lupa Password?
              </a>
            </div>

            {/* Submit Actions button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-13 mt-6 bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-[#10B981]/25 disabled:opacity-50"
            >
              {isLoading && (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke PENAHIY'}</span>
            </button>

          </form>

          {/* Social SSO integrations divider */}
          <div className="flex items-center my-6 text-[10px] font-extrabold uppercase tracking-widest text-[#9CA3AF]">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="px-3">atau masuk dengan</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          {/* SSO Google Single Sign On */}
          <button 
            type="button" 
            onClick={handleGoogleSSO}
            className="w-full h-12 bg-[#1F2937] border border-[#374151] hover:bg-[#111827] hover:border-white text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <p className="text-xs text-[#9CA3AF] font-semibold mt-6">
            Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Membuka pendaftaran anggota bursa eksklusif..."); }} className="text-[#10B981] font-extrabold hover:underline">Daftar Gratis</a>
          </p>

          <p className="text-[10px] text-gray-500 font-medium leading-normal mt-6">
            Dengan masuk, Anda setuju dengan <strong className="text-gray-400">Syarat & Ketentuan</strong> dan <strong className="text-gray-400">Kebijakan Privasi</strong> PENAHIY.
          </p>

        </div>

      </div>

      {/* 5. BOTTOM DISCLAIMER / TOAST NOTIFICATION POPUP */}
      <div className="relative z-30 pb-4 text-center">
        <p className="text-[10px] text-gray-500 font-medium px-4">
          Penahiy SahamPintar © 2026 IDX Analyst Engine · Otoritas Jasa Keuangan (OJK) Simulasi Edukasi Investor
        </p>
      </div>

      {/* Dynamic Alerts Banner */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111827] border border-[#10B981] shadow-2xl px-6 py-3.5 rounded-full flex items-center gap-2.5 transition-all duration-300 ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <CheckCircle className="w-[18px] h-[18px] text-[#10B981] shrink-0" />
        <span className="text-xs font-bold text-white">{toastMessage}</span>
      </div>

    </div>
  );
}
