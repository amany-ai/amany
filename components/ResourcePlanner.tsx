
import React, { useState } from 'react';
import { Users, Plus, Trash2, Sparkles, Briefcase, Calendar } from 'lucide-react';
import { ResourceAllocation, Project } from '../types';
import { generateWeeklyResourceSummary } from '../services/geminiService';

interface ResourcePlannerProps {
  project: Project;
  onUpdateAllocations: (allocations: ResourceAllocation[]) => void;
}

const ResourcePlanner: React.FC<ResourcePlannerProps> = ({ project, onUpdateAllocations }) => {
  const [generating, setGenerating] = useState(false);

  const generateWeeklyAIPlan = async () => {
    setGenerating(true);
    await generateWeeklyResourceSummary(project.allocations);
    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-inter">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter lowercase">
            <Briefcase className="text-blue-600" size={32} /> planner agent
          </h2>
          <p className="text-slate-500 mt-1 font-medium lowercase italic">cross-project resource synchronization</p>
        </div>
        <button 
          onClick={generateWeeklyAIPlan}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] lowercase tracking-wide shadow-xl shadow-indigo-900/10 transition-all hover:bg-indigo-700"
        >
          {generating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
          run weekly sync
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">identity</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase">allocation</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest lowercase text-right">actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {project.allocations.map((alloc) => (
              <tr key={alloc.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-800 lowercase">{alloc.employeeName}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs text-slate-500 lowercase">{alloc.taskName}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { RefreshCw } from 'lucide-react';
export default ResourcePlanner;
