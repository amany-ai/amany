
import React, { useState, useRef } from 'react';
import { Project, Task, TaskStatus, UserRole, FileAttachment } from '../types';
import { TEAM_MEMBERS } from '../constants';
import { MoreVertical, User, Clock, AlertCircle, Link as LinkIcon, Plus, ChevronDown, CheckCircle, Paperclip, X, Image as ImageIcon } from 'lucide-react';

interface ZohoTasksProps {
  project: Project;
  currentUserRole: UserRole;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onAddTask?: () => void;
  onUpdateAttachments?: (taskId: string, attachments: FileAttachment[]) => void;
}

const ZohoTasks: React.FC<ZohoTasksProps> = ({ project, currentUserRole, onUpdateStatus, onAddTask, onUpdateAttachments }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskForAttach, setActiveTaskForAttach] = useState<string | null>(null);

  const canEdit = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.PROJECT_MANAGER;

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case TaskStatus.IN_REVIEW: return 'bg-amber-100 text-amber-700 border-amber-200';
      case TaskStatus.HOLD: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const isTaskLocked = (task: Task) => {
    if (task.dependencies.length === 0) return false;
    return task.dependencies.some(depId => {
      const depTask = project.tasks.find(t => t.id === depId);
      return depTask && depTask.status !== TaskStatus.DONE;
    });
  };

  const getOwnerName = (ownerId: string) => {
    return TEAM_MEMBERS.find(m => m.id === ownerId)?.name || ownerId;
  };

  const handleAttach = (taskId: string) => {
    setActiveTaskForAttach(taskId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeTaskForAttach || !onUpdateAttachments) return;
    const files = Array.from(e.target.files || []);
    const task = project.tasks.find(t => t.id === activeTaskForAttach);
    const existing = task?.attachments || [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: FileAttachment = {
          id: `TASK-ATT-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result as string
        };
        onUpdateAttachments(activeTaskForAttach, [...existing, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    setActiveTaskForAttach(null);
  };

  const filteredTasks = filterStatus === 'All' 
    ? project.tasks 
    : project.tasks.filter(t => t.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Project Flow Node</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 font-medium">Internal Production Line: {project.tasks.length} active tasks</p>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full uppercase border border-emerald-100">
              Sovereign Registry
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {canEdit && (
            <button 
              onClick={onAddTask}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} /> Add Production Task
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex gap-4">
           <div className="relative">
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-6 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 appearance-none focus:ring-2 focus:ring-emerald-500 outline-none uppercase tracking-widest"
             >
                <option value="All">All Statuses</option>
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Node</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quality Gate</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const locked = isTaskLocked(task);
              return (
                <tr key={task.id} className={`group transition-all ${locked ? 'bg-slate-50/40' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${locked ? 'text-slate-400' : 'text-slate-900 uppercase tracking-tight'}`}>{task.title}</span>
                        {locked && (
                          <div className="group relative">
                            <AlertCircle size={14} className="text-amber-500" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {task.zohoTaskId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black text-emerald-500 rounded-xl flex items-center justify-center text-[10px] font-black border border-emerald-500/20">
                        {getOwnerName(task.ownerId).charAt(0)}
                      </div>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{getOwnerName(task.ownerId)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {task.attachments && task.attachments.length > 0 ? (
                         <div className="flex -space-x-2">
                            {task.attachments.slice(0, 3).map((att, i) => (
                              <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                 {att.type.startsWith('image/') ? <img src={att.url} className="w-full h-full object-cover" /> : <Paperclip size={10} className="text-slate-400" />}
                              </div>
                            ))}
                            {task.attachments.length > 3 && (
                               <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">+{task.attachments.length - 3}</div>
                            )}
                         </div>
                       ) : (
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Proof Attached</span>
                       )}
                       <button 
                        disabled={locked}
                        onClick={() => handleAttach(task.id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-30"
                       >
                         <Paperclip size={14} />
                       </button>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border transition-all ${
                        task.isDoDMet ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-200'
                      }`}>
                        <CheckCircle size={18} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative flex items-center">
                       <select
                        disabled={locked || (currentUserRole === UserRole.TEAM_MEMBER && task.status === TaskStatus.DONE)}
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                        className={`text-[10px] font-black px-4 py-2 rounded-xl border transition-all appearance-none pr-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 uppercase tracking-widest ${getStatusColor(task.status)}`}
                      >
                        {Object.values(TaskStatus).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 text-current pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {lockedCount(filteredTasks, project) > 0 && (
        <div className="mt-6 flex items-center gap-4 text-amber-600 bg-amber-50 p-6 rounded-[32px] border border-amber-100 shadow-sm">
          <AlertCircle size={24} />
          <div>
            <p className="text-sm font-black uppercase tracking-tighter">Production Handshake Required</p>
            <p className="text-xs font-medium text-amber-700 mt-0.5">Some tasks are locked. Finalize parent nodes to proceed with current production cycle.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const lockedCount = (tasks: Task[], project: Project) => {
  return tasks.filter(task => {
    if (task.dependencies.length === 0) return false;
    return task.dependencies.some(depId => {
      const depTask = project.tasks.find(t => t.id === depId);
      return depTask && depTask.status !== TaskStatus.DONE;
    });
  }).length;
};

export default ZohoTasks;
