
import React, { useState } from 'react';
import { BookOpen, Search, Send, FileText, CheckCircle, AlertTriangle, List, Calendar, SearchCode, Zap } from 'lucide-react';
import { analyzeSRS } from '../services/geminiService';

const SRSBriefing: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const result = await analyzeSRS(content);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <SearchCode className="text-emerald-500" size={32} /> SRS Analyzer
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Technical validation and 22-day feasibility auditing.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <FileText size={14} /> Specification Document
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste requirements, user stories, or full SRS text here to analyze against Rowaad standards..."
              className="w-full h-[450px] bg-slate-50 border border-slate-200 rounded-3xl p-8 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs leading-relaxed transition-all"
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="mt-6 w-full bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-2xl active:scale-95"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Zap size={20} className="text-emerald-400" />}
              Analyze Specifications
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {!analysis && !loading && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center text-slate-400 h-full flex flex-col justify-center items-center">
              <BookOpen size={64} className="mb-6 opacity-10 text-emerald-900" />
              <p className="font-black text-slate-300 uppercase tracking-widest text-xs max-w-xs leading-loose">
                Waiting for technical assets. Analyze an SRS to generate the 22-day feasibility report.
              </p>
            </div>
          )}

          {loading && (
             <div className="bg-black text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                <div className="relative z-10">
                   <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
                   <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse uppercase">Auditing Document...</h3>
                   <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">Cross-referencing A21 Node Roles</p>
                </div>
             </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <CheckCircle className="text-emerald-500" size={18} /> Feasibility Summary
                </h3>
                <div className="text-slate-700 text-sm font-medium leading-relaxed bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  {analysis.summary}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <AlertTriangle className="text-red-500" size={18} /> Technical Risks
                </h3>
                <ul className="space-y-3">
                  {analysis.risks.map((risk: string, i: number) => (
                    <li key={i} className="flex gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-600 text-white rounded-[32px] p-8 shadow-xl">
                 <h3 className="text-xs font-black mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <List size={18} className="text-black" /> A21 Workflow Projection
                 </h3>
                 <div className="space-y-3">
                    {analysis.suggestedTasks.map((task: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-black/10 rounded-2xl border border-white/10 hover:bg-black/20 transition-all group">
                        <div>
                           <p className="text-xs font-black tracking-tight">{task.title}</p>
                           <p className="text-[10px] text-emerald-100/70 font-bold uppercase tracking-widest mt-1">{task.phase} • {task.durationHours}h</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase border ${
                          task.priority === 'High' ? 'bg-red-500/20 border-red-400 text-red-100' : 'bg-white/10 border-white/20 text-white'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-4 bg-black text-emerald-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl">
                    Sync to Zoho Project <Send size={14} />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SRSBriefing;
