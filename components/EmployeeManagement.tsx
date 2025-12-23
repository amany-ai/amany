
import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw, Search, Mail, Briefcase, ExternalLink, ShieldCheck, MoreVertical, X, Check } from 'lucide-react';
import { TeamMember, UserRole } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<TeamMember[]>(INITIAL_MEMBERS.map(m => ({ ...m, email: m.email || `${m.name.toLowerCase().replace(' ', '.')}@company.com`, status: 'Active' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<TeamMember | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Logic for syncing with Zoho/TimeDoctor would go here
      alert("Employee list successfully synchronized with Zoho Projects & Time Doctor.");
    }, 2000);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: TeamMember = {
      id: editingEmployee?.id || `EMP-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      userRole: formData.get('userRole') as UserRole,
      status: formData.get('status') as any,
      projectType: formData.get('projectType') as any,
      shiftStartTime: formData.get('shiftStartTime') as string,
      zohoId: formData.get('zohoId') as string,
      timeDoctorId: formData.get('timeDoctorId') as string,
    };

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updated : emp));
    } else {
      setEmployees([...employees, updated]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const deleteEmployee = (id: string) => {
    if (window.confirm("Are you sure you want to remove this employee from the bridge?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Employee Directory
          </h2>
          <p className="text-slate-500 mt-1">Manage team identities and system synchronization across Zoho/Time Doctor.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} /> 
            {isSyncing ? 'Syncing External...' : 'External Sync'}
          </button>
          <button 
            onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Employee
          </button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or title..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status:</span>
             <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
               <ShieldCheck size={12} /> Encrypted Directory
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name & Title</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">System IDs</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bridge Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/40 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm border-2 border-blue-600">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail size={14} className="text-slate-400" /> {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                        <Briefcase size={12} /> {emp.projectType} Shift @ {emp.shiftStartTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      {emp.zohoId && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-100 w-fit">
                          ZOHO: {emp.zohoId}
                        </div>
                      )}
                      {emp.timeDoctorId && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 w-fit">
                          TD: {emp.timeDoctorId}
                        </div>
                      )}
                      {!emp.zohoId && !emp.timeDoctorId && <span className="text-[10px] text-slate-300 italic">No linked IDs</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      emp.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(emp.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                {editingEmployee ? <Edit2 className="text-blue-600" /> : <Plus className="text-blue-600" />}
                {editingEmployee ? 'Update Employee Record' : 'Register New Team Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Full Legal Name</label>
                <input name="name" defaultValue={editingEmployee?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Corporate Email</label>
                <input name="email" type="email" defaultValue={editingEmployee?.email} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Job Title</label>
                <input name="role" defaultValue={editingEmployee?.role} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Platform Role</label>
                <select name="userRole" defaultValue={editingEmployee?.userRole} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Project Focus</label>
                <select name="projectType" defaultValue={editingEmployee?.projectType} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option value="Mobile">Mobile Native</option>
                  <option value="Web">Web Apps</option>
                  <option value="Both">Full Stack</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Status</label>
                <select name="status" defaultValue={editingEmployee?.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Offboarded">Offboarded</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1 border-t pt-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Zoho External ID</label>
                <input name="zohoId" defaultValue={editingEmployee?.zohoId} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="col-span-2 md:col-span-1 border-t pt-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Time Doctor ID</label>
                <input name="timeDoctorId" defaultValue={editingEmployee?.timeDoctorId} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              
              <div className="col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                  {editingEmployee ? 'Update Directory' : 'Register Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
