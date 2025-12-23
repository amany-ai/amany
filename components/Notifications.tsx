
import React from 'react';
import { Notification, NotificationSettings } from '../types';
import { Bell, CheckCircle, Clock, AlertTriangle, MessageSquare, Hash, Settings, Check, X, ShieldAlert } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  onMarkRead, 
  onClearAll,
  settings,
  onUpdateSettings
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  const getIcon = (type: Notification['type'], source: Notification['source']) => {
    if (source === 'Slack') return <MessageSquare className="text-emerald-500" size={18} />;
    if (source === 'TimeDoctor') return <Clock className="text-emerald-500" size={18} />;
    
    switch (type) {
      case 'status': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'assignment': return <Hash className="text-blue-500" size={18} />;
      case 'deadline': return <ShieldAlert className="text-red-500" size={18} />;
      default: return <AlertTriangle className="text-amber-500" size={18} />;
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <Bell size={40} className="text-emerald-500" /> Notifications
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Real-time alerts from the Rowaad Bridge ecosystem.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl border transition-all ${showSettings ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-500'}`}
          >
            <Settings size={22} />
          </button>
          <button 
            onClick={onClearAll} 
            className="px-6 py-3 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
          >
            Clear Archive
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center">
               <Bell size={64} className="text-slate-100 mb-6" />
               <p className="font-black text-slate-300 uppercase tracking-widest text-xs">No active logs in the bridge node.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  className={`bg-white border rounded-3xl p-6 flex gap-6 transition-all group cursor-pointer ${
                    notif.read ? 'border-slate-100 opacity-60' : 'border-emerald-500/30 shadow-xl shadow-emerald-500/5 bg-emerald-50/10'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${notif.read ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50 border-emerald-200'}`}>
                    {getIcon(notif.type, notif.source)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{notif.source}</span>
                        {notif.type === 'deadline' && (
                          <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Critical</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{notif.timestamp}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${notif.read ? 'text-slate-600' : 'text-slate-900 font-black tracking-tight'}`}>
                      {notif.message}
                    </p>
                    {notif.channel && (
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-emerald-600">
                        <Hash size={12} /> {notif.channel}
                      </div>
                    )}
                  </div>
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-black rounded-[40px] p-10 text-white shadow-2xl border border-emerald-900/30">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tighter uppercase">
              <Settings className="text-emerald-500" /> Alert Logic
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Task Assignments', key: 'taskAssignments', desc: 'Alert when a new task node is assigned to your role.' },
                { label: 'Deadline Sentinel', key: 'deadlineApproaching', desc: 'Urgent 24-hour triggers for non-completed production tasks.' },
                { label: 'Status Handshakes', key: 'statusChanges', desc: 'Track when tasks move through the 22-day lifecycle.' },
                { label: 'System Vitals', key: 'systemAlerts', desc: 'Critical server and GitLab connectivity alerts.' }
              ].map((item) => (
                <div key={item.key} className="group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-500">{item.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed pr-4">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => toggleSetting(item.key as keyof NotificationSettings)}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key as keyof NotificationSettings] ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings[item.key as keyof NotificationSettings] ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[40px] p-10 text-black shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldAlert size={160} />
            </div>
            <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">Compliance Mode</h3>
            <p className="text-xs font-bold leading-relaxed mb-6 opacity-80">
              Notification archives are audited weekly to ensure Time Doctor and GitLab sync compliance.
            </p>
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Download Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
