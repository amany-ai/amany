
import React, { useState } from 'react';
import { Users, Calendar, MessageSquare, Plus, Trash2, Send, Download, ChevronRight, UserCircle2, Clock, CheckCircle2, Share2, Sparkles, Filter, Briefcase } from 'lucide-react';
import { ResourceAllocation, Project, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../constants';
import { generateWeeklyResourceSummary } from '../services/geminiService';

interface ResourcePlannerProps {
  project: Project;
  onUpdateAllocations: (allocations: ResourceAllocation[]) => void;
}

const ResourcePlanner: React.FC<ResourcePlannerProps> = ({ project, onUpdateAllocations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<'Matrix' | 'Employee-Focus'>('Matrix');
  const [newAlloc, setNewAlloc] = useState<Partial<ResourceAllocation>>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    comments: ''
  });
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleAddAllocation = () => {
    if (newAlloc.employeeId && newAlloc.taskName) {
      const employee = TEAM_MEMBERS.find(m => m.id === newAlloc.employeeId);
      const allocation: ResourceAllocation = {
        id: `RES-${Date.now()}`,
        employeeId: newAlloc.employeeId!,
        employeeName: employee?.name || 'Unknown',
        title: employee?.role || 'Developer',
        projectName: project.name,
        taskName: newAlloc.taskName!,
        startDate: newAlloc.startDate!,
        endDate: newAlloc.endDate!,
        comments: newAlloc.comments || 'None'
      };
      onUpdateAllocations([...project.allocations, allocation]);
      setIsAdding(false);
      setNewAlloc({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        comments: ''
      });
    }
  };

  const removeAllocation = (id: string) => {
    onUpdateAllocations(project.allocations.filter(a => a.id !== id));
  };

  const generateWeeklyAIPlan = async () => {
    setGenerating(true);
    const summary = await generateWeeklyResourceSummary(project.allocations);
    setAiSummary(summary);
    setGenerating(false);
  };

  const postToSlack = () => {
    alert(`Weekly Resource Plan formatted and dispatched to Slack.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Resource Command
          </h2>
          <p className="text-slate-500 mt-1">Share team members across PMs and generate clear weekly schedules.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 p-1 rounded-2xl flex mr-2">
            <button 
              onClick={() => setViewMode('Matrix')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'Matrix' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
            >
              Matrix View
            </button>
            <button 
              onClick={() => setViewMode('Employee-Focus')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'Employee-Focus' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
            >
              Employee Focus
            </button>
          </div>
          <button 
            onClick={generateWeeklyAIPlan}
            disabled={generating || project.allocations.length === 0}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {generating ? <Clock className="animate-spin" size={18} /> : <Sparkles size={18} className="text-amber-400" />}
            Weekly AI Plan
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} /> New Allocation
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900 border-b pb-4">
              <UserCircle2 className="text-blue-600" /> Allocate Resource
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Employee Name & Title</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  onChange={(e) => setNewAlloc({...newAlloc, employeeId: e.target.value})}
                >
                  <option value="">Select Resource...</option>
                  {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Task Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="e.g. Native Logic Implementation"
                  onChange={(e) => setNewAlloc({...newAlloc, taskName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Start Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={newAlloc.startDate}
                  onChange={(e) => setNewAlloc({...newAlloc, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">End Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={newAlloc.endDate}
                  onChange={(e) => setNewAlloc({...newAlloc, endDate: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Comments (Optional)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 h-24 text-sm font-medium"
                  placeholder="Specific requirements, blockers, or special notes..."
                  onChange={(e) => setNewAlloc({...newAlloc, comments: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleAddAllocation} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Assign Resource</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] flex items-center gap-2">
                <Filter size={14} className="text-blue-600" /> 
                {viewMode === 'Matrix' ? 'Weekly Organizational Matrix' : 'Individual Employee Focus'}
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active Nodes: {project.allocations.length}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/30 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee & Title</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project / Task</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {project.allocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-slate-50/40 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm border-2 border-blue-600">
                            {alloc.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{alloc.employeeName}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{alloc.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Briefcase size={12} className="text-slate-400" />
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{alloc.projectName}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">{alloc.taskName}</p>
                          {alloc.comments && alloc.comments !== 'None' && (
                            <p className="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-1 rounded-lg inline-block">“{alloc.comments}”</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                            <Calendar size={12} className="text-indigo-500" /> {alloc.startDate} 
                            <ChevronRight size={10} className="text-slate-300" />
                            {alloc.endDate}
                          </div>
                          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => removeAllocation(alloc.id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {project.allocations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                          <Users size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">No resources shared yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col min-h-[600px]">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Share2 size={120} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <MessageSquare className="text-blue-400" /> Weekly Slack Sync
              </h3>
              
              {!aiSummary ? (
                <div className="text-center py-16 px-6 border-2 border-dashed border-slate-800 rounded-[32px] bg-slate-800/20">
                   <Clock className="mx-auto mb-4 text-slate-700" size={32} />
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     Process allocations to generate the strict weekly plan summary for Slack.
                   </p>
                </div>
              ) : (
                <div className="bg-slate-800/40 backdrop-blur-md rounded-[32px] p-6 border border-slate-700/50 mb-8 animate-in fade-in zoom-in-95 h-[400px] overflow-hidden flex flex-col">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Slack Formatted Markdown</p>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 text-[11px] text-slate-300 font-mono leading-relaxed">
                    {aiSummary}
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-8 space-y-3">
              <button 
                onClick={postToSlack}
                disabled={!aiSummary}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95"
              >
                <Send size={18} /> Disperse to Slack
              </button>
              <button 
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700 active:scale-95"
              >
                <Download size={18} /> Export Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanner;
