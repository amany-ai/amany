
import React, { useState } from 'react';
import { 
  Share2, RefreshCw, ExternalLink, ShieldCheck, Database, Key, 
  Settings, Terminal, CheckCircle2, AlertTriangle, Cpu, Globe,
  Lock, ArrowRight, Code, Zap, Clock, Link as LinkIcon, Copy, Check, Server, Hash, Activity, Users
} from 'lucide-react';
import { NotificationSettings } from '../types';

// Added interface for Integrations component props to fix type error in App.tsx
interface IntegrationsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'auth' | 'blueprint'>('console');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ZOHO_WEBHOOK_ID = "zpsrF3qTxKfnMFD4mGt2o0pyi5bYPvFEzsiDHx8YEFH4rqiV9BzzyUOoxn9RXFFL8ZxrATyf03AwR";
  const SYSTEM_BASE_URL = "https://hub.rh.net.sa/api/v1";

  const apiEndpoints = [
    { name: 'Zoho Webhook Receiver', url: `${SYSTEM_BASE_URL}/webhooks/zoho/${ZOHO_WEBHOOK_ID.substring(0, 8)}`, method: 'POST', target: 'Zoho Projects Settings' },
    { name: 'Zoho User Sync Node', url: `${SYSTEM_BASE_URL}/sync/zoho/users`, method: 'GET', target: 'Internal PM Dashboard' },
    { name: 'Time Doctor Auth Bridge', url: `${SYSTEM_BASE_URL}/auth/timedoctor/callback`, method: 'GET', target: 'TD Developer Portal' },
    { name: 'Sovereign Resource Sync', url: `${SYSTEM_BASE_URL}/sync/resources`, method: 'GET', target: 'Internal Pulse' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Share2 className="text-emerald-600" size={32} /> API Bridge Console
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">إدارة روابط الربط مع الأنظمة الخارجية</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {(['console', 'auth', 'blueprint'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'console' ? 'Endpoints' : tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={16} className="text-emerald-500" /> Public API Endpoints
                  </h3>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">system online</span>
               </div>
               <div className="p-2">
                  {apiEndpoints.map((endpoint, i) => (
                    <div key={i} className="p-6 hover:bg-slate-50 transition-all rounded-[24px] border border-transparent hover:border-slate-100 group">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="text-sm font-black text-slate-900 lowercase">{endpoint.name}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Target: {endpoint.target}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${endpoint.method === 'POST' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {endpoint.method}
                          </span>
                       </div>
                       <div className="flex items-center gap-2 bg-slate-900 p-4 rounded-2xl relative overflow-hidden group">
                          <code className="text-[10px] text-emerald-400 font-mono truncate flex-1">{endpoint.url}</code>
                          <button 
                            onClick={() => handleCopy(endpoint.url, `end-${i}`)}
                            className="text-slate-500 hover:text-white transition-colors"
                          >
                            {copied === `end-${i}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Users size={14} className="text-blue-500" /> Identity Heartbeat
                </h4>
                <div className="space-y-4">
                   <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs font-black text-blue-900 lowercase">zoho user pool: synced</p>
                      <p className="text-[10px] text-blue-700 italic mt-1">last pool sync: 2 minutes ago</p>
                   </div>
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
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter lowercase">routes/api.php - User Sync Node</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Laravel 11 Endpoint Definition</p>
              </div>
            </header>
            <div className="bg-slate-950 p-8 rounded-[24px] font-mono text-xs text-emerald-500 overflow-x-auto">
<pre>{`<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\ZohoSyncController;

Route::prefix('v1')->group(function () {
    
    // Manual/Scheduled User Pool Sync
    Route::get('/sync/zoho/users', [ZohoSyncController::class, 'syncUsers'])
         ->name('api.zoho.users.sync');

});
`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
