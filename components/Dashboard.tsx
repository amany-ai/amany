
import React, { useState, useEffect } from 'react';
import { Project, Language, GitLabUpdate } from '../types';
import { getProjectHealthInsights } from '../services/geminiService';
import ActivitySentinel from './ActivitySentinel';
import { TrendingUp, AlertTriangle, Activity, Zap, Server, Database, Smartphone, GitBranch, HardDrive, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface DashboardProps {
  project: Project;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ project, language }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getProjectHealthInsights(project);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [project]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const progress = (project.currentDay / project.totalDays) * 100;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter generous-spacing">{t.command_center}</h2>
          <p className="text-slate-400 mt-2 font-medium italic lowercase tracking-wide generous-spacing">workflow agent node • node vitality monitor</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-6">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest generous-spacing">cycle velocity</p>
              <p className="text-3xl font-black text-slate-900">{Math.round(progress)}%</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <Activity className="text-emerald-500" size={14} /> monitoring agent
            </h3>
            {loading ? <div className="animate-pulse h-24 bg-slate-50 rounded-2xl" /> : (
              <p className="text-sm font-bold text-slate-700 leading-relaxed generous-spacing">
                {insights?.statusSummary?.toLowerCase() || "awaiting artisan nightly pulse..."}
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <AlertTriangle className="text-amber-500" size={14} /> compliance agent
            </h3>
            <ul className="space-y-4">
              {(insights?.alerts || ["scanning regulatory nodes..."]).slice(0, 3).map((a: any, i: number) => (
                <li key={i} className="text-[11px] font-bold text-slate-500 flex gap-3 generous-spacing">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></div> {a.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <Zap className="text-emerald-500" size={14} /> node vitality
            </h3>
            <div className="space-y-5">
              {[
                { label: 'laravel node', icon: <Server size={14}/> },
                { label: 'atlas storage', icon: <HardDrive size={14}/> },
                { label: 'mongodb node', icon: <Database size={14}/> }
              ].map(stack => (
                <div key={stack.label} className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-600 tracking-tighter flex items-center gap-3 generous-spacing">
                    {stack.icon} {stack.label}
                  </span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivitySentinel />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[50px] p-12 shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <HardDrive size={180} className="text-emerald-500" />
        </div>
        <div className="relative z-10 flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 generous-spacing">
              <HardDrive className="text-emerald-500" size={24} /> file storage bridge: zoho / td
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 generous-spacing">artisan storage node monitoring</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl flex items-center gap-4">
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase">storage used</p>
                <p className="text-xs font-black text-white">42.8 gb / 512 gb</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-500" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { name: 'zoho_brd_final.pdf', source: 'zoho api', size: '2.4mb', status: 'secured' },
             { name: 'td_screenshot_14.png', source: 'time doctor', size: '890kb', status: 'audited' },
             { name: 'srs_v2_node.docx', source: 'internal', size: '1.1mb', status: 'secured' },
             { name: 'mada_gateway.p12', source: 'zoho webhook', size: '12kb', status: 'encrypted' }
           ].map((file, i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                <HardDrive size={18} className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-white truncate mb-1">{file.name}</p>
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase">{file.source}</span>
                   <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">{file.status}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
