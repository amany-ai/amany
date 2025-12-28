
import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw, 
  Search, 
  Clock, 
  Activity, 
  Zap, 
  AlertTriangle,
  UserCheck,
  ArrowUpRight,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  BarChart3,
  UserPlus
} from 'lucide-react';
import { TeamMember, PlannerSyncStatus } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';

const EmployeeManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'compliance' | 'blueprint'>('roster');
  const [employees] = useState<TeamMember[]>(INITIAL_MEMBERS.map(m => ({ ...m, status: 'Active' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const tdSync: PlannerSyncStatus = { lastSync: '12h ago', status: 'active', deltaCount: 89, mappingGaps: 3 };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerZohoUserSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    // Simulate API Call to Zoho
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter lowercase-ui">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Users className="text-blue-600" size={32} /> HR Agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase generous-spacing">Identity & Zoho Users Governance</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={triggerZohoUserSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl transition-all ${
              syncSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'
            }`}
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : (syncSuccess ? <UserCheck size={14} /> : <UserPlus size={14} />)}
            {isSyncing ? 'fetching zoho users...' : (syncSuccess ? 'users synced' : 'sync from zoho')}
          </button>
          
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            {(['roster', 'compliance', 'blueprint'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSubTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search members..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all lowercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Identity Node</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">Title</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-center">Zoho ID</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-right">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">
                               {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 lowercase">{emp.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-[11px] text-slate-500 lowercase font-medium">{emp.role}</td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                           {emp.zohoId || 'pending'}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                            View Identity <ArrowUpRight size={12} className="inline ml-1" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
             <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Users size={80} className="text-emerald-400" />
                </div>
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 relative z-10">Zoho Identity Hub</h4>
                <div className="space-y-4 relative z-10">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-sm font-black text-white">12 Users Managed</p>
                      <p className="text-[10px] text-slate-400 italic mt-1 leading-relaxed">Direct connection to Zoho Projects User Pool.</p>
                      <div className="mt-4 flex items-center gap-2">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-emerald-500 uppercase">API Link Active</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <AlertTriangle size={14} className="text-amber-500" /> Identity Gaps
                </h4>
                <div className="space-y-3">
                   <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-tight">Unlinked Identity</p>
                      <p className="text-[9px] text-amber-500 italic mt-0.5">3 users in Zoho lack internal RH ID matching.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="text-blue-600" /> Identity Compliance
             </h3>
             <div className="space-y-6">
                {[
                  { label: 'Zoho -> RH ID Match', val: '92%', color: 'emerald' },
                  { label: 'Time Doctor Mapping', val: '85%', color: 'blue' },
                  { label: 'Email Consistency', val: '100%', color: 'indigo' }
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
                       <span className={`text-lg font-black text-${metric.color}-600`}>{metric.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${metric.color}-500`} style={{ width: metric.val }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                <UserCheck size={160} />
             </div>
             <h3 className="text-3xl font-black tracking-tighter mb-4 lowercase">User Pool Governance</h3>
             <p className="text-emerald-50 text-sm font-medium leading-relaxed mb-10 italic max-w-sm">
                Ensuring that every user in Zoho Projects is audited against the internal Rowaad security manifest.
             </p>
             <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl">
                Generate Identity Audit
             </button>
          </div>
        </div>
      )}

      {activeSubTab === 'blueprint' && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
           <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-2">
                 <Terminal size={20} className="text-emerald-500" /> Zoho User Sync Service (Laravel 11)
              </h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">A. Zoho User API Call</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-blue-400">{`// app/Services/ZohoUserService.php
namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use App\\Models\\TeamMember;

class ZohoUserService
{
    public function syncPortalUsers()
    {
        $portalId = config('services.zoho.portal_id');
        $token = $this->getOAuthToken();

        $response = Http::withToken($token)
            ->get("https://projectsapi.zoho.com/api/v1/portal/$portalId/users/");

        if ($response->successful()) {
            foreach ($response->json()['users'] as $zUser) {
                TeamMember::updateOrCreate(
                    ['zoho_id' => $zUser['id']],
                    [
                        'name' => $zUser['name'],
                        'email' => $zUser['email'],
                        'role' => $zUser['role_name'],
                        'status' => $zUser['status'] === 'active' ? 'Active' : 'Inactive'
                    ]
                );
            }
        }
    }
}
`}</pre>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">B. Identity Mapping Controller</h5>
                       <div className="bg-slate-950 p-6 rounded-[24px] border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto h-[400px] custom-scrollbar">
<pre className="text-emerald-300">{`// app/Http/Controllers/Api/ZohoSyncController.php
namespace App\\Http\\Controllers\\Api;

use App\\Services\\ZohoUserService;
use Illuminate\\Http\\Request;

class ZohoSyncController extends Controller
{
    public function syncUsers(ZohoUserService $service)
    {
        try {
            $service.syncPortalUsers();
            return response()->json(['status' => 'success']);
        } catch (\\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
`}</pre>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
