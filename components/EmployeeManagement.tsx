
import React, { useState } from 'react';
import { Users, RefreshCw, Search } from 'lucide-react';
import { TeamMember } from '../types';
import { TEAM_MEMBERS as INITIAL_MEMBERS } from '../constants';

const EmployeeManagement: React.FC = () => {
  const [employees] = useState<TeamMember[]>(INITIAL_MEMBERS.map(m => ({ ...m, status: 'Active' })));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Users className="text-blue-600" size={32} /> hr agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic">identity & access governance</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-black text-[10px] lowercase tracking-wide border border-slate-200">
            <RefreshCw size={14} /> sync directory
          </button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="search members..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all lowercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">name</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">title</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-all">
                <td className="px-8 py-5 text-sm font-bold text-slate-800 lowercase">{emp.name}</td>
                <td className="px-8 py-5 text-[11px] text-slate-500 lowercase">{emp.role}</td>
                <td className="px-8 py-5">
                  <span className="text-[10px] font-black text-emerald-600 lowercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;
