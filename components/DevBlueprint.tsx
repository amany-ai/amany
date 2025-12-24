
import React, { useState, useRef } from 'react';
import { 
  Calculator, Zap, FileText, X, Paperclip, ImageIcon, RefreshCw, Cpu, Brain, Binary, Wind, FileArchive, ClipboardList
} from 'lucide-react';
import { scopeRequirements, calculateTimeline, auditEstimation } from '../services/geminiService';
import { EstimationResult } from '../types';
import * as htmlToImage from 'html-to-image';

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
  const [inputType, setInputType] = useState<'BRD' | 'MD'>('BRD');
  const [isWindsurf, setIsWindsurf] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files.map(f => ({ 
      name: f.name, 
      type: f.type || (f.name.endsWith('.md') ? 'text/markdown' : 'application/octet-stream'), 
      size: f.size 
    }))]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const runProjectManagerPipeline = async () => {
    if (!inputDoc.trim() && !googleDocLink && attachments.length === 0) return;
    
    setIsProcessing(true);
    setResult(null);
    setAuditResult(null);

    try {
      const scope = await scopeRequirements(inputDoc || googleDocLink || "Files attached", inputType === 'MD');
      const estimate = await calculateTimeline(scope, { isPremium: isPremiumWeb, isWindsurf });
      setResult(estimate);
      const audit = await auditEstimation(inputDoc, estimate, isWindsurf);
      setAuditResult(audit);
    } catch (error) {
      console.error("pipeline error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Calculator className="text-emerald-600" size={32} /> estimator agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase">automated timeline projection & cost logic</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-2.5 rounded-2xl shadow-sm">
           <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest lowercase">
             {isProcessing ? 'analyzing specs...' : 'system idle'}
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest lowercase">input specs</label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setInputType('BRD')}
                  className={`px-3 py-1.5 text-[9px] font-black lowercase rounded-lg transition-all ${inputType === 'BRD' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                >
                  standard
                </button>
                <button 
                  onClick={() => setInputType('MD')}
                  className={`px-3 py-1.5 text-[9px] font-black lowercase rounded-lg transition-all ${inputType === 'MD' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                >
                  technical
                </button>
              </div>
            </div>

            <textarea 
              value={inputDoc}
              onChange={(e) => setInputDoc(e.target.value)}
              className="w-full h-48 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed mb-6 font-inter"
              placeholder="paste requirements or user stories here..."
            />

            <button 
              onClick={runProjectManagerPipeline}
              disabled={isProcessing || (!inputDoc.trim() && !googleDocLink && attachments.length === 0)}
              className="w-full bg-black text-white py-5 rounded-3xl font-black lowercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="animate-spin" /> : <Binary size={20} className="text-emerald-400" />}
              {isProcessing ? 'analyzing...' : 'generate delivery plan'}
            </button>
          </div>
        </div>

        <div className="xl:col-span-2">
          {!result && !isProcessing ? (
             <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm h-full flex flex-col justify-center text-center">
                <Brain size={32} className="text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900 mb-2 lowercase tracking-tighter">awaiting spec analysis</h3>
                <p className="text-slate-400 font-medium italic lowercase">provide documentation to trigger the estimation logic</p>
             </div>
          ) : isProcessing ? (
             <div className="bg-black text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-10"></div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse lowercase">synthesizing timeline...</h3>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest lowercase">applying internal production laws</p>
             </div>
          ) : result && (
            <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm overflow-hidden relative animate-in zoom-in-95">
               <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                     <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 lowercase">duration</p>
                     <p className="text-4xl font-black text-emerald-900 lowercase">{result.totalDurationDays} days</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 lowercase">complexity</p>
                     <p className="text-4xl font-black text-white lowercase">{result.complexity}</p>
                  </div>
               </div>
               <div className="mt-12 bg-slate-950 text-emerald-500 rounded-3xl p-8 font-mono text-[11px] leading-relaxed">
                  <p className="text-white font-black mb-4 uppercase tracking-widest text-[9px] lowercase">// justification</p>
                  {result.justification.toLowerCase()}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevBlueprint;
