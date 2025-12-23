
import React, { useState } from 'react';
import { WORKFLOW_RULES } from '../constants';
import { ShieldCheck, Info, HelpCircle, Clock, GitBranch, Cpu, AlertCircle, CheckCircle, Zap, ShieldAlert } from 'lucide-react';

const PolicyCenter: React.FC = () => {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const toggleAck = (id: string) => {
    setAcknowledged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const timeDoctorDetails = [
    {
      id: 'idle',
      title: 'Idle Time Monitoring',
      limit: 'Below 25%',
      icon: <Clock size={20} />,
      desc: 'Active monitoring of keyboard/mouse interactions. Sessions exceeding 25% idle time trigger automatic HR alerts.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[0]
    },
    {
      id: 'git',
      title: 'GitLab Daily Commit Pulse',
      limit: '1+ Commit/Day',
      icon: <GitBranch size={20} />,
      desc: 'Every Time Doctor session must correlate with at least one GitLab commit. Ghost sessions are not permitted.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[1]
    },
    {
      id: 'ai',
      title: 'Windsurf AI Integration',
      limit: 'Mandatory',
      icon: <Cpu size={20} />,
      desc: 'Coding tasks must utilize the Windsurf AI Bridge for architectural consistency and security auditing.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[2]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <ShieldCheck className="text-emerald-500" size={32} /> Work Rules
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Operational standards for the 22-day production lifecycle.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Global Policy Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {/* Time Doctor Core Rules */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-black rounded-[40px] overflow-hidden shadow-2xl border border-emerald-900/30">
            <div className="bg-emerald-500 px-10 py-6 flex items-center justify-between">
              <h3 className="font-black text-black flex items-center gap-3 uppercase tracking-tighter text-sm">
                <Clock size={20} />
                Time Doctor Compliance Matrix
              </h3>
              <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-4 py-1.5 rounded-full">Automated Enforcement</span>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {timeDoctorDetails.map((detail) => (
                <div key={detail.id} className="relative group">
                  <div className={`p-6 rounded-[32px] border transition-all h-full flex flex-col ${
                    acknowledged[detail.id] ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {detail.icon}
                    </div>
                    <h4 className="text-white font-black text-xs uppercase tracking-tight mb-2">{detail.title}</h4>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">{detail.limit}</p>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-6 flex-1">
                      {detail.desc}
                    </p>
                    <button 
                      onClick={() => toggleAck(detail.id)}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        acknowledged[detail.id] 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {acknowledged[detail.id] ? 'Rule Acknowledged' : 'Accept Protocol'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-emerald-900/10 p-8 border-t border-emerald-900/20">
               <div className="flex gap-4 items-start">
                  <AlertCircle className="text-emerald-500 shrink-0" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold leading-loose uppercase tracking-widest">
                    Violations of the idle threshold or missing daily commits result in immediate "System Lockout" for the developer node. Obstacles must be raised via the Bridge Alerts system.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* DoD Gate */}
        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter text-sm">
              <CheckCircle size={20} className="text-emerald-500" />
              Definition of Done (DoD)
            </h3>
          </div>
          <div className="p-8 flex-1 space-y-3">
            {WORKFLOW_RULES.DOD_CHECKLIST.map((item, i) => (
              <label key={i} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-emerald-100">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    defaultChecked={i < 3} 
                  />
                </div>
                <span className="text-xs font-black text-slate-700 group-hover:text-emerald-900 uppercase tracking-tight">{item}</span>
              </label>
            ))}
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100">
             <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl">
                Submit Quality Gate Audit
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
          <div className="bg-slate-900 px-8 py-6">
            <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tighter text-sm">
              <ShieldAlert size={20} className="text-red-500" />
              Raising Red Flags
            </h3>
          </div>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "SRS & Design Desync",
              "Dead API Endpoints",
              "Missing UI Assets",
              "Task Orphan (Unassigned)",
              "Nafath Integration Fail",
              "Time Doctor Sync Error"
            ].map((flag, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border border-slate-100 rounded-3xl hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                  <HelpCircle size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-tight">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-600 rounded-[40px] p-10 text-black shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap size={240} />
           </div>
           <div className="relative z-10">
              <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">Operations Integrity</h3>
              <p className="text-emerald-950 text-sm font-bold leading-relaxed mb-8 max-w-md">
                Rowaad’s production speed relies on 100% adherence to these nodes. By utilizing the Windsurf AI Bridge, we ensure all native code meets A21 standards.
              </p>
              <div className="flex gap-4">
                 <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                    Download Policy PDF
                 </button>
                 <button className="bg-emerald-400/50 border border-emerald-700/20 text-emerald-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all">
                    Contact OPS HR
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCenter;
