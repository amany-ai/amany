
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap, AlertTriangle, ShieldCheck, Play, Pause, RotateCcw } from 'lucide-react';

const ActivitySentinel: React.FC = () => {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const IDLE_LIMIT = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused && !isIdle) {
        setActiveSeconds(prev => prev + 1);
      }
    }, 1000);

    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = window.setTimeout(() => setIsIdle(true), IDLE_LIMIT);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [isPaused, isIdle]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border border-emerald-900/30 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Clock size={80} className="text-emerald-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-500" size={16} />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sovereign Sentinel</span>
          </div>
          {isIdle && (
            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 animate-pulse">
              <AlertTriangle size={10} />
              <span className="text-[9px] font-black uppercase">Idle Node</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active Session Progress</p>
          <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{formatTime(activeSeconds)}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
              isPaused ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span className="text-[8px] font-black uppercase mt-1.5">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          
          <button 
            onClick={() => setActiveSeconds(0)}
            className="flex flex-col items-center justify-center py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={16} />
            <span className="text-[8px] font-black uppercase mt-1.5">Reset</span>
          </button>

          <div className="flex flex-col items-center justify-center py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl">
            <ShieldCheck size={16} />
            <span className="text-[8px] font-black uppercase mt-1.5">Secure</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency Rating</span>
              <span className="text-xs font-black text-emerald-500">98.4%</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98.4%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySentinel;
