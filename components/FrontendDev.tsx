
import React, { useState } from 'react';
import { Layout, LayoutTemplate, Smartphone, Code, Zap, Cpu, Terminal, ShieldCheck, FileCode, CheckCircle2, Search, Link as LinkIcon, Upload, ArrowRight } from 'lucide-react';
import { generateFrontendBlueprint } from '../services/geminiService';
import { Project } from '../types';

interface FrontendDevProps {
  project: Project;
}

const FrontendDev: React.FC<FrontendDevProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'Architect' | 'Native-Sync' | 'Mock-Studio'>('Architect');
  const [requirement, setRequirement] = useState('');
  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    const result = await generateFrontendBlueprint(requirement);
    setBlueprint(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <Layout className="text-blue-600" size={32} /> Frontend Hub
          </h2>
          <p className="text-slate-500 mt-1 font-medium">React ESM, Tailwind CSS, and SwiftUI Native Interface Management.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['Architect', 'Native-Sync', 'Mock-Studio'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'Architect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Cpu className="text-blue-600" size={20} /> UI Workflow Mapper
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest leading-loose">
                Define your view requirements to generate React component trees and state stubs.
              </p>
              <textarea 
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="w-full h-64 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs leading-relaxed transition-all"
                placeholder="Example: Create a dashboard view with a sidebar, a search header, and a responsive grid of property cards..."
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !requirement}
                className="mt-6 w-full bg-black hover:bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? <Zap className="animate-spin text-amber-400" /> : <LayoutTemplate size={20} className="text-blue-400" />}
                Orchestrate Component Tree
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {!blueprint && !loading ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                    <Code size={32} className="text-slate-300" />
                 </div>
                 <h4 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Bridge Ready</h4>
                 <p className="text-slate-400 max-w-sm text-sm font-medium">System awaiting frontend UI requirements.</p>
              </div>
            ) : loading ? (
              <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center relative overflow-hidden shadow-2xl border border-blue-900/30">
                 <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
                    <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse uppercase">Mapping UI Node...</h3>
                    <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">Generating React ESM & SwiftUI View Stubs</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 h-full">
                <div className="bg-black rounded-[32px] p-8 text-blue-400 font-mono text-xs overflow-hidden h-full shadow-2xl border border-blue-900/30">
                   <div className="flex items-center gap-2 mb-6 border-b border-blue-900/30 pb-4">
                      <div className="w-3 h-3 bg-red-500/20 border border-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded-full"></div>
                      <span className="ml-4 text-white font-black tracking-widest uppercase text-[10px]">frontend_blueprint.tsx</span>
                   </div>
                   <div className="space-y-6 overflow-y-auto h-[400px] custom-scrollbar pr-4">
                      <p className="text-white font-black tracking-widest uppercase text-[10px] mb-2">// REACT COMPONENT TREE</p>
                      <div className="space-y-2">
                        {blueprint.components?.map((c: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="text-blue-400 font-bold">{'<'}</span>
                            <span className="text-emerald-400">{c.name}</span>
                            <span className="text-blue-400 font-bold">{' />'}</span>
                            <p className="text-[10px] text-slate-500 mt-1 italic">{c.description}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-white font-black tracking-widest uppercase text-[10px] mt-8 mb-2">// TAILWIND DESIGN STUBS</p>
                      <pre className="text-slate-300 bg-blue-950/20 p-4 rounded-xl border border-blue-900/20 whitespace-pre-wrap">{blueprint.tailwindStubs}</pre>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Native-Sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <Smartphone className="text-blue-600" /> SwiftUI Bridge
             </h3>
             <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl mb-8">
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                  "Native synchronization ensures all Figma designs are correctly mapped to SwiftUI 6.0 view components for the iOS production line."
                </p>
             </div>
             <div className="space-y-4">
                {blueprint?.swiftUIView ? (
                  <div className="bg-slate-950 rounded-[28px] p-8 border border-slate-800 overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source: View.swift</span>
                      <ShieldCheck className="text-blue-500" size={14} />
                    </div>
                    <pre className="text-blue-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">{blueprint.swiftUIView}</pre>
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[28px]">
                    <Smartphone size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No Native Code Processed</p>
                  </div>
                )}
             </div>
          </div>
          <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">XCode Sync Protocol</h3>
                <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80 mb-8">
                  Pushing generated view stubs directly to the internal GitLab native repository.
                </p>
                <div className="space-y-4">
                   {[
                     'Audit SwiftUI View Compatibility',
                     'Verify Tailwind Style Mapping',
                     'Link to Native API Handshake'
                   ].map((step, i) => (
                     <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                       <CheckCircle2 size={18} className="text-blue-200" />
                       <span className="text-xs font-black uppercase tracking-tight">{step}</span>
                     </div>
                   ))}
                </div>
             </div>
             <button className="relative z-10 w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl">
                Execute XCode Direct Sync <ArrowRight size={18} />
             </button>
          </div>
        </div>
      )}

      {activeTab === 'Mock-Studio' && (
        <div className="bg-black rounded-[40px] p-10 shadow-2xl overflow-hidden relative min-h-[500px] border border-blue-900/30">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-slate-400">
                <Terminal size={20} className="text-blue-500" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">frontend_mock_server_v1.0</span>
              </div>
           </div>
           <div className="space-y-6 font-mono text-sm leading-relaxed">
              <p className="text-blue-400 font-bold">$ bridge mock:start --port=8080</p>
              <p className="text-slate-500">Initializing JSON Mock Studio for Frontend Prototype...</p>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                 <p className="text-emerald-400">GET /api/v1/mock/dashboard_data</p>
                 <pre className="text-slate-400 mt-4 text-xs leading-loose">
{`{
  "status": "success",
  "data": {
    "vital_stats": [82, 95, 41],
    "nodes": ["A1", "A2", "A3"],
    "latency": "14ms"
  }
}`}
                 </pre>
              </div>
              <p className="text-blue-500 animate-pulse">Waiting for local request handshake...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default FrontendDev;
