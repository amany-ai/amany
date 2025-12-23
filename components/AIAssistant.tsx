
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, X, ArrowUpRight, Command } from 'lucide-react';
import { processAICommand } from '../services/geminiService';

interface AIAssistantProps {
  onAction: (name: string, args: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const actions = await processAICommand(input);
      if (actions && actions.length > 0) {
        actions.forEach(a => onAction(a.name, a.args));
        setIsOpen(false);
        setInput('');
      }
    } catch (err) {
      console.error("Failed to process AI command", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border border-slate-700"
    >
      <Sparkles size={28} className="text-amber-400 animate-pulse" />
      <div className="absolute right-20 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Summon AI Bridge (⌘K)
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Command className="text-blue-500" size={20} />
             <span className="text-sm font-bold text-white uppercase tracking-widest">Command Center</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <div className="relative">
             <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={22} />
             <input 
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What action should I perform? (e.g. 'Show me the task list')"
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-[28px] pl-14 pr-6 py-6 outline-none focus:border-blue-500 text-white font-medium text-lg placeholder:text-slate-600 transition-all"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {loading ? (
                  <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   <button type="submit" className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                      <ArrowUpRight size={24} />
                   </button>
                )}
             </div>
          </div>
          
          <div className="mt-8 flex gap-3 flex-wrap">
             {[
               { hint: 'Go to Project Flow', action: 'Show me the tasks' },
               { hint: 'Open Backend Node', action: 'Navigate to backend' },
               { hint: 'Check Integrations', action: 'Go to integrations' }
             ].map(item => (
               <button 
                key={item.hint}
                type="button"
                onClick={() => setInput(item.action)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-all"
               >
                 {item.hint}
               </button>
             ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
