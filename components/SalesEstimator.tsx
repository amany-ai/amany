
import React, { useState } from 'react';
import { FileText, Calculator, DollarSign, Clock, ShieldAlert, Download, Zap } from 'lucide-react';
import { estimateSalesFromBRD } from '../services/geminiService';
import { EstimationResult } from '../types';

const SalesEstimator: React.FC = () => {
  const [brd, setBrd] = useState('');
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async () => {
    if (!brd) return;
    setLoading(true);
    const data = await estimateSalesFromBRD(brd);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <DollarSign className="text-emerald-600" size={32} /> Sales Estimation Bridge
          </h2>
          <p className="text-slate-500 mt-1">Convert BRD requirements into professional project quotes instantly.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Input BRD Content</label>
          <textarea 
            value={brd}
            onChange={(e) => setBrd(e.target.value)}
            className="w-full h-80 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 font-sans text-sm"
            placeholder="Paste Business Requirements Document content here..."
          />
          <button 
            onClick={handleEstimate}
            disabled={loading || !brd}
            className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
          >
            {loading ? <Zap className="animate-spin" /> : <Calculator size={20} />}
            Generate Sales Quote
          </button>
        </div>

        <div className="space-y-6">
          {!result && !loading ? (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center text-slate-400 h-full flex flex-col justify-center">
               <Calculator size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-medium">Waiting for BRD analysis...</p>
             </div>
          ) : loading ? (
             <div className="bg-white border border-slate-200 rounded-[32px] p-12 text-center h-full flex flex-col justify-center">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="font-bold text-slate-900 animate-pulse">AI Estimator is calculating role complexities...</p>
             </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Effort</p>
                   <p className="text-2xl font-black text-slate-900">{result.totalHours} Hours</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Complexity</p>
                   <p className={`text-2xl font-black ${result.complexity === 'High' ? 'text-red-600' : 'text-emerald-600'}`}>
                     {result.complexity}
                   </p>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl">
                 <h3 className="font-bold mb-6 flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" /> Role Breakdown (Estimated Hours)
                 </h3>
                 <div className="space-y-4">
                    {/* Fix: roleBreakdown is an array as defined in the GenAI schema and now in types.ts */}
                    {result.roleBreakdown.map((item) => (
                      <div key={item.role} className="flex justify-between items-center">
                         <span className="text-sm font-medium text-slate-400">{item.role}</span>
                         <div className="flex items-center gap-4 flex-1 mx-6">
                            <div className="h-1.5 bg-slate-800 rounded-full flex-1">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.hours / result.totalHours) * 100}%` }}></div>
                            </div>
                         </div>
                         <span className="text-sm font-bold">{item.hours}h</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                    <ShieldAlert size={16} className="text-amber-500" /> Risk Mitigation
                 </h3>
                 <ul className="space-y-2">
                    {result.risks.map((risk, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-2">
                        <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5"></div> {risk}
                      </li>
                    ))}
                 </ul>
              </div>

              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Download size={18} /> Export Sales Quote PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesEstimator;
