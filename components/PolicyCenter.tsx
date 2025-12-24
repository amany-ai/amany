
import React, { useState } from 'react';
import { WORKFLOW_RULES } from '../constants';
import { ShieldCheck, Clock, GitBranch, Cpu, AlertCircle, CheckCircle, Zap, ShieldAlert } from 'lucide-react';

const PolicyCenter: React.FC = () => {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const toggleAck = (id: string) => {
    setAcknowledged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const timeDoctorDetails = [
    {
      id: 'idle',
      title: 'idle time monitoring',
      limit: 'below 25%',
      icon: <Clock size={20} />,
      desc: 'active monitoring of keyboard/mouse interactions. sessions exceeding 25% idle time trigger automatic hr alerts.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[0]
    },
    {
      id: 'git',
      title: 'gitlab daily commit pulse',
      limit: '1+ commit/day',
      icon: <GitBranch size={20} />,
      desc: 'every time doctor session must correlate with at least one gitlab commit. ghost sessions are not permitted.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[1]
    },
    {
      id: 'ai',
      title: 'windsurf ai integration',
      limit: 'mandatory',
      icon: <Cpu size={20} />,
      desc: 'coding tasks must utilize the windsurf ai bridge for architectural consistency and security auditing.',
      rule: WORKFLOW_RULES.TIME_DOCTOR_RULES[2]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter generous-spacing lowercase">
            <ShieldCheck className="text-emerald-500" size={32} /> work rules
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic generous-spacing">operational standards for the 22-day production lifecycle.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-6 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest lowercase generous-spacing">global policy active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-emerald-900/30">
            <div className="bg-emerald-500 px-10 py-6 flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-3 lowercase tracking-tighter text-sm generous-spacing">
                <Clock size={20} />
                time doctor compliance matrix
              </h3>
              <span className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-1.5 rounded-full lowercase generous-spacing">automated enforcement</span>
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
                    <h4 className="text-white font-black text-xs lowercase tracking-tight mb-2 generous-spacing">{detail.title}</h4>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 generous-spacing">{detail.limit}</p>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-6 flex-1 lowercase generous-spacing">
                      {detail.desc}
                    </p>
                    <button 
                      onClick={() => toggleAck(detail.id)}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all generous-spacing lowercase ${
                        acknowledged[detail.id] 
                        ? 'bg-emerald-500 text-slate-900' 
                        : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {acknowledged[detail.id] ? 'rule acknowledged' : 'accept protocol'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
            <h3 className="font-black text-slate-900 flex items-center gap-3 lowercase tracking-tighter text-sm generous-spacing">
              <CheckCircle size={20} className="text-emerald-500" />
              definition of done (dod)
            </h3>
          </div>
          <div className="p-8 flex-1 space-y-3">
            {WORKFLOW_RULES.DOD_CHECKLIST.map((item, i) => (
              <label key={i} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-emerald-100">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                  defaultChecked={i < 3} 
                />
                <span className="text-xs font-black text-slate-700 group-hover:text-emerald-900 lowercase tracking-tight generous-spacing">{item}</span>
              </label>
            ))}
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100">
             <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl generous-spacing lowercase">
                submit quality gate audit
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
          <div className="bg-slate-900 px-8 py-6">
            <h3 className="font-black text-white flex items-center gap-3 lowercase tracking-tighter text-sm generous-spacing">
              <ShieldAlert size={20} className="text-red-500" />
              raising red flags
            </h3>
          </div>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "srs & design desync",
              "dead api endpoints",
              "missing ui assets",
              "task orphan (unassigned)",
              "nafath integration fail",
              "time doctor sync error"
            ].map((flag, i) => (
              <div key={i} className="flex items-center gap-4 p-5 border border-slate-100 rounded-3xl hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-tight generous-spacing lowercase">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-600 rounded-[40px] p-10 text-slate-900 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <h3 className="text-4xl font-black mb-4 tracking-tighter lowercase generous-spacing">operations integrity</h3>
              <p className="text-slate-900 text-sm font-bold leading-relaxed mb-8 max-w-md lowercase generous-spacing italic">
                rowaad’s production speed relies on 100% adherence to these nodes. by utilizing the windsurf ai bridge, we ensure all native code meets a21 standards.
              </p>
              <div className="flex gap-4">
                 <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl generous-spacing lowercase">
                    policy pdf
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCenter;
