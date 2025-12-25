
import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw, 
  Search, 
  Clock, 
  Activity, 
  Zap, 
  AlertTriangle,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { TeamMember, PlannerSyncStatus } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';

const EmployeeManagement: React.FC = () => {
  const [employees] = useState<TeamMember[]>(INITIAL_MEMBERS.map(m => ({ ...m, status: 'Active' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const tdSync: PlannerSyncStatus = { lastSync: '12h ago', status: 'active', deltaCount: 89, mappingGaps: 3 };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Users className="text-blue-600" size={32} /> hr agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic">identity & time doctor governance</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 px-6 py-2 rounded-2xl flex items-center gap-4 shadow-sm">
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time Doctor Pulse</p>
                 <p className="text-[10px] font-bold text-slate-900 uppercase">Handshake: {tdSync.lastSync}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'}`}></div>
           </div>
          <button 
            onClick={triggerSync}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] lowercase tracking-wide shadow-xl hover:bg-blue-600 transition-all"
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-400" />}
            Sync Time Doctor
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="search members..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all lowercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">identity node</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">title</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-center">td status</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-right">governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">
                             {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 lowercase">{emp.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] text-slate-500 lowercase font-medium">{emp.role}</td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[9px] font-black uppercase tracking-widest">
                         <Activity size={10} /> Active Handshake
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                          View Actuals <ArrowUpRight size={12} className="inline ml-1" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Clock size={80} className="text-blue-400" />
              </div>
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 relative z-10">Identity Gaps</h4>
              <div className="space-y-4 relative z-10">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-sm font-black text-white">{tdSync.mappingGaps} Unmapped Users</p>
                    <p className="text-[10px] text-slate-400 italic mt-1 leading-relaxed">Time Doctor users detected without an internal RH identity node.</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                       Resolve Gaps
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <AlertTriangle size={14} className="text-amber-500" /> HR Alerts
              </h4>
              <div className="space-y-3">
                 <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-tight">Idle Violation</p>
                    <p className="text-[9px] text-red-500 italic mt-0.5">omar backend: 28% idle detected (Handshake 14:02)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
