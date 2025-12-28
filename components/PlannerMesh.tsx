
import React, { useState } from 'react';
import { 
  Briefcase, 
  RotateCcw,
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  UserCheck,
  Zap, 
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { PlannerAllocation } from '../types';
import { TEAM_MEMBERS } from '../constants'; // Simulating access to the central roster

const PlannerMesh: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'blueprint'>('console');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'fetching' | 'success'>('idle');

  // Logic to simulate getting the "latest" roster from HR Agent
  const currentRoster = TEAM_MEMBERS;

  const triggerSync = () => {
    setIsSyncing(true);
    setSyncStatus('fetching');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1500);
  };

  const allocations: PlannerAllocation[] = [
    { id: '1', memberId: 'marwa-be', memberName: 'Marwa Mahmoud', hours: 38, project: 'backend architecture', priority: 'High', isOverCapacity: false },
    { id: '2', memberId: 'hamza-fe', memberName: 'hamza talha', hours: 42, project: 'frontend refactor', priority: 'High', isOverCapacity: true },
    { id: '3', memberId: 'nuha-am', memberName: 'Nuha Mekkawy', hours: 30, project: 'client coordination', priority: 'Medium', isOverCapacity: false },
  ];

  return (
    <div className="p-8 max-w-7xl auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Briefcase className="text-indigo-600" size={32} /> Planner Agent Mesh
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">وكيل تخطيط الموارد وسعة الفريق</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={triggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl transition-all ${
              syncStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'
            }`}
          >
            {isSyncing ? <RotateCcw className="animate-spin" size={14} /> : (syncStatus === 'success' ? <UserCheck size={14} /> : <Users size={14} />)}
            {isSyncing ? 'fetching nodes...' : (syncStatus === 'success' ? 'mesh updated' : 'sync hr roster')}
          </button>
          
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            {(['console', 'blueprint'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSubTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {activeSubTab === 'console' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={18} className="text-indigo-500" /> Resource Mapping Sub-Agent
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Workload distribution synced with HR Identity node</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {allocations.map(alloc => (
                    <div key={alloc.id} className={`p-6 rounded-[24px] border transition-all ${alloc.isOverCapacity ? 'border-red-500/20 bg-red-50/30' : 'border-slate-100 bg-slate-50'}`}>
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
                               {alloc.memberName.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 lowercase">{alloc.memberName}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{alloc.project}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-xl font-black ${alloc.isOverCapacity ? 'text-red-600' : 'text-slate-900'}`}>{alloc.hours}h</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase">of 40h capacity</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
             <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Zap size={60} className="text-indigo-500" />
                </div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Capacity Overview</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Human Nodes</p>
                      <p className="text-2xl font-black text-white">{currentRoster.length}</p>
                      <p className="text-[8px] text-indigo-400 font-bold uppercase">Synced from HR Agent</p>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mesh Vitality</p>
                      <div className="flex items-center gap-2">
                         <TrendingUp className="text-emerald-500" size={14} />
                         <span className="text-xs font-black text-white">Optimal Utilization</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <AlertTriangle className="text-amber-500" size={14} /> Capacity Alerts Sub-Agent
                </h4>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-[10px] font-black text-amber-900 uppercase">High Load Node</p>
                   <p className="text-[11px] text-amber-700 font-medium italic mt-1">Hamza Talha exceeds 40h production cap.</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'blueprint' && (
        <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm animate-in slide-in-from-right-4">
           <div className="flex items-center gap-4 mb-10">
              <Clock className="text-indigo-600" size={24} />
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Resource Timeline Node</h3>
           </div>
           <div className="h-64 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-center text-slate-400 italic">
              Timeline visualization node initializing...
           </div>
        </div>
      )}
    </div>
  );
};

export default PlannerMesh;
