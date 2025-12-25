
import React, { useState } from 'react';
import { 
  Briefcase, 
  RotateCcw,
  Clock, 
  Slack, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  Code, 
  Zap, 
  Cpu, 
  Layers, 
  Activity,
  UserCheck,
  Search,
  CheckCircle,
  FileText,
  Terminal,
  ArrowUpRight,
  Database,
  Hash
} from 'lucide-react';
import { PlannerSyncStatus, PlannerAllocation, AuditFinding, PortfolioHealth } from '../types';

const PlannerMesh: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'blueprint'>('console');
  const [isSyncing, setIsSyncing] = useState(false);
  const [approvedPlan, setApprovedPlan] = useState(false);

  // Target Slack Configuration
  const TARGET_SLACK_CHANNEL = "C0A5X58AEKB";
  const ZOHO_WEBHOOK_ENDPOINT = "zpsrF3qTxKfnMFD4mGt2o0pyi5bYPvFEzsiDHx8YEFH4rqiV9BzzyUOoxn9RXFFL8ZxrATyf03AwR";

  // Mock Data - Only Zoho for Planner Agent
  const syncs: Record<string, PlannerSyncStatus> = {
    zoho: { lastSync: 'Real-time (Webhook)', status: 'active', deltaCount: 142, mappingGaps: 0 }
  };

  const allocations: PlannerAllocation[] = [
    { id: '1', memberId: '4', memberName: 'omar backend', hours: 38, project: 'production portal', priority: 'High', isOverCapacity: false },
    { id: '2', memberId: '5', memberName: 'khalid android', hours: 42, project: 'native refresh', priority: 'High', isOverCapacity: true },
    { id: '3', memberId: '7', memberName: 'sara qa', hours: 30, project: 'core node', priority: 'Medium', isOverCapacity: false },
  ];

  const auditFindings: AuditFinding[] = [
    { id: 'a1', agent: 'Agent 6: Audit', severity: 'Warning', message: 'User "khalid android" is overcapacity in Zoho workload (42h/40h).', fixSteps: ['Move 2h to PM Queue', 'Re-assign support task'] },
  ];

  const portfolioHealth: PortfolioHealth[] = [
    { pmName: 'PM-Node-01', score: 92, utilization: 88, missedDeadlines: 0, blockers: 1 },
    { pmName: 'PM-Node-02', score: 74, utilization: 98, missedDeadlines: 2, blockers: 4 },
  ];

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Briefcase className="text-indigo-600" size={32} /> Planner Agent Mesh
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">zoho projects workload orchestrator</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['console', 'blueprint'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'console' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Node Pulse */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-indigo-500" /> Zoho Workload Vitality
              </h4>
              <div className="space-y-4">
                {Object.entries(syncs).map(([key, sync]) => (
                  <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{key}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Tasks Delta: +{sync.deltaCount} • {sync.lastSync}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={triggerSync}
                className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black lowercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl"
              >
                {isSyncing ? <RotateCcw className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-400" />}
                Sync Zoho Node
              </button>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={100} className="text-indigo-500" />
               </div>
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 relative z-10">Agent G Workload Sentinel</h4>
               <div className="space-y-4 relative z-10">
                  {auditFindings.map(finding => (
                    <div key={finding.id} className={`p-4 rounded-2xl border ${finding.severity === 'Critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                       <p className="text-[10px] font-black text-white uppercase tracking-tight mb-1">{finding.message}</p>
                       <p className="text-[9px] text-slate-400 italic mb-3">Agent: {finding.agent}</p>
                       <div className="flex flex-wrap gap-2">
                          {finding.fixSteps.map((step, i) => (
                            <span key={i} className="text-[8px] bg-white/10 px-2 py-1 rounded-lg font-bold lowercase italic">{step}</span>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Allocation Handshake */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Layers size={18} className="text-indigo-500" /> Weekly Task Allocation
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Rule: 40h Capacity • 10% Support Reserve</p>
                  </div>
                  {!approvedPlan && (
                    <button 
                      onClick={() => setApprovedPlan(true)}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-[10px] lowercase shadow-xl hover:bg-emerald-700 transition-all"
                    >
                      Approve & Push to #{TARGET_SLACK_CHANNEL}
                    </button>
                  )}
                  {approvedPlan && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-emerald-100">
                       <CheckCircle size={14} /> Plan Synced to {TARGET_SLACK_CHANNEL}
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                  {allocations.map(alloc => (
                    <div key={alloc.id} className={`p-6 rounded-[24px] border transition-all ${alloc.isOverCapacity ? 'border-red-500/20 bg-red-50/30' : 'border-slate-100 bg-slate-50'}`}>
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <p className="text-sm font-black text-slate-900 lowercase">{alloc.memberName}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{alloc.project}</p>
                          </div>
                          <div className="text-right">
                             <p className={`text-xl font-black ${alloc.isOverCapacity ? 'text-red-600' : 'text-slate-900'}`}>{alloc.hours}h</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase">of 40h capacity</p>
                          </div>
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${alloc.isOverCapacity ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min((alloc.hours / 40) * 100, 100)}%` }}
                          ></div>
                       </div>
                       {alloc.isOverCapacity && (
                         <p className="text-[9px] text-red-600 font-black uppercase mt-3 flex items-center gap-1">
                           <AlertTriangle size={10} /> Overcapacity Violation • Escalated to Agent G
                         </p>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <TrendingUp size={16} className="text-emerald-500" /> Portfolio Health Node
                  </h4>
                  <div className="space-y-6">
                     {portfolioHealth.map(health => (
                        <div key={health.pmName} className="group">
                           <div className="flex justify-between items-end mb-2">
                              <div>
                                 <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{health.pmName}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Utilization: {health.utilization}%</p>
                              </div>
                              <span className={`text-lg font-black ${health.score > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{health.score}%</span>
                           </div>
                           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${health.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${health.score}%` }}></div>
                           </div>
                           <div className="mt-3 flex gap-4">
                              <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Missed: {health.missedDeadlines}</span>
                              <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Blockers: {health.blockers}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Slack size={16} className="text-indigo-500" /> Slack Channel Sync
                  </h4>
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-[24px]">
                     <div className="relative">
                        <Slack size={32} className="text-slate-200 mb-4" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Node:</p>
                     <p className="text-xs font-black text-indigo-600 tracking-tighter flex items-center gap-1 mb-4">
                        <Hash size={12} /> {TARGET_SLACK_CHANNEL}
                     </p>
                     <button className="mt-2 text-[10px] font-black text-indigo-600 uppercase border-b border-indigo-200 pb-0.5 hover:text-indigo-800 transition-colors">
                       View Block Kit Preview
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'blueprint' && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
           <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Terminal size={20} className="text-indigo-500" /> Implementation Blueprint (PHP 8.2+ Laravel 11)
              </h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">A. Moloquent Models (MongoDB)</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-indigo-300">{`<?php

namespace App\\Models;

use MongoDB\\Laravel\\Eloquent\\Model;

class Task extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'tasks';

    protected $fillable = [
        'zoho_id', 
        'title', 
        'owner_id', 
        'priority', 
        'planned_hours',
        'sync_source'
    ];

    /**
     * Cast NoSQL date nodes
     */
    protected $casts = [
        'due_date' => 'datetime'
    ];
}
`}</pre>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">B. Webhook & Slack Logic</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-emerald-300">{`<?php

namespace App\\Services;

use App\\Models\\Task;
use Illuminate\\Support\\Facades\\Http;

class PlannerService
{
    /**
     * Agent 1: Real-time Webhook Persistence
     * Target: /api/webhooks/zoho/${ZOHO_WEBHOOK_ENDPOINT}
     */
    public function handleZohoWebhook(array $data)
    {
        return Task::updateOrCreate(
            ['zoho_id' => $data['id']],
            [
                'title' => $data['name'],
                'sync_source' => 'webhook_realtime'
            ]
        );
    }

    /**
     * Push to Slack Channel C0A5X58AEKB
     */
    public function pushPlanToSlack(array $plan)
    {
        return Http::post(config('services.slack.webhook'), [
            'channel' => 'C0A5X58AEKB',
            'blocks' => $this->buildBlockKit($plan)
        ]);
    }
}
`}</pre>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[32px] p-10 text-white border border-indigo-900/30">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Cpu size={20} /> Sovereign Architecture (Laravel 11)
              </h4>
              <div className="bg-black/50 p-8 rounded-[24px] border border-white/5 font-mono text-[11px] text-indigo-300">
<pre>{`{
  "stack": "Laravel 11 + MongoDB Atlas",
  "auth": "JWT Internal Node Protocol",
  "webhooks": {
    "zoho_endpoint": "zpsrF3qTxKfnMFD4mGt2o0pyi5bYPvFEzsiDHx8YEFH4rqiV9BzzyUOoxn9RXFFL8ZxrATyf03AwR",
    "persistence": "moloquent_upsert"
  },
  "slack_node": {
    "target_channel": "C0A5X58AEKB",
    "protocol": "Block Kit v2.0"
  },
  "laws": {
    "capacity_hours": 40,
    "support_reserve_pct": 0.10,
    "db_driver": "mongodb-moloquent"
  }
}`}</pre>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PlannerMesh;
