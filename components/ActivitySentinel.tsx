
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap, AlertTriangle, ShieldCheck, Play, Pause, RotateCcw } from 'lucide-react';

const ActivitySentinel: React.FC = () => {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const IDLE_LIMIT = 5 * 60 * 1000;

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
    <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between lowercase-ui">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
        <Clock size={120} className="text-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-500" size={16} />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest generous-spacing">sentinel node</span>
          </div>
          {isIdle && (
            <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase generous-spacing">
              idle
            </div>
          )}
        </div>

        <div className="mb-10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 generous-spacing">session duration</p>
          <p className="text-4xl font-black text-white tracking-tighter tabular-nums generous-spacing">{formatTime(activeSeconds)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all ${
              isPaused ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span className="text-[10px] font-black uppercase generous-spacing">{isPaused ? 'resume' : 'pause'}</span>
          </button>
          
          <button 
            onClick={() => setActiveSeconds(0)}
            className="flex items-center justify-center gap-3 py-4 bg-white/5 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={14} />
            <span className="text-[10px] font-black uppercase generous-spacing">reset</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 pt-8 mt-8 border-t border-white/5">
         <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest generous-spacing">node efficiency</span>
            <span className="text-xs font-black text-emerald-500 tracking-tighter">98.4%</span>
         </div>
         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[98.4%] shadow-lg"></div>
         </div>
      </div>
    </div>
  );
};

export default ActivitySentinel;
