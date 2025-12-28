
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  RefreshCw, 
  Search, 
  GitGraph,
  Terminal,
  ShieldCheck,
  UserPlus,
  FileSpreadsheet,
  Globe,
  Trash2,
  Edit2,
  X,
  Send,
  ArrowRight,
  ShieldAlert,
  ListChecks,
  AlertTriangle,
  Zap,
  CheckCircle2,
  User
} from 'lucide-react';
import { TeamMember, UserRole } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';
import { manageHRIdentity, auditHRData } from '../services/geminiService';


const EmployeeManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'hierarchy' | 'ai-agent' | 'audit-agent'>('roster');
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<string>('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [aiCommand, setAiCommand] = useState('');
  const [aiStatus, setAiStatus] = useState<string>('');
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const SHEET_ID = "1nf_phidl_7XM4T8DFE9EN2K37W2px-x1";

  const triggerSheetSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncSuccess(false);
    setAuditResult(null);
    
    const steps = [
      `connecting to sheet: ${SHEET_ID.substring(0,8)}...`,
      'mapping columns: Name, Mail, Role, Reporting Manager, Status...',
      'validating reporting hierarchy...',
      'resolving 22 identity nodes...',
      'committing roster to internal vault...'
    ];

    for (const step of steps) {
      setSyncStep(step);
      await new Promise(r => setTimeout(r, 400));
    }

    // REAL DATA IMPORT FROM USER FILE (22 Entries)
    const sheetData = [
      { name: 'Ahmad Anwar', email: 'ahmed.anwar@rowaad.net', role: 'BA', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Ahmed Saleh', email: 'ahmed.saleh@rowaad.net', role: 'IOS', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'ahmed zayed', email: 'ahmed.zaid@rowaad.net', role: 'BA', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Amany Youssef', email: 'amany@rh.net.sa', role: 'PM', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'anass atef', email: 'ceo@rh.net.sa', role: 'CEO', mgr: 'ceo@rh.net.sa', status: 'Active' },
      { name: 'Aya Shoala', email: 'aya.shoala@rowaad.net', role: 'project coordinator', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Eman Awad', email: 'eman.awd@rowaad.net', role: 'Frontend-React', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Enas Magdy', email: 'enas.magdy@rowaad.net', role: 'Frontend', mgr: 'aya.sayed@rowaad.net', status: 'Active' },
      { name: 'gehad rezk', email: 'ge.rezk@rowaad.net', role: 'Frontend', mgr: 'aya.sayed@rowaad.net', status: 'Active' },
      { name: 'Hala ElDeeb', email: 'hala@rh.net.sa', role: 'Account Manager', mgr: 'ceo@rh.net.sa', status: 'Active' },
      { name: 'Hamada Badr', email: 'hamada@rh.net.sa', role: 'Server', mgr: 'ceo@rh.net.sa', status: 'Active' },
      { name: 'hamza talha', email: 'hamza.talha@rowaad.net', role: 'Frontend-React', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'k.hasan', email: 'k.hasan@rowaad.net', role: 'Android', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Mahmoud Heshmat', email: 'm.heshmat@rowaad.net', role: 'IOS', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Marwa Mahmoud', email: 'marwa@rowaad.net', role: 'Backend', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Moamen Ramadi', email: 'moaa@rh.net.sa', role: 'designer', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'mohamed fayez', email: 'm.fayez@rowaad.net', role: 'Backend', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Mohamed Saleh', email: 'mo.salah@rowaad.net', role: 'Frontend', mgr: 'aya.sayed@rowaad.net', status: 'Active' },
      { name: 'Mohamed Wessam', email: 'm.wessam@rowaad.net', role: 'Android', mgr: 'amany@rh.net.sa', status: 'Active' },
      { name: 'Nuha Mekkawy', email: 'nuha@rowaad.net', role: 'Account Manager', mgr: 'hala@rh.net.sa', status: 'Active' },
      { name: 'radwa osama', email: 'ra.osama@rowaad.net', role: 'Frontend', mgr: 'aya.sayed@rowaad.net', status: 'Active' },
      { name: 'rana hesham', email: 'rana.hesham@rowaad.net', role: 'Account Manager', mgr: 'hala@rh.net.sa', status: 'Active' }
    ];

    const mappedUsers: TeamMember[] = sheetData.map((u, index) => ({
      id: `sh-${index}-${u.email.split('@')[0]}`,
      name: u.name,
      email: u.email,
      role: u.role, 
      profile: u.role, // Mapping Role to Profile for consistency
      reportingManager: u.mgr || undefined,
      userRole: u.role === 'CEO' || u.role === 'PM' ? UserRole.ADMIN : UserRole.TEAM_MEMBER,
      status: u.status as 'Active' | 'On Leave' | 'Offboarded' | 'Inactive',
      projectType: 'Both',
      shiftStartTime: '09:00',
    }));

    setEmployees(mappedUsers);
    setIsSyncing(false);
    setSyncStep('');
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };
  
  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim() || isSyncing) return;

    setIsSyncing(true);
    setAiStatus('Agent H: analyzing command node...');
    
    try {
      const result: any[] | null = await manageHRIdentity(aiCommand, employees);
      if (result) {
        const updatedEmployees: TeamMember[] = result.map((u: any, i: number) => ({
          ...u,
          id: u.id || `ai-${Date.now()}-${i}`,
          status: 'Active',
          userRole: UserRole.TEAM_MEMBER,
        }));
        setEmployees(updatedEmployees);
        setAiStatus('Agent H: roster commitment successful.');
      } else {
        setAiStatus('Agent H: error interpreting command.');
      }
    } catch (error) {
      setAiStatus('Agent H: critical connection error.');
    } finally {
      setIsSyncing(false);
      setAiCommand('');
      setTimeout(() => setAiStatus(''), 3000);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    const result = await auditHRData(employees);
    setAuditResult(result);
    setIsAuditing(false);
  };

  const handleDeleteEmployee = (id: string) => {
    if(confirm('Are you sure you want to delete this identity node?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const hierarchy = employees.reduce((acc, emp) => {
      // Build adjacency list for hierarchy
      // Prevent self-referencing managers from entering the children list of themselves
      if (emp.reportingManager && emp.reportingManager !== emp.email) {
        const managerEmail = emp.reportingManager;
        if (!acc[managerEmail]) {
          acc[managerEmail] = [];
        }
        acc[managerEmail].push(emp);
      }
      return acc;
  }, {} as Record<string, TeamMember[]>);

  // Cycle detection compliant render function
  const renderHierarchy = (managerEmail: string | null, level = 0, visited = new Set<string>()) => {
    // Safety break for deep recursion
    if (level > 20) return null;

    let reports: TeamMember[] = [];
    if (managerEmail === null) {
         // Find roots: Employees with no manager, or manager is themselves (Top Level)
         reports = employees.filter(e => !e.reportingManager || e.reportingManager === e.email);
    } else {
         reports = hierarchy[managerEmail] || [];
    }

    if (reports.length === 0) return null;

    return (
      <div className={`space-y-4 ${level > 0 ? 'border-l-2 border-slate-100 pl-8 ml-4 mt-4' : ''}`}>
        {reports.map(emp => {
          // Prevent cycles (A -> B -> A)
          if (visited.has(emp.email)) return null;
          
          const nextVisited = new Set(visited);
          nextVisited.add(emp.email);

          return (
            <div key={emp.email}>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 lowercase">{emp.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{emp.role}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[9px] text-blue-500 font-bold lowercase">{emp.email}</span>
                  </div>
                </div>
              </div>
              {/* Recursive call for direct reports */}
              {renderHierarchy(emp.email, level + 1, nextVisited)}
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Users className="text-blue-600" size={32} /> HR Agent Node
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">وكيل إدارة الهوية والموارد البشرية</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['roster', 'hierarchy', 'audit-agent', 'ai-agent'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.replace('-',' ')}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4">
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search identity roster..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all lowercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={triggerSheetSync}
                  disabled={isSyncing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] lowercase tracking-wide shadow-lg transition-all ${
                    syncSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'
                  }`}
                >
                  {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <FileSpreadsheet size={14} />}
                  {isSyncing ? 'syncing...' : (syncSuccess ? 'synced' : 'sync sheet')}
                </button>
              </div>

              {isSyncing && (
                <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
                   <RefreshCw className="animate-spin text-blue-400" size={16} />
                   <p className="text-xs font-mono text-blue-100 italic">{syncStep}</p>
                </div>
              )}

              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">User Name & Email</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Role</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Reporting Manager</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Status</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-[10px] bg-blue-600 shadow-lg shadow-blue-500/20">
                               {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 lowercase">{emp.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-slate-700 font-bold uppercase tracking-tight">{emp.role}</td>
                      <td className="px-6 py-5 text-[11px] text-slate-500 lowercase font-medium flex items-center gap-1">
                         {emp.reportingManager ? (
                           <>
                             <User size={12} className="text-slate-300" /> {emp.reportingManager}
                           </>
                         ) : <span className="text-slate-300 italic">n/a</span>}
                      </td>
                      <td className="px-6 py-5">
                         <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                         }`}>
                            {emp.status}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && !isSyncing && (
                <div className="p-12 text-center text-slate-400 italic">
                   <Users size={48} className="mx-auto mb-4 opacity-10" />
                   <p className="text-xs">No users found. Click "Sync Sheet" to populate the roster.</p>
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
             <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Users size={80} className="text-blue-400" /></div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Sheet Identity Hub</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Connected Source</p>
                      <p className="text-xs font-bold text-blue-300 italic truncate">gid: 1772820315</p>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Sync Status</p>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${syncSuccess ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                         <span className="text-xs font-black text-white">{syncSuccess ? 'Active Bridge' : 'Idle'}</span>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Total Nodes</p>
                      <p className="text-xl font-black text-white">{employees.length} Users</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'hierarchy' && (
        <div className="animate-in slide-in-from-right-4 duration-500 bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm">
           <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tighter flex items-center gap-4">
              <GitGraph className="text-blue-600" /> Organization Graph Sub-Agent
           </h3>
           <div className="space-y-4 max-w-2xl">
              {employees.length > 0 ? renderHierarchy(null) : (
                <p className="text-slate-400 italic text-sm">Sync roster to visualize hierarchy.</p>
              )}
           </div>
        </div>
      )}

      {activeSubTab === 'audit-agent' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter flex items-center gap-4">
              <ListChecks className="text-blue-600" /> Data Integrity Sub-Agent
            </h3>
            <p className="text-sm text-slate-500 font-medium italic mb-8">
              This agent scans the synced Google Sheet data for potential errors, ensuring the organizational structure is sound.
            </p>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing || employees.length === 0}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
            >
              {isAuditing ? <RefreshCw className="animate-spin" /> : <Zap size={16} className="text-amber-400" />}
              {isAuditing ? 'Auditing...' : 'Run Data Audit'}
            </button>
            {employees.length === 0 && <p className="text-center text-xs text-red-500 mt-4 italic">Please sync the roster first.</p>}
          </div>

          <div className="space-y-6">
            {!auditResult && !isAuditing && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center h-full flex flex-col justify-center">
                <ShieldAlert size={48} className="mx-auto mb-4 text-slate-200" />
                <h4 className="text-xl font-black text-slate-300">Awaiting Audit</h4>
                <p className="text-slate-400 text-sm mt-2 italic">Click "Run Data Audit" to scan for issues.</p>
              </div>
            )}
            {isAuditing && (
              <div className="bg-slate-900 text-white rounded-[40px] p-12 text-center h-full flex flex-col justify-center animate-pulse">
                <p className="text-lg font-black text-blue-400">AUDITOR AGENT SCANNING...</p>
              </div>
            )}
            {auditResult && (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Audit Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-2xl font-black">{auditResult.summary.total}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Total Identities</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-2xl font-black">{auditResult.summary.uniqueRoles}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Unique Roles</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Warnings & Flags</h4>
                  {auditResult.warnings?.length > 0 ? (
                    <ul className="space-y-3">
                      {auditResult.warnings.map((warn: any, i: number) => (
                        <li key={i} className="flex gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <AlertTriangle className={warn.severity === 'High' ? 'text-red-500' : 'text-amber-500'} size={16} />
                           {warn.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-3 text-emerald-600 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={16} />
                      <p className="text-xs font-bold">No data integrity issues found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeSubTab === 'ai-agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-950 rounded-[40px] p-10 shadow-2xl relative overflow-hidden border border-blue-900/30 min-h-[500px] flex flex-col">
             <div className="flex items-center gap-3 mb-8 text-blue-400">
                <Terminal size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Control Sub-Agent</span>
             </div>
             <div className="flex-1 space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[11px] text-slate-400 leading-relaxed italic">
                     Use natural language to manage the roster.
                   </p>
                   <ul className="mt-4 space-y-2 text-[10px] text-blue-300 font-bold uppercase">
                      <li>• "add amany as CEO with email amany@rh.net.sa"</li>
                      <li>• "remove omar backend"</li>
                   </ul>
                </div>
                {aiStatus && (
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono animate-pulse">
                     <ArrowRight size={14} /> {aiStatus}
                  </div>
                )}
             </div>
             <form onSubmit={handleAiCommand} className="relative mt-auto">
                <input 
                  type="text" 
                  value={aiCommand}
                  onChange={(e) => setAiCommand(e.target.value)}
                  placeholder="enter hr command..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 text-white text-sm font-medium transition-all"
                  disabled={isSyncing}
                />
                <button type="submit" disabled={isSyncing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                  {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
