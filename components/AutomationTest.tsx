
import React, { useState } from 'react';
import { Beaker, Play, Terminal, CheckCircle, XCircle, Clock, Zap, FileCode, Smartphone, Globe, ShieldCheck, Bug } from 'lucide-react';
import { generateTestSuite } from '../services/geminiService';
import { Project, TestCase } from '../types';

interface AutomationTestProps {
  project: Project;
  onUpdateTests: (testCases: TestCase[]) => void;
}

const AutomationTest: React.FC<AutomationTestProps> = ({ project, onUpdateTests }) => {
  const [activeSubTab, setActiveSubTab] = useState<'Execution' | 'Generator' | 'Scripts'>('Execution');
  const [srsInput, setSrsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);

  const handleGenerateTests = async () => {
    if (!srsInput.trim()) return;
    setLoading(true);
    const newTests = await generateTestSuite(srsInput);
    // Add default status and timestamps
    const processedTests = newTests.map((t: any) => ({
      ...t,
      status: 'Pending',
      lastRun: 'Never'
    }));
    onUpdateTests(processedTests);
    setLoading(false);
    setActiveSubTab('Execution');
  };

  const runTest = (id: string) => {
    const updated = project.testCases.map(t => 
      t.id === id ? { ...t, status: 'Running' as const } : t
    );
    onUpdateTests(updated);
    
    // Simulate execution
    setTimeout(() => {
      const final = project.testCases.map(t => 
        t.id === id ? { ...t, status: (Math.random() > 0.1 ? 'Pass' : 'Fail') as any, lastRun: 'Just now' } : t
      );
      onUpdateTests(final);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Fail': return 'text-red-500 bg-red-50 border-red-100';
      case 'Running': return 'text-blue-500 bg-blue-50 border-blue-100 animate-pulse';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Beaker className="text-purple-600" size={32} /> Automation QA Bridge
          </h2>
          <p className="text-slate-500 mt-1">Native Android/iOS & Web Automation Hub integrated with A21-T33.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['Execution', 'Generator', 'Scripts'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'Execution' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Scenario</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {project.testCases.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedTest(test)}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${test.priority === 'Critical' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                          <span className="text-sm font-bold text-slate-800">{test.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                          {test.platform === 'Android' || test.platform === 'iOS' ? <Smartphone size={12} /> : <Globe size={12} />}
                          {test.platform}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); runTest(test.id); }}
                          className="p-2 bg-slate-900 text-white rounded-xl hover:bg-purple-600 transition-all shadow-md"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {project.testCases.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                        No test cases found. Use the Generator to create a suite from SRS.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Zap className="text-amber-400" /> Automation Health
              </h3>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pass Rate</p>
                    <p className="text-4xl font-black">{Math.round((project.testCases.filter(t => t.status === 'Pass').length / (project.testCases.length || 1)) * 100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Tests</p>
                    <p className="text-2xl font-black">{project.testCases.length}</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                    style={{ width: `${(project.testCases.filter(t => t.status === 'Pass').length / (project.testCases.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {selectedTest && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{selectedTest.title}</h4>
                  <button onClick={() => setSelectedTest(null)} className="text-slate-300 hover:text-slate-600"><XCircle size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Type</p>
                      <p className="text-xs font-bold text-slate-700">{selectedTest.type}</p>
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Last Run</p>
                      <p className="text-xs font-bold text-slate-700">{selectedTest.lastRun}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Technical Requirements</p>
                    <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-purple-400 leading-relaxed">
                      // {selectedTest.platform} Automation Config<br/>
                      {selectedTest.automationScript || '// No script generated yet'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'Generator' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Bug className="text-red-500" /> AI Test Generator
            </h3>
            <textarea 
              value={srsInput}
              onChange={(e) => setSrsInput(e.target.value)}
              className="w-full h-96 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs leading-relaxed"
              placeholder="Paste specific SRS requirements or user stories to generate targeted automated test cases..."
            />
            <button 
              onClick={handleGenerateTests}
              disabled={loading || !srsInput}
              className="mt-6 w-full bg-slate-900 hover:bg-purple-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl"
            >
              {loading ? <Clock className="animate-spin" /> : <Zap className="text-amber-400" />}
              Generate Automation Suite
            </button>
          </div>
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col justify-center items-center text-center">
             <FileCode size={64} className="text-slate-200 mb-6" />
             <h4 className="text-xl font-black text-slate-800 mb-2">Automated Mapping</h4>
             <p className="text-slate-500 max-w-sm text-sm">Our AI technical architect generates Appium, Espresso, and XCUITest stubs automatically based on your requirements document.</p>
          </div>
        </div>
      )}

      {activeSubTab === 'Scripts' && (
        <div className="bg-slate-950 rounded-[40px] p-10 shadow-2xl overflow-hidden relative min-h-[500px]">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"></div>
           <div className="flex items-center gap-4 mb-8 text-slate-400">
              <Terminal size={20} />
              <span className="text-xs font-mono">automation_bridge_v2.5_logs</span>
           </div>
           <div className="space-y-4 font-mono text-sm leading-relaxed">
              <p className="text-emerald-400">$ bridge init --platform native_mobile --project a9</p>
              <p className="text-slate-500">Initializing Appium session for A9 iOS Native...</p>
              <p className="text-slate-500">Connecting to Windsurf AI Debugger...</p>
              <p className="text-blue-400">[info] 24 test cases identified in SRS v1.3</p>
              <p className="text-slate-500">Generating Swift test suites for Nafath Login flow...</p>
              <p className="text-emerald-400">✔ Success: Generated 12 test scripts for iOS Native</p>
              <p className="text-slate-500">Running smoke test for Payment Gateway (Apple Pay)...</p>
              <p className="text-red-400">[error] Payment sheet timeout - linking to GitLab Issue #142</p>
              <div className="inline-block px-2 py-1 bg-slate-800 text-[10px] text-slate-400 animate-pulse">_</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AutomationTest;
