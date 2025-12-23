
import React from 'react';
import { LayoutDashboard, CheckCircle, Users, ShieldAlert, Share2, Bell, Cpu, Beaker, Lock, BookOpen, SearchCode, FileCode, Shield, Layout } from 'lucide-react';
import { UserRole, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  userRole: UserRole;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadCount, userRole, language }) => {
  const t = TRANSLATIONS[language];
  
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.FE_DEV, UserRole.BE_DEV, UserRole.ANDROID_DEV, UserRole.IOS_DEV, UserRole.QA, UserRole.DESIGNER] },
    { id: 'srs', label: t.srs, icon: <SearchCode size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA] },
    { id: 'blueprint', label: t.blueprint, icon: <Cpu size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'tasks', label: t.tasks, icon: <CheckCircle size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.FE_DEV, UserRole.BE_DEV, UserRole.ANDROID_DEV, UserRole.IOS_DEV, UserRole.QA, UserRole.DESIGNER] },
    { id: 'resources', label: t.resources, icon: <BookOpen size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'employees', label: t.employees, icon: <Users size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'frontend', label: t.frontend, icon: <Layout size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.FE_DEV, UserRole.DESIGNER] },
    { id: 'system-files', label: t.system_files, icon: <FileCode size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BE_DEV, UserRole.FE_DEV] },
    { id: 'vault', label: t.vault, icon: <Lock size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BE_DEV, UserRole.ANDROID_DEV, UserRole.IOS_DEV] },
    { id: 'testcenter', label: t.testcenter, icon: <Beaker size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.QA] },
    { id: 'integrations', label: t.integrations, icon: <Share2 size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'users', label: 'User Admin', icon: <Shield size={18} />, roles: [UserRole.ADMIN] },
    { id: 'notifications', label: t.notifications, icon: <Bell size={18} />, badge: unreadCount, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.QA] },
    { id: 'policy', label: t.policy, icon: <ShieldAlert size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.QA] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`w-64 bg-black h-screen flex flex-col text-slate-400 fixed left-0 border-r top-0 z-50 shadow-2xl border-emerald-900/30 transition-all duration-300`}>
      <div className="p-8 flex flex-col gap-4">
        <div className="group flex flex-col items-center gap-4">
          <div className="w-full bg-black p-4 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-all h-16 border border-white/5">
             {/* Rh Logo SVG */}
             <svg viewBox="0 0 100 100" className="h-full w-full text-white fill-current">
                <rect x="0" y="0" width="100" height="100" rx="22" fill="black" />
                <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="Inter, sans-serif" fill="white">Rh</text>
             </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">ROWAAD</h1>
            <p className="text-emerald-500 text-[8px] font-black tracking-[0.3em] uppercase mt-1">Sovereign OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-2 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                : 'hover:bg-emerald-900/20 hover:text-emerald-400'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} transition-colors`}>
              {item.icon}
            </div>
            <span className="font-black text-[11px] uppercase tracking-wider">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
               <span className={`ml-auto bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full`}>
                 {item.badge}
               </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-emerald-900/20 bg-black/50 backdrop-blur-sm">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/40 flex items-center justify-center text-[11px] font-black text-emerald-400 border border-emerald-900/30">
              {userRole.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{userRole}</p>
              <button onClick={() => window.location.reload()} className="text-[9px] text-emerald-600 font-bold hover:text-white transition-colors uppercase tracking-widest">
                {t.logout}
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
