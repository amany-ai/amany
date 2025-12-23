
import React from 'react';
import { FileText, Download, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface WeeklyReportProps {
  reportData: {
    reportText: string;
    summaryScore: number;
    tasksCompleted: number;
    violationsCount: number;
  } | null;
  loading: boolean;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ reportData, loading }) => {
  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold animate-pulse">Gemini AI is analyzing Zoho, Slack, and Time Doctor logs...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-12 text-center text-slate-500">
        <FileText size={48} className="mx-auto mb-4 opacity-20" />
        <p>No report generated yet. Click "Generate Report" to start sync.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Weekly Performance Report</h2>
          <p className="text-slate-500 mt-1">Consolidated summary for Project Management.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border p-6 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Task Velocity</p>
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <CheckCircle size={20} />
            <span className="text-3xl font-bold">{reportData.tasksCompleted}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tasks finalized in Zoho</p>
        </div>
        <div className="bg-white border p-6 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Compliance Alert</p>
          <div className="flex items-center justify-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <span className="text-3xl font-bold">{reportData.violationsCount}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Time Doctor violations</p>
        </div>
        <div className="bg-white border p-6 rounded-2xl shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Overall Score</p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <TrendingUp size={20} />
            <span className="text-3xl font-bold">{reportData.summaryScore}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Efficiency rating</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-10 prose prose-slate max-w-none shadow-sm">
        <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
          {reportData.reportText}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
