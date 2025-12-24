
import React from 'react';
import { LayoutDashboard, Users, ShieldAlert, Share2, Bell, Calculator, BookOpen, ClipboardList } from 'lucide-react';
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
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.QA, UserRole.DESIGNER] },
    { id: 'blueprint', label: t.blueprint, icon: <Calculator size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SALES] },
    { id: 'tasks', label: t.tasks, icon: <ClipboardList size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.QA] },
    { id: 'resources', label: t.resources, icon: <BookOpen size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'employees', label: t.employees, icon: <Users size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'integrations', label: t.integrations, icon: <Share2 size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER] },
    { id: 'notifications', label: t.notifications, icon: <Bell size={18} />, badge: unreadCount, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.QA] },
    { id: 'policy', label: t.policy, icon: <ShieldAlert size={18} />, roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.BA, UserRole.QA] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white h-screen flex flex-col text-slate-500 fixed left-0 border-r border-slate-100 top-0 z-50 transition-all duration-300 font-inter">
      <div className="p-10 flex flex-col gap-4">
        <div className="group flex flex-col items-center gap-4">
          <div className="w-full bg-slate-900 p-4 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all h-20">
             <svg viewBox="0 0 100 100" className="h-full w-full text-white fill-current">
                <rect x="0" y="0" width="100" height="100" rx="22" fill="#0f172a" />
                <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fill="white">rh</text>
             </svg>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-black text-slate-900 tracking-tighter lowercase generous-spacing">rowaad</h1>
            <p className="text-emerald-500 text-[8px] font-black tracking-[0.4em] uppercase mt-1">sovereign os</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                : 'hover:bg-slate-50 text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-emerald-400' : 'text-slate-300 group-hover:text-slate-900'} transition-colors`}>
              {item.icon}
            </div>
            <span className="font-bold text-[11px] lowercase tracking-tight generous-spacing">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
               <span className={`ml-auto bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full`}>
                 {item.badge}
               </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-10 border-t border-slate-50 bg-slate-50/30">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-[11px] font-black text-white border border-slate-800">
              {userRole.substring(0, 1).toLowerCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-slate-900 truncate lowercase tracking-tighter">{userRole}</p>
              <button onClick={() => window.location.reload()} className="text-[10px] text-slate-400 font-bold hover:text-emerald-600 transition-colors lowercase tracking-wide">
                {t.logout}
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
