
import React, { useState } from 'react';
import { FileCode, Database, Layout, Lock, Copy, Check, Terminal, Folder, File as FileIcon, ChevronRight, ChevronDown, Download, Link as LinkIcon, HardDrive, Code, Server, Users } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SystemFilesProps { language: Language; }

const SystemFiles: React.FC<SystemFilesProps> = ({ language }) => {
  const [activeView, setActiveView] = useState<'env' | 'backend' | 'storage' | 'api' | 'users'>('env');
  const [copied, setCopied] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  const ZOHO_USER_SERVICE = `
<?php

namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use App\\Models\\TeamMember;
use Illuminate\\Support\\Facades\\Log;

class ZohoUserService
{
    /**
     * Agent H: Identity Node Sync
     * Fetch all users from Zoho Projects Portal
     */
    public function syncAllFromZoho()
    {
        $token = $this->getValidToken(); // Your OAuth logic
        $portalId = config('services.zoho.portal_id');

        $response = Http::withToken($token)
            ->get("https://projectsapi.zoho.com/api/v1/portal/{$portalId}/users/");

        if (!$response->successful()) {
            Log::error("Zoho User Sync Failed: " . $response->body());
            return false;
        }

        $users = $response->json()['users'] ?? [];

        foreach ($users as $user) {
            TeamMember::updateOrCreate(
                ['zoho_id' => $user['id']],
                [
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role_label' => $user['role_name'],
                    'avatar_url' => $user['user_image_url'] ?? null,
                    'is_active' => $user['status'] === 'active',
                    'last_sync' => now()
                ]
            );
        }

        return true;
    }
}
  `.trim();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase">
            <FileCode size={32} className="text-emerald-500" /> {t.system_files}
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic lowercase">repository for sovereign api nodes.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <button 
            onClick={() => setActiveView('env')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'env' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            .env
          </button>
          <button 
            onClick={() => setActiveView('users')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Sync
          </button>
          <button 
            onClick={() => setActiveView('api')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'api' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            API Bridge
          </button>
        </div>
      </header>

      {activeView === 'users' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
              <header className="flex justify-between items-end mb-10 border-b pb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                       <Users size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">ZohoUserService.php</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Laravel 11 Identity Sync Node</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleCopy(ZOHO_USER_SERVICE, 'user-service-code')}
                   className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2"
                 >
                    {copied === 'user-service-code' ? <Check size={14} /> : <Copy size={14} />} {copied === 'user-service-code' ? 'Copied' : 'Copy Code'}
                 </button>
              </header>
              <div className="bg-slate-950 p-8 rounded-[32px] font-mono text-[11px] text-blue-400 overflow-x-auto h-[600px] custom-scrollbar shadow-2xl">
                 <pre>{ZOHO_USER_SERVICE}</pre>
              </div>
           </div>
        </div>
      )}

      {activeView === 'env' && (
        <div className="bg-black rounded-[40px] p-12 text-emerald-500 font-mono text-xs animate-in fade-in">
           <pre>{`
# ZOHO CONFIG
ZOHO_PORTAL_ID=72491XXXX
ZOHO_CLIENT_ID=1000.XXXXX
ZOHO_CLIENT_SECRET=XXXXXX
           `}</pre>
        </div>
      )}
    </div>
  );
};

export default SystemFiles;
