
import React, { useState } from 'react';
import { 
  Share2, RefreshCw, ExternalLink, ShieldCheck, Database, Key, 
  Settings, Terminal, CheckCircle2, AlertTriangle, Cpu, Globe,
  Lock, ArrowRight, Code, Zap, Clock, Link as LinkIcon, Copy, Check, Server, Hash, Activity, Users, Layout
} from 'lucide-react';
import { NotificationSettings } from '../types';

interface IntegrationsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'auth' | 'blueprint' | 'config'>('config');
  const [copied, setCopied] = useState<string | null>(null);

  const [zohoConfig, setZohoConfig] = useState({
    portalId: 'rhnetsa', // Updated to match user's portal
    numericId: '72491000',
    clientId: '1000.XXXXXXXXXXXXXXXXXXXXXX',
    clientSecret: '••••••••••••••••••••••••••••••••',
    redirectUri: 'https://hub.rh.net.sa/api/v1/auth/zoho/callback'
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const SYSTEM_BASE_URL = "https://hub.rh.net.sa/api/v1";

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Share2 className="text-emerald-600" size={32} /> API Bridge Console
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">إدارة الربط الآمن مع بوابة rhnetsa</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['config', 'console', 'auth', 'blueprint'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'config' ? 'Zoho Setup' : (tab === 'console' ? 'Endpoints' : tab)}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <Key className="text-blue-600" /> Zoho Identity Settings
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Portal Identifier</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        value={zohoConfig.portalId}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none font-bold text-slate-900 cursor-not-allowed"
                      />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OAuth Scopes Required</label>
                    <div className="flex flex-wrap gap-2">
                       {['ZohoProjects.projects.READ', 'ZohoProjects.users.READ', 'ZohoProjects.tasks.ALL'].map(scope => (
                         <span key={scope} className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">{scope}</span>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                       <CheckCircle2 size={16} />
                       <p className="text-xs font-black uppercase">Handshake Status</p>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium lowercase italic">OAuth token verified for portal 'rhnetsa'. user pool extraction node is ready.</p>
                 </div>

                 <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl">
                    Update Credentials
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                 <AlertTriangle size={200} className="text-amber-500" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-6 lowercase">لماذا لا تظهر قائمة المستخدمين؟</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-amber-500/50 transition-all">
                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ShieldCheck size={14} /> 1. OAuth Scopes Missing
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic lowercase">تأكد من أن تطبيقك في Zoho Developer Console يحتوي على `ZohoProjects.users.READ`. بدون هذا النطاق، سيعيد النظام قائمة فارغة.</p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-all">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Globe size={14} /> 2. Portal ID Mismatch
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic lowercase">النظام يحاول الجلب من بوابتك (`rhnetsa`). إذا تغير الاسم البرمجي للبوابة، فلن تنجح عملية الربط.</p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-emerald-500/50 transition-all">
                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Activity size={14} /> 3. Data Sync Delay
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic lowercase">يتم تخزين المستخدمين في MongoDB Atlas. إذا لم تضغط على "Sync" في صفحة الـ HR، فلن تظهر البيانات في الواجهة.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={16} className="text-emerald-500" /> API Identity Cluster
                  </h3>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">node active</span>
               </div>
               <div className="p-2">
                  {[
                    { name: 'Zoho User Sync Node', url: `${SYSTEM_BASE_URL}/sync/zoho/users`, method: 'GET', target: 'rhnetsa Identity Pool' },
                    { name: 'Zoho Task Webhook', url: `${SYSTEM_BASE_URL}/webhooks/zoho/tasks`, method: 'POST', target: 'rhnetsa Workload' }
                  ].map((endpoint, i) => (
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
        </div>
      )}
    </div>
  );
};

export default Integrations;
