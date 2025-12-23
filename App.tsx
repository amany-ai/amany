
import React, { useState, useCallback, useEffect } from 'react';
import { Project, ProjectPhase, TaskStatus, Task, UserRole, Notification, User, GitLabUpdate, TestCase, ApiEndpoint, ResourceAllocation, Credential, NotificationSettings, FileAttachment, Language } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ZohoTasks from './components/ZohoTasks';
import PolicyCenter from './components/PolicyCenter';
import Integrations from './components/Integrations';
import Notifications from './components/Notifications';
import AdminUserManagement from './components/AdminUserManagement';
import DevBlueprint from './components/DevBlueprint';
import AutomationTest from './components/AutomationTest';
import FrontendDev from './components/FrontendDev';
import ResourcePlanner from './components/ResourcePlanner';
import CredentialVault from './components/CredentialVault';
import EmployeeManagement from './components/EmployeeManagement';
import SRSBriefing from './components/SRSBriefing';
import SystemFiles from './components/SystemFiles';
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
  { id: '1', author: 'Omar Backend', repo: 'backend-laravel-mongo', message: 'feat: add nafath controller and mongodb aggregation', timestamp: '2h ago', linesAdded: 142, linesRemoved: 12 },
  { id: '2', author: 'Sara Design', repo: 'design-assets', message: 'sync: update real estate card typography', timestamp: '4h ago', linesAdded: 0, linesRemoved: 0 },
  { id: '3', author: 'Khalid Android', repo: 'android-native', message: 'fix: location service permission flow', timestamp: '5h ago', linesAdded: 55, linesRemoved: 4 },
  { id: '4', author: 'Laila iOS', repo: 'ios-native', message: 'feat: implement mada payment sheet using swiftui', timestamp: 'Yesterday', linesAdded: 310, linesRemoved: 22 },
];

const INITIAL_ENDPOINTS: ApiEndpoint[] = [
  { id: '1', method: 'POST', path: '/api/auth/verify', status: 'Deployed', xcodeSynced: true, windsurfVerified: true },
  { id: '2', method: 'GET', path: '/api/v1/listings', status: 'Deployed', xcodeSynced: true, windsurfVerified: true },
  { id: '3', method: 'POST', path: '/api/v1/payments', status: 'Draft', xcodeSynced: false, windsurfVerified: true },
];

const INITIAL_ALLOCATIONS: ResourceAllocation[] = [
  { id: '1', employeeId: '4', employeeName: 'Omar Backend', title: 'Backend Developer', projectName: 'Production Portal', taskName: 'Laravel API Security & MongoDB Aggregation', startDate: '2025-02-20', endDate: '2025-02-27', comments: 'Focusing on Moloquent integration' },
  { id: '2', employeeId: '5', employeeName: 'Khalid Android', title: 'Android Developer', projectName: 'Production Portal', taskName: 'Base Design Coding', startDate: '2025-02-20', endDate: '2025-03-05', comments: 'Direct figma sync' }
];

const INITIAL_CREDENTIALS: Credential[] = [
  { id: 'c1', title: 'GitLab Production Token', type: 'Service Account', environment: 'Production', identifier: 'PM-AUTO-BOT', secretValue: 'glpat-5529kks82910xx-fake', comments: 'Main CI/CD pipeline access', lastUpdated: '2025-02-20' },
  { id: 'c2', title: 'Internal MongoDB Node', type: 'Database', environment: 'Dev', identifier: 'mongodb_local_admin', secretValue: 'mongodb://127.0.0.1:27017/rowaad_prod', comments: 'Self-hosted internal NoSQL node', lastUpdated: '2025-02-22' }
];

const DEFAULT_PROJECT: Project = {
  id: 'PRJ-NODE-001',
  name: 'ROWAAD Core Stream',
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
  endpoints: INITIAL_ENDPOINTS,
  allocations: INITIAL_ALLOCATIONS,
  credentials: INITIAL_CREDENTIALS,
  stackInfo: {
    framework: 'Laravel 11',
    database: 'Self-Hosted MongoDB',
    version: 'A21 v2.6-Internal'
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
    if (type === 'assignment' && !notifSettings.taskAssignments) return;
    if (type === 'status' && !notifSettings.statusChanges) return;
    if (type === 'deadline' && !notifSettings.deadlineApproaching) return;
    if (type === 'system' && !notifSettings.systemAlerts) return;

    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}-${Math.random()}`,
      source,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, [notifSettings]);

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = project.tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      addNotification(`Task "${task.title}" status changed to ${status}`, 'status', 'System');
    }
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
      addNotification(`System: AI navigated to section "${args.tab}"`, 'system');
    }
  }, [addNotification]);

  useEffect(() => {
    if (!currentUser) return;
    const checkDeadlines = () => {
      const now = Date.now();
      project.tasks.forEach(task => {
        if (task.dueDate && task.status !== TaskStatus.DONE) {
          const dueTime = new Date(task.dueDate).getTime();
          const diffHours = (dueTime - now) / (1000 * 60 * 60);
          if (diffHours > 0 && diffHours <= 24) {
            const exists = notifications.some(n => n.type === 'deadline' && n.message.includes(task.title));
            if (!exists) {
              addNotification(`Sovereign Alert: "${task.title}" due in < 24h.`, 'deadline', 'System');
            }
          }
        }
      });
    };
    const interval = setInterval(checkDeadlines, 60000);
    checkDeadlines();
    return () => clearInterval(interval);
  }, [project.tasks, currentUser, notifications, addNotification]);

  const handleUpdateTests = (testCases: TestCase[]) => setProject(prev => ({ ...prev, testCases }));
  const handleUpdateAllocations = (allocations: ResourceAllocation[]) => setProject(prev => ({ ...prev, allocations }));
  const handleUpdateCredentials = (credentials: Credential[]) => setProject(prev => ({ ...prev, credentials }));

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard project={project} language="en" />;
      case 'srs': return <SRSBriefing />;
      case 'blueprint': return <DevBlueprint />;
      case 'tasks': return (
        <ZohoTasks 
          project={project} 
          currentUserRole={currentUser.role} 
          onUpdateStatus={handleUpdateTaskStatus}
          onUpdateAttachments={handleUpdateTaskAttachments}
        />
      );
      case 'resources': return <ResourcePlanner project={project} onUpdateAllocations={handleUpdateAllocations} />;
      case 'employees': return <EmployeeManagement />;
      case 'frontend': return <FrontendDev project={project} />;
      case 'system-files': return <SystemFiles language="en" />;
      case 'vault': return <CredentialVault credentials={project.credentials} userRole={currentUser.role} onUpdate={handleUpdateCredentials} />;
      case 'testcenter': return <AutomationTest project={project} onUpdateTests={handleUpdateTests} />;
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
      case 'users': return <AdminUserManagement />;
      default: return <Dashboard project={project} language="en" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`flex bg-[#fdfdfd] min-h-screen`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={unreadCount} 
        userRole={currentUser.role} 
        language="en"
      />
      <main className={`flex-1 ml-64 p-2 overflow-x-hidden transition-all duration-300`}>
        <header className="sticky top-0 z-40 bg-black backdrop-blur-xl border-b border-emerald-900/20 px-10 py-5 flex justify-between items-center rounded-b-[32px] mb-4 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 group">
              <div className="h-10 w-10 flex items-center justify-center bg-black rounded-lg group-hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10">
                {/* Rh Logo SVG Small */}
                <svg viewBox="0 0 100 100" className="h-7 w-7 text-white fill-current">
                   <rect x="0" y="0" width="100" height="100" rx="20" fill="black" />
                   <text x="50" y="68" textAnchor="middle" fontSize="50" fontWeight="900" fontFamily="Inter, sans-serif" fill="white">Rh</text>
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="font-black text-white tracking-tight uppercase text-sm leading-none">
                   ROWAAD SYSTEM
                </h2>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                   Sovereign Node <ShieldCheck size={8} />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
             <div className="bg-emerald-950/30 px-4 py-1.5 rounded-full border border-emerald-900/30 flex items-center gap-2">
                <Command size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t.internal_node}</span>
             </div>
             <div className={`text-right`}>
                <p className="text-xs font-black text-white uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-[0.2em]">{currentUser.role}</p>
             </div>
             <button 
                onClick={() => setActiveTab('notifications')}
                className="relative w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black font-black shadow-2xl group hover:bg-white transition-all cursor-pointer overflow-hidden"
              >
                {currentUser.name.charAt(0)}
                {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-black animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
                )}
             </button>
          </div>
        </header>
        <div className="p-4">
          {renderContent()}
        </div>
      </main>

      {/* AI Assistant Bridge Integrated */}
      <AIAssistant onAction={handleAIAction} />
    </div>
  );
};

const App: React.FC = () => <AppContent />;
export default App;
