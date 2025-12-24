
import React, { useState, useCallback, useEffect } from 'react';
import { Project, ProjectPhase, TaskStatus, Task, UserRole, Notification, User, GitLabUpdate, ResourceAllocation, NotificationSettings, FileAttachment, Language } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ZohoTasks from './components/ZohoTasks';
import PolicyCenter from './components/PolicyCenter';
import Integrations from './components/Integrations';
import Notifications from './components/Notifications';
import DevBlueprint from './components/DevBlueprint';
import ResourcePlanner from './components/ResourcePlanner';
import EmployeeManagement from './components/EmployeeManagement';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import { ZOHO_A21_TEMPLATE, TRANSLATIONS } from './constants';
import { ShieldCheck, Command } from 'lucide-react';

const DEFAULT_NOTIF_SETTINGS: NotificationSettings = {
  taskAssignments: true,
  deadlineApproaching: true,
  statusChanges: true,
  systemAlerts: true
};

const MOCK_GIT_FEED: GitLabUpdate[] = [
  { id: '1', author: 'omar backend', repo: 'backend-laravel-mongo', message: 'feat: add nafath controller and mongodb aggregation', timestamp: '2h ago', linesAdded: 142, linesRemoved: 12 },
  { id: '2', author: 'sara design', repo: 'design-assets', message: 'sync: update real estate card typography', timestamp: '4h ago', linesAdded: 0, linesRemoved: 0 },
  { id: '3', author: 'khalid android', repo: 'android-native', message: 'fix: location service permission flow', timestamp: '5h ago', linesAdded: 55, linesRemoved: 4 },
  { id: '4', author: 'laila ios', repo: 'ios-native', message: 'feat: implement mada payment sheet using swiftui', timestamp: 'yesterday', linesAdded: 310, linesRemoved: 22 },
];

const INITIAL_ALLOCATIONS: ResourceAllocation[] = [
  { id: '1', employeeId: '4', employeeName: 'omar backend', title: 'backend developer', projectName: 'production portal', taskName: 'laravel api security & mongodb aggregation', startDate: '2025-02-20', endDate: '2025-02-27', comments: 'focusing on moloquent integration' },
  { id: '2', employeeId: '5', employeeName: 'khalid android', title: 'android developer', projectName: 'production portal', taskName: 'base design coding', startDate: '2025-02-20', endDate: '2025-03-05', comments: 'direct figma sync' }
];

const DEFAULT_PROJECT: Project = {
  id: 'prj-node-001',
  name: 'rowaad core stream',
  type: 'Both',
  currentDay: 6,
  totalDays: 22,
  phase: ProjectPhase.FOUNDATION,
  tasks: ZOHO_A21_TEMPLATE.map(t => ({
    ...t,
    dueDate: new Date(Date.now() + 86400000 * (t.durationDays || 1)).toISOString()
  })),
  gitUpdates: MOCK_GIT_FEED,
  testCases: [],
  endpoints: [],
  allocations: INITIAL_ALLOCATIONS,
  credentials: [],
  stackInfo: {
    framework: 'laravel 11',
    database: 'self-hosted mongodb',
    version: 'a21 v2.6-internal'
  }
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(DEFAULT_NOTIF_SETTINGS);

  const t = TRANSLATIONS['en'];

  const addNotification = useCallback((message: string, type: Notification['type'], source: Notification['source'] = 'System') => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      source,
      message: message.toLowerCase(),
      timestamp: 'just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };

  const handleUpdateTaskAttachments = (taskId: string, attachments: FileAttachment[]) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, attachments } : t)
    }));
  };

  const handleAIAction = useCallback((name: string, args: any) => {
    if (name === 'navigate' && args.tab) {
      setActiveTab(args.tab);
    }
  }, []);

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard project={project} language="en" />;
      case 'blueprint': return <DevBlueprint />;
      case 'tasks': return (
        <ZohoTasks 
          project={project} 
          currentUserRole={currentUser.role} 
          onUpdateStatus={handleUpdateTaskStatus}
          onUpdateAttachments={handleUpdateTaskAttachments}
        />
      );
      case 'resources': return <ResourcePlanner project={project} onUpdateAllocations={(allocs) => setProject(p => ({...p, allocations: allocs}))} />;
      case 'employees': return <EmployeeManagement />;
      case 'integrations': return <Integrations settings={notifSettings} onUpdateSettings={setNotifSettings} />;
      case 'notifications': return (
        <Notifications 
          notifications={notifications} 
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} 
          onClearAll={() => setNotifications([])}
          settings={notifSettings}
          onUpdateSettings={setNotifSettings}
        />
      );
      case 'policy': return <PolicyCenter />;
      default: return <Dashboard project={project} language="en" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex bg-[#fdfdfd] min-h-screen font-inter lowercase-ui">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={unreadCount} 
        userRole={currentUser.role} 
        language="en"
      />
      <main className="flex-1 ml-64 p-6 overflow-x-hidden transition-all duration-300">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 py-6 flex justify-between items-center rounded-3xl mb-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h2 className="font-black text-slate-900 tracking-tight text-xl lowercase generous-spacing">
                 rowaad hub
              </h2>
              <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                 sovereign node <ShieldCheck size={10} />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="bg-slate-100 px-5 py-2 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Command size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest lowercase generous-spacing">{t.internal_node}</span>
             </div>
             <div className="text-right">
                <p className="text-xs font-black text-slate-900 tracking-tighter">{currentUser.name.toLowerCase()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] lowercase">{currentUser.role.toLowerCase()}</p>
             </div>
             <button 
                onClick={() => setActiveTab('notifications')}
                className="relative w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-xl hover:bg-emerald-600 transition-all overflow-hidden"
              >
                {currentUser.name.charAt(0).toLowerCase()}
                {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
             </button>
          </div>
        </header>
        <div className="px-4">
          {renderContent()}
        </div>
      </main>

      <AIAssistant onAction={handleAIAction} />
    </div>
  );
};

const App: React.FC = () => <AppContent />;
export default App;
