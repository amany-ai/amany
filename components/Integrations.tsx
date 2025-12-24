
import React from 'react';
import { Share2, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { NotificationSettings } from '../types';

interface IntegrationsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Integrations: React.FC<IntegrationsProps> = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Share2 className="text-emerald-500" size={32} /> int. agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic">live system webhooks & api bridges</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl hover:bg-emerald-600 transition-all">
          <RefreshCw size={16} /> full node sync
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['zoho projects', 'slack bridge', 'time doctor'].map((node) => (
          <div key={node} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all">
             <div className="flex justify-between items-start mb-10">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                   <ShieldCheck className="text-emerald-500" size={20} />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 lowercase">active</span>
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-2 lowercase tracking-tight">{node}</h3>
             <p className="text-xs text-slate-400 font-medium mb-8 lowercase">bridge successfully connected to node.rhnetsa.local</p>
             <button className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-all lowercase">
                portal link <ExternalLink size={12} className="inline ml-1" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
