
import React, { useState, useRef } from 'react';
import { Calculator, Zap, FileText, Download, AlertCircle, ShieldCheck, Database, Smartphone, Globe, Layers, CheckCircle, Link as LinkIcon, Paperclip, X, File, Info } from 'lucide-react';
import { estimateSalesFromBRD } from '../services/geminiService';
import { ROWAD_ESTIMATION_RULES } from '../constants';
import { EstimationResult } from '../types';

interface AttachedFile {
  name: string;
  type: string;
  size: number;
}

const DevBlueprint: React.FC = () => {
  const [inputDoc, setInputDoc] = useState('');
  const [googleDocLink, setGoogleDocLink] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isPremiumWeb, setIsPremiumWeb] = useState(false);
  const [complexity, setComplexity] = useState<'Low' | 'Medium' | 'High'>('Low');
  // Fixed: typed result as EstimationResult | null instead of any | null to avoid unknown type errors
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type, size: f.size }))]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (!inputDoc.trim() && !googleDocLink && attachments.length === 0) return;
    setLoading(true);
    const data = await estimateSalesFromBRD(inputDoc, { 
      isPremiumWeb, 
      complexity,
      googleDocLink,
      attachments: attachments.map(a => a.name)
    });
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <Calculator className="text-emerald-600" size={32} /> Rowad Estimation Hub
          </h2>
          <p className="text-slate-500 mt-1">Calibrated AI estimation strictly following Rowad's internal technical methodology.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-2.5 rounded-2xl shadow-sm">
           <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] ${loading ? 'animate-ping' : ''}`}></div>
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={12} className="text-emerald-500" /> Saudi Compliance v2.7
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Requirement Core
              </label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-lg border border-slate-200 transition-all"
                title="Attach Methodology Documents"
              >
                <Paperclip size={14} />
              </button>
            </div>

            <textarea 
              value={inputDoc}
              onChange={(e) => setInputDoc(e.target.value)}
              className="w-full h-48 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 font-sans text-sm leading-relaxed mb-6"
              placeholder="Paste the Business Requirements Document text here..."
            />

            <div className="space-y-4 mb-8">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Google Doc Link"
                  value={googleDocLink}
                  onChange={(e) => setGoogleDocLink(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {attachments.map((file, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-2 relative group overflow-hidden">
                      <button 
                       onClick={() => removeAttachment(i)}
                       className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <X size={12} />
                      </button>
                      <div className="w-full h-10 flex items-center justify-center bg-white rounded-lg border border-slate-100">
                        <File size={16} className="text-emerald-500" />
                      </div>
                      <p className="text-[8px] font-black text-slate-500 mt-1 truncate px-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Website Tier</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  <button 
                    onClick={() => setIsPremiumWeb(false)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!isPremiumWeb ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setIsPremiumWeb(true)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${isPremiumWeb ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Premium (+20%)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Complexity Factor</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  {(['Low', 'Medium', 'High'] as const).map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setComplexity(lvl)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${complexity === lvl ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleProcess}
              disabled={loading || (!inputDoc.trim() && !googleDocLink && attachments.length === 0)}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Zap className="animate-spin text-amber-400" /> : <Calculator size={20} />}
              Calculate Rowad Estimate
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8">
             <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Database size={14} /> Reusable Repository
             </h3>
             <div className="flex flex-wrap gap-2">
                {ROWAD_ESTIMATION_RULES.REUSABLE_MODULES.map(m => (
                  <span key={m} className="px-3 py-1 bg-white border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                    {m}
                  </span>
                ))}
             </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2">
          {!result && !loading ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center opacity-60">
               <Layers size={80} className="text-slate-200 mb-6" />
               <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Estimator Idle</h3>
               <p className="text-slate-400 max-w-sm">Paste a BRD, add files or links to generate a technical quote calibrated for Rowad.</p>
             </div>
          ) : loading ? (
             <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 animate-pulse uppercase">AI Calibrating...</h3>
                <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Applying Rowad Production Laws</p>
             </div>
          ) : result && (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm">
                <header className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                   <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Technical Delivery Quote</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Projected Production Timeline</h3>
                   </div>
                   <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-emerald-600 transition-all shadow-xl">
                      <Download size={16} /> Export Internal Doc
                   </button>
                </header>
                
                <div className="grid grid-cols-2 gap-8 mb-12">
                   <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 group">
                      <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-2">Estimated Delivery</p>
                      <p className="text-4xl font-black text-emerald-900">{result.totalDurationDays} Days</p>
                      <p className="text-[9px] font-bold text-emerald-600/60 mt-2 uppercase flex items-center gap-1">
                        <CheckCircle size={10} /> Validated Methodology
                      </p>
                   </div>
                   <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
                      <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-2">Complexity Factor</p>
                      <p className="text-4xl font-black text-white">{result.complexity}</p>
                      <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Buffer applied correctly</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b pb-4 flex items-center gap-2">
                     <Layers size={14} className="text-emerald-600" /> Platform Breakdown
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {Object.entries(result.breakdown).map(([platform, days]) => (
                        <div key={platform} className="group">
                           <div className="flex justify-between items-end mb-2">
                              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{platform}</span>
                              <span className="text-xs font-black text-slate-900">{days}d</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                 className="h-full bg-emerald-600 rounded-full group-hover:bg-black transition-all" 
                                 style={{ width: `${(Number(days) / result.totalDurationDays) * 100}%` }}
                              ></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                   <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Smartphone size={14} className="text-blue-600" /> External Integrations
                      </h4>
                      <div className="space-y-2">
                        {result.externalIntegrations.map((item: string, i: number) => (
                          <div key={i} className="flex gap-2 items-center text-[11px] font-bold text-slate-600">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                             {item}
                          </div>
                        ))}
                      </div>
                      <p className="text-[8px] text-slate-400 mt-6 uppercase font-black italic">Note: Timeline excludes external delays.</p>
                   </div>

                   <div className="bg-white border border-slate-200 rounded-3xl p-8">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Info size={14} className="text-emerald-500" /> Validation Checklist
                      </h4>
                      <div className="space-y-2">
                        {result.validationChecklist && result.validationChecklist.map((item: string, i: number) => (
                          <div key={i} className="flex gap-2 text-[10px] font-bold text-slate-500 items-center">
                             <CheckCircle size={10} className="text-emerald-500" />
                             {item}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="mt-12 bg-slate-950 text-emerald-500 rounded-3xl p-8 font-mono text-[11px] leading-relaxed">
                   <p className="text-white font-black mb-4 uppercase tracking-widest text-xs">// ESTIMATION LOGIC LOG</p>
                   {result.justification}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevBlueprint;
