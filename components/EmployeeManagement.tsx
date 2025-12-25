
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
  ArrowUpRight,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  BarChart3
} from 'lucide-react';
import { TeamMember, PlannerSyncStatus } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';

const EmployeeManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'compliance' | 'blueprint'>('roster');
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
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Users className="text-blue-600" size={32} /> HR Agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">Identity & Time Doctor Governance</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['roster', 'compliance', 'blueprint'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search members..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all lowercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Identity Node</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Title</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-center">TD Status</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-right">Governance</th>
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
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 relative z-10">Time Doctor Pulse</h4>
                <div className="space-y-4 relative z-10">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-sm font-black text-white">{tdSync.mappingGaps} Unmapped Users</p>
                      <p className="text-[10px] text-slate-400 italic mt-1 leading-relaxed">External Time Doctor nodes detected without internal ID mapping.</p>
                      <button 
                        onClick={triggerSync}
                        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-400" />}
                        Execute Sync
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
      )}

      {activeSubTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="text-blue-600" /> Compliance Metrics
             </h3>
             <div className="space-y-6">
                {[
                  { label: 'Idle Limit Compliance', val: '94%', color: 'blue' },
                  { label: 'Commit Frequency Node', val: '88%', color: 'emerald' },
                  { label: 'Identity Handshake Rate', val: '100%', color: 'indigo' }
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                       <span className={`text-lg font-black text-${metric.color}-600`}>{metric.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${metric.color}-500`} style={{ width: metric.val }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={160} />
             </div>
             <h3 className="text-3xl font-black tracking-tighter mb-4 lowercase">Agent H: Governance</h3>
             <p className="text-blue-100 text-sm font-medium leading-relaxed mb-10 italic max-w-sm">
                Automatically auditing Time Doctor screenshots and idle data against A21 productivity nodes.
             </p>
             <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl">
                Download Audit History
             </button>
          </div>
        </div>
      )}

      {activeSubTab === 'blueprint' && (activeSubTab === 'blueprint' && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
           <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Terminal size={20} className="text-blue-500" /> Time Doctor Node.js Integration Blueprint
              </h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">A. Time Doctor Mongoose Schema</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-blue-400">{`// models/TimeLog.js
import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
    td_user_id: { type: String, required: true },
    rh_identity_node: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    start_time: Date,
    end_time: Date,
    idle_minutes: Number,
    is_compliant: { type: Boolean, default: true },
    sync_batch: String
}, { timestamps: true });

export default mongoose.model('TimeLog', TimeLogSchema);
`}</pre>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">B. Sync & Compliance Logic</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-emerald-300">{`// services/timeDoctorService.js
import axios from 'axios';
import TimeLog from '../models/TimeLog.js';

export const syncTimeDoctorNode = async () => {
    const response = await axios.get(process.env.TIME_DOCTOR_URL, {
        headers: { 'Authorization': \`Bearer \${process.env.TD_KEY}\` }
    });

    for (const log of response.data.entries) {
        const idlePercent = (log.idle / log.total) * 100;
        
        await TimeLog.create({
            td_user_id: log.userId,
            idle_minutes: log.idle,
            is_compliant: idlePercent < 25,
            sync_batch: \`sync_\${Date.now()}\`
        });

        if (idlePercent > 25) {
            triggerHRAudit(log.userId, idlePercent);
        }
    }
};
`}</pre>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[32px] p-10 text-white border border-blue-900/30">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Cpu size={20} /> HR Agent Sovereign Architecture
              </h4>
              <div className="bg-black/50 p-8 rounded-[24px] border border-white/5 font-mono text-[11px] text-blue-300">
<pre>{`{
  "stack": "Node.js (Express) + MongoDB Atlas",
  "integration": {
    "provider": "Time Doctor v1.1",
    "endpoint": "https://api2.timedoctor.com/v1.1",
    "handshake_protocol": "REST/OAuth2"
  },
  "compliance_laws": {
    "max_idle_threshold": 0.25,
    "min_commits_per_session": 1,
    "audit_frequency": "Every 6 Hours"
  }
}`}</pre>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeManagement;
