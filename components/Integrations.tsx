
import React, { useState } from 'react';
import { Share2, MessageSquare, Clock, CheckCircle, ExternalLink, RefreshCw, Settings, Save, Power, Lock, Zap, Globe, Bell, ShieldCheck } from 'lucide-react';
import { IntegrationSettings, ServiceConnection, NotificationSettings } from '../types';

interface IntegrationsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ settings, onUpdateSettings }) => {
  const [internalSettings, setInternalSettings] = useState<IntegrationSettings>({
    maxIdleMinutes: 25,
    shiftStartTime: '09:00',
    slackAlertChannel: '#ops-alerts',
    reportingFrequency: 'Weekly'
  });

  const [connections, setConnections] = useState<ServiceConnection[]>([
    { 
      id: 'zoho', 
      name: 'Zoho Projects (rhnetsa)', 
      status: 'Connected', 
      lastSync: '2m ago' 
    },
    { 
      id: 'slack', 
      name: 'Slack (TMPJ0PBH6)', 
      status: 'Connected', 
      lastSync: 'Live' 
    },
    { 
      id: 'timedoctor', 
      name: 'Time Doctor V2', 
      status: 'Connected', 
      lastSync: '15m ago' 
    }
  ]);

  const portals = {
    zoho: "https://projects.zoho.com/portal/rhnetsa",
    timedoctor: "https://2.timedoctor.com/dashboard",
    slack: "https://app.slack.com/client/TMPJ0PBH6"
  };

  const openPortal = (id: keyof typeof portals) => {
    window.open(portals[id], '_blank');
  };

  const toggleNotif = (key: keyof NotificationSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <Share2 size={32} className="text-emerald-500" /> System Bridge Control
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Live synchronization between your Zoho, Slack, and Time Doctor instances.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
            <Lock size={16} /> API Keys
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all">
            <RefreshCw size={16} /> Full System Sync
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {connections.map((service) => (
          <div key={service.id} className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-8">
              <div className="p-5 bg-slate-50 rounded-3xl group-hover:bg-emerald-50 transition-colors">
                {service.id === 'zoho' && <CheckCircle className="text-emerald-500" />}
                {service.id === 'slack' && <MessageSquare className="text-emerald-500" />}
                {service.id === 'timedoctor' && <Clock className="text-emerald-500" />}
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Active
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{service.lastSync}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">{service.name}</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">
              Real-time webhook integration is active. Monitoring tasks and activity logs.
            </p>
            
            <button 
              onClick={() => openPortal(service.id as any)}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl"
            >
              Open System Portal <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-sm">
              <Settings size={20} className="text-emerald-500" />
              Production Automation Logic
            </h3>
            <button className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
              <Save size={16} /> Save Rules
            </button>
          </div>
          <div className="p-10 space-y-12">
            <section>
              <div className="flex justify-between items-center mb-6">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Idle Time Violation Threshold</label>
                 <span className="text-sm font-black text-emerald-600">{internalSettings.maxIdleMinutes}% Limit</span>
              </div>
              <input 
                type="range" min="10" max="50" 
                value={internalSettings.maxIdleMinutes}
                onChange={(e) => setInternalSettings({...internalSettings, maxIdleMinutes: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-4 font-medium leading-relaxed">
                If Time Doctor reports idle % above this, an automated warning will be sent to <strong>{internalSettings.slackAlertChannel}</strong> and the employee's DM.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Shift Config</h4>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Shift Compliance (UTC)</label>
                  <input 
                    type="time" 
                    value={internalSettings.shiftStartTime}
                    onChange={(e) => setInternalSettings({...internalSettings, shiftStartTime: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-mono text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 font-black"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">User Notifications</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Assignments', key: 'taskAssignments' },
                    { label: 'Deadlines', key: 'deadlineApproaching' },
                    { label: 'Handshakes', key: 'statusChanges' }
                  ].map(item => (
                    <div key={item.key} className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                      <button 
                        onClick={() => toggleNotif(item.key as keyof NotificationSettings)}
                        className={`w-10 h-5 rounded-full relative transition-all ${settings[item.key as keyof NotificationSettings] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${settings[item.key as keyof NotificationSettings] ? 'left-5.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={200} className="text-emerald-500" />
           </div>
           
           <div>
              <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-emerald-500/20">
                 <Zap className="text-black" />
              </div>
              <h4 className="text-3xl font-black mb-6 tracking-tighter uppercase">Bridge Diagnostics</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                Your production bridge is currently processing webhooks from <strong>rhnetsa</strong> nodes.
              </p>
              <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Incoming Events (Today)</span>
                    <div className="flex items-center gap-3 text-sm font-black text-emerald-400 tracking-tight">
                       <Globe size={14} /> 142 API Requests Processed
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Alerts Dispatched</span>
                    <div className="flex items-center gap-3 text-sm font-black text-emerald-400 tracking-tight">
                       <Bell size={14} /> 28 Node Notifications Sent
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-12 pt-10 border-t border-emerald-900/30">
              <button className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-emerald-500/10">
                 Download Security Audit (.csv)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
