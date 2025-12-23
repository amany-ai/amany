
import React, { useState } from 'react';
import { FileCode, Database, Layout, Lock, Copy, Check, Terminal, Folder, File as FileIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SystemFilesProps {
  language: Language;
}

const SystemFiles: React.FC<SystemFilesProps> = ({ language }) => {
  const [activeView, setActiveView] = useState<'env' | 'backend' | 'frontend'>('env');
  const [copied, setCopied] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ENV_BACKEND = `
# ROWAAD SOVEREIGN OS - LARAVEL BACKEND CONFIG
APP_NAME="Rowaad Sovereign"
APP_ENV=production
APP_KEY=base64:7vX+fakekeyexample...
APP_DEBUG=false
APP_URL=http://internal.node.local

# INTERNAL MONGODB NODE
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=rowaad_production
DB_USERNAME=admin_node
DB_PASSWORD=local_secure_pass

# EXTERNAL INTEGRATIONS
ZOHO_CLIENT_ID=zoho_id_...
ZOHO_CLIENT_SECRET=zoho_secret_...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
TIME_DOCTOR_API_KEY=td_key_...
  `.trim();

  const ENV_FRONTEND = `
# ROWAAD SOVEREIGN OS - REACT FRONTEND CONFIG
VITE_API_BASE_URL=http://internal.node.local/api
VITE_SYSTEM_VERSION=A21-v2.6
VITE_INTERNAL_NODE_ID=NODE-001

# AI SERVICES (Injected via process.env.API_KEY)
API_KEY=your_gemini_key_here
  `.trim();

  const LARAVEL_DATABASE_CONFIG = `
<?php
// config/database.php (MongoDB Moloquent Config)

'connections' => [
    'mongodb' => [
        'driver' => 'mongodb',
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', 27017),
        'database' => env('DB_DATABASE', 'rowaad'),
        'username' => env('DB_USERNAME', ''),
        'password' => env('DB_PASSWORD', ''),
        'options' => [
            'database' => env('DB_AUTHENTICATION_DATABASE', 'admin'),
        ],
    ],
],
  `.trim();

  const FRONTEND_GEMINI_SERVICE = `
import { GoogleGenAI } from "@google/genai";

// Frontend Service Implementation
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSRS = async (content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: content,
  });
  return response.text;
};
  `.trim();

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <FileCode size={32} className="text-emerald-500" /> {t.system_files}
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Internal technical repository for Sovereign OS stack.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <button 
            onClick={() => setActiveView('env')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeView === 'env' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Lock size={14} /> {language === 'ar' ? '.env' : '.env'}
          </button>
          <button 
            onClick={() => setActiveView('backend')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeView === 'backend' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Database size={14} /> {language === 'ar' ? 'البحث' : 'Backend'}
          </button>
          <button 
            onClick={() => setActiveView('frontend')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeView === 'frontend' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layout size={14} /> {language === 'ar' ? 'الواجهة' : 'Frontend'}
          </button>
        </div>
      </header>

      {activeView === 'env' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Database size={16} />
                     </div>
                     <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Backend /.env</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(ENV_BACKEND, 'be-env')}
                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {copied === 'be-env' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
               </div>
               <div className="p-8 bg-black text-emerald-500 font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{ENV_BACKEND}</pre>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <Layout size={16} />
                     </div>
                     <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Frontend /.env</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(ENV_FRONTEND, 'fe-env')}
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {copied === 'fe-env' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
               </div>
               <div className="p-8 bg-black text-blue-400 font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{ENV_FRONTEND}</pre>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'backend' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm h-fit">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Folder size={14} className="text-emerald-500" /> Laravel 11 Structure
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold hover:text-emerald-600 cursor-pointer">
                    <Folder size={16} /> app/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400 font-bold ml-6">
                    <Folder size={16} /> Http/Controllers/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400 font-bold ml-6">
                    <Folder size={16} /> Models/ (Moloquent)
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold hover:text-emerald-600 cursor-pointer">
                    <Folder size={16} /> config/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-emerald-600 font-black ml-6">
                    <FileIcon size={16} /> database.php
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold hover:text-emerald-600 cursor-pointer">
                    <Folder size={16} /> routes/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-emerald-600 font-black ml-6">
                    <FileIcon size={16} /> api.php
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold hover:text-emerald-600 cursor-pointer">
                    <FileIcon size={16} /> artisan
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <div className="bg-black rounded-[32px] overflow-hidden shadow-2xl border border-emerald-900/30">
                 <div className="p-6 border-b border-emerald-900/30 bg-emerald-950/20 flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">config/database.php</span>
                    <button 
                      onClick={() => handleCopy(LARAVEL_DATABASE_CONFIG, 'be-db')}
                      className="p-2 text-slate-400 hover:text-emerald-500"
                    >
                      {copied === 'be-db' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                 </div>
                 <div className="p-8 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto h-[400px] custom-scrollbar">
                    <pre>{LARAVEL_DATABASE_CONFIG}</pre>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'frontend' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm h-fit">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Folder size={14} className="text-blue-500" /> React ESM Structure
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                    <Folder size={16} /> components/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                    <Folder size={16} /> services/
                 </div>
                 <div className="flex items-center gap-2 text-sm text-blue-600 font-black ml-6">
                    <FileIcon size={16} /> geminiService.ts
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                    <FileIcon size={16} /> index.tsx
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                    <FileIcon size={16} /> App.tsx
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-blue-900/30">
                 <div className="p-6 border-b border-blue-900/30 bg-blue-950/20 flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">services/geminiService.ts</span>
                    <button 
                      onClick={() => handleCopy(FRONTEND_GEMINI_SERVICE, 'fe-ai')}
                      className="p-2 text-slate-400 hover:text-blue-500"
                    >
                      {copied === 'fe-ai' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                 </div>
                 <div className="p-8 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto h-[400px] custom-scrollbar">
                    <pre>{FRONTEND_GEMINI_SERVICE}</pre>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SystemFiles;
