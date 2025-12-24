
import React, { useState } from 'react';
import { Palette, Sparkles, Type as TypeIcon, Maximize2, Move, LayoutTemplate, Zap, RefreshCw, Layers } from 'lucide-react';
import { generateUIDesign } from '../services/geminiService';
import { UIDesignResult } from '../types';

const UIDesignAgent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [designResult, setDesignResult] = useState<UIDesignResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateUIDesign(prompt);
    setDesignResult(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <Palette className="text-emerald-500" size={32} /> UI Expert Agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic tracking-wide">
            orchestrating 'inter' based design systems with focus on whitespace and minimalist rhythm.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Design Input Cluster */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500" /> UI requirement
              </label>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed mb-6 font-inter"
              placeholder="describe a screen or component. focus on space and lowercase aesthetics..."
            />

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Zap size={20} className="text-emerald-400" />}
              {loading ? 'synthesizing...' : 'generate design specs'}
            </button>
          </div>

          <div className="bg-black rounded-[32px] p-8 text-white">
             <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layers size={14} /> design core rules
             </h3>
             <ul className="space-y-4">
                <li className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> font family: inter
                </li>
                <li className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> logic: strict whitespace
                </li>
                <li className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> emphasis: lowercase labels
                </li>
             </ul>
          </div>
        </div>

        {/* Output Canvas */}
        <div className="xl:col-span-2 space-y-8">
           {!designResult && !loading ? (
             <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm h-full flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                  <Palette size={32} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">awaiting design handshake</h3>
                <p className="text-slate-400 font-medium italic lowercase">provide a prompt to generate technical design specifications</p>
             </div>
           ) : loading ? (
             <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-[pulse_2s_infinite]"></div>
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 animate-pulse uppercase text-emerald-500">synthesizing layout...</h3>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">applying inter metrics & lowercase rules</p>
             </div>
           ) : designResult && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
                   <header className="flex justify-between items-start mb-10 border-b pb-8">
                      <div>
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">design specification report</p>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">ui architecture</h3>
                      </div>
                   </header>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                         <div className="flex items-center gap-2 mb-3">
                            <TypeIcon size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">typography</span>
                         </div>
                         <p className="text-lg font-black text-slate-900">{designResult.typography?.fontFamily || 'Inter'}</p>
                         <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">{designResult.typography?.letterSpacing || 'normal'} tracking</p>
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                         <div className="flex items-center gap-2 mb-3">
                            <Move size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">word spacing</span>
                         </div>
                         <p className="text-lg font-black text-slate-900 lowercase italic">{designResult.typography?.wordSpacing || 'normal'}</p>
                         <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">focus: whitespace</p>
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                         <div className="flex items-center gap-2 mb-3">
                            <Maximize2 size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">case logic</span>
                         </div>
                         <p className="text-lg font-black text-slate-900 lowercase italic">{designResult.typography?.caseStyle || 'normal'}</p>
                         <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">style emphasis</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b pb-4 flex items-center gap-2">
                        <LayoutTemplate size={14} className="text-emerald-600" /> generated component tree
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                         {(designResult.components || []).map((comp, idx) => (
                           <div key={idx} className="group p-6 bg-slate-50 border border-slate-200 rounded-[28px] hover:border-emerald-300 transition-all">
                              <div className="flex justify-between items-center mb-4">
                                 <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{comp.name}</h5>
                                 <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full uppercase">optimized</span>
                              </div>
                              <div className="bg-slate-950 p-4 rounded-2xl mb-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                                 {comp.tailwind}
                              </div>
                              <p className="text-xs font-medium text-slate-500 lowercase leading-relaxed">
                                 {comp.explanation}
                              </p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-4 gap-4">
                      {(designResult.spacingSystem || []).map((space, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                           <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${(idx + 1) * 20}%` }}></div>
                           </div>
                           <span className="text-[8px] font-black text-slate-400 uppercase">{space}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UIDesignAgent;
