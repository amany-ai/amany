
import React, { useState, useEffect } from 'react';
import { Project, Language, GitLabUpdate } from '../types';
import { getProjectInsights } from '../services/geminiService';
import ActivitySentinel from './ActivitySentinel';
import { TrendingUp, AlertTriangle, GitPullRequest, Activity, Zap, Server, Database, Smartphone, GitBranch, History, Terminal } from 'lucide-react';
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
      const data = await getProjectInsights(project);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [project]);

  // Simulate periodic fetching of git logs
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const progress = (project.currentDay / project.totalDays) * 100;

  return (
    <div className="p-4 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{t.command_center}</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Rowaad Internal Node • Laravel 11 & Self-Hosted MongoDB Vitality</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.cycle_progress}</p>
              <p className="text-2xl font-black text-black">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:border-emerald-500/20 transition-all">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="text-emerald-500" size={14} /> {t.ai_analysis}
            </h3>
            {loading ? <div className="animate-pulse h-24 bg-slate-50 rounded-2xl" /> : (
              <p className="text-sm font-bold text-slate-700 leading-relaxed border-l-4 border-emerald-500 pl-4">
                {insights?.statusSummary || "Awaiting Laravel daily sync cycle..."}
              </p>
            )}
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={14} /> {t.risk_matrix}
            </h3>
            <ul className="space-y-3">
              {(insights?.alerts || ["Scanning Internal Nodes..."]).slice(0, 3).map((a: any, i: number) => (
                <li key={i} className="text-[11px] font-bold text-slate-500 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1 shrink-0"></div> {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="text-emerald-500" size={14} /> {t.stack_vitality}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-2">
                  <Server size={12} className="text-emerald-500" /> Laravel 11 Node
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-2">
                  <Database size={12} className="text-emerald-500" /> Internal MongoDB
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-2">
                  <Smartphone size={12} className="text-emerald-500" /> Native Mobile
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivitySentinel />
        </div>
      </div>

      {/* RECENT GIT COMMIT LOGS SECTION */}
      <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm mb-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <GitBranch className="text-emerald-500" size={20} /> Recent Git Commit Logs
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Direct stream from internal GitLab repositories</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isSyncing ? 'Syncing...' : 'Nodes Connected'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {project.gitUpdates.map((log: GitLabUpdate) => (
            <div key={log.id} className="bg-slate-50/50 hover:bg-white border-2 border-transparent hover:border-emerald-100 p-6 rounded-[32px] transition-all group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-emerald-400 font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                    {log.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <History size={10} className="text-slate-400" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{log.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Terminal size={10} className="text-emerald-600" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{log.repo}</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed line-clamp-2">
                  {log.message}
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-emerald-600">+{log.linesAdded}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-red-500">-{log.linesRemoved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white border-2 border-slate-100 rounded-[50px] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center px-12">
            <h3 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">22-Day Production Lifecycle</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100">
                 <Zap size={12} fill="currentColor" /> Artisan Workflow
               </div>
            </div>
          </div>
          <div className="p-12">
            <div className="relative h-16 bg-slate-100 rounded-full flex items-center p-2 shadow-inner">
              <div 
                className="h-full bg-black rounded-full transition-all duration-1000 flex items-center justify-end px-8 relative group border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20"
                style={{ width: `${progress}%` }}
              >
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{t.day} {project.currentDay} / 22</span>
              </div>
            </div>
            <div className="grid grid-cols-4 mt-10">
               {['Phase 1: Deep BA', 'Phase 2: Base Coding', 'Phase 3: Integration', 'Phase 4: Smoke Test'].map((p, i) => (
                 <div key={p} className={`text-center px-4 ${language === 'ar' ? 'border-l' : 'border-r'} last:border-0 border-slate-100`}>
                    <p className={`text-[10px] font-black uppercase mb-2 ${i <= 1 ? 'text-emerald-600' : 'text-slate-300'}`}>Node 0{i+1}</p>
                    <p className={`text-xs font-black uppercase tracking-widest ${i <= 1 ? 'text-black' : 'text-slate-300'}`}>{p}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="bg-black rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-900/30">
           <div className="relative z-10">
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <GitPullRequest size={14} /> {t.gitlab_pulse}
              </h3>
              <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                 {project.gitUpdates.map(update => (
                   <div key={update.id} className="border-b border-white/5 pb-4 last:border-0">
                     <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{update.author}</p>
                       <p className="text-[8px] text-slate-500 font-bold">{update.timestamp}</p>
                     </div>
                     <p className="text-[11px] text-slate-300 truncate font-medium">{update.message}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
