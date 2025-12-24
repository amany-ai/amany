
import React, { useState, useRef } from 'react';
import { 
  Calculator, Zap, FileText, Download, AlertCircle, ShieldCheck, Database, 
  Smartphone, Globe, Layers, CheckCircle, Link as LinkIcon, Paperclip, X, 
  File, Info, FileSpreadsheet, ListChecks, ImageIcon, ShieldAlert, 
  BadgeCheck, Search, Activity, RefreshCw, Cpu, Brain, Terminal, Binary, Wind,
  FileArchive, ClipboardList, TrendingUp, DollarSign, Wallet, Share2, HelpCircle,
  Users, Monitor, UserCheck, Briefcase, ChevronRight, AlertTriangle, Upload,
  Scale, BookOpen, Calculator as CalcIcon
} from 'lucide-react';
import { runInitialScan, runFullSynthesis } from '../services/geminiService';
import { EstimationResult, MethodologyOption } from '../types';
import { ROWAD_ESTIMATION_RULES } from '../constants';
import * as htmlToImage from 'html-to-image';

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  url: string;
}

const DevBlueprint: React.FC = () => {
  const [inputDoc, setInputDoc] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [use22DayLogic, setUse22DayLogic] = useState(true);
  const [showLogicRules, setShowLogicRules] = useState(false);
  
  const [isProcessingInitial, setIsProcessingInitial] = useState(false);
  const [isProcessingSynthesis, setIsProcessingSynthesis] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const [initialScan, setInitialScan] = useState<{ scope: any, methodology_options: MethodologyOption[] } | null>(null);
  const [selectedMethodology, setSelectedMethodology] = useState<string | null>(null);
  const [result, setResult] = useState<EstimationResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const billRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result as string
        }]);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleInitialScan = async () => {
    if (!inputDoc.trim() && attachments.length === 0) return;
    
    setIsProcessingInitial(true);
    setInitialScan(null);
    setSelectedMethodology(null);
    setResult(null);

    const agents = ["Agent A: Scope Extractor", "Agent B: Methodology Selector"];
    for (const agent of agents) {
      setActiveAgent(agent);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const scan = await runInitialScan(inputDoc, attachments);
      setInitialScan(scan);
    } catch (error) {
      console.error("Initial scan error", error);
    } finally {
      setIsProcessingInitial(false);
      setActiveAgent(null);
    }
  };

  const handleFullSynthesis = async (methodology: string) => {
    if (!initialScan) return;
    setSelectedMethodology(methodology);
    setIsProcessingSynthesis(true);

    const agents = [
      "Agent C: Time Estimator", 
      "Agent D: Budget Planner", 
      "Agent E: Vendor Analyst", 
      "Agent F: Export Architect", 
      "Agent G: Validation Guard"
    ];

    for (const agent of agents) {
      setActiveAgent(agent);
      await new Promise(r => setTimeout(r, 1000));
    }

    try {
      const estimation = await runFullSynthesis({
        input: inputDoc,
        files: attachments,
        scope: initialScan.scope,
        methodology,
        use22DayLogic
      });
      setResult(estimation);
    } catch (error) {
      console.error("Synthesis error", error);
    } finally {
      setIsProcessingSynthesis(false);
      setActiveAgent(null);
    }
  };

  const exportBill = async () => {
    if (!billRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(billRef.current, { 
        quality: 1.0,
        backgroundColor: '#ffffff',
        fontEmbedCSS: '',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `rowaad-mesh-bill-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const resetEstimator = () => {
    setInputDoc('');
    setAttachments([]);
    setInitialScan(null);
    setSelectedMethodology(null);
    setResult(null);
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Calculator className="text-emerald-600" size={32} /> Estimator Mesh
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">7-agent sovereign production node</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowLogicRules(!showLogicRules)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] lowercase tracking-wide transition-all ${showLogicRules ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <Scale size={14} className="inline mr-2" /> View Sovereign Laws
          </button>
          <button 
            onClick={resetEstimator}
            className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 font-black text-[10px] lowercase tracking-wide hover:bg-slate-200 transition-all"
          >
            Reset Node
          </button>
          {result && (
            <button 
              onClick={exportBill}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl hover:bg-emerald-700 transition-all"
            >
              <Download size={16} /> Agent F: Full Export
            </button>
          )}
        </div>
      </header>

      {/* SOVEREIGN LAWS PANEL */}
      {showLogicRules && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-[24px]">
            <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CalcIcon size={14} /> Effort Formulas
            </h4>
            <ul className="space-y-2 text-[10px] font-bold text-amber-700 lowercase italic">
              <li>• Dashboard = Backend × 0.2</li>
              <li>• QA = 10d + 3d × (Platforms - 1)</li>
              <li>• Web Standard = 30d (Base)</li>
              <li>• Reuse Library = -40% build effort</li>
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[24px]">
            <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <DollarSign size={14} /> Artisan Rates (Monthly)
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-bold text-emerald-700">
               <span>BE: $18k</span> <span>FE: $17k</span>
               <span>AD: $18k</span> <span>iOS: $18k</span>
               <span>QA: $14k</span> <span>PM: $16k</span>
               <span>BA: $12k</span> <span>AM: $12k</span>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-[24px]">
            <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} /> Agent Chain
            </h4>
            <ul className="space-y-1 text-[9px] font-bold text-blue-700 lowercase italic">
               <li>A: Scope Extractor</li>
               <li>B: Methodology Selector</li>
               <li>C: Time Estimator</li>
               <li>D: Budget Planner</li>
               <li>E: Integration Designer</li>
               <li>F: Export Architect</li>
               <li>G: Validation Guard</li>
            </ul>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-xl">
             <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={14} /> Agent G Mandate
             </h4>
             <p className="text-[9px] font-medium leading-relaxed opacity-80 lowercase italic">
               Agent G validates all math. if platform scope = 0, effort and cost MUST be 0. ensures VAT calculation (15%) is strictly separate from labor node.
             </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Configuration */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest lowercase">Artisan Input</label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                 <div className="px-4 py-2 text-[10px] font-black lowercase bg-white shadow-sm text-slate-900 rounded-lg">BRD/MD Bridge</div>
              </div>
            </div>

            <textarea 
              value={inputDoc}
              onChange={(e) => setInputDoc(e.target.value)}
              className="w-full h-48 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed mb-6 font-inter"
              placeholder={`Paste your requirements for Agent A...`}
              disabled={initialScan !== null}
            />

            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest lowercase mb-3">Support Docs</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer transition-all mb-4"
              >
                <Upload size={20} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest lowercase">Upload Specs / Assets</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
              
              <div className="space-y-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{file.name}</span>
                    </div>
                    <button onClick={() => removeAttachment(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Logic Node</span>
                <button 
                  onClick={() => setUse22DayLogic(!use22DayLogic)}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${use22DayLogic ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}
                >
                  {use22DayLogic ? '22-Day Model' : '30-Day Calendar'}
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed">Financials: Artisan Node Default Rates Active.</p>
            </div>

            {!initialScan && (
              <button 
                onClick={handleInitialScan}
                disabled={isProcessingInitial || (!inputDoc.trim() && attachments.length === 0)}
                className="w-full bg-black text-white py-5 rounded-3xl font-black lowercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
              >
                {isProcessingInitial ? <RefreshCw className="animate-spin" /> : <Binary size={20} className="text-emerald-400" />}
                {isProcessingInitial ? `Executing ${activeAgent}...` : 'Start Initial Scan (Agents A+B)'}
              </button>
            )}

            {initialScan && !result && (
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-700 uppercase mb-2">
                    <CheckCircle size={14} /> Scope Captured
                  </div>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase">{initialScan?.scope?.project_name || 'Project Unnamed'}</p>
               </div>
            )}
          </div>
        </div>

        {/* Dynamic Output Column */}
        <div className="xl:col-span-2 space-y-8">
          {!initialScan && !isProcessingInitial && (
            <div className="bg-white border border-slate-200 rounded-[40px] p-24 shadow-sm h-full flex flex-col justify-center items-center text-center">
              <Brain size={48} className="text-slate-100 mb-6" />
              <h3 className="text-xl font-black text-slate-900 mb-2 lowercase tracking-tighter">Mesh Awaiting Handshake</h3>
              <p className="text-slate-400 font-medium italic lowercase max-w-xs">Waiting for requirement input to trigger Agents A & B.</p>
            </div>
          )}

          {isProcessingInitial && (
             <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse lowercase">{activeAgent}...</h3>
                <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">Scanning Context & Files</p>
             </div>
          )}

          {initialScan && !result && !isProcessingSynthesis && (
            <div className="space-y-8 animate-in zoom-in-95">
               <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm border-b-4 border-emerald-500">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                     <Layers size={20} className="text-emerald-500" /> Agent B: Methodology Decision Point
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {initialScan?.methodology_options?.map((opt) => (
                        <button 
                           key={opt.type}
                           onClick={() => handleFullSynthesis(opt.type)}
                           className="p-8 rounded-[32px] text-left transition-all border-2 bg-slate-50 border-slate-100 hover:border-emerald-500 hover:bg-white hover:shadow-2xl group flex flex-col h-full"
                        >
                           <h5 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-tighter">{opt.type}</h5>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-6 flex-1 italic">{opt.justification.toLowerCase()}</p>
                           <div className="space-y-2 mb-6">
                              <p className="text-[9px] font-black text-emerald-600 uppercase">Pros: {opt.pros.toLowerCase()}</p>
                              <p className="text-[9px] font-black text-red-400 uppercase">Cons: {opt.cons.toLowerCase()}</p>
                           </div>
                           <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between items-center group-hover:text-emerald-600 transition-colors">
                              <span className="text-[9px] font-black uppercase tracking-widest">Select Logic</span>
                              <ChevronRight size={16} />
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {isProcessingSynthesis && (
             <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse lowercase">{activeAgent}...</h3>
                <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">Executing Agent G Validation Nodes</p>
             </div>
          )}

          {result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               {/* Agent G: Compliance Guardrail */}
               <div className={`p-8 rounded-[32px] border-2 shadow-sm ${result?.validation?.status === 'pass' ? 'bg-emerald-50 border-emerald-500/20' : 'bg-red-50 border-red-500/20'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className={result?.validation?.status === 'pass' ? 'text-emerald-600' : 'text-red-600'} size={18} /> Agent G: Logic Audit
                    </h4>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${result?.validation?.status === 'pass' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                       {result?.validation?.status || 'fail'}
                    </span>
                  </div>
                  {result?.validation?.status === 'pass' && (
                     <div className="mb-4 flex flex-wrap gap-2">
                        {['dashboard_ratio', 'qa_platform_scale', 'reuse_discount', 'vat_separation', 'node_headcount'].map(law => (
                           <div key={law} className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-emerald-200">
                              <CheckCircle size={10} /> {law.replace('_', ' ')} verified
                           </div>
                        ))}
                     </div>
                  )}
                  {result?.validation?.issues && result.validation.issues.length > 0 ? (
                    <div className="space-y-4">
                       {result.validation.issues.map((issue, idx) => (
                         <div key={idx} className="p-4 bg-white rounded-2xl border border-red-100 flex gap-4">
                            <AlertTriangle className="text-red-500 shrink-0" size={16} />
                            <div>
                               <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight mb-1">{issue.rule}</p>
                               <p className="text-[11px] text-slate-500 font-medium italic lowercase leading-relaxed mb-3">{issue.impact}</p>
                               <div className="flex flex-wrap gap-2">
                                  {issue.fix_steps?.map((step, i) => (
                                    <span key={i} className="text-[8px] bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100 font-bold lowercase italic">{step}</span>
                                  ))}
                               </div>
                               {issue.missing_user_inputs && issue.missing_user_inputs.length > 0 && (
                                  <div className="mt-2 text-[9px] font-black text-red-700 uppercase">
                                     Missing: {issue.missing_user_inputs.join(', ')}
                                  </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-700 font-medium italic lowercase">Agent G has confirmed all math and logic nodes match sovereign standards.</p>
                  )}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Monitor size={16} className="text-blue-500" /> Production Nodes
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(result?.effort_days || {}).filter(([_, val]) => (val as number) >= 0).map(([key, val]) => (
                          <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}</p>
                             <p className={`text-lg font-black ${val === 0 ? 'text-slate-300' : 'text-slate-900'}`}>{val as number}d</p>
                          </div>
                       ))}
                    </div>
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-[28px] text-center">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Duration Handshake</p>
                        <p className="text-3xl font-black text-blue-900">{result?.duration_working_days || 0} Working Days</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Share2 size={16} className="text-emerald-500" /> Verified Vendors
                     </h4>
                     <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {result?.integrations?.map((int, i) => (
                           <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                              <div className="flex justify-between items-start mb-2">
                                 <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{int.vendor}</p>
                                 <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{int.complexity}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium mb-2 italic lowercase">{int.type}</p>
                              <div className="flex justify-between items-center">
                                 <p className="text-[9px] font-black text-emerald-600 uppercase">Effort: {int.effort_days}d</p>
                                 <Info size={12} className="text-slate-300" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div ref={billRef} className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-2xl relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none grayscale select-none">
                     <svg viewBox="0 0 100 100" className="w-[500px] h-[500px] text-slate-900 fill-current">
                       <text x="50" y="60" textAnchor="middle" fontSize="40" fontWeight="900">ROWAAD MESH</text>
                     </svg>
                  </div>

                  <div className="relative z-10">
                     <header className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-10">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center text-white font-black text-3xl">rm</div>
                           <div>
                             <h5 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Rowaad Production Hub</h5>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Sovereign Estimator Node</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-900 uppercase">EST-VER: v7.0</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Logic: {selectedMethodology}</p>
                        </div>
                     </header>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-6">
                           <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4 mb-6">Artisan Capacity</h6>
                           <div className="space-y-4">
                              {Object.entries(result?.team || {}).filter(([_, count]) => (count as number) > 0).map(([role, count]) => (
                                 <div key={role} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div>
                                       <p className="text-xs font-black text-slate-800 uppercase">{role}</p>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">${result?.rates_monthly?.[role]?.toLocaleString() || 0}/mo</p>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{count as number} Units</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="flex flex-col">
                           <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4 mb-6">Financial Synthesis</h6>
                           <div className="flex-1 space-y-6 flex flex-col justify-center">
                              <div className="flex justify-between items-end">
                                 <span className="text-[10px] font-black text-slate-400 uppercase">Monthly Capacity</span>
                                 <span className="text-2xl font-black text-slate-900">${result?.budget?.monthly_cost?.toLocaleString() || 0}</span>
                              </div>
                              <div className="flex justify-between items-end text-slate-400">
                                 <span className="text-[10px] font-black uppercase">Project Subtotal</span>
                                 <span className="text-2xl font-black text-slate-600">${result?.budget?.project_cost?.toLocaleString() || 0}</span>
                              </div>
                              <div className="flex justify-between items-end text-slate-400">
                                 <span className="text-[10px] font-black uppercase">VAT (15%)</span>
                                 <span className="text-sm font-bold text-slate-500">${result?.budget?.vat_amount?.toLocaleString() || 0}</span>
                              </div>
                              <div className="bg-emerald-600 p-8 rounded-[32px] text-white shadow-xl shadow-emerald-500/20 mt-6">
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm font-black uppercase tracking-tighter">Total Sovereign Quote</span>
                                    <span className="text-4xl font-black tracking-tighter">${result?.budget?.total_with_vat?.toLocaleString() || 0}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 bg-slate-50 rounded-[32px] mb-12 border border-slate-100">
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Artisan Assumptions</h6>
                        <ul className="grid grid-cols-2 gap-4">
                           {result?.assumptions?.map((ass, i) => (
                              <li key={i} className="text-[9px] text-slate-500 font-bold leading-relaxed lowercase italic flex gap-2">
                                 <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div> {ass}
                              </li>
                           ))}
                        </ul>
                     </div>

                     <footer className="pt-10 border-t-2 border-slate-900 text-center">
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em] mb-4">Sovereign OS • CR: 1010000000</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase">This blueprint is synthesized via 7-agent artisan mesh and validated by Agent G node.</p>
                     </footer>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[32px] p-8 text-white border border-blue-900/30">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={18} /> Agent F: Playwright Export Protocol
                    </h4>
                    <span className="text-[9px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg uppercase">Python Node</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 font-medium lowercase italic leading-relaxed">
                      Implementation for full-page high-fidelity capture of the estimator bill.
                    </p>
                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5 overflow-x-auto max-h-[300px] custom-scrollbar">
                       <pre className="text-blue-300 font-mono text-[10px] leading-relaxed">{result?.export_plan?.code_snippet}</pre>
                    </div>
                  </div>
               </div>

               {result?.human_summary && (
                  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" /> Human Summary
                     </h4>
                     <div className="prose prose-slate max-w-none text-xs text-slate-600 font-medium leading-loose">
                        {result.human_summary}
                     </div>
                  </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevBlueprint;
