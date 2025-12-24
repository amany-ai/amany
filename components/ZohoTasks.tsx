
import React, { useState, useRef } from 'react';
import { Project, Task, TaskStatus, UserRole, FileAttachment } from '../types';
import { TEAM_MEMBERS } from '../constants';
import { MoreVertical, AlertCircle, ChevronDown, CheckCircle, Paperclip, Plus } from 'lucide-react';

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

  const filteredTasks = filterStatus === 'All' 
    ? project.tasks 
    : project.tasks.filter(t => t.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <input type="file" ref={fileInputRef} className="hidden" multiple />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter lowercase">workflow agent</h2>
          <p className="text-slate-500 font-medium lowercase italic">live production lifecycle tracker</p>
        </div>
        {canEdit && (
          <button onClick={onAddTask} className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl hover:bg-emerald-600 transition-all">
            <Plus size={16} /> add task node
          </button>
        )}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">task detail</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">owner</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-center">gate</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const locked = isTaskLocked(task);
              return (
                <tr key={task.id} className={`group transition-all ${locked ? 'bg-slate-50/40' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-bold ${locked ? 'text-slate-400' : 'text-slate-800 lowercase'}`}>{task.title}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-600 lowercase">{getOwnerName(task.ownerId)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <CheckCircle size={16} className={task.isDoDMet ? 'text-emerald-500' : 'text-slate-200'} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 lowercase">
                      {task.status.toLowerCase()}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZohoTasks;
