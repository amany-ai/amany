
import React, { useState, useRef } from 'react';
import { Database, Server, Code, Terminal, Zap, GitBranch, Cpu, Smartphone, ShieldCheck, FileCode, CheckCircle2, AlertCircle, Image as ImageIcon, Link as LinkIcon, X, Upload } from 'lucide-react';
import { generateApiBlueprint, analyzeFigmaDesign } from '../services/geminiService';
import { Project, ApiEndpoint } from '../types';

interface BackendDevProps {
  project: Project;
  onUpdateEndpoints: (endpoints: ApiEndpoint[]) => void;
}

const BackendDev: React.FC<BackendDevProps> = ({ project, onUpdateEndpoints }) => {
  const [activeTab, setActiveTab] = useState<'Architecture' | 'Figma-AI' | 'Xcode-Sync' | 'Windsurf-Bridge'>('Architecture');
  const [requirement, setRequirement] = useState('');
  const [figmaLink, setFigmaLink] = useState('');
  const [figmaImage, setFigmaImage] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateArchitecture = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    const result = await generateApiBlueprint(requirement);
    setBlueprint(result);
    processEndpoints(result);
    setLoading(false);
  };

  const handleFigmaSync = async () => {
    if (!figmaImage && !figmaLink) return;
    setLoading(true);
    const result = await analyzeFigmaDesign(figmaImage || undefined, figmaLink || undefined);
    setBlueprint(result);
    processEndpoints(result);
    setLoading(false);
  };

  const processEndpoints = (result: any) => {
    if (result?.endpoints) {
      const newEndpoints: ApiEndpoint[] = result.endpoints.map((e: any, i: number) => ({
        id: `API-${Date.now()}-${i}`,
        method: e.method,
        path: e.path,
        status: 'Draft',
        xcodeSynced: false,
        windsurfVerified: true
      }));
      onUpdateEndpoints([...project.endpoints, ...newEndpoints]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFigmaImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <Server className="text-emerald-500" size={32} /> Laravel Backend Node
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Laravel 11 + Internal NoSQL Instance + Windsurf AI Bridge.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(['Architecture', 'Figma-AI', 'Xcode-Sync', 'Windsurf-Bridge'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'Architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Cpu className="text-emerald-500" /> AI Laravel Architect
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest leading-loose">
                Feed requirement to generate Laravel Controllers, Local MongoDB Collections, and Swift Data Models.
              </p>
              <textarea 
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="w-full h-64 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs leading-relaxed transition-all"
                placeholder="Example: Define a User collection in Internal MongoDB and a Laravel controller for Nafath OAuth2..."
              />
              <button 
                onClick={handleGenerateArchitecture}
                disabled={loading || !requirement}
                className="mt-6 w-full bg-black hover:bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? <Zap className="animate-spin text-emerald-400" /> : <FileCode size={20} className="text-emerald-400" />}
                Generate Laravel Blueprint
              </button>
            </div>
          </div>

          <BlueprintDisplay blueprint={blueprint} loading={loading} />
        </div>
      )}

      {activeTab === 'Figma-AI' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <ImageIcon className="text-emerald-500" /> Figma Internal Sync
              </h3>
              
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden"
                >
                  {figmaImage ? (
                    <>
                      <img src={figmaImage} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Upload className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Figma Screenshot</p>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                <div className="relative">
                   <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Paste Figma Design Link..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                      value={figmaLink}
                      onChange={(e) => setFigmaLink(e.target.value)}
                   />
                </div>

                <button 
                  onClick={handleFigmaSync}
                  disabled={loading || (!figmaImage && !figmaLink)}
                  className="w-full bg-black hover:bg-emerald-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? <Zap className="animate-spin text-emerald-400" /> : <Zap size={20} className="text-emerald-400" />}
                  Generate Architecture from Design
                </button>
              </div>
            </div>
          </div>

          <BlueprintDisplay blueprint={blueprint} loading={loading} />
        </div>
      )}

      {activeTab === 'Xcode-Sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Laravel API Handshake Registry</h3>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                  Sync All with Xcode
                </button>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method / Path</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Laravel Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Local NoSQL Sync</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Environment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {project.endpoints.map(endpoint => (
                    <tr key={endpoint.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-black ${
                             endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                             endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                           }`}>{endpoint.method}</span>
                           <span className="text-sm font-bold text-slate-700 font-mono">{endpoint.path}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         {endpoint.xcodeSynced ? 
                           <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase">
                             <CheckCircle2 size={14} /> Artisan OK
                           </div> : 
                           <div className="flex items-center justify-center gap-1.5 text-slate-300 font-black text-[10px] uppercase">
                             <AlertCircle size={14} /> Pending
                           </div>
                         }
                      </td>
                      <td className="px-8 py-5 text-center">
                         <div className={`inline-flex items-center gap-1.5 font-black text-[10px] uppercase ${endpoint.windsurfVerified ? 'text-emerald-500' : 'text-slate-300'}`}>
                           <Database size={14} /> Internal Node
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-tighter shadow-md">
                           {endpoint.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>

          <div className="space-y-6">
             <div className="bg-black rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-900/30">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
                   <Smartphone size={120} />
                </div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                   <ShieldCheck className="text-emerald-500" /> Internal Security
                </h3>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Endpoints Ready</p>
                         <p className="text-4xl font-black">{Math.round((project.endpoints.filter(e => e.xcodeSynced).length / (project.endpoints.length || 1)) * 100)}%</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Local APIs</p>
                         <p className="text-2xl font-black">{project.endpoints.length}</p>
                      </div>
                   </div>
                   <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${(project.endpoints.filter(e => e.xcodeSynced).length / (project.endpoints.length || 1)) * 100}%` }}
                      ></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Windsurf-Bridge' && (
        <div className="bg-black rounded-[40px] p-10 shadow-2xl overflow-hidden relative min-h-[600px] border border-emerald-900/30">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-slate-400">
                <Terminal size={20} className="text-emerald-500" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">laravel_artisan_local_bridge_v11.0</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-red-500/20 border border-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500 rounded-full"></div>
              </div>
           </div>
           <div className="space-y-6 font-mono text-sm leading-relaxed max-h-[450px] overflow-y-auto custom-scrollbar pr-4">
              <div className="flex gap-4">
                <span className="text-slate-600">09:12:01</span>
                <p className="text-emerald-400 font-bold">$ php artisan bridge:connect --stack=laravel-internal-mongo</p>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-600">09:12:04</span>
                <p className="text-emerald-500">SUCCESS: Connection established to Local MongoDB Node (127.0.0.1).</p>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-600">09:12:15</span>
                <p className="text-slate-400">Scanning app/Http/Controllers for A21-Txx compatibility...</p>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-600">09:13:42</span>
                <p className="text-emerald-500">[AI Action] Generating Internal MongoDB Eloquent Model: UserProfile.php</p>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-600">09:14:05</span>
                <p className="text-amber-400 text-xs">[Xcode Event] Mapping Laravel API responses to Swift Codable structs.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-600">09:14:10</span>
                <p className="text-emerald-400">PUSH COMPLETED: routes/api.php updated with new internal endpoints.</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-slate-600">09:15:00</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                   <span className="text-emerald-300">Listening for Artisan commands...</span>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const BlueprintDisplay = ({ blueprint, loading }: { blueprint: any, loading: boolean }) => (
  <div className="space-y-6">
    {!blueprint && !loading ? (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center">
         <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
            <Code size={32} className="text-slate-300" />
         </div>
         <h4 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Artisan IDLE</h4>
         <p className="text-slate-400 max-w-sm text-sm font-medium">System awaiting local Laravel requirement or Figma input.</p>
      </div>
    ) : loading ? (
      <div className="bg-black text-white rounded-[40px] p-24 text-center h-full flex flex-col justify-center items-center relative overflow-hidden shadow-2xl border border-emerald-900/30">
         <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
         <div className="relative z-10">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-10"></div>
            <h3 className="text-2xl font-black tracking-tighter mb-4 animate-pulse uppercase">Laravel Processing...</h3>
            <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">BUILDING LOCAL CONTROLLERS & NO-SQL SCHEMAS</p>
         </div>
      </div>
    ) : (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="bg-black rounded-[32px] p-8 text-emerald-400 font-mono text-xs overflow-hidden h-[500px] shadow-2xl border border-emerald-900/30">
           <div className="flex items-center gap-2 mb-6 border-b border-emerald-900/30 pb-4">
              <div className="w-3 h-3 bg-red-500/20 border border-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500/20 border border-emerald-500 rounded-full"></div>
              <span className="ml-4 text-white font-black tracking-widest uppercase text-[10px]">laravel_artisan_local_output.php</span>
           </div>
           <div className="space-y-4 overflow-y-auto h-[400px] custom-scrollbar pr-4">
              <p className="text-emerald-400 font-black tracking-widest uppercase text-[10px] mb-2">// INTERNAL MONGODB COLLECTION SCHEMA (BSON)</p>
              <pre className="text-slate-300 bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/20">{blueprint.databaseSchema}</pre>
              <p className="text-emerald-400 font-black tracking-widest uppercase text-[10px] mt-8 mb-2">// LARAVEL LOCAL API CONTROLLER (PHP)</p>
              <pre className="text-slate-300 bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/20">{blueprint.endpoints?.map((e:any) => `Route::${e.method.toLowerCase()}('${e.path}', [Controller::class, 'handle']);`).join('\n')}</pre>
           </div>
        </div>
      </div>
    )}
  </div>
);

export default BackendDev;
