
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
          <p className="text-slate-400 mt-2 font-medium italic lowercase tracking-wide">rowaad internal node • laravel 11 & self-hosted mongodb vitality</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-6">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest generous-spacing">{t.cycle_progress}</p>
              <p className="text-3xl font-black text-slate-900">{Math.round(progress)}%</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <Activity className="text-emerald-500" size={14} /> {t.ai_analysis}
            </h3>
            {loading ? <div className="animate-pulse h-24 bg-slate-50 rounded-2xl" /> : (
              <p className="text-sm font-bold text-slate-700 leading-relaxed lowercase generous-spacing">
                {insights?.statusSummary?.toLowerCase() || "awaiting laravel daily sync cycle..."}
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <AlertTriangle className="text-amber-500" size={14} /> {t.risk_matrix}
            </h3>
            <ul className="space-y-4">
              {(insights?.alerts || ["scanning internal nodes..."]).slice(0, 3).map((a: any, i: number) => (
                <li key={i} className="text-[11px] font-bold text-slate-500 flex gap-3 lowercase generous-spacing">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></div> {a.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 generous-spacing">
              <Zap className="text-emerald-500" size={14} /> {t.stack_vitality}
            </h3>
            <div className="space-y-5">
              {[
                { label: 'laravel 11 node', icon: <Server size={14}/> },
                { label: 'internal mongodb', icon: <Database size={14}/> },
                { label: 'native mobile', icon: <Smartphone size={14}/> }
              ].map(stack => (
                <div key={stack.label} className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-3 generous-spacing">
                    {stack.icon} {stack.label}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivitySentinel />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[50px] p-12 shadow-sm mb-12 transition-all hover:shadow-md">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-4 generous-spacing">
              <GitBranch className="text-slate-900" size={24} /> gitlab pulse
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 generous-spacing">direct stream from internal gitlab repositories</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest generous-spacing">
              {isSyncing ? 'syncing node...' : 'synchronized'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {project.gitUpdates.map((log: GitLabUpdate) => (
            <div key={log.id} className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 p-8 rounded-[40px] transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs uppercase">
                    {log.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 tracking-tight lowercase generous-spacing">{log.author}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase generous-spacing">{log.timestamp}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 generous-spacing">{log.repo}</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed line-clamp-2 lowercase generous-spacing">
                  {log.message}
                </p>
              </div>
              <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                <span className="text-[10px] font-black text-emerald-600">+{log.linesAdded}</span>
                <span className="text-[10px] font-black text-slate-300">-{log.linesRemoved}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[60px] p-16 shadow-2xl transition-all hover:shadow-emerald-900/10">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 generous-spacing">22-day production lifecycle</h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest generous-spacing">standard protocol a21-v2</div>
          </div>
          
          <div className="relative h-20 bg-white/5 rounded-full flex items-center p-2 mb-12 shadow-inner">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 flex items-center justify-end px-10 relative shadow-lg shadow-emerald-500/20"
              style={{ width: `${progress}%` }}
            >
              <span className="text-xs font-black text-slate-900 generous-spacing">{t.day} {project.currentDay} / 22</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-12">
             {['deep ba', 'base coding', 'integration', 'smoke test'].map((p, i) => (
               <div key={p} className="text-center group">
                  <p className={`text-[10px] font-black uppercase mb-3 generous-spacing ${i <= 1 ? 'text-emerald-500' : 'text-slate-700'}`}>node 0{i+1}</p>
                  <p className={`text-xs font-black lowercase tracking-widest generous-spacing ${i <= 1 ? 'text-white' : 'text-slate-700'}`}>{p}</p>
                  <div className={`h-1 rounded-full mt-4 mx-auto w-10 transition-all ${i <= 1 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`}></div>
               </div>
             ))}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
