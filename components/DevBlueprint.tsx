
import React, { useState, useRef } from 'react';
import { Cpu, Zap, Terminal, Code, Smartphone, FileText, Send, Download, Paperclip, Image as ImageIcon, Link as LinkIcon, X, File, AlertCircle } from 'lucide-react';
import { orchestrateOneClickFlow, estimateSalesFromBRD } from '../services/geminiService';

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  preview?: string;
}

const DevBlueprint: React.FC = () => {
  const [inputDoc, setInputDoc] = useState('');
  const [googleDocLink, setGoogleDocLink] = useState('');
  const [mode, setMode] = useState<'Estimation' | 'Blueprint'>('Blueprint');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          preview: file.type.startsWith('image/') ? (reader.result as string) : undefined
        }]);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file); // For text based files
      }
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (!inputDoc && attachments.length === 0 && !googleDocLink) return;
    setLoading(true);
    
    // Simulate combining multiple sources for AI context
    const fullContext = `
      DOC CONTENT: ${inputDoc}
      GOOGLE DOC: ${googleDocLink}
      ATTACHMENTS: ${attachments.map(a => a.name).join(', ')}
    `;

    let data;
    if (mode === 'Estimation') {
      data = await estimateSalesFromBRD(fullContext);
    } else {
      data = await orchestrateOneClickFlow(fullContext);
    }
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <Cpu className="text-blue-600" size={32} /> Project Orchestrator
          </h2>
          <p className="text-slate-500 mt-1">Transform SRS/BRD documents, images, and links into automated production plans.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <button 
            onClick={() => { setMode('Blueprint'); setResult(null); }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'Blueprint' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            A21 Blueprint
          </button>
          <button 
             onClick={() => { setMode('Estimation'); setResult(null); }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${mode === 'Estimation' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sales Estimate
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Requirement Core
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg border border-slate-200 transition-all"
                  title="Attach Documents or Images"
                >
                  <Paperclip size={14} />
                </button>
              </div>
            </div>

            <textarea 
              value={inputDoc}
              onChange={(e) => setInputDoc(e.target.value)}
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs leading-relaxed mb-4"
              placeholder={`Paste your ${mode === 'Blueprint' ? 'SRS text' : 'BRD text'}...`}
            />

            <div className="space-y-4 mb-6">
               <div className="relative">
                 <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <input 
                   type="text"
                   placeholder="Google Doc Link..."
                   value={googleDocLink}
                   onChange={(e) => setGoogleDocLink(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>

               {attachments.length > 0 && (
                 <div className="grid grid-cols-2 gap-2">
                   {attachments.map((file, i) => (
                     <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-2 relative group overflow-hidden">
                       <button 
                        onClick={() => removeAttachment(i)}
                        className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                       >
                         <X size={12} />
                       </button>
                       {file.preview ? (
                         <img src={file.preview} alt="preview" className="w-full h-12 object-cover rounded-lg" />
                       ) : (
                         <div className="w-full h-12 flex items-center justify-center bg-white rounded-lg border border-slate-100">
                           <File size={20} className="text-blue-500" />
                         </div>
                       )}
                       <p className="text-[8px] font-black text-slate-500 mt-1 truncate px-1">{file.name}</p>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt" 
              onChange={handleFileUpload}
            />

            <button 
              onClick={handleProcess}
              disabled={loading || (!inputDoc && attachments.length === 0 && !googleDocLink)}
              className={`w-full ${mode === 'Blueprint' ? 'bg-slate-900 hover:bg-blue-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50`}
            >
              {loading ? <Zap className="animate-spin text-amber-400" /> : <Send size={20} />}
              {mode === 'Blueprint' ? 'Orchestrate Workflow' : 'Generate Estimation'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl overflow-hidden relative border border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle size={14} className="text-blue-400" /> AI Instruction Note
            </h3>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              Attaching detailed diagrams or SRS PDFs significantly improves the accuracy of the 22-day task mapping. System supports native Word/PDF parsing and multi-image context analysis.
            </p>
          </div>
        </div>

        <div className="xl:col-span-2">
          {!result && !loading ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center opacity-60">
               <Terminal size={80} className="text-slate-200 mb-6" />
               <h3 className="text-2xl font-black text-slate-800 mb-2">Bridge Inactive</h3>
               <p className="text-slate-400 max-w-sm">Provide documents, images or links to trigger AI Orchestration.</p>
             </div>
          ) : loading ? (
             <div className="bg-slate-900 text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                <div className="relative z-10">
                   <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
                   <h3 className="text-3xl font-black tracking-tighter mb-4 animate-pulse uppercase">AI Analyzing Assets...</h3>
                   <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Compiling context from {attachments.length + (googleDocLink ? 1 : 0) + (inputDoc ? 1 : 0)} source(s)</p>
                </div>
             </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95">
               {mode === 'Blueprint' ? (
                 <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Generated Task Tree</h3>
                          <p className="text-slate-500 font-bold">Consolidated from all provided documents.</p>
                       </div>
                       <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                         Push 100% to Zoho
                       </button>
                    </div>
                    <div className="space-y-4">
                       {result.tasks.map((task: any, i: number) => (
                         <div key={i} className="flex items-center gap-6 p-5 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                              task.role.includes('Android') ? 'bg-emerald-50 text-emerald-600' :
                              task.role.includes('iOS') ? 'bg-indigo-50 text-indigo-600' :
                              task.role.includes('Design') ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                               {task.role.includes('Mobile') || task.role.includes('Android') || task.role.includes('iOS') ? <Smartphone size={24}/> : <Code size={24}/>}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-widest">{task.zohoId}</span>
                                  <h4 className="text-sm font-black text-slate-800">{task.title}</h4>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.role}</span>
                                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                  <span className="text-[10px] font-bold text-slate-500">{task.durationDays} Days</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-sm">
                    <header className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                       <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Multi-Doc Consolidated Quote</p>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Comprehensive Project Estimate</h3>
                       </div>
                       <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-xl">
                          <Download size={16} /> Export Detail PDF
                       </button>
                    </header>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                       <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                          <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-2">Total Effort</p>
                          <p className="text-4xl font-black text-emerald-900">{result.totalHours}h</p>
                       </div>
                       <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800">
                          <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-2">Budgetary Est.</p>
                          <p className="text-4xl font-black text-white">{result.estimatedCost}</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Resource Distribution</h4>
                       {result.roleBreakdown && result.roleBreakdown.map((item: any, i: number) => (
                         <div key={i}>
                            <div className="flex justify-between items-end mb-2">
                               <span className="text-xs font-bold text-slate-600">{item.role}</span>
                               <span className="text-xs font-black text-slate-900">{item.hours}h</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(item.hours / result.totalHours) * 100}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevBlueprint;
