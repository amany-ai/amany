
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Copy, Plus, Trash2, Key, Server, Database, ShieldCheck, Globe, Search, Filter, AlertCircle } from 'lucide-react';
import { Credential, UserRole } from '../types';

interface CredentialVaultProps {
  credentials: Credential[];
  userRole: UserRole;
  onUpdate: (credentials: Credential[]) => void;
}

const CredentialVault: React.FC<CredentialVaultProps> = ({ credentials, userRole, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [newCred, setNewCred] = useState<Partial<Credential>>({
    type: 'API Key',
    environment: 'Dev',
  });

  const canManage = userRole === UserRole.ADMIN || userRole === UserRole.PROJECT_MANAGER;

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast here
  };

  const handleAdd = () => {
    if (newCred.title && newCred.identifier && newCred.secretValue) {
      const entry: Credential = {
        id: `CRED-${Date.now()}`,
        title: newCred.title!,
        type: newCred.type as any,
        environment: newCred.environment as any,
        identifier: newCred.identifier!,
        secretValue: newCred.secretValue!,
        comments: newCred.comments || 'None',
        lastUpdated: new Date().toLocaleDateString(),
      };
      onUpdate([...credentials, entry]);
      setIsAdding(false);
      setNewCred({ type: 'API Key', environment: 'Dev' });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this credential?')) {
      onUpdate(credentials.filter(c => c.id !== id));
    }
  };

  const filtered = credentials.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Lock className="text-blue-600" size={32} /> Credential Vault
          </h2>
          <p className="text-slate-500 mt-1">Secure environment secrets and API infrastructure access.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 font-medium"
            />
          </div>
          {canManage && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus size={18} /> New Secret
            </button>
          )}
        </div>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900 border-b pb-4 uppercase tracking-tighter">
              <Key className="text-blue-600" /> Register Secret
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Secret Name / Service</label>
                <input 
                  type="text"
                  placeholder="e.g., AWS Production S3 Key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  onChange={(e) => setNewCred({...newCred, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  onChange={(e) => setNewCred({...newCred, type: e.target.value as any})}
                >
                  <option>API Key</option>
                  <option>Database</option>
                  <option>SSH/Server</option>
                  <option>Service Account</option>
                  <option>Web Login</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Environment</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  onChange={(e) => setNewCred({...newCred, environment: e.target.value as any})}
                >
                  <option>Dev</option>
                  <option>Staging</option>
                  <option>Production</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Identifier (Username/ID)</label>
                <input 
                  type="text"
                  placeholder="e.g., AKIAIOSFODNN7EXAMPLE"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  onChange={(e) => setNewCred({...newCred, identifier: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Secret Value / Password</label>
                <input 
                  type="password"
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  onChange={(e) => setNewCred({...newCred, secretValue: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Store Securely</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cred) => (
          <div key={cred.id} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-blue-500/10">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${
                cred.type === 'Database' ? 'bg-emerald-50 text-emerald-600' :
                cred.type === 'SSH/Server' ? 'bg-indigo-50 text-indigo-600' :
                cred.type === 'API Key' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
              }`}>
                {cred.type === 'Database' && <Database size={20} />}
                {cred.type === 'SSH/Server' && <Server size={20} />}
                {cred.type === 'API Key' && <Key size={20} />}
                {cred.type === 'Service Account' && <ShieldCheck size={20} />}
                {cred.type === 'Web Login' && <Globe size={20} />}
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter mb-1 ${
                  cred.environment === 'Production' ? 'bg-red-100 text-red-600' :
                  cred.environment === 'Staging' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {cred.environment}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{cred.lastUpdated}</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-1">{cred.title}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Identifier</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-700 truncate mr-2">{cred.identifier}</span>
                  <button onClick={() => copyToClipboard(cred.identifier)} className="text-slate-300 hover:text-blue-600"><Copy size={12} /></button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Secret Value</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-blue-400 truncate mr-2">
                    {revealedIds.has(cred.id) ? cred.secretValue : '••••••••••••••••'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleReveal(cred.id)} className="text-slate-500 hover:text-white">
                      {revealedIds.has(cred.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copyToClipboard(cred.secretValue)} className="text-slate-500 hover:text-white"><Copy size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            {canManage && (
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleDelete(cred.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
            <Lock size={48} className="mx-auto mb-4 text-slate-200" />
            <h4 className="text-xl font-black text-slate-800 mb-2">Vault is Empty</h4>
            <p className="text-slate-400 max-w-sm mx-auto text-sm">Add your project's sensitive credentials to manage them securely within the team.</p>
          </div>
        )}
      </div>

      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-[32px] p-6 flex gap-4 items-start">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Security Compliance Note</h4>
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            All credentials in this vault are encrypted at rest. Do not share server passwords or private keys in the Zoho task comments. Always use the Vault identifiers for communication to maintain standard bridge security protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CredentialVault;
