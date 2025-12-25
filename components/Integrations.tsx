
import React, { useState } from 'react';
import { 
  Share2, RefreshCw, ExternalLink, ShieldCheck, Database, Key, 
  Settings, Terminal, CheckCircle2, AlertTriangle, Cpu, Globe,
  Lock, ArrowRight, Code, Zap, Clock, Link as LinkIcon
} from 'lucide-react';
import { NotificationSettings } from '../types';

interface IntegrationsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Integrations: React.FC<IntegrationsProps> = () => {
  const [syncingNode, setSyncingNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'blueprint' | 'auth'>('status');

  const handleSync = (node: string) => {
    setSyncingNode(node);
    setTimeout(() => setSyncingNode(null), 3000);
  };

  const ZOHO_WEBHOOK_ID = "zpsrF3qTxKfnMFD4mGt2o0pyi5bYPvFEzsiDHx8YEFH4rqiV9BzzyUOoxn9RXFFL8ZxrATyf03AwR";

  const nodes = [
    { id: 'zoho', name: 'Zoho Projects (Webhook)', status: 'Active', lastSync: 'Real-time', version: 'v3.0', color: 'emerald', detail: 'Webhook: Active' },
    { id: 'td', name: 'Time Doctor', status: 'Active', lastSync: '12h ago', version: 'v1.1', color: 'blue', detail: 'REST Sync' },
    { id: 'slack', name: 'Slack Bridge', status: 'Active', lastSync: 'Real-time', version: 'Webhooks', color: 'indigo', detail: 'C0A5X58AEKB' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Share2 className="text-emerald-600" size={32} /> Integration Agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">Sovereign API Handshake Registry</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {(['status', 'auth', 'blueprint'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'status' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nodes.map((node) => (
                <div key={node.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-12 h-12 bg-${node.color}-50 rounded-2xl flex items-center justify-center border border-${node.color}-100`}>
                      <Database className={`text-${node.color}-500`} size={24} />
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 lowercase">connected</span>
                       <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{node.version}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1 lowercase tracking-tight">{node.name}</h3>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-4 flex items-center gap-1">
                    <LinkIcon size={12} /> {node.detail}
                  </p>
                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>Heartbeat</span>
                       <span className="text-slate-900">{node.lastSync}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${node.color}-500 w-[100%] animate-pulse`}></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleSync(node.id)}
                      disabled={syncingNode === node.id}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black lowercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl"
                    >
                      {syncingNode === node.id ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} className="text-amber-400" />}
                      Sync Delta
                    </button>
                    <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Cpu size={180} />
               </div>
               <div className="relative z-10">
                  <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Agent Logic Console</h4>
                  <h3 className="text-3xl font-black tracking-tighter mb-8 lowercase">Laravel API Handshake Logic</h3>
                  <div className="space-y-6">
                     {[
                       { rule: "Webhook Persistence", desc: "Zoho Webhook (zpsrF3...) events are prioritized for real-time task mapping in the Moloquent layer." },
                       { rule: "JWT Node Auth", desc: "Internal API calls require a Bearer token issued by the Laravel 11 authentication node." },
                       { rule: "Nafath Gateway", desc: "Identity verification is synchronized via the Nafath OAuth2 bridge before project access." }
                     ].map((logic, i) => (
                       <div key={i} className="flex gap-6 items-start">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-emerald-400 font-black text-xs">{i+1}</div>
                          <div>
                             <p className="text-sm font-black text-white lowercase tracking-tight">{logic.rule}</p>
                             <p className="text-xs text-slate-400 font-medium italic leading-relaxed mt-1">{logic.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <AlertTriangle size={14} className="text-amber-500" /> Webhook Events
                </h4>
                <div className="space-y-4">
                   <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-xs font-black text-emerald-900 lowercase">Event: Task_Created</p>
                      <p className="text-[10px] text-emerald-700 italic mt-1">Source: Webhook Endpoint {ZOHO_WEBHOOK_ID.substring(0, 8)}...</p>
                      <div className="mt-2 text-[9px] font-bold text-emerald-600 bg-white/50 px-2 py-1 rounded-lg">Mapped to MongoDB in 14ms</div>
                   </div>
                </div>
             </div>

             <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-500/20">
                <h4 className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">Node Health</h4>
                <div className="flex justify-between items-end">
                   <p className="text-4xl font-black tracking-tighter">99.8%</p>
                   <span className="text-[10px] font-bold uppercase mb-1">Webhook Connectivity</span>
                </div>
                <div className="mt-6 h-1 w-full bg-white/20 rounded-full">
                   <div className="h-full bg-white w-[99.8%]"></div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'blueprint' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
            <header className="flex justify-between items-end mb-10 border-b pb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter lowercase">Agent 1: Zoho Webhook Controller</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 tracking-widest">Laravel 11 Handler for Event zpsrF3...</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">php 8.2+</span>
                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">laravel 11</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Database size={16} /> A. Webhook Receiver Logic
                </h4>
                <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[450px] custom-scrollbar">
<pre className="text-emerald-400">{`<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use App\\Models\\Task;

class ZohoWebhookController extends Controller
{
    /**
     * Handle Zoho Webhook Events
     * Endpoint: /api/webhooks/zoho/${ZOHO_WEBHOOK_ID}
     */
    public function handle(Request $request)
    {
        $payload = $request->json()->all();
        
        // Validation of Zoho-Specific Signature
        if (!$this->isValidSignature($request)) {
            return response()->json(['error' => 'invalid_node'], 403);
        }

        $taskData = $payload['task'];

        // Moloquent Real-time Persistence
        Task::updateOrCreate(
            ['zoho_id' => $taskData['id']],
            [
                'title' => $taskData['name'],
                'owner_email' => $taskData['owner'],
                'status' => $taskData['status_node'],
                'sync_source' => 'webhook'
            ]
        );

        return response()->json(['status' => 'acknowledged']);
    }
}
`}</pre>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Clock size={16} /> B. Event Mapping Engine
                </h4>
                <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[450px] custom-scrollbar">
<pre className="text-blue-300">{`<?php

namespace App\\Services;

class ZohoMappingAgent
{
    public function processEvent(array $payload)
    {
        // 1. Log Raw Payload to MongoDB Audit Collection
        \\Log::channel('mongodb')->info('Zoho Webhook Recv', $payload);

        // 2. Dispatch to Planner Agent for Overcapacity Check
        if ($payload['action'] === 'task_assigned') {
            PlannerOrchestrator::dispatch($payload['task_id']);
        }
        
        // 3. Trigger Slack Notify via Channel C0A5X58AEKB
        SlackNotifier::send("New Task Node: " . $payload['task']['name']);
    }
}
`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auth' && (
        <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm animate-in zoom-in-95">
           <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                 <Lock size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 lowercase">Sovereign Auth Node</h3>
              <p className="text-slate-400 font-medium italic mb-12 lowercase">Managing Webhook Tokens and API Nodes.</p>
              
              <div className="space-y-4 text-left">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Zoho Webhook Token</label>
                    <div className="relative group">
                       <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                       <input 
                         type="text" 
                         defaultValue={ZOHO_WEBHOOK_ID}
                         readOnly
                         className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 py-5 outline-none font-mono text-xs text-slate-500"
                       />
                    </div>
                 </div>
                 {['MongoDB Atlas URI', 'Laravel App Key', 'Nafath Client Secret'].map((field) => (
                    <div key={field} className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{field}</label>
                       <div className="relative group">
                          <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                          <input 
                            type="password" 
                            defaultValue="••••••••••••••••••••"
                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                          />
                       </div>
                    </div>
                 ))}
                 <button className="w-full mt-8 bg-black text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                    Update Production Config <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
